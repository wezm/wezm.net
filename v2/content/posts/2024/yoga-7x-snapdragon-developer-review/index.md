+++
title = "A Developer's Review of a Snapdragon X Laptop (Lenovo Yoga Slim 7x)"
date = 2024-07-16T07:19:09+10:00
template = "yoga7x.html"

[extra]
updated = 2024-07-26T10:34:50+10:00
+++

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-on-desk.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-on-desk.jpg",
   resize_width=1600,
   alt="Photo of the Yoga 7x laptop open on a desk showing the Glass House Mountains on the desktop. To the right of the laptop is a coffee mug and a pair of glasses.",
   caption="Lenovo Yoga Slim 7x Snapdragon") }}

For the last two weeks I've been testing out my new laptop, a [Lenovo Yoga Slim
7x (14&quot;, Gen 9) Snapdragon][yoga-7x]. This laptop is interesting because
it's one of the initial batch based on [Qualcomm's Snapdragon X Elite Arm
CPUs][X Elite]. In this post I aim to provide a detailed review of the device
and the experience of using it from the perspective of a software developer.
This post was written on the Yoga 7x.

<!-- more -->

<!-- toc -->

### Introduction & Purchasing

All prices are quoted in Australian dollars. You can select a
different currency, which will use exchange rates at the time I purchased the
laptop.

{{ select_currency(path="content/posts/2024/yoga-7x-snapdragon-developer-review/forex.json") }}

I purchased the Yoga 7x for {{ money(amount=2466.98) }} direct from Lenovo.
There are two models offered, one with 16 Gb RAM/512 Gb storage the other with
32 Gb/1 Tb. Strangely, if you option the first model up to the same specs as
the other one the price is cheaper, so I did that. Additionally, I was able to
get a {{ money(amount=200) }} discount and carry case for {{ money(amount=1) }}
by asking in the web chat if they had any "special offers" for this machine.

The Yoga 7x is to replace a [HP Aero] that I bought for {{ money(amount=1079)
}} two years ago. My use-case for a laptop is mostly for tinkering in the
evening and for work when travelling. Normally for work I use a desktop
computer. The main tasks I perform on my laptop are programming, web browsing,
YouTube, and other technical pursuits.

I normally use Linux for all my computing. I bought this laptop knowing that it
would not yet run Linux ([Project Farm] voice: _we're going to test that!_) and
that I'd have to use Windows for a period of time. [Qualcomm has been
upstreaming support to the Linux kernel][qcom-upstream], but it's still
ongoing. It is my intention to use Linux as the primary OS on this machine as
soon as it's viable.

I have not used Windows for development since around 2007, and I'll admit I've
never really been a fan. In this review I've _tried_ to stick to details
specific to the experience of using this machine and omit the many complaints I
have with Windows.

### Hardware & Specifications

Let's get the specifications and inevitable comparisons to MacBooks out of the
way first:

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/fastfetch.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/fastfetch.png",
   resize_width=1600,
   alt="Screenshot of a Windows Terminal window with the output of fastfetch.",
   caption="fastfetch output on the Yoga 7x.") }}

|                        |                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------|
| **CPU**                | Qualcomm Snapdragon X Elite X1E-78-100 Arm CPU, 12 cores, max Turbo up to 3.4GHz, all core turbo 3.4Ghz, with fan |
| **RAM**                | 32Gb LPDDR5X-8448                                                                                                 |
| **Storage**            | 1TB SSD M.2 2242 PCIe 4.0x4 NVMe                                                                                  |
| **GPU**                | Qualcomm Adreno X integrated GPU                                                                                  |
| **Display**            | 14.5&quot; 3K (2944×1840) OLED 1000nits (Peak) / 500nits (Typical), 100% DCI-P3 with touchscreen                  |
| **Camera**             | 1080p (2.0MP) + IR, with E-shutter, fixed focus                                                                   |
| **Speakers**           | 4 stereo speakers, 2 x 2W (woofers), 2 x 2W (tweeters), Dolby Atmos                                               |
| **Microphone**         | Quad-mic array                                                                                                    |
| **Ports**              | 3 x USB-C® (USB4® 40Gbps), with USB PD 3.1 and DisplayPort™ 1.4                                                   |
| **Wi-Fi**              | Wi-Fi 7, 802.11be 2x2 Wi-Fi + Bluetooth 5.4                                                                       |
| **Battery**            | 70Wh                                                                                                              |
| **Power&nbsp;Adapter** | 65W USB-C                                                                                                         |
| **Case&nbsp;Material** | Aluminium                                                                                                         |
| **Weight**             | 1.28kg                                                                                                            |

Qualcomm hyped up these CPUs for months before their release with frequent
comparisons to Apple's MacBook Air. While it seems unlikely that they would woo
Mac users into switching, the point is that there are now laptops in the PC
market that can compete with Apple's M-series laptops.

The Yoga 7x sits somewhere in between the MacBook Air and the MacBook Pro
spec-wise, while managing to be significantly cheaper than both. I configured a
15-inch MacBook Air[^1] and 14-inch MacBook Pro to similar specifications as my
7x and came up with the following:

**MacBook Air 15-inch**

- Apple M3 chip with 8-core CPU with four performance cores and four efficiency cores, fanless
- 24GB unified memory
- 1TB SSD storage
- 15.3-inch Liquid Retina display (2880×1864), 500 nits brightness
- 1080p FaceTime HD camera
- Two Thunderbolt/USB 4 ports
- 70W USB-C Power Adapter

{{ money(amount=3399) }}

**MacBook Pro 14-inch**

- Apple M3 Pro chip with 12-core CPU with six performance cores and six efficiency cores, with fan
- 36GB unified memory
- 1TB SSD storage
- 14-inch Liquid Retina XDR display² with notch, 3024x1964
    - XDR brightness: 1,000 nits sustained full-screen, 1,600 nits peak[2](https://www.apple.com/au/macbook-pro/specs/#footnote-2) (HDR content only)
    - SDR brightness: 600 nits
    - ProMotion technology for adaptive refresh rates up to 120Hz
- 96W USB-C Power Adapter
- Three Thunderbolt 4 ports, HDMI port, SDXC card slot, headphone jack, MagSafe 3 port

{{ money(amount=4799) }}

The Air comes out {{ money(amount=932) }} more than the Yoga 7x, and the Pro is
whopping {{ money(amount=2332) }} more (almost enough to buy a second Yoga 7x),
but it is admittedly more full-featured.

### Usage

#### Case Construction

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-top.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-top.jpg",
   resize_width=1600,
   alt="Photo of the top of the laptop showing the Lenovo detail in the middle.",
   caption="Top of laptop, back to the reader.") }}

The laptop is dressed in a lovely blue-grey colour that Lenovo call Cosmic
Blue. The surface/colour of the case is a bit of fingerprint magnet but cleans
up easily with a micro-fibre cloth. The build quality and construction is
top-notch. The case is made of aluminium and is rigid and nicely finished. The
edges are rounded (not sharp) and pleasant to touch/be in contact with.

#### Display

The display is amazing! It's bright, with vivid colours and true blacks owing
to the OLED technology. The bezels around the display are narrow and the entire
display is usable as there is no notch. It came set to 60Hz by default but
supports 90Hz as well. After changing it to 90Hz I didn't initially notice much
difference. However, after changing back to 60Hz I can see that scrolling in
Firefox is a lot smoother with the 90Hz refresh rate. Windows 11 supports
dynamic refresh rate but the 7x does not appear to be compatible.

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-camera-bump.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-camera-bump.jpg",
   resize_width=1600,
   alt="Photo of the front edge of the laptop showing the camera bump.",
   caption="Camera bump.") }}

Instead of a notch there's a slightly taller region at the top of the screen
where the camera, and other sensors are. There is also a camera bump behind this
part of the display. I saw at least one video deriding this, but I think it's
an excellent compromise. The bump on the top edge of the display is a nice
affordance for your fingers when opening the laptop. It also means there's no
need for a cutout on the bottom half of the laptop like on MacBooks.

The movement of the display hinge is firm and smooth. It can be opened with one
hand without the bottom lifting. When closing the lid there is a positive feel
when the two halves meet, as though they are attracted to each other
magnetically. There is a very thin plastic surround on the top half to prevent
the display contacting the bottom half. I've not seen any keyboard prints on
the display.

The laptop lid is rigid and does not exhibit wobble even when using it on your
lap. The rigidity allows the touchscreen to work well too, although I've not
really worked out how a touchscreen fits into my workflow. I tried the
Precision Pen 2 that came with my Lenovo tablet on the screen but it didn't
work. It seems they sell [a version specifically for laptops][pen].

#### Keyboard

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-keyboard-and-stickers.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-keyboard-and-stickers.jpg",
   resize_width=1600,
   alt="Photo of the keyboard and trackpad. On the right hand palm rest there is a Snapdragon X sticker and a tall sticker from Lenovo.",
   caption="Keyboard and trackpad. Yes, free of the tyranny of Intel Inside stickers what did Lenovo do? More stickers! The tall one peeled off ok, but you could see where it had been. A quick wipe with an alcohol swab sorted it out. I left the Snapdragon one on for now. I don't know what's wrong with me.") }}

The keyboard is pleasant to type on. It has an unsurprising layout without any
weird quirks. It has a firm feel and slightly more travel than my old laptop,
which did take a moment to adjust to. It has full height left and right arrow
keys, which I find bad for positioning without looking. I would have preferred
an inverted-T layout like that on a MacBook. I also miss the dedicated Page
Up/Down Home/End keys from the HP Aero.

There is an Fn key next to the outermost Ctrl key on the left for accessing
function keys, as well as home, end, page up, and page down on the arrow keys.
The UEFI has a "Fool Proof Fn Ctrl" feature enabled by default that will "Treat
Fn as Ctrl when combined with non function key for some frequently-used
shortcut key".

#### Trackpad

The trackpad is quite large—in my opinion larger than it needs to be. The
surface is pleasant to use and motion is accurate. Multitouch gestures work as
expected. It is top-pivoting with a physical button underneath like pretty much
all PC laptops. I would have preferred a haptic action like Apple's, but I'm
used to tap-to-click at this point. I have had the odd unintentional action
from my palm or stray finger so perhaps the automatic rejection could be
better.

#### Battery & Fan

The experience of using this laptop is superior to any other PC laptop I've
owned. It runs cool and quiet and has an amazing battery life. Battery life is
hard to quantify without time-consuming tests but Lenovo claims the following
and I think they're probably in the right ballpark:

- MobileMark® 25@250nits: up to 16.4 hours
- Local video (1080p) playback@150nits: up to 23.8 hours

I think I easily get double the runtime out of the 7x compared to the Aero.
Depending on what you're doing I think it would be perfectly feasible to go a
typical work day without the need to plug in.

As I write this, the battery is down to 51% and it's reporting 7h 25m left.

While almost any activity beyond the basic would spur the fan on my HP Aero
into action the fan on the Yoga 7x pretty much only comes on when you're doing
something multicore intensive like compiling software. From what I've gathered
it does turn on more frequently than a MacBook Pro, which I've heard need
pretty strong motivation to get the fan going. I'd rate the fan pitch when it
is running at higher speeds in the middle of the road—it's not bad, but it's
not a neutral white noise type sound either.

#### Audio/Visual

The camera does not seem to be anything remarkable. In indoor conditions
without any direct lighting of the subject it produces an image that shows
heavy noise reduction but is fairly bright.

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/camera.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/camera.jpg",
   resize_width=1600,
   alt="Photo of your author taken with the built-in webcam.",
  caption="Photo of the author taken with the built-in webcam.") }}

I have not used the built-in microphones. The speakers are extremely crisp and
clear in mid and high ranges. They are capable of going very loud without
distortion. As with most laptops the low-end bass is limited but better than
some I've heard. I can feel very little vibration in the case even with the
volume cranked.

There is no 3.5mm headphone jack. I paired some Bluetooth Sennheiser headphones
but ran into an issue with audio being out of sync with the video when watching
YouTube. These headphones work fine with iOS, Android, and Linux, so I'm not
sure what going on with them in Windows. Some searching online suggests this is
not an uncommon issue with Windows, but I suspect they're a noisy minority—at
least I'm hoping that's the case.

#### Ports & Power

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-left-edge.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-left-edge.jpg",
   resize_width=1600,
   alt="Photo of the left edge of the laptop showing the two USB-C ports.",
   caption="The left-side ports.") }}

On the left hand side are two of the three USB-C ports. Between them is an LED
that glows orange when charging and white when full. On the right hand side is
the other USB-C port as well as a power button and camera privacy switch. The
power button is a thin phone-style unit on the edge of the body. It has a small
white LED the glows when the laptop is on and pulses slowly while it is
sleeping.

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-right-edge.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-right-edge.jpg",
   resize_width=1600,
   alt="Photo of the left edge of the laptop showing the two USB-C ports.",
   caption="The right-side ports.") }}

Pressing the power button will sleep/wake the laptop. You must dwell with the
button pressed for just a moment to have it work, which helps prevent
accidental presses. Although, it is natural to brace the right side where the
button is when plugging in something to the left, which can result in the power
button being pressed if you aren't careful.

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-camera-switch.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-camera-switch.jpg",
   resize_width=1600,
   alt="Photo of the laptop upside-down showing the camera privacy switch.",
   caption="The camera privacy switch. This sticker was easy to remove with the little red pull tab.") }}

There is no fingerprint reader, instead Windows Hello uses the camera and IR
sensor to use your face to authenticate. The utility of the camera privacy
switch is somewhat diminished because it also prevents Windows Hello from
working. If there was a separate fingerprint reader the camera could remain
disabled unless it was specifically needed.

Waking from suspend is nearly instant. If opening the laptop it's usually
resumed and ready to go before you've finished moving the display into
position.

{{ video(video="posts/2024/yoga-7x-snapdragon-developer-review/wake-from-sleep.m4v", height=450, preload="metadata", loop=true, alt="Video showing the laptop waking from sleep quickly. Windows Hello uses the camera to grant access without having to type in a password.", caption="Video showing the laptop waking from sleep. Windows Hello uses the camera to grant access without having to type in a password.") }}

### Compatibility & Gaming

The big question with a new architecture[^2] is how much does it impact
day-to-day activities. As with most things in the tech world: it depends. For a
typical computer user the situation is quite good. Most, if not all the
software included with Windows is Arm native. I do all my browsing with Firefox
and a native Arm version of it has been [available for many
years][firefox-arm]. The note-taking tool [Obsidian] has an Arm native version,
as does [1Password] \(in preview), [Rust Rover], and [Rufus] to name a few more.

However, there's still plenty of software out there that assumes Windows = x86.
For that there's the [Prism x86 emulator built into Windows][prism]. This
allows most x86 Windows applications to run seamlessly on Windows Arm, albeit
with some hit to performance. The emulation is often not noticeable, aside from
an initial delay when first launching an application.

I took note of the architecture of everything I installed. Of the 27 things I
installed 44% were native. 

Most x86 software I tried such as [Inkscape] and [Handbrake] ran fine. It
wasn't all perfect though. I installed [Stardew Valley] using [GOG Galaxy],
which went fine but when clicking the Play button it never started. There was a
`stardewvalley.exe` process in Task Manager, but it never opened a window.
Curiously, if the exe is run directly from Explorer then it works fine.

I also tried [Factorio] and [Cities Skylines] installed via [Steam] (all x86
executables). Factorio ran great at the native resolution of the display and
did a constant 60fps, at least in the early game. With a reduced (from native)
resolution of 1600×900 Cities Skylines ran acceptably at 25–30fps in a city
with a population of a bit under 10k.

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/factorio.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/factorio.png",
   resize_width=1600,
   alt="Screenshot of Factorio. The view is fairly zoomed out. There a lot of trees in the bottom left of the image and the FPS counter is showing 60 FPS.",
   caption="Screenshot of Factorio taken while moving diagonally down and to the left.") }}

As you can probably guess I'm not much of a gamer and this is not a gaming PC,
but for older, or lighter games it does just fine under emulation. I didn't
find a native game to try out, but I then I didn't really try hard to find one
either.

### WSL & Virtualisation

Windows is a strange beast, an outlier in a world that has mostly settled on
UNIX/POSIX inspired systems. Being the outlier there are a plethora of ways
that Microsoft and the community have come up with to make it integrate with
the rest of the computing world. The [Windows Subsystem for Linux][wsl] (WSL)
is one of them, and it works great on this system.

I installed [Debian GNU/Linux][debian] as well as [Chimera Linux] in WSL.
Debian was installed using the built-in mechanism `wsl --install -d Debian`.
Chimera was installed manually by downloading the `aarch64` root file system,
gunzipping it and then importing it. Both distros work well. It was
particularly satisfying to `apt install x11-apps` in the Debian install, then
run `xeyes` and have it just work™.

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/xeyes.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/xeyes.png",
   resize_width=1600,
   alt="Screen shot with an xeyes window above a terminal window showing apt output from installing x11-apps and running xeyes.",
   caption="xeyes running via WSL.") }}

WSL2 uses Hyper-V virtualisation under the covers but frustratingly creating
virtual machines manually with Hyper-V requires Windows Pro and the 7x comes
with Windows Home. Through a website of dubious legitimacy I was able to
purchase a Windows Pro key for considerably less than the {{ money(amount=169)
}} Microsoft was asking on the Microsoft Store for a Home to Pro upgrade.

After the updates were applied I fired up Hyper-V Manager and tried booting the
Chimera Linux `aarch64` ISO. The grub menu is shown promptly but after
selecting an entry it seems to hang. I also tried a Debian ISO but got the same
result. Some searching online revealed that I was [not alone](https://www.reddit.com/r/Surface/comments/1dmzpzt/running_linux_in_hyperv_on_snapdragon_x/).
I let the Debian installer go for a while. It turns out that it is running,
just at a glacial pace.

This doesn't seem to be an issue with Windows on Arm in general. I also have
a [Windows Dev Kit 2023][Dev Kit 2023] WIth a Snapdragon 8cx Gen 3 CPU and
Hyper-V works fine on it. Hopefully this is just a bug/early issue that will
be resolved.

It's also worth noting that Hyper-V is the only option for Windows on Arm.
VMWare and Virtual Box only work on x86 systems.

In desperation, I managed to get [QEMU] running in the [Msys2] environment.
However, while the `qemu-system-aarch64` binary is native it is emulating a
system and there is no acceleration available. For lightweight systems such as
Chimera Linux this works, but it's not ideal.

### Development

The development experience on this laptop is a bit of a mixed bag, which I will
detail below.

#### Rust

Pretty much all my personal projects are implemented in [Rust] and for the most
part it works great. The one gotcha is that when using the MSVC toolchain on
Windows for Arm the `ring` crate requires that `clang` is installed. This is
straightforward to achieve with the Visual Studio Installer, but it's not quite
the just works experience you get on x86 Windows. `rustup` is an x86 binary but
the toolchain it installs is a native `aarch64` one.

Windows compatible Rust projects that don't have C/C++ dependencies tend to
build and run fine. I worked on a few my projects without issue and also
published some releases to [crates.io](https://crates.io/). It is more
challenging if C/C++ dependencies are involved. There's multiple ways to
approach them such as `vcpkg` but I have so far avoided the issue. If I run
into a project that has tricky dependencies I think I'll use WSL.

#### Python

I tried to install [pyinfra], which as the name suggests is implemented in
Python. Running `python` in a PowerShell session opens up the Windows Store to
the Python page if it's not already installed. Initially I installed this
version, but I noticed that it had installed the x86 version. Searching with
`winget` revealed a native version, so I uninstalled the Store version and
reinstalled via `winget`.

I then tried to install `pyinfa` into a venv and was met with failure.
Pre-built wheels were not available for some packages, so it was attempting to
build from source. I had Rust installed for my other work but `cryptography`
failed because it couldn't find OpenSSL. I installed it via `vcpkg` but it
still complained about not being able to find OpenSSL despite my attempts to
point it at it. `pynacl` also failed to build because it couldn't find `make`.

There has been [an issue open on the `pynacl` repo][pynacl-issue] since 2022
asking for Arm support. An issue requesting Arm Windows support for
`cryptography` was previously closed with the note:

> We won't ship a wheel for a platform we can't test in CI and GitHub does not
> currently offer arm64 windows runners. When they do we'll revisit this
> though!

Since [GitHub have announced Arm Linux and Windows runners][arm-runners] I
opened a new issue in `cryptography` asking for Arm Windows support. I didn't
notice that the Arm runners are currently only available to GitHub Enterprise
and Team plans though. So the `cryptography` folks are still waiting for
general availability before they are willing to tackle the issue.

It's pretty strange that Microsoft own GitHub and are making this push for
developers to support Windows on Arm but still haven't made Arm GitHub Actions
runners available to the wider open-source community.

At this point I suspected that the Microsoft Store may have been on to
something when it installed the x86 version of Python. I uninstalled Python
once again and replaced it with the Store version. This time `pyinfa` installed
and ran fine. Sadly it was at this point that I discovered that Hyper-V was
broken as described earlier, so my `pyinfra` experiments had to move to my
Linux system.

#### Node.js

I hear JavaScript is pretty popular these days. I didn't have a particular need
to run [Node.js] but wanted to try it out on this system. I installed a native
Node.js via `winget` and tried to build a couple of projects. Both failed to
build due to a change that was made to address [a security issue on Windows in
April 2024][node-security]—The joys of being on the odd-one-out OS. I then
thought I'd try building the TypeScript compiler—another Microsoft project.
This was immediately blocked by the lack of a native binary for the `dprint`
package:

> Error: Cannot find module '@dprint/win32-arm64/package.json'

Again pretty wild that an extremely popular Microsoft project still doesn't
build on Windows for Arm despite the platform being years old at this point.

`dprint` is actually a Rust project, and in this case `npm` is used to install
it. Unlike the Python packages the `dprint` npm package didn't try to build a
binary when a pre-built one was unavailable. I opened an issue on the repo
suggesting that an Arm Windows binary be published.

The maintainer was amazingly responsive and had a fix released the following
day. They encountered issues building a native binary, but a script was changed
to recognise `win32-arm64` and install the pre-built x86 binary, which worked.

After opening the issue on the `dprint` repo I was having flashbacks to my
Python experience, so I uninstalled node and used the installer on the Node.js
website to install the x86 version. Perhaps unsurprisingly this worked fine,
and I was able to build the TypeScript compiler.

The takeaway from this and the Python experience (and likely Ruby too) is that
these ecosystems are not ready for Windows on Arm yet. Unless your project and
its dependencies have no dependencies on native binaries/libraries/extensions
then you're you're better off using the x86 version for now.

#### C/C++/C#

Yes one of these is not like the others, but they all start with C, so together
they go! I built a couple of C# projects that I came across on GitHub without
drama in Visual Studio Community Edition.

**Note:** The following section is mostly me complaining about Windows and is 
not specific to Windows on Arm. Feel free to skip.

Most open-source projects I come across implemented in C or C++ use Makefiles,
autotools, cmake, or meson to build. This isn't specific to Windows on Arm but
as far as I can tell you're more or less sweet out of luck when it comes to
Makefiles and autotools on Windows—you pretty much have to use a third-party
toolchain like Msys2 to build these projects. `camke` and `meson` projects
might work…

I did some searching for a `make` implementation that would run natively, by
that I mean in PowerShell and not some other environment like Msys2. I did find
[ezwinports](https://sourceforge.net/projects/ezwinports/), which seems to be a
heroic effort by a single person, Eli Zaretskii to port various UNIX tools to
Windows. I looked into installing the GNU `make` port but there was this note
about installing `libgcc` and `libstdc++`:

> Warning: all the ports produced since the year 2021 onwards depend on
> the libgcc DLL, and some depend on libstdc++-6.dll, which are not
> provided in the zip files.  For the reasons, see below.  If you don't
> have these DLLs on your system, you can download them from this site:
> 
> https://osdn.net/projects/mingw/releases
> 
> Specifically, download and install these two archives:
> 
> https://osdn.net/projects/mingw/downloads/72215/libgcc-9.2.0-3-mingw32-dll-1.tar.xz/
> https://osdn.net/projects/mingw/downloads/72210/libstdc%2B%2B-9.2.0-3-mingw32-dll-6.tar.xz/

I have no idea where these are supposed to go and wasn't really in the mood for
going down this path, so I gave up and concluded if I ran into projects that
needed `make` or autotools I'd just use Linux (via WSL).

I did revisit the topic about a week later though as I wanted to test an
extremely basic Makefile in one of my projects. I found [pymake], which seems
to have been created specifically to improve the `make` experience on Windows.
I was able to `pip install py-make` and do what I needed to do in my project.

**Update 26 Jul 2024:** [Adam on Mastodon pointed out][voltagex] that GNU make
has a `bat` file for building with MSVC on Windows. I tried this and it built
successfully without the need to install any other dependencies. It did however
build an x86 binary and not an Arm one.

_End rant_

I tried to find a nice little C or C++ project to test with that:

- Used cmake or meson
- Was Windows compatible
- Didn't have extra dependencies to deal with

Those were hard to find. Eventually I settled on the [Janet] scripting
language, which built quickly and easily once I worked out what a Visual Studio
Command Prompt was:

```
D:\Source\janet>janet.exe
Janet 1.35.2-local windows/aarch64/msvc - '(doc)' for help
repl:1:> (print "Hello from Janet")
Hello from Janet
nil
repl:2:>
```

### Performance

From feel alone the laptop performs very well. Actions are snappy and
responsive. Web-browsing even on heavy websites does not bog down.

First things first, these are the [GeekBench scores I got on the Yoga 7x][geekbench-yoga]:

- 2,457 Single-Core, 13,088 Multi-Core 

For reference, my other systems:

-  2,966 Single-Core, 20,174 Multi-Core - [Desktop Linux system with AMD Ryzen 7950X][geekbench-desktop]
-  1,938 Single-Core, 6,348 Multi-Core - [HP Aero Laptop][geekbench-aero]

I wanted to find a relatively easy to reproduce "real-world" benchmark to
include in this post so that other people can run the same benchmark to get an
idea of how this system performs comparatively. I settled on the time to build
the [Gleam] programming language tooling. If you want to play along at home
this is what you need to do (assuming you have Rust installed):

Windows:

```
git clone https://github.com/gleam-lang/gleam
cd gleam
git checkout v1.2.1
cargo fetch
cargo clean; Measure-Command { cargo build --release --locked }
```

Not Windows:

```
git clone https://github.com/gleam-lang/gleam
cd gleam
git checkout v1.2.1
cargo fetch
cargo clean && time cargo build --release --locked
```

Some friends also graciously ran the test for me too. These are the results I
collected. In each case the last line was run multiple times and I selected the
fastest run, rounded to the nearest second.

|                                                    | Device         | CPU             | Topology | Arch | OS                 | rustc  | Time |
|----------------------------------------------------|:---------------|:----------------|:---------|:-----|:-------------------|:-------|:-----|
| <img class="os-logo" src="tux.svg" width="24">     | Yoga 7x        | X Elite         | 12c      | ARM  | Debian 12 (WSL)    | 1.79.0 | 0:52 |
| <img class="os-logo" src="windows.svg" width="24"> | Yoga 7x        | X Elite         | 12c      | ARM  | Windows 11         | 1.79.0 | 0:60 |
| <img class="os-logo" src="openbsd.svg" width="24"> | Yoga 7x        | X Elite         | 12c      | ARM  | OpenBSD -current   | 1.79.0 | 4:04 |
| &nbsp;                                             |                |                 |          |      |                    |        |      |
| <img class="os-logo" src="tux.svg" width="24">     | Desktop        | [Ryzen 9 7950X] | 16c/32t  | x86  | Arch Linux         | 1.79.0 | 0:23 |
| <img class="os-logo" src="apple.svg" width="24">   | MacBook Pro    | M3 Max          | 12p/4e   | ARM  | macOS 14.5         | 1.79.0 | 0:34 |
| <img class="os-logo" src="tux.svg" width="24">     | Desktop        | [Ryzen 9 3900X] | 12c/24t  | x86  | Arch Linux         | 1.77.1 | 0:44 |
| <img class="os-logo" src="tux.svg" width="24">     | Dell XPS 15    | [i7-13700H]     | 6p/8e\*  | x86  | Ubuntu 22.04 (WSL) | 1.79.0 | 0:55 |
| <img class="os-logo" src="apple.svg" width="24">   | MacBook Pro    | M1 Pro          | 8p/2e    | ARM  | macOS 13.6.7       | 1.76.0 | 1:02 |
| <img class="os-logo" src="tux.svg" width="24">     | [HP Aero]      | [Ryzen 7 5800U] | 8c/16t   | x86  | Arch Linux         | 1.79.0 | 1:09 |
| <img class="os-logo" src="windows.svg" width="24"> | [HP Aero]      | [Ryzen 7 5800U] | 8c/16t   | x86  | Windows 11         | 1.79.0 | 2:03 |
| <img class="os-logo" src="windows.svg" width="24"> | [Dev Kit 2023] | [8cx Gen3]      | 8c       | ARM  | Windows 11         | 1.79.0 | 2:39 |

<small>

**Key:** c = core, t = thread, p = performance core, e = efficiency core

**Notes:**

- As part of collecting these results I have noticed that the build
time is heavily influenced by the memory allocator and possibly libc used by
`rustc`. On the exact same system with different Linux/allocator combinations
I've seen times ranging from 24s to 1m55s, so as with all benchmarks they may
be complete rubbish.
- The tests I performed on the Yoga 7x were all in the Balanced power
mode. I did try the Best Performance mode and it was about 3 seconds faster.
However, it got hotter and the fan ran for longer after the build was finished.
Since part of my motivation for wanting an Arm system is cooler, quieter
computing I'm going to stick with the Balanced setting.
- For Windows testing the code was checked out onto a [Dev Drive] volume.
- \* This machine was configured to use 14 cores in WSL and was not using
  a Dev Drive.

</small>

Overall I think the Snapdragon X Elite does very well. It's in between an M1
Pro and an M3 Max, it handily beat my outgoing laptop (comparing Windows
times), and it's not far off a much more power hungry desktop AMD CPU from a
few years ago.

### Copilot & AI

The Yoga 7x is a so-called Copilot+PC because the SoC includes a neural
processing unit (NPU) capable of more than 40 trillion Int8 operations per
second (TOPS)—Qualcomm claim up to 45 TOPS. I have very little interest in
these Copilot features. Although, I was honestly curious to try out Windows
Recall after they announced the improvements to it. Alas, they canned it for
the initial release and probably for good reason.

There is a dedicated Copilot key on the keyboard as mandated by Microsoft.
Pressing it opens an app with a chat interface a-la ChatGPT. It turns out the
Copilot "app" is just an Edge "App", an app-like shortcut for opening a
website, in this case `copilot.microsoft.com`. As a result it can be a bit
janky and is completely dependent on an internet connection to render the UI
and respond to prompts.

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/copilot-offline.png",
   link="posts/2024/yoga-7x-snapdragon-developer-review/copilot-offline.png",
   width=630,
   alt="Screenshot of the Copilot app showing 'You're offline' and no other UI.",
   caption="Copilot 'app' when you're offline.") }}

I did use it a few times when seeking answers for how to do something I know
how to do on Linux in Windows. The responses were generally helpful. One detail
I particularly like is that the response is marked up with numbered links
intended to provide a source for the information. Belying its Edge
underpinnings clicking these links opens in Edge instead of the default
browser.

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/copilot-response.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/copilot-response.png",
   resize_width=1600,
   alt="Screenshot of the Copilot app with a response to a query about PowerShell. The response includes several numbered footnotes, each of which is a link.",
   caption="Copilot response with links to sources.") }}

### Non-Windows Operating Systems

As I mentioned at the start of this post I intend to run Linux on the 7x as
soon as that is viable. Qualcomm has been upstreaming support to the Linux
kernel for some time and looking over the Linux kernel mailing list there is a
bunch more being proposed for Linux 6.11.

Just to be sure Linux was definitely not functional yet I tried booting a
Chimera Linux and Ubuntu-daily ISO. Perhaps worth noting that the 7x runs good
old UEFI and after turning off Secure Boot loaded up grub off these Linux
install disks just fine. However, after selecting an entry in grub it would say
loading Linux then promptly reboot… definitely not working yet.

All was not lost though. The keen eyed among you may have noticed the OpenBSD
entry in the benchmark table. Yep OpenBSD runs on it right now. After resizing
the Windows partition I was able to install a recent snapshot of OpenBSD
-current.

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/openbsd-fvwm.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/openbsd-fvwm.png",
   resize_width=1600,
   alt="Screenshot of OpenBSD running fvwm. There are Firefox and Alacritty windows. The Firefox window is showing the OpenBSD homepage. The Alacritty window is showing the output of neofetch.",
   caption="OpenBSD running on the Yoga 7x.") }}

Now it's all still pretty bleeding edge and I can't say the experience is
particularly good at this point. It runs pretty hot with the fan going most of
the time. The built-in Wi-Fi didn't work, so I had to use a USB Wi-FI dongle.
There is no GPU acceleration and I couldn't work out how to get fvwm to honor
the X DPI settings so everything was tiny, at least Firefox honored it.
Complaints aside this is proof, only a month or so after release that
alternative OSes are pretty easy to run on these systems.

### Conclusion

{{ figure(image="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-yoga-detail.jpg",
   link="posts/2024/yoga-7x-snapdragon-developer-review/yoga-7x-yoga-detail.jpg",
   resize_width=1600,
   alt="Photo of the laptop at and angle showing the YOGA detail on the right-side palm rest.",
   caption="YOGA") }}

Overall I'm very happy with the Yoga 7x. It has mostly met my expectations for
a device this early in its release cycle. It is not without its quirks, bugs,
and compromises, but I have a pretty high threshold for those things. Those
compromises mean that computing on the PC Arm platform will not be for
everyone, but I'm glad it's now an option for the non-Mac users.

It's also worth noting that the X1E-78-100 CPU in the 7x is the bottom of
the X Elite range, there's two others with higher clock speeds announced
by Qualcomm that should make for pretty nice machines too.

If there's anything about the Snapdragon X experience that I didn't cover feel
free to get in contact and I'll do my best to answer any questions.

#### Comments

- [Lobsters](https://lobste.rs/s/p0hx8s/developer_s_review_snapdragon_x_laptop)
- [Hacker News](https://news.ycombinator.com/item?id=40971564)
- [Reddit](https://old.reddit.com/r/Lenovo/comments/1e47g09/a_developers_review_of_a_snapdragon_x_laptop/)

#### Credits

- [Foreign exchange rates](https://www.x-rates.com/historical/?from=AUD&amount=1&date=2024-05-29)
- [Apple logo](https://commons.wikimedia.org/wiki/File:Apple_logo_dark_grey.svg)
- [Windows logo](https://commons.wikimedia.org/wiki/File:Windows_logo_-_2021.svg)
- [OpenBSD mascot](https://commons.wikimedia.org/wiki/File:OpenBSD_Logo.svg)
- [Tux](https://commons.wikimedia.org/wiki/File:Tux-shaded.svg)

[^1]: The 15-inch is the closest match in display resolution.

[^2]: While Windows on Arm is not new the X Elite CPUs are the first ones to be widely adopted by PC manufacturers.

[1Password]: https://1password.community/discussion/comment/713004
[8cx Gen3]: https://www.qualcomm.com/products/mobile/snapdragon/pcs-and-tablets/snapdragon-mobile-compute-platforms/snapdragon-8cx-gen-3-compute-platform
[Chimera Linux]: https://chimera-linux.org/
[Cities Skylines]: https://www.paradoxinteractive.com/games/cities-skylines/about
[Dev Drive]: https://blogs.windows.com/windowsdeveloper/2023/06/01/dev-drive-performance-security-and-control-for-developers/
[Dev Kit 2023]: https://learn.microsoft.com/en-us/windows/arm/dev-kit/
[Factorio]: https://www.factorio.com/
[GOG Galaxy]: https://www.gog.com/galaxy
[Gleam]: https://gleam.run/
[HP Aero]: https://support.hp.com/lv-en/document/c08303941
[Handbrake]: https://handbrake.fr/
[Inkscape]: https://inkscape.org/
[Janet]: https://janet-lang.org/
[Msys2]: https://www.msys2.org/
[Node.js]: https://nodejs.org/
[Obsidian]: https://obsidian.md/
[Project Farm]: https://www.youtube.com/@ProjectFarm
[QEMU]: https://www.qemu.org/
[Rufus]: https://rufus.ie/en/
[Rust Rover]: https://www.jetbrains.com/rust/
[Rust]: https://www.rust-lang.org/
[Ryzen 7 5800U]: https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-7-5800u.html#amd_support_product_spec
[Ryzen 9 3900X]: https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9900x.html
[Ryzen 9 7950X]: https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7950x.html
[Stardew Valley]: https://www.stardewvalley.net/
[Steam]: https://store.steampowered.com/
[X Elite]: https://www.anandtech.com/show/21445/qualcomm-snapdragon-x-architecture-deep-dive
[arm-runners]: https://github.blog/2024-06-03-arm64-on-github-actions-powering-faster-more-efficient-build-systems/
[debian]: https://www.debian.org/
[firefox-arm]: https://www.theverge.com/2019/4/11/18305849/mozilla-firefox-windows-arm-laptops-beta
[geekbench-aero]: https://browser.geekbench.com/v6/cpu/6906110
[geekbench-desktop]: https://browser.geekbench.com/v6/cpu/3355715
[geekbench-yoga]: https://browser.geekbench.com/v6/cpu/6896181
[i7-13700H]: https://ark.intel.com/content/www/us/en/ark/products/232128/intel-core-i7-13700h-processor-24m-cache-up-to-5-00-ghz.html
[node-security]: https://nodejs.org/en/blog/vulnerability/april-2024-security-releases-2
[pen]: https://www.lenovo.com/au/en/p/accessories-and-software/stylus-pens-and-supplies/pens/4x81h95637?orgRef=https%253A%252F%252Fduckduckgo.com%252F
[prism]: https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-x86-emulation
[pyinfra]: https://pyinfra.com/
[pymake]: https://github.com/tqdm/py-make
[pynacl-issue]: https://github.com/pyca/pynacl/issues/775
[qcom-upstream]: https://www.qualcomm.com/developer/blog/2024/05/upstreaming-linux-kernel-support-for-the-snapdragon-x-elite
[wsl]: https://learn.microsoft.com/en-us/windows/wsl/about
[yoga-7x]: https://archive.is/kgfke
[voltagex]: https://aus.social/@voltagex/112832696768580115
