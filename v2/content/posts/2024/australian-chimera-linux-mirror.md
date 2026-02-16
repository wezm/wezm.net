+++
title = "Australian Chimera Linux Mirror"
date = 2024-08-25T09:17:27+10:00

[extra]
updated = 2026-02-16T14:10:52+10:00
+++

I have set up a mirror of
[repo.chimeralinux.org](https://repo.chimera-linux.org/) on a server in
Australia (Brisbane). It's been running well for a couple of weeks now. The
[root of the mirror][mirror] shows an index of what is hosted and when it was
last synced. [/chimera] is where the Chimera data lives.

It mirrors the packages as well as ISO and rootfs downloads. Using the mirror
greatly speeds up package downloads, which in-turn makes things like `apk
upgrade` a lot faster. Some rudimentary testing suggests this this server may
also provide a speed improvement for folks in parts of Asia too.

<!-- more -->

### How to Use the Mirror

#### Packages

Refer to [the documentation on the Chimera Linux website][mirrors].

#### Downloads

For ISOs and rootfs images visit: <https://au.mirror.7bit.org/chimera/live/latest/>.

### Building and Running the Mirror

I set up a new server with [BinaryLane] in Brisbane and installed Chimera Linux
on it—yes the mirror is hosted with Chimera. Specifically I installed the
[base-minimal] package set to keep the package count low. On top of that I
installed `nginx` to serve the data and [Lego] (which I added to cports) to
manage TLS certificates from Let's Encrypt.

To limit access and avoid the use of `root` there are dedicated regular users
for syncing, `lego`, `nginx`, and `www-data`. To allow `lego` to restart
`nginx` when certificates are updated I use a [doas] rule.

Synchronisation is triggered hourly by a cron job. I use the [atomic-rsync]
script to make updates atomic. The script manages a pair of directories
`chimera-1` and `chimera-2`. The active one is symlinked to `chimera`. The
script syncs into the inactive directory, creating hard links for unchanged
data, then flips the symlink at the end.

After syncing, the current date is written to a file, which is used by a small
snippet of JavaScript on [the index page][mirror] to show when the data was
last synced.

[mirror]: https://au.mirror.7bit.org/
[/chimera]: https://au.mirror.7bit.org/chimera/
[BinaryLane]: https://www.binarylane.com.au/
[base-minimal]: https://pkgs.chimera-linux.org/package/current/main/x86_64/base-minimal
[atomic-rsync]: https://github.com/RsyncProject/rsync/blob/9615a2492bbf96bc145e738ebff55bbb91e0bbee/support/atomic-rsync
[Lego]: https://go-acme.github.io/lego/
[doas]: https://github.com/Duncaen/OpenDoas
[mirrors]: https://chimera-linux.org/docs/apk/mirrors
