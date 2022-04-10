+++
title = "Fixing Monospace Text in Kobo eReaders"
date = 2022-04-10T09:14:50+10:00

# [extra]
# updated = 2022-01-27T21:07:32+10:00
+++

After verifying with friends that eBook readers do a decent job of rendering
technical content I purchased a [Kobo Libra 2] this week. I loaded up some books
and started reading… but something was off. Sure enough, after verifying the
[EPUB] with [Calibre] on my computer I confirmed that the Kobo was not rendering
text with CSS rules like `font-family: monospace` in a monospace font.

<!-- more -->

[Skip to Instructions ⮷](#instructions)

I quickly discovered this is a known issue with Kobo readers dating back years:
for reasons I can't comprehend they do not include a monospace font on the
device. I read many forum posts about how to add fonts but these were centred
around adding fonts to the font selector for the body text. Eventually I found
the solution via a [summary of the release notes for a firmware update in
2019][fw]:

> Path for monospace font changed to match other fonts and name is "Courier".
> This should mean that any correctly sideloaded font whose name starts with
> "Courier" will be used when the monospace font face is specified.

With this knowledge in hand I was able to make it render monospace text in the
one true monospace font, [PragmataPro]:

{{ figure(image="posts/2022/monospace-kobo-ereader/kobo-monospace.jpg", link="posts/2022/monospace-kobo-ereader/kobo-monospace.jpg", resize_width=600, alt="Kobo Libra 2 rendering monospace text in PragmataPro", caption="Kobo Libra 2 rendering monospace text in PragmataPro.") }}

## Instructions

1. Connect the Kobo to your computer.
2. Create a folder in the root of the device named `fonts`.
3. Put your chosen monospace font in the `fonts` folder.
4. Rename the fonts to follow this naming convention: `Courier <Font Family>-<Font Weight>.ttf`.
   * The leading `Courier` is required for the eReader to use the font for
     monospace text in books and not just show the font as an option in the
     reading settings.

For example I renamed the PragmataPro font files to:

* `Courier PragmataPro Mono-Regular.ttf`
* `Courier PragmataPro Mono-Bold.ttf`
* `Courier PragmataPro Mono-Italic.ttf`
* `Courier PragmataPro Mono-BoldItalic.ttf`

I read in [a forum thread][forum-thread] that it's important that the fonts be
named like this with the actual font family name and the font weight names for
them to work. [GNOME Font Viewer][gnome-fonts] in freedesktop.org environments
or [Font Book] on macOS, or [allsorts-tools] on all platforms can show you the
font family name for a font.

Happy reading!

[Kobo Libra 2]: https://au.kobobooks.com/products/kobo-libra-2
[EPUB]: https://www.w3.org/publishing/epub/
[Calibre]: https://calibre-ebook.com/
[fw]: https://blog.the-ebook-reader.com/2019/12/12/new-kobo-firmware-update-4-19-14123-released/
[PragmataPro]: https://fsd.it/shop/fonts/pragmatapro/
[forum-thread]: https://www.mobileread.com/forums/showthread.php?t=204363
[gnome-fonts]: https://apps.gnome.org/en/app/org.gnome.font-viewer/
[Font Book]: https://support.apple.com/en-au/guide/font-book/welcome/mac
[allsorts-tools]: https://github.com/yeslogic/allsorts-tools
