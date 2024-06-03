+++
title = "Tech Stack 2024"
date = 2024-06-01T10:13:48+10:00

#[extra]
#updated = 2024-02-21T10:05:19+10:00
+++

Inspired by Alex Chan's [Tools of the trade][achan] post I thought I'd note
down my current tech stack and then revisit it in a few years to see how things
evolve. As per Alex's post I'll break it down into three sections: software,
(development) tech stack, and hardware.

{{ figure(image="posts/2024/tech-stack/desktop.jpg", link="posts/2024/tech-stack/desktop.jpg", resize_width=1600, alt="A photo of my desk. There's two displays, the one on the right is rotated into a portait orientation, the left on is on a wooden monitor stand. In front of the monitors are: a PS4 controller, TI-89, tenkeyless mechanical keyboard, mouse, and Kobo e-Reader.", caption="My desk. The computer is behind the displays.") }}

<!-- more -->

### Software

My dotfiles are public so if you're curious about the configuration of some
of the tools mentioned below check out <https://github.com/wezm/dotfiles>.

#### Linux

I use Linux for everything. On my desktop machine, which I use for work as well
as personal computing I run [Arch Linux]. On my laptop, which is more of an
ancillary device that I use for tinkering and occasional travel I run [Chimera
Linux]. My goal is to run Chimera on the desktop too (it actually dual boots
already) but I need to get my work development environment working on it before
I can do that. My desktop is my primary computer, the rest of the post will
focus on that.

#### Awesome

I've been using the [Awesome window manager][Awesome] since 2019. It's
deceptively good. When I try out other desktop environments it's surprising how
many little details that Awesome gets right. It's also very stable, meaning I
don't get surprise updates to my UI in new releases.

However the writing is on the wall for X11. My current arrangement of two 4K
24&quot; displays running at 2x scaling with one of them rotated to a portrait
orientation is really pushing the limits of X11. It's my goal to switch to a
Wayland based system at some point in the future. Most likely System 76's
[COSMIC desktop][COSMIC], which I've been periodically testing during its
development.

#### Alacritty

Somewhere around 75% of the windows I have open at any time are terminal
windows. I like [Alacritty] because it's devoid of UI chrome and features like
tabs. Awesome takes care of all window organisation so there is no need for
tabs, splits and things like that. I also like that it's responsive to use.

#### Z Shell

I've used the [Z shell][zsh] since at least 2008. I've tried out some of the
newer shells but quickly run into limitations or things I miss from Z shell.
Some things I like about it:

- Extensive, full-featured completion support
- Spelling correction/did you mean
- Synced history: history across all shells is added to history after every
  command and available in all running shells.
- Path expansion: `ls /h/w/P/rss<Tab>` → `ls /home/wmoore/Projects/rsspls`
- Command stack (`Esc-q`)

#### Espanso

[Espanso] is a text expander. It allows me to do things like type `;mdl` and
have that be replaced with a Markdown link using the contents of the clipboard
(E.g. `[](<clipboard url>)`), or `;em` and have that be replaced with my email
address.

#### CLI

I use a bunch of CLI tools, aside from standard POSIX/UNIX tools I use these a lot:

- [bat](https://github.com/sharkdp/bat) — `cat` with syntax highlighting
- [fd](https://github.com/sharkdp/fd) — file finder
- [fzf](https://github.com/junegunn/fzf) — fuzzy finder (integrated with zsh and vim)
- [lsd](https://github.com/lsd-rs/lsd) — `ls` but better
- [ripgrep](https://github.com/BurntSushi/ripgrep) — clever regex search
- [tig](https://github.com/jonas/tig) — git TUI
- [paru](https://github.com/Morganamilo/paru) — `pacman` wrapper

#### Obsidian

I note down ideas, thoughts, howtos, and things in [Obsidian]. I picked it
because the notes store is just plain Markdown files and they sync between
Linux and iOS.

#### ZFS

`/home` on my system is a mirror of two 2Tb NVMe drives. I use [ZFS] for its
data integrity (resistance to bit rot), redundancy (I can lose a drive an not
lose data), compression (`compressratio` is 1.40x at the time of writing), and
lightweight snapshots.

I use [zfs-autosnap] to periodically take snapshots of `/home`, which allows me
roll back files if I get them into an undesirable state.

#### Text Editing

I'm currently in a bit of transitional period with text editors:

- [Rust Rover] for Rust
- [Zed] migration in progress for Rust
- [Neovim] for everything else, it's hard to beat

I have started using Zed for Rust development. Ideally it would be my primary
editor but it doesn't support enough languages yet. I imagine I will shift more
tasks to it as it continues to improve.

#### 1Password

I returned to [1Password] when they released the Linux version. Not a lot say
here, it's reliable and works across all the devices I use.

#### Firefox

Like everyone I use a web browser a lot. I use [Firefox] as it's fast, works well,
is mostly user focused, has built-in ad blocking, and is not a made by Google.

[Multi-account containers][firefox-containers] are a killer Firefox feature
that allows me to segregate things like Google and Facebook off into their own
little container. This separates them so that for my usual browsing I'm not
logged into a Google or Facebook account so it's harder for them to associate my
activities across the web and on first-party sites (like Google Maps) with my
account.

I've read some people say that they can't use Firefox because too many websites
don't work with it but I don't run into this problem at all with the sites I
visit.

##### Stylus

I don't use a lot of browser extensions but [Stylus] is a great one. It lets me
apply custom styles websites (or all sites). This lets do things like fix poor
font choices or hide that annoying Sign-In With Google across all websites.

#### Shotwell

I recently got a new DSLR and did some research to find a decent
non-destructive photo editor and library manager. I settled on [Shotwell] and
while I still dearly miss [Aperture], Shotwell gets the job done.

#### keyd

[keyd] lets me customise and remap keys on my keyboard at the system level so
that it works everywhere. I previously relied solely on programmable mechanical
keyboards for this functionality but I've now been able to use a board that
does not have a customisable firmware with the help of `keyd`.

#### CopyQ

Clipboard history is an essential part of any desktop computing environment and
[CopyQ] is what provides it for me.

### Dev Stack

#### Rust

Pretty much all software I write these days in done with [Rust]. Also I use a
lot of software written in Rust as it tends to be efficient with resources,
reliable, and easy for me to delve into the code if needed.

#### mold

Linking is slow, I do a lot of linking working on personal and work projects.
[Mold] makes this faster.

#### Rocket

For building web applications my go-to is [Rocket]. It's not quite as batteries
included as something like [Rails] but it includes a lot of stuff that's
missing from other options.

#### Zola

For blogs and simple static sites I love [Zola]. It's full-featured, customisable,
and super fast.

#### Gleam

On occasions I need to write code targeting JavaScript that is non-trivial
I've been reaching for [Gleam]. It's kinda of like Elm but actively maintained
and with fewer restrictions.

### Hardware

#### Desktop Computer

My computer is a desktop machine that I assembled myself in 2023:

- AMD Ryzen 9 7950X 16-Core Processor
- 64 Gb DDR5 6000 MT/s RAM
- Storage:
  - Root disk: Crucial T700 1TB PCIe Gen5 NVMe M.2 SSD
  - /home: 2x WD_BLACK 2TB SN850X NVMe in ZFS mirror
- AMD Radeon RX 6700 XT GPU with 12Gb VRAM
- 2x Dell 24&quot; 4K displays, one in portrait orientation
- Razer Kiyo web cam
- Audio Technica ATR2100X microphone
- Logi Lift vertical mouse + BenQ ZOWIE FK2-C mouse
- [WK870 mechanical keyboard][WK870] with Gateron G Pro 2.0 brown switches

All of this is packed into a monstrous [Fractal Design Torrent case][torrent]
with a lot of slow, quiet fans to try to keep all the hot things under control.
This build was optimised for my development activities (both work and personal)
with occasional gaming. For future comparisons it does a clean Prince build[^1]
in 1m50s and scores 2966/20174 in Geekbench 6.

In early 2024 I started having trouble with pain in my hands from mousing. For
nearly 20 odd years I've alternated mouse hands to load balance the wear on my
hands. However this was an issue in both. That led me to try a vertical mouse,
which didn't initially help. I then tried a wrist rest but it was super hard
and the pain remained. I got different softer one and now the vertical mouse is
comfortable and my hands have stopped complaining.

#### Laptop

My laptop is a 13" HP Pavilion Aero Laptop 13-be0203AU I bought it because it was
cheap (~AU$1000), had an 8 core AMD CPU, and was lightweight (~1kg). The case
construction is not great as parts of it are painted plastic, which has dings and
scratches on it now. In contrast to my old 2013 MacBook Pro, which still looks
new.

I've pre-ordered a Lenovo Yoga Slim 7x (14", Gen 9) Snapdragon to replace this
machine. It's got one of the new Snapdragon X Elite ARM CPUs in it. I expect
I'll have to make do with Windows & WSL until Linux support for this new
hardware catches up.

[^1]: `time ./bin/build prince` with `mold` as linker.

[achan]: https://www.alexchantastic.com/tools-of-the-trade
[Prince]: https://www.princexml.com/
[zsh]: https://www.zsh.org/
[Gleam]: https://gleam.run/
[Rust Rover]: https://www.jetbrains.com/rust/
[Zed]: https://zed.dev/
[Neovim]: https://neovim.io/
[Arch Linux]: https://archlinux.org/
[Chimera Linux]: https://chimera-linux.org/
[Awesome]: https://awesomewm.org/
[COSMIC]: https://blog.system76.com/tags/COSMIC%20DE
[Alacritty]: https://alacritty.org/
[Espanso]: https://espanso.org/
[Obsidian]: https://obsidian.md/
[ZFS]: https://openzfs.org/
[zfs-autosnap]: https://github.com/wezm/zfs-autosnap
[1Password]: https://1password.com/
[Firefox]: https://getfirefox.com/
[firefox-containers]: https://support.mozilla.org/en-US/kb/containers
[Sylus]: https://github.com/openstyles/stylus
[Shotwell]: https://wiki.gnome.org/Apps/Shotwell
[Aperture]: https://web.archive.org/web/20150407001931/http://www.apple.com/aperture/
[keyd]: https://github.com/rvaiya/keyd
[CopyQ]: https://hluk.github.io/CopyQ/
[Rocket]: https://rocket.rs/
[Mold]: https://github.com/rui314/mold
[Rust]: https://www.rust-lang.org/
[Zola]: https://www.getzola.org/
[torrent]: https://www.fractal-design.com/products/cases/torrent/
[WK870]: https://www.keebmonkey.com/en-au/products/wk870?syclid=ck4d58iusvis73cshbug
[Stylus]: https://github.com/openstyles/stylus
