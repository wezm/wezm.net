+++
title = "Trying to Get Chimera Linux Running on Pentium Class Hardware"
date = 2025-05-04T08:09:28+10:00

[extra]
updated = 2025-05-04T19:51:02+10:00
+++

Since declaring in [my last post](@/posts/2025/website-fit-for-1999/index.md)
that "it was time to return to slightly less frivolous projects for a bit" I
instead spent the last week-and-change attempting to make [Chimera Linux]
run on Pentium class 32-bit x86 hardware.

{{ figure(image="posts/2025/chimera-i586/chimera-i586-qemu.png",
   link="posts/2025/chimera-i586/chimera-i586-qemu.png",
   width=594,
   alt="Screenshot of a terminal with the output of fastfetch. It indicates the OS is Chimera Linux i586. It's using 216 MiB of 256MiB of RAM (85%).",
   caption="I was moderately successful.") }}

This was sparked by a friend linking to the
[EoL page on the PC Engines website](https://pcengines.ch/eol.htm)
quoting the fact that they were exiting the market:

> Despite having used considerable quantities of AMD processors and Intel NICs,
> we don't get adequate design support for new projects. In addition, the x86
> silicon currently offered is not very appealing for our niche of passively
> cooled boards. After about 20 years of WRAP, ALIX and APU, it is time for me
> to move on to different things.

This reminded me that I had two ALIX boards in neat little aluminium cases
sitting in the cupboard:
an [alix2d13] purchased in 2011, and an [alix3d2] purchased in 2012. My
immediate thought was the alix3d2 would be perfect for hosting [my retro
website][retro-site].

{{ figure(image="posts/2025/chimera-i586/alix3d2.jpg",
   link="posts/2025/chimera-i586/alix3d2.jpg",
   alt="Photo of alix3d2 in aluminum case. It's longer than it is wide, kinda like a modem. It has power, Ethernet, and DB-9 serial cables connected.",
   caption="alix3d2") }}

They are powered by an AMD Geode LX800 CPU clocked at 500Mhz with 256Mb of RAM.
The Geode is [mostly an i686][i686-geode] class 32-bit x86 CPU. Instead
of installing an OS that I know works on them like [OpenWRT] or [NetBSD] I have
spent the last week and a bit bringing up Chimera Linux on i586 (Pentium).

I wanted to use Chimera Linux because:

1. I was already hosting my retro site with it.
1. I had already packaged the Rust binary that serves part of the site.
   Chimera makes cross-compiling that package super easy, as well as service
   monitoring with [Dinit].
1. I thought it would be fun to use a modern distro on Pentium class hardware.

The process of bringing up a new platform on Chimera Linux was interesting, but
tested me at times. Especially early on when I was getting segfaults in `apk`,
thus preventing anything from working.
This post aims to document the steps I took (which may not be optimal) in
case it happens to be useful.

<!-- more -->

As I was working this out as I went, I made a few missteps along the way and
had to repeat the process a few times (I compiled LLVM _many_ times). I'll
mostly leave those missteps out, and describe the process that ended up
working.

All of this work was completed on my Arch Linux system. Since the Chimera
tooling does everything in a sandbox, this works fine. These are the steps
I took:

1. Add a new x86 build profile.
1. Cross-compile a toolchain via the `base-cbuild` package.
    1. Update various packages to accept the x86 architecture.
1. Re-build the toolchain in a native sandbox.
1. Attempt to build `base-full`, addressing issues along the way.
1. Bootstrap Rust and Cargo.
1. Build `fastfetch`, addressing issues along the way.
1. Build `limine` and `grub`.
1. Define and build a Linux kernel.
1. Update `chimera-live` to produce an ISO.
1. Use the ISO to boot and install into virtual machine.

Note: These steps are partially from memory, so may not be perfectly reproducible.
All of the code changes are captured in [my i586 cports branch][i586-cports].

### Add New Build Profile and Cross-Compile Toolchain

Everything starts with `etc/build_profiles/x86.ini`, which defines what we're
building for:

```ini
[profile]
endian    = little
wordsize  = 32
triplet   = i586-chimera-linux-musl
repos     =
goarch    = 386
[flags]
# clang defaults to pentium4 on i*86- triples.
# see https://github.com/llvm/llvm-project/issues/61347
CFLAGS    = -march=pentium
CXXFLAGS  = ${CFLAGS}
FFLAGS    = ${CFLAGS}
```

With that in place I tried cross-compiling `base-cbuild`:
`./cbuild -a x86 main/base-cbuild`.

This revealed various packages that are restricted to specific architectures.
Updating them to accept `x86` and regenerating sub-package links
(`./cbuild relink-subpkgs`) gets us a cross-build toolchain.

### Starting Afresh

With `base-cbuild` built it was now possible to bootstrap an x86 build root:<br>
`./cbuild -A x86 bootstrap`. I initially wasted a bunch of time with an Alpine
x86 virtual machine here, before discovering the neat `-A` argument to
`./cbuild`. The docs describe `-A` as follows:

> `-A ARCH`, `--host-arch ARCH` Override the host architecture. The given host
> arch must be runnable on the current kernel. This is typically useful for
> e.g. 32-bit builds on 64-bit architectures, or for emulated targets.

I then found out that the cross-built `apk` would segfault,
seemingly due to a recursive call in `libatomic` causing stack overflow:

```
thousands more omitted
⋮
frame #174557: 0xf7f925e8 apk.static`__atomic_load + 312
frame #174558: 0xf7f925e8 apk.static`__atomic_load + 312
frame #174559: 0xf7f925e8 apk.static`__atomic_load + 312
frame #174560: 0xf7f925e8 apk.static`__atomic_load + 312
frame #174561: 0xf7f925e8 apk.static`__atomic_load + 312
frame #174562: 0xf7db48e4 apk.static`CRYPTO_atomic_load + 68
frame #174563: 0xf7d7eb44 apk.static`OPENSSL_init_crypto + 148
frame #174564: 0xf7d44852 apk.static`ossl_err_get_state_int + 50
frame #174565: 0xf7d45b8a apk.static`ERR_new + 26
frame #174566: 0xf7d492f9 apk.static`___lldb_unnamed_symbol12090 + 329
frame #174567: 0xf7d49874 apk.static`EVP_DigestInit_ex + 36
frame #174568: 0xf7bec625 apk.static`apk_digest_ctx_init at crypto_openssl.c:101:6
frame #174569: 0xf7bebe30 apk.static`apk_ctx_init at context.c:33:2
frame #174570: 0xf7bd1703 apk.static`main at apk.c:587:2
frame #174571: 0xf7f96cbf apk.static
frame #174572: 0xf7f96c7d apk.static`__libc_start_main + 61
frame #174573: 0xf7bd148d apk.static`__dls2 at rcrt1.c:13:2
frame #174574: 0xf7bd1400 apk.static`_start_c at dlstart.c:162:2
frame #174575: 0xf7bd101b apk.static`_start + 27
```

After quite a lot of challenging debugging and staring at assembly in
the [Compiler Explorer] I eventually concluded that 
[`__atomic_load` ended up calling itself through `__atomic_load_n`](https://github.com/chimera-linux/libatomic-chimera/blob/2681747f227c6fee6a50a33c72b09b397d2ecefd/atomic.c#L130).
This was extra tricky for me to debug because there were compiler builtins
in play, so I also had to poke through LLVM source as well.

Eventually I started gathering the information necessary to open a bug on LLVM,
since [libatomic-chimera] is derived from `atomic.c` in LLVM's `compiler-rt`. I
wrote a small reproducer based on the current LLVM version of `atomic.c`, only to
discover that it worked fine. In the end I was able to work out that
`libatomic-chimera` was triggering a code path in `__atomic_load_n` for
misaligned atomics, even though it was only making that call after checking for
compatibility with:

```c
(__atomic_always_lock_free(size, p) || \
    (__atomic_always_lock_free(size, 0) && ((uintptr_t)p % size) == 0))
```

I didn't chase this into LLVM to find the root cause. Instead I [updated
`libatomic-chimera`][libatomic-chimera-update] based on the newer version of
`atomic.c` in LLVM, and this resolved the problem. It was
possible to re-build `base-cbuild` in the x86 build root.

### Attempt to Build base-full

Next was to build `base-full`, which provides the core packages for a Chimera system.
This was a somewhat iterative process of run `./cbuild -A x86 pkg main/base-full` until
a package failed to build, and then work out how to fix it. The fixes were usually one of:

- Fix the package to make it build (unrelated to x86), like setting<br>
  `-DCMAKE_POLICY_VERSION_MINIMUM=3.5` to make it build under CMake 4.0.
- Patch the package so that it builds on x86. Patches from Alpine and Debian
  were often helpful here.
- Tweak the package template to skip tests that fail on x86.
- Tweak the package template to skip the `check` phase entirely on x86.
- Patch the package template to build without dependencies that were currently
  broken (mostly doxygen).

This was a fairly straightforward iterative process. I was pretty free and easy
about skipping failing tests if it was just one or two, since my initial goal
was to get stuff compiling.

#### Rust

Eventually I ran into a failure that I was anticipating: Rust. It gets pulled
in by `pipewire` via a curious chain of dependencies ultimately leading to
`mesa` and `rust`:

```
 pipewire
  alsa-lib
   alsa-ucm-conf
  avahi
   gtk+3
    adwaita-icon-theme
     hicolor-icon-theme
    at-spi2-core
     libsm
      libice
     libxtst
      libxi
       libxfixes
    colord
     lcms2
     libgudev
      vala
       graphviz
        gdk-pixbuf
         shared-mime-info
        libgd
         libavif
          dav1d
          libaom
          libwebp
           freeglut
            glu
             mesa
              cbindgen
               cargo-auditable
                cargo
                 cargo-bootstrap
                 libgit2
                  http-parser
                 rust
                  rust-bootstrap
                  wasi-libc
```

Once I worked out the process this was straightforward to deal with:

1. Add patches so that Rust knows about `i586-chimera-linux-musl`.
1. Generate a Rust bootstrap compiler via cross-compilation:<br>
   `./cbuild -a x86 invoke-custom bootstrap main/rust`. This also
   requires building a new host Rust compiler so that it knows about
   the new triple too.
1. Upload the boostrap binaries and update the `rust-bootstrap` package
   so that it has an entry for `x86`.
1. Repeat for cargo: `./cbuild -a x86 invoke-custom bootstrap main/cargo`

With that in place it's possible to return to trying to build `base-full`.
The `rust` package is able to be built from the `rust-bootstrap` package.
I actually took this a step further and rebuild the bootstrap binaries
using the non-cross-compiled `rust` and republished them.

Eventually `base-full` succeeded, which was quite satisfying.

### Build fastfetch

Now because I wanted to be able to show pretty screenshots of my handiwork
I also built [fastfetch]. It happens to have a quite deep dependency tree,
which was more of the same iteration to get everything building.

<details>
<summary>Full build graph for fastfetch</summary>
<pre>
fastfetch
 chafa
  automake
   autoconf
    base-files
    gm4
     texinfo
      ncurses
       pkgconf
      perl
       bzip2
       zlib-ng-compat
  docbook-xsl-nons
   docbook-xml
    xmlcatmgr
     libtool
      help2man
       perl-locale-gettext
  freetype
   brotli
    cmake
     curl
      c-ares
      ca-certificates
       debianutils
       openssl3
        linux-headers
      libidn2
       gettext
        libarchive
         acl
          attr
         lz4
         musl-bsd-headers
         xz
         zstd
          meson
           ninja
            python
             autoconf-archive
             bluez-headers
             libedit
             libexpat
             libffi8
             sqlite
           python-build
            python-flit_core
            python-installer
            python-packaging
             python-pyparsing
            python-pyproject_hooks
           python-setuptools
            python-wheel
        libunistring
        libxml2
         icu
       gtk-doc-tools
        itstool
        libxslt
         libgcrypt
          libgpg-error
           slibtool
        python-lxml
         python-cython
         python-html5lib
          python-six
          python-webencodings
           python-pytest
            python-iniconfig
             python-hatch_vcs
              python-hatchling
               python-editables
               python-pathspec
               python-pluggy
                python-setuptools_scm
                 python-typing_extensions
               python-trove-classifiers
                python-calver
            python-sphinx
             python-alabaster
             python-babel
             python-docutils
              python-pygments
             python-imagesize
             python-jinja2
              python-markupsafe
             python-requests
              python-charset-normalizer
              python-idna
              python-urllib3
             python-roman-numerals-py
             python-snowballstemmer
             python-sphinxcontrib-applehelp
             python-sphinxcontrib-devhelp
             python-sphinxcontrib-htmlhelp
             python-sphinxcontrib-jsmath
             python-sphinxcontrib-qthelp
             python-sphinxcontrib-serializinghtml
      libpsl
      libssh2
       bash
        bison
        readline
      mandoc
       less
      nghttp2
       cppunit
       jansson
       libev
       libevent
      nghttp3
     libuv
     rhash
   freetype-bootstrap
   harfbuzz
    cairo
     fontconfig
      gperf
      util-linux
       bash-completion
       file
       flex
        byacc
       libcap-ng
       linux-pam
        docbook-xsl
        linux-pam-base
       shadow
        base-shells
         chimerautils
          libxo
          sd-tools
           libcap
     glib-bootstrap
      dbus
       libx11
        libxcb
         libxau
          xorg-util-macros
          xorgproto
         libxdmcp
         xcbproto
        xtrans
       xmlto
        ugetopt
      elfutils
       argp-standalone
       json-c
       libmicrohttpd
        gnutls
         gmp
         libtasn1
         nettle
         p11-kit
         tpm2-tss
          cmocka
          libftdi1
           libconfuse
           libusb
            udev
             kmod
              scdoc
         trousers
         unbound
          dns-root-data
          hiredis
          libsodium
          protobuf-c
           boost
           protobuf
            abseil-cpp
             gtest
       musl-obstack
      pcre2
     libpng
     libxext
     libxrender
     lzo
     pixman
    glib
     gobject-introspection
      python-mako
      python-markdown
       python-pyyaml
        libyaml
     sysprof-capture
    graphite2
  libavif
   dav1d
    nasm
     asciidoc
   gdk-pixbuf
    libtiff
     jbigkit
      check
     libjpeg-turbo
    shared-mime-info
   libaom
   libwebp
    freeglut
     glu
      mesa
       cbindgen
        cargo-auditable
         cargo
          cargo-bootstrap
          libgit2
           heimdal
            e2fsprogs
             fuse
            openldap
             libsasl
            perl-json
             perl-test-pod
           http-parser
          rust
           llvm
            fortify-headers
            libatomic-chimera
            llvm-bootstrap
            musl
           rust-bootstrap
           wasi-libc
         cargo-auditable-bootstrap
       glslang
        spirv-tools
         spirv-headers
       libclc
        spirv-llvm-translator
       libdrm
        libpciaccess
       libva-bootstrap
       libxdamage
        libxfixes
       libxrandr
       libxshmfence
       libxv
       libxxf86vm
       lm-sensors
       lua5.4
       python-ply
       python-pycparser
       rust-bindgen
       vulkan-loader
        libxkbcommon
         wayland
         wayland-protocols
         xkeyboard-config
          gawk
          xkbcomp
           libxkbfile
        vulkan-headers
     libxi
    giflib
  librsvg
   cargo-c
   pango
    fribidi
    libthai
     libdatrie
    libxft
   vala
    graphviz
     fonts-liberation
      fontforge-cli
       libspiro
       libuninameslist
       woff2
      mkfontscale
       libfontenc
      python-fonttools
       python-brotli
       python-pytest-xdist
        python-execnet
        python-filelock
        python-pexpect
         python-ptyprocess
         zsh
        python-psutil
     libgd
      libheif
       libde265
       x265
        numactl
 dconf
  gtk+3
   adwaita-icon-theme
    hicolor-icon-theme
   at-spi2-core
    libsm
     libice
    libxtst
   colord
    dinit-dbus
     libdinitctl
    lcms2
    libgudev
    libgusb
     json-glib
    polkit
     duktape
     elogind
      libseccomp
       gsed
      tangle
      turnstile
       dinit-chimera
        dinit
        snooze
        tzdb
    sane-backends
     avahi-bootstrap
      libdaemon
     libgphoto2
      libexif
     v4l-utils
   cups
    libpaper
    xdg-utils
     lynx
     xset
      libxfontcache
      libxmu
       libxt
      libxxf86misc
   iso-codes
   libcloudproviders
   libepoxy
   libxcomposite
   libxcursor
   libxinerama
   tinysparql
    libsoup
     glib-networking
      gsettings-desktop-schemas
       chimera-artwork
       fonts-adwaita-ttf
      libproxy
    python-gobject
     python-cairo
 ddcutil
 imagemagick
  djvulibre
  fftw
  ghostscript
   ijs
   jasper
   jbig2dec
   openjpeg
  libjxl
   gflags
   highway
   openexr
    imath
    libdeflate
  libraw
 libpulse
  libsamplerate
   libsndfile
    flac
     libogg
    lame
    libvorbis
    opus
  orc
  perl-xml-parser
 ocl-icd
  opencl-headers
  ruby
 xfconf
  libxfce4util
   xfce4-dev-tools
  xwayland-run
   weston
    libdisplay-info
     hwdata
    libinput
     libevdev
     libwacom
      python-libevdev
      python-pyudev
     mtdev
    libseat
    libva
    pipewire
     alsa-lib
      alsa-ucm-conf
     avahi
      python-dbus
      xmltoman
     bluez
      libical
     fdk-aac
     gst-plugins-base
      cdparanoia
      graphene
      gstreamer
      libtheora
     ldacbt
     libcamera
     libcanberra
      tdb
     libfreeaptx
     liblc3
     libmysofa
      cunit
     lilv
      lv2
      serd
      sord
       zix
      sratom
     rtkit
     sbc
     webrtc-audio-processing
   xauth
   xwayland
    font-util
     bdftopcf
     font-alias
    libei
     python-attrs
     python-dbusmock
      libnotify
      modemmanager
       libmbim
       libqmi
        libqrtr-glib
       ppp
        libpcap
         libnl
      networkmanager
       iproute2
        iptables
         libmnl
         libnetfilter_conntrack
          libnfnetlink
         libnftnl
       libndp
       mobile-broadband-provider-info
       newt
        popt
        slang
       nss
        nspr
       resolvconf
        openresolv
       wpa_supplicant
        pcsc-lite
     python-structlog
      python-freezegun
       python-dateutil
      python-pretend
      python-pytest-asyncio
      python-simplejson
    libtirpc
    libxcvt
    libxfont2
    xserver-xorg-protocol
 yyjson
</pre>
</details>

### Bootloaders

Back to necessary things. The Chimera ISOs use the [Limine bootloader][limine] on most
platforms, although it's not currently fully supported for installations, so GRUB is
also needed (systemd-boot is another option but does not support x86). Limine does not
officially support i585 class CPUs, but it seemed to work:

> For 32-bit x86 systems, support is only ensured starting with those with Pentium Pro (i686) class CPUs.

Limine and GRUB built fine once x86 was added to their `arch` list in the template.

### Linux kernel

The final piece of the puzzle was a kernel. It's a little unclear to me how
distros go about defining the config for a new platform. I first tried starting
with a `defconfig` kernel, but that didn't boot the system in a VM. Next I
tried taking the x86\_64 kernel config and tweaking it to turn it into an i586 kernel.
This resulted in a pretty large kernel, but one that actually booted in a VM.

The process for tweaking the kernel config was to initially populate
`main/linux-lts/files/config-x86.generic`, then run `./cbuild -A x86
invoke-custom generate-configs main/linux-lts`. This pauses on each
architecture allowing you to enter the chroot and mess with the config. Running
kernel make commands is done with the assistance of the `chimera-buildkernel`
command.

```
./cbuild chroot main/linux-lts
chimera-buildkernel config
```

The latter command runs `make menuconfig`, you make and save your changes,
exit, and then hit enter in the other window running `generate-configs` and it
updates `main/linux-lts/files/config-x86.generic`. It's then possible to build
the kernel the usual way: `./cbuild -A x86 pkg main/linux-lts`.

### Building an ISO

After making some [small tweaks][chimera-live-i586] to the [chimera-live] repo
to recognise x86 it was possible to build an ISO. This process requires the
`main/xorriso` and `base-live` packages to be built first.

```
doas ./mklive-image.sh -b base -k linux-lts -p fastfetch -- -a x86 -r ../cports-i586/packages/main -k ../cports-i586/etc/keys
```

After a short time this will spit out an ISO that you can try booting in a VM or real hardware.

### Extra Challenges

During my time working on this the freedesktop.org project was in the process
of migrating their infrastructure and at various times tarballs from
freedesktop.org, gitlab.freedesktop.org, mesa.freedesktop.org, and x.org were
down, which caused the `fetch` phase that pulls source code to fail for affected
packages. Additionally it seems that mirror sites for these projects were all
either down or last updated late 2023. I was able to work around these by:

- Switching to GitLab archives from published tarballs when the former was up but not the latter.
- Pull archives from the Internet Archive.

### Will it Run?

With ISOs built, I was able to boot and install Chimera into a virtual machine
with the CPU set to `pentium`, as shown at the top of the post. Next it was
time to try running it on the ALIX. The ALIX boards I have use [tinyBIOS] and
don't support booting from USB. They also don't have any graphical output, only
supplying a serial port. The primary storage is a 2Gb Compact Flash card. These
constraints provided some challenges.

First I created a virtual machine and passed-through the CF card connected via
an IDE to USB cable:

```xml
<!-- libvirt config -->
<disk type="block" device="disk">
  <driver name="qemu" type="raw"/>
  <source dev="/dev/sdd"/>
  <target dev="vdb" bus="virtio"/>
  <boot order="3"/>
</disk>
```

I then booted from the ISO and did a normal installation onto the CF card.

After that I'd shutdown the VM, remove the CF card, swap it into the ALIX and
see if it would boot. Initially I was not getting any output, not even from
GRUB. That was fixed through tweaking the GRUB and kernel command line to
output on the serial port (`ttyS0`) and use 115200 baud rate to match tinyBIOS.
At this point I could get the machine to boot GRUB and try to start Chimera,
but it never got further than that.

I tried a bunch of different avenues, including coming up with a new kernel
package tailored specifically for the ALIX hardware. This also didn't work.
Lastly I confirmed that OpenWRT boots on the machine and then copied their
kernel config over and tweaked it a little (to enable some things like
compressed initramfs that Chimera uses). That still failed to start. After
the GRUB menu and choosing an entry this is all that is seen:

{{ figure(image="posts/2025/chimera-i586/chimera-i585-alix-boot.svg",
   link="posts/2025/chimera-i586/chimera-i585-alix-boot.svg",
   width=600,
   alt="asciinema capture of the output on the serial console when trying to boot Chimera on the ALIX. It starts off with the tinyBIOS memory check, then loading GRUB, the GRUB boot menu, loading Linux, loading initial ramdisk, decompressing Linux, and finally booting the kernel.",
   caption="Serial output captured from the ALIX when booting.") }}

Given more-or-less the same config is able to boot on OpenWRT, there must
be something particular about the Chimera build that's causing it to fail.

This is where I have decided to pause this project. If I pick it up again I
think I'd need to delve into kernel debugging to try to work out what's
happening on the machine when it stops.

Finally the code from this adventure is in my [i586 cports branch][i586-cports].

[i686-geode]: http://strohmayers.com/linux/news/GeodeLX_as_686.pdf
[libatomic-chimera-update]: https://github.com/wezm/cports/commit/387f3d4eedefda207f21f77078bf02260528cf81
[tinyBIOS]: https://pcengines.ch/tinybios.htm
[i586-cports]: https://github.com/wezm/cports/tree/i586
[Chimera Linux]: https://chimera-linux.org/
[alix2d13]: https://www.pcengines.ch/alix2d13.htm
[alix3d2]: https://www.pcengines.ch/alix3d2.htm
[retro-site]: http://home.wezm.net/~wmoore/
[OpenWRT]: https://openwrt.org/
[NetBSD]: https://netbsd.org/
[Dinit]: https://davmac.org/projects/dinit/
[Compiler Explorer]: https://godbolt.org/
[fastfetch]: https://github.com/fastfetch-cli/fastfetch
[limine]: https://limine-bootloader.org/
[chimera-live]: https://github.com/chimera-linux/chimera-live
[libatomic-chimera]: https://github.com/chimera-linux/libatomic-chimera
[chimera-live-i586]: https://github.com/wezm/chimera-live/commit/e7647326931cb1fc065772084b994574398a3c9c
