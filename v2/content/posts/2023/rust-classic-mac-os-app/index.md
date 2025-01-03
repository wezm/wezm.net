+++
title = "Building a Classic Mac OS App in Rust"
date = 2023-03-31T13:26:07+10:00

#[extra]
#updated = 2023-03-26T14:27:05+10:00
+++

Instead of using my funemployment to build useful things I have continued to
build things for old versions of Mac OS. Through some luck and a little
persistence I have actually managed to get Rust code running on classic Mac OS
(I've tried Mac OS 7.5 and 8.1). In this post I'll cover how I got here and
show a little network connected demo application I built—just in time for
the end of [#MARCHintosh].

<!-- more -->

Before I get into the details this is where we're headed:

{{ video(video="posts/2023/rust-classic-mac-os-app/ferris-weather-2023-03-31_12.37.49_edit.mp4", height=480, poster="png", preload="auto", alt="Video showing the Ferris Weather application in operation. Initially there is a window with a Ferris icon, the text, 'An application that exercises my Open Transport Rust bindings and HTTP client', and a button 'Get Weather'. Clicking the button results in an alert that says: 'The temperature in Brisbane is 26.9°C'.", caption="Ferris Weather, a weather app built with Rust (and some C)") }}

### DeRez Redux

In [the last post](@/posts/2023/derez/index.md) I got Nim code running on Mac
OS and toyed with DeRez. [The author of `mpu-emu` replied on Mastodon][Ninji]
letting me know that DeRez _should_ run via `mpw-emu` on Linux as the
filesystem layer transparently handles [MacBinary] files.

I spent some time in the debugger and worked out that `mpw-emu` supported
MacBinary III but [Retro68] produced MacBinary II files. I contributed code
to `mpw-emu` to add MacBinary II support and enabled some latent support for
UNIX paths. After that DeRez did work (almost):

```
$ mpw-emu ~/Documents/Classic\ Mac/Shared\ 2/DeRez.bin Root:home:wmoore:Projects:classic-mac-rust:cmake-build-retro68ppc:Dialog.bin
[2023-03-31T04:51:34Z ERROR emulator] Unimplemented call to InterfaceLib::SetFScaleDisable @10012C6C
[2023-03-31T04:51:34Z ERROR stdio] Unimplemented format character: P
[2023-03-31T04:51:34Z ERROR emulator] Unimplemented call to InterfaceLib::SecondsToDate @1000B2A4
data 'DITL' (128) {
	$"0007 0000 0000 00A0 00E6 00B4 0136 0404"            /* .......†.Ê.¥.6.. */
	$"5175 6974 0000 0000 009B 00E1 00B9 013B"            /* Quit.....õ.·.π.; */
	$"0000 0000 0000 0046 000A 005A 0136 0818"            /* .......F...Z.6.. */
	$"436F 6E76 6572 7369 6F6E 2070 6F77 6572"            /* Conversion power */
	$"6564 2062 7920 5E30 0000 0000 001E 000A"            /* ed by ^0........ */
	$"003E 002A A002 0080 0000 0000 0014 0032"            /* .>.*†..Ä.......2 */
	$"0024 007D 8807 4365 6C73 6975 7300 0000"            /* .$.}à.Celsius... */
	$"0000 0014 00AA 0024 00F5 8809 4661 7265"            /* .....™.$.ıà∆Fare */
	$"6E68 6569 7400 0000 0000 0029 0036 0039"            /* nheit......).6.9 */
	$"0081 1002 3235 0000 0000 002B 00AE 003B"            /* .Å..25.....+.Æ.; */
	$"00F9 1002 3737"                                     /* .˘..77 */
};

/* etc */
```

Success! DeRez running on Linux… only thing is that when you point at the type
definitions to get structured output instead of hex dumps it hits an
unimplemented function in `mpw-emu`. It's on my to-do list to fix that:

```
$ mpw-emu ~/Documents/Classic\ Mac/Shared\ 2/DeRez.bin Root:home:wmoore:Projects:classic-mac-rust:cmake-build-retro68ppc:Dialog.bin Root:home:wmoore:Source:github.com:autc04:Retro68:InterfacesAndLibraries:Interfaces\&Libraries:Interfaces:RIncludes:Carbon.r
[2023-03-31T04:53:07Z ERROR emulator] Unimplemented call to InterfaceLib::SetFScaleDisable @10012C6C
[2023-03-31T04:53:07Z ERROR stdio] Unimplemented format character: P
[2023-03-31T04:53:07Z ERROR emulator] Unimplemented call to InterfaceLib::SecondsToDate @1000B2A4
[2023-03-31T04:53:07Z ERROR emulator] Unimplemented call to StdCLib::fseek @10006A8C
File "Root:home:wmoore:Source:github.com:autc04:Retro68:InterfacesAndLibraries:Interfaces&Libraries:Interfaces:RIncludes:CoreServices.r"; Line 0; ### /home/wmoore/Documents/Classic Mac/Shared 2/DeRez.bin - Can't FSeek on file Root:home:wmoore:Source:github.com:autc04:Retro68:InterfacesAndLibraries:Interfaces&Libraries:Interfaces:RIncludes:CoreServices.r.
File "Root:home:wmoore:Source:github.com:autc04:Retro68:InterfacesAndLibraries:Interfaces&Libraries:Interfaces:RIncludes:CoreServices.r"; Line 0; ### /home/wmoore/Documents/Classic Mac/Shared 2/DeRez.bin - Fatal Error, can't recover.
```

### MacBinary

Poking at the MacBinary code in `mpw-emu` got me wondering if there was already
a MacBinary crate that could be used. Turns out there wasn't so I somehow
nerd-sniped myself into [building one][macbinary-crate].

The first challenge was finding a decent specification for the three versions
of MacBinary. I was eventually I was able to dig up the following:

- [MacBinary I]
- [MacBinary II]
- [MacBinary III]

I then set about building the parser. I reused the binary parser code from
[Allsorts] since I was already familiar with that code. I hit another roadblock
when it came to the CRC in the header. Nothing describes the actual CRC
algorithm used. I tried the CRC reversing tool [CRC RevEng][RevEng] without
success. A lot of existing code seemed to use an implementation that originated
in a late 80's UNIX utility, [mcvert], that has unclear licensing. I wanted to
use the Rust [crc crate] instead.

I eventually stumbled on the blog post,
[Detecting MacBinary format](https://entropymine.wordpress.com/2019/02/13/detecting-macbinary-format/),
which included the line:

> Note that the spec does not even tell you what CRC algorithm to use — you
> have to be a detective to figure it out. (It’s the one sometimes called
> CRC16-CCITT.) 

That was the tip I needed and with a little trial an error I eventually worked
out that it was [CRC-16/XMODEM] also known as `CRC-16/CCITT-FALSE`. In
hindsight I could probably have worked this out from the discussion of XMODEM
in the [MacBinary I spec][MacBinary I].

With that sorted I was able to wrap up the parser and do some testing. I could
now read the resource and data forks and figured it would be interesting to be
able to parse the resource data too, so I added a resource fork parser as well.

I wrote the parsers in a way that does not require heap allocation—only
borrowing from the underlying data. Due to this it was straightforward to make
the crate compatible with `no_std`, which allows it to be used in embedded
environments and WebAssembly.

As something of a test-bed I created some
WebAssembly bindings and built a page that allows you to inspect MacBinary
files online, with all parsing done client-side via the crate. You can
try it out at: <https://7bit.org/macbinary/>

### Rust on Mac OS

Now that I was well and truly in the classic Mac space again I took another
stab at compiling Rust for PPC Mac OS
([see this post for my previous attempt](@/posts/2023/rust-on-ppc-classic-mac-os/index.md)).
It seemed that using the
`powerpc-ibm-aix` LLVM target was most likely to produce a compatible library
(Apple used AIX conventions for PPC Mac OS). Problem was that it was hitting
unimplemented code in LLVM:

> LLVM ERROR: relocation for paired relocatable term is not yet supported

I set about trying to work out how this code path was being hit and ran `rustc`
in a debugger. Unsurprisingly there were no debug symbols so I built `rustc`
and LLVM from source. This was my `config.toml` for the Rust repo:

```toml
[llvm]
release-debuginfo = true
download-ci-llvm = false
link-jobs = 4
```

After repeatedly running out of disk space and memory compiling LLVM (the
binaries with debug info are huge) I eventually had new Rust compiler.

Some of the LLVM binaries:

```
.rwxr-xr-x 2.0G wmoore 26 Mar 20:05 llc
.rwxr-xr-x 2.1G wmoore 26 Mar 20:10 llvm-opt-fuzzer
.rwxr-xr-x 2.1G wmoore 26 Mar 20:04 bugpoint
.rwxr-xr-x 2.2G wmoore 26 Mar 20:09 llvm-lto2
.rwxr-xr-x 2.2G wmoore 26 Mar 20:06 llvm-lto
.rwxr-xr-x 2.2G wmoore 26 Mar 20:11 opt
.rwxr-xr-x 2.3G wmoore 26 Mar 20:11 llvm-reduce
```

I linked the new compiler into `rustup` and then repeated my previous steps in
the debugger… except this time the code compiled and did not hit the
unimplemented LLVM code. This was my first lucky break. I'm not sure what
changed but it was now happily compiling the code. I switched to a recent
nightly compiler and that worked too! No need to build from source.

I repeated the step described in my original post of using
`powerpc-linux-gnu-objcopy` to convert the static library archive (`.a`) to a
format that Retro68 would accept. After some fighting with `binutils` I was
finally able to get it to link!

<iframe src="https://mastodon.decentralised.social/@wezm/110098546361010915/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400" allowfullscreen="allowfullscreen"></iframe><script src="https://mastodon.decentralised.social/embed.js" async="async"></script>

I rebuilt the temperature converter that I'd built in Nim in Rust ([source code][rust-temp]) and ran into
more linker/`binutils` issues. After a _lot_ of trial-and-error and some more
luck I was able to solve that by using the updated `binutils` on the
`gcc12-update branch` branch of Retro68. I now had a working temperature
converter:

{{ video(video="posts/2023/rust-classic-mac-os-app/classic-mac-rust-2023-03-28_20.00.31.mp4", height=480, poster="png", preload="auto", alt="Video of the temperature converter converting values to and from Celsius, running on Mac OS 8.1 (in emulator).", caption="The temperature converter application ported to Rust") }}

It worked on Mac OS 7.5 too:

{{ figure(image="posts/2023/rust-classic-mac-os-app/rust-on-mac-os-7.png", link="posts/2023/rust-classic-mac-os-app/rust-on-mac-os-7.png", pixelated=true, border=1, alt="Screenshot of the temperature converter application running on Mac OS 7.5 (in emulator).", caption="Temperature converter application running on Mac OS 7.5") }}

The Rust version is a bit more efficient than the [Nim version][nim-version] as
it avoids some copying and heap allocation. That latter of which because I'm
coding in a `no_std` environment without a heap.

The Rust standard library is divided into three main parts (crates):

1. `core` for things that do not require heap allocation, I/O, etc.
2. `alloc` for things that use heap allocation but not I/O etc.
3. `std`, the rest: files, networking, threads, etc. `std` re-exports the
   other two.

By defining a custom allocator that called `malloc` and `free` provided by the
Retro68 environment I was able to use the `alloc` crate in addition to `core`.
This gained me access `String`, `Vec`, and friends.

#### Networking

I now wanted to build something a little more involved than a single dialog. I
set about building bindings to Open Transport, Apple's network stack introduced
with PCI Power Macs (like my 9500).

Due to its heritage most of the Mac OS toolbox functions use the Pascal calling
convention, [which LLVM does not support][llvm-pascal]. To bridge the C (and
Rust) world to this Pascal world I had to create [trampoline functions] in C
for each toolbox function that I wanted to call from Rust (if there's a better
way to do this I'd love to know how). This works because `gcc` in Retro68
understands both C and Pascal calling conventions. I appended an underscore to
each of the wrapper functions. For example:

```c
OSStatus OTConnect_(EndpointRef ref, TCall *sndCall, TCall *rcvCall) {
    return OTConnect(ref, sndCall, rcvCall);
}
```

I used the "Downloading a URL With HTTP" example from the [Networking With Open Transport]
book as a guide for the functions I needed. Once the bindings were created I
implemented the `TcpClientStack` trait from the [embedded-nal] \(embedded network abstraction layer)
crate against Open Transport. Next I used this with the [http_io] crate to be able
to make HTTP requests.

As an initial test I wrote an app to fetch a friend's website (since it's
available over plain HTTP) and show an alert with the number of bytes read.
Amazingly this worked on the first try: the Open Transport bindings, the
`TcpClientStack` implementation, the HTTP client, and my test code all worked!

Finally I used my newfound networking abilities to build [Ferris
Weather][ferris-weather], the application shown at the start of the post. This
uses the HTTP client to fetch a JSON file containing weather observations,
parses it with [serde] and then shows an alert with the most recent
observation. I also drew a little 1-bit [Ferris the Rustacean][Ferris] in
[ResEdit] for it.

The idea for this was prompted by the [Australian Bureau of Meteorology][bom]
still being accessible over HTTP. Unfortunately it wasn't working and after a
lot of debugging I eventually discovered that I triggering their anti-scraping
blocker for some reason. To work around this I copied a snapshot of the JSON to
my own server. So, unfortunately the data shown by the application does not
update but you still get the idea.

{{ figure(image="posts/2023/rust-classic-mac-os-app/Ferris%20Weather.png", link="posts/2023/rust-classic-mac-os-app/Ferris%20Weather.png", pixelated=true, border=1, alt="Screenshot of the Ferris Weather application showing an alert with the temperature in Brisbane.", caption="Ferris Weather") }}

So there you have it, that's how I built an application in Rust (and some C)
for classic Mac OS. The [source code to Ferris Weather][ferris-weather] is on
GitHub.

### Next

My intention is to take a bit of a break from classic Mac OS for a bit and work
on some other projects—ones that might be useful to people in this century—but
there are some things I want to look at when I come back to it:

First is TLS support for the HTTP client. I think this should be relatively
straightforward with the [embedded-tls] crate.

Next I'd like to improve how Open Transport is used. I think with either
the synchronous, non-blocking mode I'm using now or the asynchronous mode it
should be possible to tie it into the async Rust ecosystem, which would allow
it to play nicer with the event loop and cooperative multi-tasking.

Finally, so far I've been working without the full Rust standard library, only
`core` and `alloc`. It seems like it should be possible to implement a lot of
the remaining standard library (io, networking), on top of the Mac OS toolbox,
but that's a lot of work and will have to wait for another time.

### Hire Me

As mentioned at the start of this post I'm currently taking a break from
employment but I will be looking for a new role next month, so if you're looking
for a Rust developer get in touch.

[#MARCHintosh]: https://www.marchintosh.com/
[Ninji]: https://vulpine.club/@Ninji/110053455721324087
[mcvert]: https://web.mit.edu/~mkgray/jik/sipbsrc/src/mcvert/mcvert.c
[Networking With Open Transport]: https://developer.apple.com/library/archive/documentation/mac/NetworkingOT/NetworkingOpenTransport.pdf
[ferris-weather]: https://github.com/wezm/ferris-weather
[Retro68]: https://github.com/autc04/Retro68
[MacBinary]: https://en.wikipedia.org/wiki/MacBinary
[macbinary-crate]: https://lib.rs/crates/macbinary
[Allsorts]: https://github.com/yeslogic/allsorts
[RevEng]: https://reveng.sourceforge.io/
[crc crate]: https://lib.rs/crates/crc
[CRC-16/XMODEM]: https://reveng.sourceforge.io/crc-catalogue/16.htm#crc.cat.crc-16-ibm-3740
[MacBinary I]: https://web.archive.org/web/20050307030202/http://www.lazerware.com/formats/macbinary/macbinary.html
[MacBinary II]: https://web.archive.org/web/20050305042909/http://www.lazerware.com/formats/macbinary/macbinary_ii.html
[MacBinary III]: https://web.archive.org/web/20050305044255/http://www.lazerware.com/formats/macbinary/macbinary_iii.html
[llvm-pascal]: https://github.com/llvm/llvm-project/blob/bd20a344bbf813b2c39b57ad1a5248bff915ce25/clang/lib/CodeGen/CGCall.cpp#L60
[trampoline functions]: https://en.wikipedia.org/wiki/Trampoline_(computing)
[embedded-nal]: https://docs.rs/embedded-nal/latest/embedded_nal/
[http_io]: https://lib.rs/crates/http_io
[serde]: https://serde.rs/
[bom]: http://www.bom.gov.au/
[Ferris]: https://rustacean.net/
[ResEdit]: https://en.wikipedia.org/wiki/ResEdit
[embedded-tls]: https://lib.rs/crates/embedded-tls
[rust-temp]: https://github.com/wezm/classic-mac-rust
[nim-version]: https://github.com/wezm/classic-mac-nim
