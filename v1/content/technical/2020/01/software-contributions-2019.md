Open-source software has a bit of a sustainability problem so I try to
contribute back to the ecosystem where I can. I am very fortunate to be in a
position where I have spare time and income that I'm able to funnel into this.
[At the end of 2017 I did a round-up of the software contributions](/technical/2018/01/software-contributions-2017/)
I'd made that year. I thought it would be good to do another one now that 2019
has come to a close.

My motivation for doing so is twofold: to encourage others to do the same if they
are able, and to highlight people and projects doing interesting and important
work.

## Financial Contributions

### Monthly Donations

I make small (typically US$5–10) monthly donations to the following:

* [Arch Linux](https://www.archlinux.org/) — My operating system of choice.
* [FreeBSD](https://www.freebsd.org/) — I like OS diversity.
* [OpenBSD](https://www.openbsd.org/) — Even if you don’t use the OS you probably use OpenSSH.
* [Neovim](https://neovim.io/) — My text editor of choice.
* [Gargron](https://www.patreon.com/mastodon) — Creator of the [Mastodon](https://joinmastodon.org/) decentralised social network.
* [Jeremy Soller](https://www.patreon.com/redox_os) — Creator of [Redox OS](https://www.redox-os.org/), an operating system written in Rust.
* [Jorge Aparicio](https://www.patreon.com/japaric) — Building out the [embedded Rust](https://github.com/rust-embedded) ecosystem.
* [Dirkjan Ochtman](https://www.patreon.com/dochtman) — Rust developer, author of the [askama](https://github.com/djc/askama) compile time template language.
* [QuietMisdreavus](https://www.patreon.com/QuietMisdreavus) — Leader of the [docs.rs](https://docs.rs/) team.
* [Pierre Krieger](https://www.patreon.com/tomaka) — Rust developer, author of [many crates](https://github.com/tomaka).
* [Raph Levien](https://www.patreon.com/raphlinus) — Doing lots of interesting things in the Rust ecosystem.
* [Kent Overstreet](https://www.patreon.com/bcachefs) — Building [bcachefs](https://bcachefs.org/), a copy-on-write file system for Linux.
* [Geoffroy Couprie](https://www.patreon.com/geoffroy) — Rust developer, author of the [nom](https://github.com/Geal/nom) parser combinator framework.
* [Nora Dot Codes](https://www.patreon.com/noracodes) — Rust tutorials and code.
* [Bryan Phelps](https://www.patreon.com/onivim) — Building the [Onivim](https://v2.onivim.io/) Neovim GUI with [Reason](https://reasonml.github.io/).
* [Blondihacks](https://www.patreon.com/QuinnDunki) — Great engineering and electronics [blog posts](http://blondihacks.com/) and videos.
* [GNOME](https://www.gnome.org/) — I don't use the GNOME desktop at the moment but they still do a lot of foundational work for open-source desktops (such as GTK, and pushing Wayland) that I want to support.
* [Mozilla](https://www.mozilla.org/) — [Firefox](https://www.mozilla.org/firefox/) is my browser of choice.
* [rust-analyzer](https://rust-analyzer.github.io/) — New language server for Rust
* [Crystal](https://crystal-lang.org/) — Now powering [Read Rust](https://readrust.net/). _Yes I'm aware that some find it amusing that a Rust site is not written in Rust. I have [my reasons](https://github.com/wezm/read-rust/blob/a2b9a3a776871390ab5b87a6bda7187fcb5f232c/README.md#development)._
* [Rich Felker](https://github.com/richfelker) — Creator of [musl libc](https://www.musl-libc.org/), which powers [my Void Linux laptop](https://bitcannon.net/post/huawei-matebook-x-pro-void-linux/).
* [Sean Griffin](https://github.com/sgrif) — Creator of the [Diesel](http://diesel.rs/) ORM for Rust.

### One Off Contributions

* [CopyQ](https://hluk.github.io/CopyQ/) — Clipboard manager for open-source desktops.
* [Movember](https://au.movember.com/about/cause) — This one isn't software but
  my brother took his own life in April 2019. I supported some friends taking part in
  Movember, a cause that aims to improve mens health.

## Open Source Contributions

In addition to financial contributions I also made code contributions, both to
existing projects and by releasing my own work. Some of the highlights are:

* Curated [Read Rust](https://readrust.net/), my site that aggregates
  interesting posts from the Rust community:
  * Shared 1207 posts.
  * Completely [rebuilt the site](https://github.com/wezm/read-rust/pull/112).
  * Added a [Support Rust](https://twitter.com/read_rust/status/1132950140585570304?s=20) page
    highlighting people and projects in the Rust ecosystem accepting financial
    contributions.
* 45 pull requests to projects on GitHub.
* Published the [cc2650](https://crates.io/crates/cc2650) crate to support [running
  Rust on the CC2650 based TI
  SensorTag](https://www.wezm.net/technical/2019/03/sensortag-embedded-rust-coding-retreat/).
* Published a [Lobsters](https://lobste.rs/) client
  [crate](https://crates.io/crates/lobsters) and
  [TUI](https://www.wezm.net/technical/2019/04/lobsters-tui/).
* Published the [profont](https://crates.io/crates/profont) monospace font crate
  and [ssd1675](https://crates.io/crates/ssd1675) ePaper display driver crate
  for my [Rust powered linux.conf.au e-Paper
  badge](https://www.wezm.net/technical/2019/01/linux-conf-au-rust-epaper-badge/).
* Created/maintain 21 [Arch User Repository (AUR)
  packages](https://aur.archlinux.org/packages/?SeB=m&K=wezm).

## Conclusion

2019 was a good year for contributions. This was partly due to me starting a
new job at YesLogic 4 days a week. I dedicate the fifth day of the work week to
personal projects and open-source. I was also fortunate to contribute to
open-source projects though my work at YesLogic. We released the [Allsorts font
parsing and shaping engine][Allsorts] and [several crates][yeslogic-crates]
relating to font handling and Unicode.

Onward to 2020!

[Allsorts]: https://yeslogic.com/blog/allsorts-rust-font-shaping-engine.html
[yeslogic-crates]: https://crates.io/teams/github:yeslogic:developers-prince
