For a little side project I'm working on I want to be able to produce
pre-compiled binaries for a variety of platforms, including FreeBSD. With a bit
of trial and error I have been able to successfully build working FreeBSD
binaries from a Docker container, without using (slow) emulation/virtual
machines.  This post describes how it works and how to add it to your own Rust
project.

I started with [Sandvine's freebsd-cross-build][freebsd-cross-upstream] repo. Which builds
a Docker image with a cross-compiler that targets FreeBSD. I made a few updates
and improvements to it:

* Update from FreeBSD 9 to 12.
* Base on newer debian9-slim image instead of ubuntu 16.04.
* Use a multi-stage Docker build.
* Do all fetching of tarballs inside the container to remove the need to run a
  script on the host.
* Use the FreeBSD base tarball as the source of headers and libraries instead
  of ISO.
* Revise the `fix-links` script to automatically discover symlinks that need
  fixing.

Once I was able to successfully build the cross-compilation toolchain I built a
second Docker image based on the first that installs Rust, and the
`x86_64-unknown-freebsd` target. It also sets up a non-privileged user account
for building a Rust project bind mounted into it.

Check out the repo at: <https://github.com/wezm/freebsd-cross-build>

## Building the Images

I haven't pushed the image to a container registry as I want to do further
testing and need to work out how to version them sensibly. For now
you'll need to build them yourself as follows:

1. `git clone git@github.com:wezm/freebsd-cross-build.git && cd freebsd-cross-build`
2. `docker build -t freebsd-cross .`
3. `docker build -f Dockerfile.rust -t freebsd-cross-rust .`

## Using the Images to Build a FreeBSD Binary

To use the `freebsd-cross-rust` image in a Rust project here's what you need to
do (or at least this is how I'm doing it):

In your project add a `.cargo/config` file for the `x86_64-unknown-freebsd`
target. This tells cargo what tool to use as the linker.

```
[target.x86_64-unknown-freebsd]
linker = "x86_64-pc-freebsd12-gcc"
```

I use Docker volumes to cache the output of previous builds and the cargo
registry.  This prevents cargo from re-downloading the cargo index and
dependent crates on each build and saves build artifacts across builds,
speeding up compile times.

A challenge this introduces is how to get the
resulting binary out of the volume. For this I use a separate `docker`
invocation that copies the binary out of the volume into a bind mounted host
directory.

_Originally I tried mounting the whole `target` directory into the container
but this resulted in spurious compilation failures during linking and lots of
files owned by `root` (I'm aware of [user namespaces] but haven't set it up
yet)._

I wrote a shell script to automate this process:

```language-shell
#!/bin/sh

set -e

mkdir -p target/x86_64-unknown-freebsd

# NOTE: Assumes the following volumes have been created:
# - lobsters-freebsd-target
# - lobsters-freebsd-cargo-registry

# Build
sudo docker run --rm -it \
  -v "$(pwd)":/home/rust/code:ro \
  -v lobsters-freebsd-target:/home/rust/code/target \
  -v lobsters-freebsd-cargo-registry:/home/rust/.cargo/registry \
  freebsd-cross-rust build --release --target x86_64-unknown-freebsd

# Copy binary out of volume into target/x86_64-unknown-freebsd
sudo docker run --rm -it \
  -v "$(pwd)"/target/x86_64-unknown-freebsd:/home/rust/output \
  -v lobsters-freebsd-target:/home/rust/code/target \
  --entrypoint cp \
  freebsd-cross-rust \
  /home/rust/code/target/x86_64-unknown-freebsd/release/lobsters /home/rust/output
```

This is what the script does:

1. Ensures that the destination directory for the binary exists. Without this,
   docker will create it but it'll be owned by root and the container won't be
   able to write to it.
2. Runs `cargo build --release --target x86_64-unknown-freebsd` (the leading
   `cargo` is implied by the `ENTRYPOINT` of the image.
    1. The first volume (`-v`) argument bind mounts the source code into the
       container, read-only.
    2. The second `-v` maps the named volume, `lobsters-freebsd-target` into
       the container. This caches the build artifacts.
    3. The last `-v` maps the named volume, `lobsters-freebsd-cargo-registry`
       into the container. This caches the carge index and downloaded crates.
3. Copies the built binary out of the `lobsters-freebsd-target` volume into the
   local filesystem at `target/x86_64-unknown-freebsd`.
    1. The first `-v` bind mounts the local `target/x86_64-unknown-freebsd`
       directory into the container at `/home/rust/output`.
    2. The second `-v` mounts the `lobsters-freebsd-target` named volume into
       the container at `/home/rust/code/target`.
    3. The `docker run` invocation overrides the default `ENTRYPOINT` with `cp`
       and supplies the source and destination to it, copying from the volume
       into the bind mounted host directory.

After running the script there is a FreeBSD binary in
`target/x86_64-unknown-freebsd`. Copying it to a FreeBSD machine for testing
shows that it does in fact work as expected!

One last note, this all works because I don't depend on any C libraries in my
project. If I did, it would be necessary to cross-compile them so that the
linker could link them when needed.

Once again, the code is at: <https://github.com/wezm/freebsd-cross-build>.

<div class="seperator"><hr class="left">✦<hr class="right"></div>

Previous Post: [My First 3 Weeks of Professional Rust](/technical/2019/03/first-3-weeks-of-professional-rust/)


[freebsd-cross-upstream]: https://github.com/sandvine/freebsd-cross-build
[user namespaces]: https://docs.docker.com/engine/security/userns-remap/
