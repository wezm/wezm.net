+++
title = "Replicating My Alacritty Appearance in Ghostty"
date = 2025-01-10T08:54:40+10:00

[extra]
updated = 2025-01-15T09:51:03+10:00
+++

[Ghostty] by Mitchell Hashimoto is the new hotness in the terminal emulator
world. It recently came out of private beta launching publicly as 1.0. It's
similar to other GPU accelerated terminal emulators like [Alacritty] and
[Kitty], but differs in that it uses the native toolkit on macOS and Linux
(GTK). For nerds it's also interesting because it's implemented in [Zig].

<!-- more -->

Initially I dismissed Ghostty as not offering me anything over my current
terminal emulator, [Alacritty]. Largely because of my use of the [Awesome window
manager][awesomewm]. Using a tiling window manager means I have no need for tabs in my
terminal emulator, and I have Awesome configured to show no window decorations
on most windows. I thought this meant that Ghostty using a native UI offered me
very little. However, after some recent discussions I noted that Ghostty did
support two longstanding missing features in Alacritty:

1. Text rendering with ligatures
2. Bitmap image support, such as sixel

This prompted me to take another look at Ghostty. I set about tweaking the
settings to remove all the UI chrome and get the theme to match my Alacritty
config. This is the result:

{{ figure(image="posts/2025/ghostty-config/ghostty-fastfetch.png",
   link="posts/2025/ghostty-config/ghostty-fastfetch.png",
   width="700",
   alt="Screenshot of the output of fastfetch in Ghostty.",
   caption="fastfetch output in Ghostty.") }}

Compared to Alacritty:

{{ figure(image="posts/2025/ghostty-config/alacritty-fastfetch.png",
   link="posts/2025/ghostty-config/alacritty-fastfetch.png",
   width="700",
   alt="Screenshot of the output of fastfetch in Ghostty. It's slightly narrower than the Ghostty output.",
   caption="fastfetch output in Alacritty.") }}

For some reason Ghostty is rendering PragmataPro slightly wider than Alacritty
despite them both being set to the same font size.

Finally here's a sample document in [mdcat] showing image and ligature support:

{{ figure(image="posts/2025/ghostty-config/ghostty-mdcat.png",
   link="posts/2025/ghostty-config/ghostty-mdcat.png",
   width="700",
   alt="Screenshot of the output of mdcat rendering a showcase Markdown file that includes formatting, images, and ligatures.",
   caption="mdcat rendering a sample Markdown document.") }}

With the visuals out of the way, now I just need to spend some time with
Ghostty to see how it compares in practice. My configuration for both terminal
emulators can be found in my dotfiles repo:

- [Alacritty](https://github.com/wezm/dotfiles/blob/master/config/alacritty/alacritty.yml) (I need to migrate this one to TOML)
- [Ghostty](https://github.com/wezm/dotfiles/blob/master/config/ghostty/config)

**Update 15 Jan 2025:** I have suspended my use of Ghostty for now, as [the
text rendering is not right][rendering-bug]. I've been staring at PragmataPro
for more than a decade, so the difference from how I expect it to look keeps
distracting me. If that issue is fixed I will likely revisit Ghostty as I did
enjoy some of the features.

[Alacritty]: https://alacritty.org/
[awesomewm]: https://awesomewm.org/
[Ghostty]: https://ghostty.org/
[Kitty]: https://sw.kovidgoyal.net/kitty/
[mdcat]: https://github.com/swsnr/mdcat
[rendering-bug]: https://github.com/ghostty-org/ghostty/issues/4504#issuecomment-2589154353
[Zig]: https://ziglang.org/
