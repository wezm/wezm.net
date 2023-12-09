+++
title = "Debugging a Docker Core Dump"
date = 2023-02-25T10:39:49+10:00

#[extra]
#updated = 2023-01-11T21:11:28+10:00
+++

On my main machine I use an excellent cross-platform tool called [Docuum] that
automatically cleans up unused docker images. This allows me to use Docker
without the need to periodically wonder why I'm out of disk space, run `docker
system prune` and recover half my disk.

I installed Docuum via [the AUR package][aurpkg] (although tweaked to build the
latest Docuum release) and ran it via the bundled systemd service definition.
This worked great for a while but some time back it started failing. Every time
Docuum would try to check for things to clean up I'd see the following in the
system journal:

<!-- more -->

```
Feb 25 10:03:12 ryzen docuum[77751]: [2023-02-25 10:03:12 +10:00 INFO] Performing an initial vacuum on startup…
Feb 25 10:03:12 ryzen kernel: audit: type=1326 audit(1677283392.831:2): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=77763 comm="docker" exe="/usr/bin/docke>
Feb 25 10:03:12 ryzen systemd[1]: Created slice Slice /system/systemd-coredump.
Feb 25 10:03:12 ryzen systemd[1]: Started Process Core Dump (PID 77768/UID 0).
Feb 25 10:03:13 ryzen systemd-coredump[77769]: [🡕] Process 77763 (docker) of user 0 dumped core.

                                               Stack trace of thread 77763:
                                               #0  0x00005568dbcb5c4e n/a (docker + 0x243c4e)
                                               #1  0x00005568dbd35a3b n/a (docker + 0x2c3a3b)
                                               #2  0x00005568dbd3482f n/a (docker + 0x2c282f)
                                               #3  0x00005568dbd6c2ee n/a (docker + 0x2fa2ee)
                                               #4  0x00005568dbcfafa8 n/a (docker + 0x288fa8)
                                               #5  0x00005568dbcfaef1 n/a (docker + 0x288ef1)
                                               #6  0x00005568dbced953 n/a (docker + 0x27b953)
                                               #7  0x00005568dbd1eb41 n/a (docker + 0x2acb41)
                                               ELF object binary architecture: AMD x86-64
Feb 25 10:03:13 ryzen docuum[77751]: [2023-02-25 10:03:13 +10:00 ERROR] Unable to list images.
Feb 25 10:03:13 ryzen docuum[77751]: [2023-02-25 10:03:13 +10:00 INFO] Retrying in 5 seconds…
Feb 25 10:03:13 ryzen systemd[1]: systemd-coredump@0-77768-0.service: Deactivated successfully.
```

This would repeat every 5 seconds. I ignored this for a while but finally decided
to investigate it today. To find the failing command I ran
`coredumpctl list` then identified one of the docker crashes and ran
`coredumpctl info` with its PID:

```
$ coredumpctl info 78255
           PID: 78255 (docker)
           UID: 0 (root)
           GID: 0 (root)
        Signal: 31 (SYS)
     Timestamp: Sat 2023-02-25 10:03:23 AEST (44min ago)
  Command Line: docker image ls --all --no-trunc --format $'{{.ID}}\\t{{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}'
    Executable: /usr/bin/docker
 Control Group: /system.slice/docuum.service
          Unit: docuum.service
         Slice: system.slice
       Boot ID: 0ac9f0dd246548949c3a90a0e7494665
    Machine ID: affcb0b7a7d1464385d65464d9be450e
      Hostname: ryzen
       Storage: /var/lib/systemd/coredump/core.docker.0.0ac9f0dd246548949c3a90a0e7494665.78255.1677283403000000.zst (inaccessible)
       Message: Process 78255 (docker) of user 0 dumped core.
```

Strangely I could run the command myself (`Command Line` line) just fine. I
figured I needed to see where in docker it was crashing. I learned how to
access systemd coredumps with gdb and ran: `sudo coredumpctl gdb 78255`. `sudo`
is needed because the core dump belongs to root due the crashing `docker`
process belonging to root. This didn't yield much extra info as debug symbols
were not present for the binary. It did identify why it crashed though:

> Program terminated with signal SIGSYS, Bad system call.

Knowing that docker was implemented in Go and that they make system calls
manually on Linux I wondered if this was some sort of Go bug—although given
the popularity of Docker this did seem unlikely.

To get more info I needed debug symbols. Arch Linux makes these available via
[debuginfod](https://wiki.archlinux.org/title/Debuginfod) and gdb can
automatically download debuginfo files if `DEBUGINFOD_URLS` is set. I reran
`gdb`, telling `sudo` to pass the `DEBUGINFOD_URLS` environment variable
through (I had already set `DEBUGINFOD_URLS=https://debuginfod.archlinux.org/`
in my Zsh config some time ago):

```
sudo --preserve-env=DEBUGINFOD_URLS coredumpctl gdb 78255
```

Now there was a proper backtrace:

```
#0  runtime/internal/syscall.Syscall6 () at runtime/internal/syscall/asm_linux_amd64.s:36
#1  0x00005588e7b93c33 in syscall.RawSyscall6 (num=160, a1=7, a2=94046491589710, a3=7, a4=824634289408, a5=0, a6=0, r1=<optimized out>, r2=<optimized out>,
    errno=<optimized out>) at runtime/internal/syscall/syscall_linux.go:38
#2  0x00005588e7c13a3b in syscall.RawSyscall (trap=160, a1=7, a2=94046491589710, a3=7, r1=<optimized out>, r2=<optimized out>, err=<optimized out>)
    at syscall/syscall_linux.go:62
#3  0x00005588e7c1282f in syscall.Setrlimit (resource=<optimized out>, rlim=<optimized out>, err=...) at syscall/zsyscall_linux_amd64.go:1326
#4  0x00005588e7c4a2ee in os.init.1 () at os/rlimit.go:30
#5  0x00005588e7bd8fa8 in runtime.doInit (t=0x5588e91a7be0 <os.[inittask]>) at runtime/proc.go:6506
#6  0x00005588e7bd8ef1 in runtime.doInit (t=0x5588e91a9900 <main.[inittask]>) at runtime/proc.go:6483
#7  0x00005588e7bcb953 in runtime.main () at runtime/proc.go:233
#8  0x00005588e7bfcb41 in runtime.goexit () at runtime/asm_amd64.s:1598
#9  0x0000000000000000 in ?? ()
```

So the issue seems to be a call to `setrlimit`. Looking at [the code][gocode]
and searching the Go issue tracker didn't turn up anyone else having this
issue, which pointed at an issue on my system.

I'm honestly not sure what led me to the next step but I decided to take a look
at the Docuum service definition. I was surprised to see that it was more
complicated than most definitions I'm used to seeing:

```ini
[Unit]
Description=LRU eviction of Docker images
Documentation=https://github.com/stepchowfun/docuum
DefaultDependencies=false
After=docker.service docker.socket
Requires=docker.service docker.socket

[Service]
Type=simple
Environment=DOCUUM_THRESHOLD=10GB
EnvironmentFile=-/etc/default/docuum
ExecStart=/usr/bin/docuum --threshold $DOCUUM_THRESHOLD
ProtectSystem=full
PrivateTmp=true
PrivateDevices=true
PrivateNetwork=true
CapabilityBoundingSet=
KeyringMode=private
RestrictNamespaces=~cgroup ipc net mnt pid user uts
RestrictAddressFamilies=AF_UNIX
ReadWritePaths=/var/run/docker.sock
DeviceAllow=
IPAddressDeny=any
NoNewPrivileges=true
PrivateTmp=true
PrivateDevices=true
PrivateMounts=true
PrivateUsers=true
ProtectControlGroups=true
ProtectSystem=strict
ProtectHome=tmpfs
ProtectKernelModules=true
ProtectKernelTunables=true
RestrictSUIDSGID=true
SystemCallArchitectures=native
SystemCallFilter=@system-service
SystemCallFilter=~@privileged @resources
RestrictRealtime=true
LockPersonality=true
MemoryDenyWriteExecute=true
UMask=0077
ProtectHostname=true

[Install]
WantedBy=multi-user.target
```

Suspiciously it seemed to be doing some sandboxing and filtering system calls
(`SystemCallFilter`). A bit more research pointed me to `systemd-analyze
syscall-filter`, which lists which system calls belong to the predefined system
call sets (`@privileged`, `@resources`, etc.).

`setrlimit` was listed under `@resources`:

```
@resources
    # Alter resource settings
    ioprio_set
    mbind
    migrate_pages
    move_pages
    nice
    sched_setaffinity
    sched_setattr
    sched_setparam
    sched_setscheduler
    set_mempolicy
    setpriority
    setrlimit
```

The [systemd docs for `SystemCallFilter`][SystemCallFilter] also mentioned:

> If the first character of the list is "~", the effect is inverted: only the
> listed system calls will result in immediate process termination
> (deny-listing)

So we finally had our culprit: the service definition was denying system calls in
the `@resources` set and at some point `docker` had started making `setrlimit` calls,
which were resulting in termination.

The fix was simple enough: I removed `@resources` from the deny list, rebuilt
the package, and then re-enabled the `docuum` service (I'd previously disabled
it due to the constant crashes). I was pleased to see it start successfully and
begin vacuuming up a few months of Docker image detritus.

### Conclusion

This small debugging session taught me a number of things: I learned how to
find and list core dumps managed by systemd, how to open them in GDB with
symbols present, and that systemd has powerful, fine-grained system call
sandboxing.

I was ultimately able to resolve the issue and get Docuum working again.
I have published my patched version of the AUR package to my personal AUR
repo in case it's useful to anyone else:

<https://github.com/wezm/aur/tree/master/docuum>.

[aurpkg]: https://aur.archlinux.org/packages/docuum
[Docuum]: https://github.com/stepchowfun/docuum
[gocode]: https://github.com/golang/go/blob/203e59ad41bd288e1d92b6f617c2f55e70d3c8e3/src/syscall/zsyscall_linux_amd64.go#L1335
[service]: https://aur.archlinux.org/cgit/aur.git/tree/docuum.service?h=docuum&id=650d2c24fe9df712e8a98dde37f3ee47d3af4e47
[SystemCallFilter]: https://www.freedesktop.org/software/systemd/man/systemd.exec.html#System%20Call%20Filtering
