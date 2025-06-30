+++
title = "Doing My Day Job on Chimera Linux"
date = 2025-06-29T12:05:41+10:00

# [extra]
# updated = 2025-05-04T19:51:02+10:00
+++

{{ figure(image="posts/2025/daily-driving-chimera-for-work/cane-fields.jpg",
   link="posts/2025/daily-driving-chimera-for-work/cane-fields.jpg",
   resize_width=1600,
   alt="Landscape scene with trimmed, green grass in the foreground, sugar cane fields in the middle, and foggy bushland mountains in the background topped with a clear blue sky.",
   caption="View of sugar cane fields from where I was working.") }}

{% aside(title="What Is Chimera Linux?", float="right") %}
<a href="https://chimera-linux.org/">Chimera Linux</a> is a unique from-scratch
Linux distribution created in 2021 by <a href="https://q66.moe/">q66</a> that
combines the <a href="https://www.kernel.org/">Linux kernel</a>, <a
href="https://musl.libc.org/">musl libc</a>, <a
href="https://www.freebsd.org/">FreeBSD</a> userland, <a
href="https://wiki.alpinelinux.org/wiki/Alpine_Package_Keeper">apk package
manager</a>, and <a href="https://davmac.org/projects/dinit/">dinit binary init
system</a>. The whole system is built with the <a href="https://llvm.org/">LLVM</a> toolchain.
{% end %}

Since [I started running the first alpha][alpha] release of [Chimera Linux] in
2023, my goal has been to eventually migrate to Chimera as my primary operating
system. This includes personal tinkering as well as for my job as a programmer.
A recent trip to Central Queensland afforded an opportunity to test the waters
of daily driving Chimera Linux for work. The trip spanned two weeks and involved
working remotely (as usual) during the week, and sightseeing on the weekends.

This post details some of the barriers that I encountered and how I worked
around them. While the post is focussed on Chimera Linux, the details probably
apply to most distributions using [musl libc][musl].

<!-- more -->

This is not the first time I've tried using a musl based distribution while on
a working holiday. I did the same with [Void Linux (musl) in 2019][void-2019].
So, I'm not going into this 100% blind.

### Preparations

#### Hardware

The last time I did working travel like this I used Windows + WSL on my
[Lenovo Yoga Slim 7x ARM laptop](@/posts/2024/yoga-7x-snapdragon-developer-review/index.md).
This worked pretty well, but since then Windows has become unstable on that machine.
Every few days it crashes and reboots with the error:

> The system has rebooted without cleanly shutting down first. This error is
> caused because the system stopped responding and the hardware watchdog
> triggered a system reset.

Usually I don't see the reboot. I just open it and it has restarted—
everything I had open is gone. Apparently [I'm not the only one
experiencing the issue][win-crash]. I've tried various things to fix it, including a
clean reinstall, but the issue remains.

After the reinstall failed to fix Windows [I finally got around to installing
Chimera Linux on it][x1e-linux]. However, Linux support for Snapdragon X based laptops is
still a work in progress. The main issues are: the webcam doesn't work, and the
battery drains pretty quickly while suspended. It is more stable than Windows though.

While usable, this felt a little too bleeding edge for a machine I'd need to
work from, so I picked up a [Lenovo Yoga 7 2-in-1 (14\", Gen 10)][2in1] laptop
with a decent <abbr title="End of Financial Year">EoFY</abbr> discount. It's
got a AMD Ryzen AI 7 350 CPU with 8 cores (4×Zen 5, 4×Zen 5c), 32 Gb RAM, and
1Tb NVMe. I was also curious to see what things were looking like on the x86
side of the fence (my last x86\_64 laptop was from 2022).

{{ figure(image='posts/2025/daily-driving-chimera-for-work/Lenovo Yoga 7 2-in-1 (14", Gen 10).jpg',
   link='posts/2025/daily-driving-chimera-for-work/Lenovo Yoga 7 2-in-1 (14", Gen 10).jpg',
   resize_width=1600,
   alt="Lenovo Yoga 7 2-in-1 sitting open with two windows in GNOME open",
   caption='Lenovo Yoga 7 2-in-1 (14" Gen 10)') }}

#### Software

Installation of Chimera on the new laptop was straightforward:

1. Disable Secure Boot
2. Boot from live USB flash drive
3. Follow [installation instructions][chimera-install]

{{ figure(image="posts/2025/daily-driving-chimera-for-work/fastfetch-chimera-yoga7.png",
   link="posts/2025/daily-driving-chimera-for-work/fastfetch-chimera-yoga7.png",
   resize_width=1600,
   alt="Screenshot of a terminal window with the output of fastfetch.",
   caption="fastfetch output on the Yoga 7 2-in-1.") }}

The product I work on, [Prince], is implemented in a mixture of [Mercury] and [Rust].
I created [an apk package for the specific version of the Mercury][mmc] compiler we use.
The main issue I encountered here was Chimera's `fortify-headers` did not play nice
with the Mercury build, so I added a [patch to disable it][patch].

We also use a pinned version of Rust for building Prince, but [rustup] toolchains
don't work on Chimera—it's only possible to run the packaged
version of Rust. Building Prince with this version of Rust was fine.

With Prince built, the next hurdle to jump over was passing the test suite. This
initially failed due to different output produced by `zlib-ng` used by Chimera,
compared to `zlib` used by other distros. This was easily fixed by telling our
build system to build `zlib` when on Chimera Linux (like we already do for some
other systems).

Now most of the test suite passed, but there were still some failing tests. I
tracked this down to a difference in the regular expression syntax of GNU `diff`
and BSD `diff`. We use the following `diff` invocation to compare PDFs in our test
suite:

```bash
diff_pdf () {
    ( [ ! -s "$1" ] && [ ! -s "$2" ] ) ||
    $DIFF -u -a \
      --show-function-line='^[0-9][0-9]* 0 obj'	\
      -I '^/FontName' \
      -I '^/BaseFont' \
      -I '^/MediaBox' \
      -I '^/BleedBox' \
      -I '^/TrimBox' \
      -I '^<pdf:Producer' \
      -I '^<xmp:CreateDate' \
      -I '^<xmp:MetadataDate' \
      -I '^<xmp:ModifyDate' \
      -I '^<xmpMM:DocumentID' \
      -I '^\(<<\)*/ModDate' \
      -I '^\(<<\)*/CreationDate' \
      -I '^\(<<\)*/Producer' \
      -I '^[0-9]* 00000 n $' \
      -I '^[1-9][0-9]*$' \
      -I '^/ID \[<' \
      "$@"
}
```

Notably, grouping in GNU `diff` uses escaped parenthesis `\(`, `\)`, which is
what our test harness uses. Whereas BSD `diff` uses the more conventional
unescaped version `(`, `)`. If I edited the `diff_pdf` function to remove the
escaped parenthesis, then the test suite passed. I didn't want to carry this change
specifically for my environment though. For various reasons I also didn't come
up with a satisfying way to automatically switch syntax, so I [packaged GNU
diffutils][diffutils]. Our test runner is already set up to prefer using a
`gdiff` binary when present, so with my `diffutils` package installed the test
suite passed without modification.

The last piece of the puzzle was a text editor. For work I use a mix of [Zed]
and [Rust Rover] \(although now that [Zed has debugger support][zed-debug] Rust
Rover's days may be numbered). I have previously got Rust Rover running on
Chimera, but when I tried again it failed to start with an `IOException`.

I turned my attention to Zed. Zed used to be packaged for Chimera, but it
started depending on the `livekit` crate, which downloads a pre-compiled
`libwebrtc.so` in `build.rs`. Unsurprisingly this pre-built library does not work
on Chimera, and the [Zed project are unwilling to make LiveKit
optional][livekit]. The Zed project in general is extremely [free-and-easy with
downloading pre-compiled binaries][zed-binaries] (that don't run on Chimera),
and despite this being raised, acknowledged, and work started in October 2024
it remains unresolved as of 29 Jun 2025.

Fortunately Zed is open-source, and Chimera community member [pj has a
fork][pj-zed] that strips it down and makes it buildable on Chimera. He also
resurrected the [cports package][zed-cports]. I built this and my editor
situation was solved. I could also fall back to Neovim if needed too.

Four other programs that are important to my workflow are [1Password],
[Obsidian], [Signal], and [Beyond Compare]. 1Password, Obsidian, and Signal
were readily installed via [Flatpak] packages on [Flathub]. For Beyond Compare
I set up a [Distrobox] Arch Linux container. This worked great, whenever I
needed to call upon Beyond Compare's merge conflict resolution abilities I ran:
`distrobox enter arch -- git mergetool`.

After confirming that the webcam worked in Signal (we do meetings in Signal) I
was good to travel!

### How did it go?

Totally fine. My preparations paid off and I didn't encounter any blockers to
getting my work done. I did run into one tool that I use occasionally
that was not available for Chimera: the [MuPDF tools][mupdf-tools]. I briefly
considered packaging them, but after seeing [the Arch PKGBUILD][PKGBUILD] I
promptly aborted that plan, and installed them in the Arch Distrobox container
with `paru -S mupdf-tools` and carried on.

As a Rust developer (i.e. someone that primary develops in Rust) one of the
main annoyances on Chimera is missing support for `rustup`. Being able to
install and switch to different Rust versions is nice at times, but the main
issue is being unable to install targets for cross-compiling. This is needed when
targeting microcontrollers, or say a Raspberry Pi Zero. I also can't do `rustup
doc --std` to open an offline copy of the standard library documentation (it
seems the `rust-doc` package in Chimera only contains licences). I think the
solution to this will have to be Distrobox for now.

Having said that, `rustup` is fully statically linked and _does_ run on
Chimera. The issue is that the toolchains that it installs do not work. There
is a community project publishing [builds of Rust nightly at
`musl.rs`][musl.rs] that are compatible with Chimera. This can come in handy
in the odd occasions where a nightly toolchain is needed.

To make it easier to switch between the system rust and nightly rust I installed rustup with:

```
RUSTUP_INIT_SKIP_PATH_CHECK=1 sh rustup-init --default-toolchain none
```

And then linked the local toolchains:

```
rustup toolchain link system /usr
rustup default system
rustup toolchain link musl-nightly ~/.local
```

This makes it easy to use the nightly version only when needed. For
example, I wanted to format the code in a doc-test, which is not stable yet. I
could do this with:

```
rustup musl-nightly cargo fmt -- --unstable-features --config format_code_in_doc_comments=true
```

<small>(for some reason the usual `cargo +musl-nightly fmt ...` invocation did not work)</small>

On Distrobox, I reached for an Arch Linux container as my fallback distro, but
Arch only officially supports x86\_64. This poses a challenge if I am to
replicate this setup on the ARM-based Yoga Slim 7x. For this reason I think
I'll switch to using [Void Linux] as my Distrobox fallback in the future. (In
case it isn't obvious I have no desire to use Debian/Ubuntu if I can avoid it).

### Thoughts on the laptop

As an aside, how did a current generation AMD laptop compare to the year old
ARM-based Yoga Slim 7x? Overall fine, although I still strongly prefer the 7x.
The 7x runs cooler, and is thinner and lighter, which makes it more pleasant to
move and hold. The AMD machine seemed to run hotter, and fire up the fan more.
In particular, the fan seemed to run whenever it was charging and being used at
the same time. Battery life seemed decent. I was able to do about 7 hours of
programming work on Prince, before it needed charging.

As in my [original review of the Yoga Slim 7x](@/posts/2024/yoga-7x-snapdragon-developer-review/index.md)
I used a clean build of the [Gleam] compiler to do some crude benchmarking:

```
git clone https://github.com/gleam-lang/gleam
cd gleam
git checkout v1.11.0
cargo fetch --locked
cargo clean && time cargo build --release --locked
```

Yoga Slim 7x specifications for reference:

{{ figure(image="posts/2025/daily-driving-chimera-for-work/fastfetch-chimera-yoga7x.png",
   link="posts/2025/daily-driving-chimera-for-work/fastfetch-chimera-yoga7x.png",
   resize_width=1600,
   alt="Screenshot of a terminal window with the output of fastfetch.",
   caption="fastfetch output on the Yoga 7x") }}

I ran the Gleam build a couple of times on both laptops while plugged into power
using Rust 1.87.0. These were the results:

| Device         | CPU                | Topology | Arch    | Time |
|:---------------|:-------------------|:---------|:--------|:-----|
| Yoga Slim 7x   | Snapdragon X Elite | 12c      | ARM     | 0:49 |
| Yoga 7 2-in-1  | AMD Ryzen AI 7 350 | 8c/16t   | x86\_64 | 1:21 |

So, the 7x with its 4 additional cores is a good bit faster.

The 2-in-1 does have USB-A ports, which is nice. I didn't make use of the
2-in-1 functionality, or the included stylus. It doesn't seem like GNOME
detects the different lid configurations, and the on-screen keyboard didn't
appear when the screen was flipped around (although this could be a setting I
missed).

In the end the 7x is cooler, faster, lighter, and thinner. I plan to sell the
2-in-1.

### Conclusion

The experiment was a success. This has given me more confidence to pursue
setting up my dev environment on my primary desktop computer, but there's still
some things to address. Currently that machine runs the [COSMIC Desktop], which
is not packaged for Chimera, and doesn't look like it would be a lot of fun to
implement.

The switch to COSMIC was prompted by X11 having unfixable tearing on my Intel
B580 GPU. Prior to that I ran [AwesomeWM] for many years, and would like to
explore [Pinnacle] \(an Awesome-like Wayland compositor) as an alternative. It
is simpler to package than COSMIC, and I've already [partially completed
it][cports-pinnacle]. I shall continue to check things off the TODO list and
will get there eventually.

[AwesomeWM]: https://awesomewm.org/
[Pinnacle]: https://github.com/pinnacle-comp/pinnacle
[cports-pinnacle]: https://mastodon.decentralised.social/@wezm/114712597249998867
[1Password]: https://1password.com/
[2in1]: https://www.lenovo.com/au/en/p/laptops/yoga/yoga-2-in-1-series/lenovo-yoga-7-2-in-1-gen-10-14-inch-amd/83jrcto1wwau1
[alpha]: https://mastodon.decentralised.social/@wezm/110545610926304063
[apk]: https://wiki.alpinelinux.org/wiki/Alpine_Package_Keeper
[Beyond Compare]: https://www.scootersoftware.com/
[Chimera Linux]: https://chimera-linux.org/
[chimera-install]: https://chimera-linux.org/docs/installation
[COSMIC Desktop]: https://system76.com/cosmic
[diffutils]: https://github.com/chimera-linux/cports/pull/430
[dinit]: https://davmac.org/projects/dinit/
[Distrobox]: https://distrobox.it/
[Flathub]: https://flathub.org/
[Flatpak]: https://flatpak.org/
[FreeBSD]: https://www.freebsd.org/
[Gleam]: https://gleam.run/
[Linux kernel]: https://www.kernel.org/
[livekit]: https://github.com/zed-industries/zed/issues/22374
[Mercury]: https://mercurylang.org/
[mmc]: https://github.com/wezm/cports/blob/4123e5be51d28dc084642bbd917d009b779d4441/user/mercury/template.py
[mupdf-tools]: https://archlinux.org/packages/extra/x86_64/mupdf-tools/
[musl.rs]: https://musl.rs/
[musl]: https://musl.libc.org/
[Obsidian]: https://obsidian.md/
[patch]: https://github.com/wezm/cports/blob/4123e5be51d28dc084642bbd917d009b779d4441/user/mercury/patches/no-fortify.patch
[pj-zed]: https://github.com/panekj/zed/tree/pj/release/0.194.0
[PKGBUILD]: https://gitlab.archlinux.org/archlinux/packaging/packages/mupdf/-/blob/15c222524843735a69387cfa9c9b97a4b1f914d7/PKGBUILD
[Prince]: https://www.princexml.com/
[q66]: https://q66.moe/
[Rust Rover]: https://www.jetbrains.com/rust/
[Rust]: https://www.rust-lang.org/
[rustup]: https://rustup.rs/
[Signal]: https://signal.org/
[Void Linux]: https://voidlinux.org/
[void-2019]: https://bitcannon.net/post/huawei-matebook-x-pro-void-linux/
[win-crash]: https://mastodon.social/@Darep/114661470696786319
[x1e-linux]: https://mastodon.decentralised.social/@wezm/114506161082726738
[zed-binaries]: https://github.com/zed-industries/zed/issues/12589
[zed-cports]: https://github.com/panekj/cports/blob/821d3ebe00e9d83c33c0b364bb09eeebcbf8e444/user/zed/template.py
[zed-debug]: https://zed.dev/blog/debugger
[Zed]: https://zed.dev/
