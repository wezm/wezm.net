With [my move away from macOS][mac-alternative] in 2017 to open source
operating systems I was aware that my software spending would reduce as most
software I use these days is provided without financial cost. I decided early
in the year to try to make a point to redirect these savings towards some of
the projects I was now benefiting from as well as to some people that were
doing interesting work. In addition I wanted to ramp up my own open source
contributions.

I acknowledge that I'm very lucky to be in the privileged position to have the
means to contribute time and money to these projects and I'm by no means
suggesting everyone must do the same. I am still far away from contributing to
all the projects I benefit from but am thankful for all the time and effort
that goes into each and every one.

## elementary OS

I started the year running [elementary] as my macOS replacement and was
strongly incentivised to see it succeed. I contributed through [bug
bounties][bounties], recurring payments on [Patreon][donate-elementary],
[merchandise][merch-elementary] and an [Indiegogo campaign][indie-elementary].

**Contribution:** $281.48

## Arch Linux

As my primary OS at work and on my laptop [Arch] was also high on my list of
projects to support. I contribute through [recurring donation][donate-arch].

**Contribution:** $120

## FreeBSD

I run [FreeBSD] on my two Digital Ocean servers, as well as on my NAS and as of
the latter part of 2017, the primary OS on my home desktop computer. I
contribute through [recurring donation][donate-freebsd].

**Contribution:** $120

## NetBSD

I run [NetBSD] on a little $15 a year server but also have a soft spot for it
as it was the first UNIX like OS I installed many year ago. NetBSD doesn't get
all that much attention these days but they have some interesting projects like
[pkgsrc], [Rump kernel][Rump], and [anita], so it was important to me to send
some dollars their way. NetBSD don't have a recurring donation mechanism so I
made a [one off donation][donate-netbsd] at the end of the year.

**Contribution:** $60

## OpenBSD

I don't run [OpenBSD] directly, aside from an install on my laptop to check in
with its progress now and then. However, the project has had a huge impact on
the software world and in my opinion doesn't get enough credit (or funds) for
this. Some of their projects of note are: 

* [OpenSSH] (including `ssh`, `scp`, `sftp`, `ssh-agent`)
* [LibreSSL]
* [tmux]
* [pf firewall][pf]
* [OpenSMTPD]

Even if you don't use OpenBSD directly it's likely you're benefiting from one
of their projects. I contributed through [recurring donation][donate-openbsd]
and [merchandise][merch-openbsd].

**Contribution:** $150

## Solus OS

Early in the year I was using the [Budgie desktop][solus] on Arch as my desktop
environment.  Eventually I switched to GNOME but sent them funds for a while. I
contributed to [Solus on Patreon][donate-solus].

**Contribution:** $50


## GNOME

[GNOME] is the desktop environment I use on all my systems now. I like the
integration of all the components and the relatively uncluttered UI. The
project is huge, spanning low level libraries, the GTK toolkit, applications
built with these libraries, and the desktop environment itself.

When you, "[Become a Friend of GNOME][donate-gnome]", you get to adopt a
hacker and receive a post card from a GNOME developer. I chose [Christian
Hergert], for all the excellent work he's doing on [GNOME Builder].

**Contribution:** $45

## Mozilla

[Mozilla] make my browser of choice, [Firefox], but also favourite programming
language, [Rust].  They're also strong proponents for the open web and pushing
new technologies like web assembly forward. I contribute through [recurring
donation][donate-mozilla].

**Contribution:** $35

## Neovim

I use [Neovim] pretty much every day and it is one of the primary tools I use
in my day job. This very post was written in it. Supporting its continued
development is definitely in my interest. I contribute through [recurring
donation][donate-neovim].

**Contribution:** $60

## Individual Creators

These are people doing interesting work or are responsible for things I benefit
from.

* [Jeremy Soller] is creating [Redox OS], an MIT licensed OS written in Rust.
  $60
* [Gargron] is creating the [Mastodon] federated social network. You can find
  me at <https://mastodon.social/@wezm>. $40
* [Jorge Aparicio] is doing fantastic work building Rust tooling and pushing
  the state of the art of [Rust on microcontrollers][embedded-rust]. $35
* [Steve Wills] does a stack of work on [FreeBSD ports/packages][swills-ports].
  $10
* [Drew DeVault] (sircmpwn) is building a bunch of interesting open source
  tools, including the [sway] tiling Wayland compositor for Linux and FreeBSD.
  $15

**Contribution:** $160

## Bug Bounties

Bug bounties seem like a nice way to make bug fixes more appealing, reward
folks that fix bugs you've encountered or to make a feature request a little
more rewarding for a developer. Excluding the bounties that resulted from my
elementary use detailed above I also posted these bounties:

| Project        | Amount   |
| -------------- | -------- |
| [dopen]        | $20      |
| [neovim-gtk]   | $40      |
| [GNOME - vte]  | $100     |
| [Plack]        | $15      |
| [Maya]         | $10      |
| [Geary]        | $50      |
| **TOTAL**      | $235     |

## Other One Off Contributions

* [rEFInd boot manager][refind] $10
* [Pass for iOS][pass-ios] $15
* [archive.org] $10

**Contribution:** $35

## Open Source Contributions

In addition to financial contributions, in 2017 I also tried to make more open
source contributions, both to projects and by releasing my own work.  Some of
these were just small README improvements, others were new features or
operating system support. Some of the highlights are:

* Add, fix, or improve FreeBSD and OpenBSD support in the [nix], [libc],
  [rust-users] crates.
* Various [small fixes][pr-dot] to the [dot], dotfiles manager.
* Replace the deprecated use of `rustc_serialize` with `serde` in the
  [maxminddb crate][maxminddb].
* Convert the [Scala STM] documentation from Textile to Markdown so that their
  website could be brought back online.
* Create and maintain some [AUR packages].
* Build and publish [titlecase] tool and crate.

## Conclusion

So all up I donated $1,351.48. That's likely more than I would have
spent on commercial software in the year but still not a huge amount in the
grand scheme of things. I hope it helps all these great projects.

In the past year I am happy with the code and documentation contributions
I made. In the future I'd like to be releasing or contributing more sizable
chunks of code... We'll see how that goes in 2018.

[anita]: https://github.com/gson1703/anita
[Arch]: https://www.archlinux.org/
[archive.org]: https://archive.org/
[AUR packages]: https://aur.archlinux.org/packages/?K=wezm&SeB=m
[bounties]: https://www.bountysource.com/people/24354-wezm
[Christian Hergert]: https://blogs.gnome.org/chergert/
[donate-arch]: https://www.archlinux.org/donate/
[donate-elementary]: https://www.patreon.com/elementary
[donate-freebsd]: https://www.freebsdfoundation.org/donate/
[donate-gnome]: https://www.gnome.org/friends/
[donate-mozilla]: https://donate.mozilla.org/
[donate-neovim]: https://salt.bountysource.com/teams/neovim
[donate-netbsd]: https://www.netbsd.org/donations/#how-to-donate
[donate-openbsd]: http://www.openbsd.org/donations.html
[donate-solus]: https://www.patreon.com/solus
[dopen]: https://www.bountysource.com/trackers/59191989-tmccombs-dopen
[dot]: https://github.com/ubnt-intrepid/dot
[Drew DeVault]: https://www.patreon.com/sircmpwn
[elementary]: https://elementary.io/
[embedded-rust]: http://blog.japaric.io/
[Firefox]: https://www.mozilla.org/firefox/
[FreeBSD]: https://www.freebsd.org/
[Gargron]: https://www.patreon.com/mastodon
[Geary]: https://www.bountysource.com/trackers/403531-geary
[GNOME - vte]: https://www.bountysource.com/trackers/11153430-gnome-vte
[GNOME Builder]: https://wiki.gnome.org/Apps/Builder
[GNOME]: https://www.gnome.org/
[indie-elementary]: https://www.indiegogo.com/projects/appcenter-the-pay-what-you-want-app-store#/
[Jeremy Soller]: https://www.patreon.com/redox_os
[Jorge Aparicio]: https://www.patreon.com/japaric
[libc]: https://github.com/rust-lang/libc/pulls?utf8=%E2%9C%93&q=is%3Apr+author%3Awezm+created%3A2017-01-01..2017-12-31
[LibreSSL]: https://www.libressl.org/
[mac-alternative]: http://bitcannon.net/post/finding-an-alternative-to-mac-os-x/
[Mastodon]: https://joinmastodon.org/
[maxminddb]: https://github.com/oschwald/maxminddb-rust
[Maya]: https://www.bountysource.com/trackers/52097-maya
[merch-elementary]: https://elementary.io/store/
[merch-openbsd]: https://openbsdstore.com/
[Mozilla]: https://www.mozilla.org/
[neovim-gtk]: https://www.bountysource.com/trackers/40104917-daa84-neovim-gtk
[Neovim]: https://neovim.io/
[NetBSD]: https://www.netbsd.org/
[nix]: https://github.com/nix-rust/nix/pulls?utf8=%E2%9C%93&q=is%3Apr+author%3Awezm+created%3A2017-01-01..2017-12-31
[OpenBSD]: http://www.openbsd.org/
[OpenSMTPD]: https://www.opensmtpd.org/
[OpenSSH]: https://www.openssh.com/
[pass-ios]: https://github.com/mssun/passforios
[pf]: https://man.openbsd.org/pf.4
[pkgsrc]: http://www.pkgsrc.org/
[Plack]: https://www.bountysource.com/trackers/262089-plank
[pr-dot]: https://github.com/ubnt-intrepid/dot/pulls?utf8=%E2%9C%93&q=is%3Apr+author%3Awezm+created%3A2017-01-01..2017-12-31
[Redox OS]: https://www.redox-os.org/
[refind]: http://www.rodsbooks.com/refind/
[Rump]: https://en.wikipedia.org/wiki/Rump_kernel
[rust-users]: https://github.com/ogham/rust-users/pulls?utf8=%E2%9C%93&q=is%3Apr+author%3Awezm+created%3A2017-01-01..2017-12-31
[Rust]: https://www.rust-lang.org/
[Scala STM]: https://nbronson.github.io/scala-stm/
[solus]: https://solus-project.com/
[Steve Wills]: https://www.patreon.com/swills
[sway]: http://swaywm.org/
[swills-ports]: http://www.freshports.org/search.php?stype=committer&method=match&query=swills&num=10&orderby=category&orderbyupdown=asc&search=Search
[titlecase]: https://github.com/wezm/titlecase
[tmux]: http://tmux.github.io/
