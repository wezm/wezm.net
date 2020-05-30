+++
title = "Setting the amdgpu HDMI Pixel Format on Linux"
date = 2020-05-30T08:48:30+10:00

#[extra]
#updated = 2020-03-27T21:53:53+11:00
+++

This week I discovered some details of digital display technology that I was
previously unaware of: pixel formats. I have two [Dell P2415Q displays][P2415Q]
connected to [my computer][ryzen9-pc]. One via DisplayPort, the other via HDMI.
The HDMI connected one was misbehaving and showing a dull picture. It turned
out I needed to force the HDMI port of my RX560 graphics card to use RGB output
instead of YcBCr. However, the `amdgpu` driver does not expose a means to do
this. So, I used an EDID hack to make it look like the display only supported
RGB.

<!-- more -->

**tl;dr** You can't easily configure the pixel format of the Linux `amdgpu`
driver but you can hack the EDID of your display so the driver chooses RGB.
[Jump to the instructions](#the-fix).

Previously I had one display at work and one at home, both using DisplayPort
and all was well. However, when I started working from home at the start of
2020 (pre-pandemic) the HDMI connected one has always been a bit flakey. The
screen would go blank for second, then come back on. I tried 3 different HDMI
cables each more premium (and hopefully shielded than the last) without
success.

This week the frustration boiled over and I vented to some friends. I was on
the brink of just rage buying a new graphics card with multiple DisplayPorts,
since I'd never had any trouble with that connection. I received one suggestion
to swap the cables between the two, to rule out a fault with the HDMI connected
display. I was quite confident the display was ok but it was a sensible thing
to try before dropping cash on a new graphics card. So I swapped the cables
over.

After performing [the magical incantation to enable HDMI 2.0][incantation] and
get 4K 60Hz on the newly HDMI connected display I immediately noticed lag. I
even captured it in a slow motion video on my phone to prove I wasn't going
crazy. Despite `xrandr` reporting a 60Hz connection it seemed as though it was
updating at less than that. This led me to compare the menus of the two
displays. It was here I noticed that good one reported an input colour format
of RGB, than the other [YPbPr].

This led to more reading about pixel formats in digital displays — a thing I
was not previously aware of. Turns out that ports like HDMI support multiple
ways of encoding the pixel data, some sacrificing dynamic range for lower
bandwidth. I found this article particularly helpful,
[DisplayPort vs. HDMI: Which Is Better For Gaming?](https://www.tomshardware.com/features/displayport-vs-hdmi-better-for-gaming).

My hypothesis at this point was that the lag was being introduced by my display
converting the YPbPr input to its native RGB. So, I looked for a way to change
the pixel format output from the HDMI port of my RX560 graphics card. Turns out
this is super easy on Windows, but [the `amdgpu` driver on Linux does not
support changing it][amdgpu-bug].

In trying various suggestions in that bug report I rebooted a few times and the
lag mysteriously went away but the pixel format remained the same. At this
point I noticed the display had a grey cast to it especially on areas of white.
This had been present on the other display when it was connected via HDMI too
but I just put it down to being a couple of years older. With my new pixel
format knowledge in hand I knew this was was the source of lack of brightness.
So, I was still determined to find a way to force the HDMI output to RGB.

### The Fix

It was at this point I found [this Reddit post][reddit-pixel-format] with a
fairly terrible hack: Copy the [EDID] of the display and modify it to make it
seem like the display only supports RGB. The `amdgpu` driver then chooses that
format instead.  Amazingly enough it worked! I also haven't experienced the
screen blanking issue since swapping cables. I can't say for sure if that is
fixed but the HDMI cable is now further away from interference from my Wi-Fi
router, so perhaps that helped.

The following are the steps I took on Arch Linux to use a modified EDID:

1. Install [wxEDID from the AUR][wxEDID].
1. Make a copy of the EDID data: `cp /sys/devices/pci0000:00/0000:00:03.1/0000:09:00.0/drm/card0/card0-HDMI-A-1/edid Documents/edid.bin`
1. Edit `edid.bin` with wxEDID and change these values:
   1. Find SPF: Supported features -> vsig_format -> replace 0b01 wih 0b00
   1. Find CHD: CEA-861 header -> change the value of YCbCr420 and YCbCr444 to 0
   1. Recalculate the checksum: Options > Recalc Checksum.
   1. Save the file.

**Note:** I had to attempt editing the file a few times as wxEDID kept
segfaulting. Eventually it saved without crashing though.

Now we need to get the kernel to use the modified file:

1. `sudo mkdir /lib/firmware/edid`
1. `sudo mv edid.bin /lib/firmware/edid/edid.bin`
1. Edit the kernel command line. I use [systemd-boot], so I edited `/boot/loader/entries/arch.conf` and added `drm_kms_helper.edid_firmware=edid/edid.bin` to the command line, making the full file look like this:

        title   Arch Linux
        linux   /vmlinuz-linux
        initrd  /amd-ucode.img
        initrd  /initramfs-linux.img
        options root=PARTUUID=2f693946-c278-ed44-8ba2-67b07c3b6074 resume=UUID=524c0604-c307-4106-97e4-1b9799baa7d5 resume_offset=4564992 drm_kms_helper.edid_firmware=edid/edid.bin rw

1. Regenerate the initial RAM disk: `sudo mkinitcpio -p linux`
1. Reboot

After rebooting the display confirmed it was now using RGB and visually it was
looking much brighter! 🤞 the display blanking issue remains fixed as well.

[P2415Q]: https://www.dell.com/en-au/shop/dell-24-ultra-hd-4k-monitor-p2415q/apd/210-anfp/monitors-monitor-accessories
[ryzen9-pc]: https://bitcannon.net/page/ryzen9-pc/
[incantation]: https://www.dell.com/support/article/en-au/sln306595/setting-up-the-p2415q-p2715q-monitors-with-hdmi-2-0-that-support-4k-x-2k-60hz?lang=en
[amdgpu-bug]: https://gitlab.freedesktop.org/drm/amd/-/issues/476
[YPbPr]: https://en.wikipedia.org/wiki/YPbPr
[reddit-pixel-format]: https://www.reddit.com/r/Amd/comments/8bwul6/how_to_switch_the_pixel_format_for_amdgpu_on_linux/dxaef7a/
[EDID]: https://en.wikipedia.org/wiki/Extended_Display_Identification_Data
[wxEDID]: https://aur.archlinux.org/packages/wxedid
[systemd-boot]: https://wiki.archlinux.org/index.php/Systemd-boot
