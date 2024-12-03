+++
title = "Ubuntu Linux on Snapdragon X Laptop (Lenovo Yoga Slim 7x)"
date = 2024-12-01T11:17:03+10:00
# template = "yoga7x.html"

# [extra]
# updated = 2024-07-26T10:34:50+10:00
+++

{{ figure(image="posts/2024/linux-on-yoga-7x-snapdragon/fastfetch.png",
   link="posts/2024/linux-on-yoga-7x-snapdragon/fastfetch.png",
   resize_width=1600,
   alt="Screenshot of fastfetch output in a terminal window. The details indicate that it's running Ubuntu oracular 24.10 on aarch64.",
   caption="Ubuntu running on Yoga Slim 7x") }}

Over the course of the last few months some fine folks in the Linux community
have been plugging away implementing support for Qualcomm Snapdragon X based
ARM laptops. Recently Canonical published [Ubuntu 24.10
Concept][ubuntu-concept] for testing on these laptops, which I
installed and tested on my Lenovo Yoga Slim 7x.

<!-- more -->

### Installation

{% aside(title="Want a full review?", float="right") %}
See: [A Developer's Review of a Snapdragon X Laptop (Lenovo Yoga Slim 7x)](@/posts/2024/linux-on-yoga-7x-snapdragon/index.md)
for my detailed review of this laptop.
{% end %}

Installation alongside Windows was almost as straightforward as a normal Ubuntu
install. It booted to a graphical live environment with working Wi-Fi.

The main issue was that the installer application in the live environment was only
rendering the bottom quarter of its window when display scaling was set to 200%
(which is the expected value for the display and was automatically applied at
boot). Changing it to 100% made everything tiny, but allowed me to complete the
install.

As per the notes in the forum post I installed and ran `qcom-firmware-extract`
after installation to fetch and install firmware blobs from the Windows
partition, and then rebooted. This appeared to fix battery level reporting and
possibly hardware video acceleration.

{{ figure(image="posts/2024/linux-on-yoga-7x-snapdragon/qcom-firmware-extract.png",
   link="posts/2024/linux-on-yoga-7x-snapdragon/qcom-firmware-extract.png",
   resize_width=1600,
   alt="Screenshot of a terminal showing the output from running qcom-firmware-extract. It says 'extracting firmware' followed by a list of files, and ends with 'Building package qcom-x1e-firmware-extracted_20241201_arm64'.",
   caption="Running qcom-firmware-extract") }}

### Usage

{{ figure(image="posts/2024/linux-on-yoga-7x-snapdragon/system-details.png",
   link="posts/2024/linux-on-yoga-7x-snapdragon/system-details.png",
   resize_width=1600,
   alt="Screenshot of System Details in GNOME settings indicating that GNOME is running on a Lenovo Yoga Slim 7 14Q8X9 with 32Gb RAM, 1Tb disk, GNOME 47 on Wayland. The Processor section is blank.",
   caption="System Details in GNOME Settings") }}

I have not spent a huge amount of time with this installation as Ubuntu isn't my
distro of choice, so I don't want to invest much time setting it up. I did
try most common functionality to get an idea of what works though.

#### Wi-Fi

I was about to connect to my 5Ghz AP without issue. A [speed test] showed very
similar results between Windows and Linux (although Linux was a bit faster):

- Linux: 137 Mbps down, 47 Mbps up
- Windows: 131 Mbps down, 45 Mbps up

#### Bluetooth

I was able to pair and use some Sennheiser Bluetooth headphones.

#### Graphics

The display works fine. I was able to change it to run at the full 90Hz in the
GNOME settings. The Wayland based GNOME desktop appears to be using GPU
acceleration and runs smoothly.

{{ figure(image="posts/2024/linux-on-yoga-7x-snapdragon/glxgears.png",
   link="posts/2024/linux-on-yoga-7x-snapdragon/glxgears.png",
   resize_width=1600,
   alt="Screenshot showing glxgears running and reporting 89fps in the terminal.",
   caption="glxgears running at 90Hz") }}

[glxinfo](glxinfo.txt) and [vulkaninfo](vulkaninfo.txt) both suggest hardware
graphics acceleration is available. However, Firefox reports `llvmpipe` in
`about:support` and drops frames playing 4K 60Hz video on YouTube, same with
Chromium. Despite `llvmpipe` Firefox runs smoothly.

It appears that hardware video decoding via is not supported yet (`vainfo`
doesn't find a suitable device).

#### Audio

The built-in speakers didn't work, with the only output device being a dummy device.
However, pairing Bluetooth headphones worked as expected. I didn't test microphones.

#### Input Devices

The keyboard and trackpad work, including tap-to-click out of the box on the
trackpad. The brightness and volume controls work on the keyboard.

#### Power Management

As mentioned above, installing and running `qcom-firmware-extract` copies
firmware from the Windows installation and fixed battery level reporting. I
can't comment on battery life yet but it did seem to run a bit warmer than
Windows, although not as hot as
[my early testing of OpenBSD](@/posts/2024/yoga-7x-snapdragon-developer-review/index.md#non-windows-operating-systems).

#### Other

I didn't try the USB ports. Suspending _appeared_ to work: the screen turned
off, however the LED on the power switch did not start pulsing like it does in
Windows. More testing required here.

### Conclusion

Linux support for these laptops is coming along quite nicely, and if you're
willing to put up with a few rough edges Ubuntu is quite usable. No doubt
things will continue to improve.

There's been working happen in other distros too. Relevant to my interests
[Jami Kettunen has also being working on X1E support in Chimera Linux][JamiKettunen]
and has that running on a HP OmniBook X. It's on my TODO list to try out Jami's
work on my Yoga 7x.

{{ figure(image="posts/2024/linux-on-yoga-7x-snapdragon/chimera-kde-plasma-x1e.png",
   link="posts/2024/linux-on-yoga-7x-snapdragon/chimera-kde-plasma-x1e.png",
   resize_width=1600,
   alt="About this system in KDE Plasma showing Chimera Linux running on Snapdragon X hardware.",
   caption="About this system in KDE Plasma showing Chimera Linux running on Snapdragon X hardware.") }}


[JamiKettunen]: https://github.com/JamiKettunen/cports/tree/x1e
[ubuntu-concept]: https://discourse.ubuntu.com/t/ubuntu-24-10-concept-snapdragon-x-elite/48800/1
[speed test]: https://www.speedtest.net/
