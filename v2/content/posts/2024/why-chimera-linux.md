+++
title = "Why Chimera Linux"
date = 2024-07-04T08:48:55+10:00

[extra]
updated = 2024-07-04T12:24:30+10:00
+++

I received a reply to my [Tech Stack 2024](@/posts/2024/tech-stack/index.md)
post asking: Why Chimera Linux? I wrote a response that turned out longer than
anticipated and figured I may as well post it here too. I'm not trying to
convince you to use Chimera with this post, just note down why it appeals to
me. That's really the crux of it: there's dozens of distros out there all with
different goals and values and Chimera really speaks to me, for you it might be
something else.

<!-- more -->

Below is a lightly edited version of my email response.

---

I like [Chimera Linux] because it's the closest distro I've found to what I would build
if I was building my own (something I've tinkered with a few times over the
years).

I like that it is a comparatively small and easy to understand system without
giving up quite as much as you do with Alpine Linux, which to be clear, I like
as well and use on my server. The [userland from FreeBSD][userland] is capable and easy
to understand code wise, [Dinit] provides an init system with process monitoring,
dependency tracking, and a service file format that doesn't require writing
shell scripts like in FreeBSD and Alpine. [musl] is designed to be secure and
uses quite straightforward implementations of libc functions while sticking
closely to the POSIX standard. See the recent OpenSSH vulnerability where
[remote code execution was not possible on musl based systems](https://fosstodon.org/@musl/112711796005712271).

I really like the [cbuild] system for building packages. It uses a real
programming language (Python) to define packages and share library code. This
makes package templates easier to write and understand over Make and shell
based packaging systems. Packages are built in an isolated sandbox, preventing
them depending on the host system accidentally—this is definitely an advantage
over building packages on Arch. Most run-time dependencies are automatically
determined so you don't have to list all those out in the package template.

[apk] is fast (although not as fast as Pacman when doing updates[^1]). It has a
clever way of tracking packages where [the world file][world] specifies all the packages
that should be present and it uses a solver to determine what needs to be
installed/removed. The neat bit is that when you `apk del` a package it can remove all
packages that are no longer specifically requested, whereas in Arch it's easy
to end up with orphaned packages that are dead weight and require [manual
maintenance to clean up](https://wiki.archlinux.org/title/Pacman/Tips_and_tricks#Removing_unused_packages_(orphans)).

Chimera is also a rolling distro (like Arch) so things stay up to date. There's
a low barrier to submitting new packages and updates, you don't have to have a
special "committer" or "developer" account, you can just open a pull request
like any other open-source project. Packages in the repo are built
automatically with a build bot server for all supported architectures, whereas
I believe Arch is still working towards automated packaging. Additionally first
class support for multiple CPU architectures allows me to run the same system
on different devices I use such as Raspberry Pis, RISC-V single board
computers, and hopefully eventually my new ARM based Snapdragon X Elite laptop.

Having written that all out I guess Chimera feels like a distro that is
full-featured but also simple enough that you can poke around and understand
all the parts. It's also easy to get involved with the project.

[^1]: Pacman downloads in parallel (5 at time in my config), then does the actual upgrades. `apk` fetches one package at at time and then stages the upgrade before moving on to the next one. There's a couple of related open issues:

      - <https://gitlab.alpinelinux.org/alpine/apk-tools/-/issues/10963>
      - <https://gitlab.alpinelinux.org/alpine/apk-tools/-/issues/5977>

[cbuild]: https://github.com/chimera-linux/cports/blob/master/Usage.md
[cports]: https://github.com/chimera-linux/cports
[musl]: https://musl.libc.org/
[Dinit]: https://davmac.org/projects/dinit/
[apk]: https://gitlab.alpinelinux.org/alpine/apk-tools
[userland]: https://github.com/chimera-linux/chimerautils
[Chimera Linux]: https://chimera-linux.org/
[world]: https://chimera-linux.org/docs/apk/world
