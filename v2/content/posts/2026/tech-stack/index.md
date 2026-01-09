+++
title = "Tech Stack 2026"
date =  2026-01-09T08:36:37+10:00

[extra]
updated = 2026-01-09T13:18:42+10:00
+++

A summary of my personal tech stack as we start 2026. I previously did one of these
in [2024](@/posts/2024/tech-stack/index.md). I was prompted to write this one
by [David Bushell] and [Robb Knight]'s App Defaults 2026 posts.

{{ figure(image="posts/2026/tech-stack/desktop.jpg", link="posts/2026/tech-stack/desktop.jpg", resize_width=1600, alt="A photo of my standing desk. There's a large display showing a Chimera Linux GNOME desktop, on the right is Macintosh LC 475. In front of the monitor is: a PS4 controller, TI voyage 200 graphing calculator, tenkeyless mechanical keyboard, mouse, and Boox Go 103 e-Note.", caption="My desk in late 2025.") }}

<!-- more -->

### Software

My dotfiles are public so if you're curious about the configuration of some
of the tools mentioned below check out [github.com/wezm/dotfiles](https://github.com/wezm/dotfiles).

- **Operating System:** [Arch Linux] on my desktop, [Chimera Linux] on my laptop. Each can also
  dual boot the other OS as well. I like rolling release distros for personal computing: you never
  have to do big upgrades, and everything is always up to date.
- **Desktop Environment:** [COSMIC] on my desktop, and [GNOME] on my laptop. I like that COSMIC
  has window tiling built in. Eventually I'd like to get the laptop on COSMIC too.
- **Text Editor:** [Zed] for most coding, backed up with [Neovim] for ancillary editing.
- **Merge Tool:** [Beyond Compare]. If you don't have a proper tool that can do three-way merges
  to resolve git merge conflicts, often automatically, you're missing out.
- **Web Browser:** [Firefox]. People complain a lot about Mozilla, and some of it
  is justified, but it's still a better choice than the alternatives.
- **RSS:** [Feedbin]. I'm a heavy user of RSS, (a quick check says I'm subscribed to 3739 feeds)
  and have been a paid Feedbin subscriber since the demise of Google Reader, it's great.
- **Email:** [Fastmail]. I've been with them since 2012 and it continues to be 100% worth the money.
- **Calendar:** [Fastmail]
- **Social Media:** Personal [Mastodon] instance accessed via the [Phanpy] client.
- **Terminal Emulator:** [Alacritty]
- **Shell:**  [Z Shell][zsh] as has been the case for at least 18 year now.
- **Text Expander:** [Espanso]
- **CLI Tools:**  I use a bunch of CLI tools, aside from standard POSIX/UNIX tools I use these a lot:
  - [bat](https://github.com/sharkdp/bat) — `cat` with syntax highlighting
  - [fd](https://github.com/sharkdp/fd) — file finder
  - [fzf](https://github.com/junegunn/fzf) — fuzzy finder (integrated with zsh and nvim)
  - [lsd](https://github.com/lsd-rs/lsd) — `ls` but better
  - [mergiraf](https://mergiraf.org/) — syntax aware merge conflict resolution tool
  - [ripgrep](https://github.com/BurntSushi/ripgrep) — clever regex search
  - [tig](https://github.com/jonas/tig) — git TUI
  - [paru](https://github.com/Morganamilo/paru) — `pacman` wrapper
- **Notes:** [Obsidian]
- **File System**: ZFS, nothing else can be trusted with my data.
- **Password Manager:**  [1Password]
- **Photo Library:**  [Shotwell]
- **Image Editor:** [GIMP]
- **Audio Editor:** [Audacity]
- **"AI" Coding Tools**: None really. I sometimes have the default Zeta completion
  in Zed but that's about all.

### Hardware

#### Desktop Computer

My computer is a desktop machine that I assembled myself in 2023, it has had a few
upgrades since I last documented it—how great are upgradable computers!

- AMD Ryzen 9 9950X3D 16-Core/32-Thread Processor
- 64 Gb DDR5 6000 MT/s RAM
- Storage:
  - Root disk: Crucial T700 1TB PCIe Gen5 NVMe M.2 SSD, ext4
  - /home: 2x WD_BLACK 2TB SN850X PCIe Gen4 NVMe, ZFS mirror
  - Extra storage: 3x Samsung 1Tb Evo 870 SSDs, ZFS RAIDZ-1
- AMD Radeon RX 9060 XT GPU with 16Gb VRAM
- ASUS PA32QCV 6016x3384 6K display at 2x scaling
- Razer Kiyo web cam
- Audio Technica ATR2100X microphone
- Logi MX Vertical mouse + BenQ ZOWIE FK2-C mouse
- [WK870 mechanical keyboard][WK870] with Gateron G Pro 2.0 brown switches

[1Password]: https://1password.com/
[achan]: https://www.alexchantastic.com/tools-of-the-trade
[Alacritty]: https://alacritty.org/
[Aperture]: https://web.archive.org/web/20150407001931/http://www.apple.com/aperture/
[Arch Linux]: https://archlinux.org/
[Awesome]: https://awesomewm.org/
[Chimera Linux]: https://chimera-linux.org/
[CopyQ]: https://hluk.github.io/CopyQ/
[COSMIC]: https://blog.system76.com/tags/COSMIC%20DE
[David Bushell]: https://dbushell.com/2026/01/08/app-defaults/
[Espanso]: https://espanso.org/
[firefox-containers]: https://support.mozilla.org/en-US/kb/containers
[Firefox]: https://getfirefox.com/
[Gleam]: https://gleam.run/
[keyd]: https://github.com/rvaiya/keyd
[Mold]: https://github.com/rui314/mold
[Neovim]: https://neovim.io/
[Obsidian]: https://obsidian.md/
[Prince]: https://www.princexml.com/
[Rails]: https://rubyonrails.org/
[Robb Knight]: https://rknight.me/blog/app-defaults-2026/
[Rocket]: https://rocket.rs/
[Rust Rover]: https://www.jetbrains.com/rust/
[Rust]: https://www.rust-lang.org/
[Shotwell]: https://wiki.gnome.org/Apps/Shotwell
[Stylus]: https://github.com/openstyles/stylus
[Sylus]: https://github.com/openstyles/stylus
[torrent]: https://www.fractal-design.com/products/cases/torrent/
[WK870]: https://www.keebmonkey.com/en-au/products/wk870?syclid=ck4d58iusvis73cshbug
[Zed]: https://zed.dev/
[zfs-autosnap]: https://github.com/wezm/zfs-autosnap
[ZFS]: https://openzfs.org/
[Zola]: https://www.getzola.org/
[zsh]: https://www.zsh.org/
[GNOME]: https://www.gnome.org/
[Feedbin]: https://feedbin.com/
[Fastmail]: https://www.fastmail.com/
[GIMP]: https://www.gimp.org/
[Audacity]: https://www.audacityteam.org/
[Beyond Compare]: https://www.scootersoftware.com/
[Mastodon]: https://joinmastodon.org/
[Phanpy]: https://phanpy.social/
