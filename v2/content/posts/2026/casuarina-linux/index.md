+++
title = "Introducing My New Linux Distro: Casuarina Linux"
date = 2026-05-19T19:22:09+10:00

# [extra]
# updated = 2026-01-27T09:25:58+10:00
+++

Over the past few months I've been working on a Linux distribution derived from [Chimera Linux], and
it's now available for download. The distribution is called Casuarina Linux. It swaps out `musl` in
Chimera for `glibc` to gain more binary compatibility with the wider GNU/Linux ecosystem.

{{ figure(image="posts/2026/casuarina-linux/casuarina-gnome.webp", link="posts/2026/casuarina-linux/casuarina-gnome.webp", resize_width=1600, border=true, alt="Casuarina Linux GNOME desktop with a music player open and compact fastfetch output showing OS: Casuarina Linux x86, boot manager: systemd-boot, kernel: Linux, init: dinit, libc: glibc, pkgs: apk (1786)", caption="GNOME desktop on Casuarina Linux.") }}

<!-- more -->

Most of the heavy lifting was done by [q66] in creating Chimera Linux. I used that excellent base to
build Casuarina. It inherits most of the composition of Chimera, with the exception of `glibc`:

- [LLVM] toolchain
- [Dinit] init system
- [GNU libc][glibc]
- [FreeBSD derived core utilities][chimerautils]
- [apk package manager][apk]

The resulting system is compact and efficient, but still full-featured and well suited to desktop
use. It may appeal to people that want a Linux distribution that's up-to-date, doesn't compromise on
functionality, compatible, and easy to understand and contribute to. I've been using as the primary
OS on my laptop and desktop for personal and day job computing since mid-April.

Read more about it in the [announcement post on the Casuarina Linux website][announce].

[announce]: https://casuarina.org/news/introducing-casuarina-linux/
[Chimera Linux]: https://chimera-linux.org/
[cbuild]: https://chimera-linux.org/about/#buildable-from-source
[apk]: https://gitlab.alpinelinux.org/alpine/apk-tools
[LLVM]: https://www.llvm.org/
[Dinit]: https://davmac.org/projects/dinit/
[Buildbot]: https://buildbot.net/
[chimerautils]: https://github.com/chimera-linux/chimerautils
[glibc]: https://www.gnu.org/software/libc/
[Codeberg]: https://codeberg.org/casuarina/
[q66]: https://q66.moe/
