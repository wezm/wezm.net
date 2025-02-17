+++
title = "Making the Web More Readable With Stylus"
date = 2025-02-17T10:21:22+10:00

[extra]
#updated = 2025-01-15T09:51:03+10:00
+++

[Stylus] is an open-source browser extension for managing and applying "user
styles"—custom snippets of CSS—to websites. It allows you to tweak sites you
visit to tailor them to your preferences. In this post I list the ways I use
Stylus to make my browsing experience nicer.

<!-- more -->

Stylus has the ability to share and use shared styles, but I just use styles
I write myself. Styles can by applied to all sites, specific sub-domains,
domains, or domains + paths. I note the matching rule of each style at the
top of each entry.

You will probably notice that are large number of my rules are just tweaks
to fonts. What can I say, I have opinions about fonts and I use Stylus to
express them.

### Sign in with Google

**Applies to:** Everything

Hide the stupid Sign in with Google popup that appears on sites using a Log in
with Google button, such as StackOverflow. I _never_ want to Sign in with
Google on a third-party site.

```css
#credential_picker_container:has(iframe[src*="accounts.google.com"]) {
    display: none;
}
```

### arstechnica.com

**Applies to:** URLs on the domain: [arstechnica.com](https://arstechnica.com)

Remove auto-playing videos in the middle of articles.

```css
.ars-interlude-container {
    display: none;
}
```

### d-shoot.net

**Applies to:** URLs on the domain: [d-shoot.net](https://d-shoot.net)

Set a font and `max-width` more suited to reading.

```css
body {
    max-width: 640px;
    font-family: sans-serif;
    margin: 0 auto;
}
```

### danluu.com

**Applies to:** URLs on the domain: [danluu.com](https://danluu.com)

Set a `max-width` more suited to reading.

```css
body {
    max-width: 600px;
    margin: 0 auto;
}
```

### feedbin.com

**Applies to:** URLs on the domain: [feedbin.com](https://feedbin.com)

Put my single glyph WMAppleLogo font first in the stack so that when people use
the Apple logo in text it appears correctly on non-Apple devices; use Muli as
the article font.

On Apple devices you can type an Apple logo, which uses the Private Use Area
code point U+F8FF. [I created a font with an Apple logo mapped to this code
point so that posts that use it appear as intended][WMAppleLogo].

```css
.font-default .content-styles {
    font-family: WMAppleLogo, Muli, sans-serif;
}
```

### github.com

**Applies to:** URLs on the domain: [github.com](https://github.com/)

Use the default `sans-serif` font for body text on GitHub. I have my system
font set to Cantarell, which unlike many I actually like for system controls
like menus, buttons, and titles. I don't however want to see prose written in
it. So I override GitHub's use of `system-ui`.

```css
body, .markdown-body {
    font-family: sans-serif; /* Use sans-serif font instead of system UI font */
}
```

### gkeenan.co

**Applies to:** URLs on the domain: [gkeenan.co](https://gkeenan.co)

This blog uses a typewriter font for body text which I don't like visually,
nor find particularly easy to read. Replace it with [Work Sans], which still
fits the vibe of the site.

```css
html {
    font-family: Work Sans, sans-serif;
}
```

### goughlui.com

**Applies to:** URLs on the domain: [goughlui.com](https://goughlui.com)

Uses a Times New Roman font by default, which it a bit ugly on my system.
Replace with a nicer serif font.

```css
body,
input,
textarea,
.page-title span,
.pingback a.url {
 font-family: "TeX Gyre Pagella", serif
}
```

### lwn.net

**Applies to:** URLs on the domain: [lwn.net](https://lwn.net)

LWN allows you to choose from a selection of fonts, but I still chose to
override it with the [Source Sans 3] variable font. I also adjust the headings
to be less bold and also constrain the article text width.

```css
body {
    font-family: SourceSans3VF, sans-serif;
}
h1,h2,h3, b {
    font-weight: 600
}
DIV.PageHeadline,
DIV.ArticleText {
    max-width: 800px;
}
```

### news.ycombinator&#8203;.com

**Applies to:** URLs on the domain: [news.ycombinator.com](https://news.ycombinator.com)

The post text in Hacker News self-posts like "Ask HN" posts is shown in light grey.
Fix this.

```css
/* Make HN post text readable */
.toptext {
    color: #333;
}
.toptext a {
    color: #1973c2;
}
```

### https://okmij.org&#8203;/ftp/papers/&#8203;DreamOSPaper.html

**Applies to:** URLs starting with:
[https://okmij.org/ftp/papers/&#8203;DreamOSPaper.html](https://okmij.org/ftp/papers/DreamOSPaper.html)

Readable `max-width`.

```css
body {
    max-width: 640px;
    margin: 1em auto;
}
```

### phanpy.social

**Applies to:** URLs on the domain: [phanpy.social](https://phanpy.social)

Custom font.

```css
body {
    font-family: Figtree, sans-serif;
}
```

### thingspool.net

**Applies to:** URLs on the domain: [thingspool.net](https://thingspool.net)

Readable `max-width`.

```css
body {
    max-width: 700px;
}
```

### wikipedia.org

**Applies to:** URLs on the domain: [wikipedia.org](https://wikipedia.org)

Better font on desktop.

```css
html, body {
    font-family: 'Lato', sans-serif; /* Lato is used by m.wikipedia */
}
```

### www.&#8203;bleepingcomputer&#8203;.com

**Applies to:** URLs on the domain: [www.bleepingcomputer.com](https://www.bleepingcomputer.com)

Nicer font.

```css
.bc_main_content p,
.bc_main_content li
{
    font-family: Figtree, sans-serif;
    font-weight: normal;
}
```

### yeslogic.element.io

**Applies to:** URLs on the domain: yeslogic.element.io

This is a hosted Matrix instance using the Element client.

* Use the system emoji font ([JoyPixels]) instead of the heinous Noto Color Emoji.
* Use the system monospace font ([PragmataPro]) instead of a custom one.
* Reduce line height of monospace text to match other places monospace text shown on my system.
* Hide the space wasting "Spaces" bar.

```css
body {
    font-family: Inter, sans-serif;
    /* Make it use system emoji font */
}

.mx_EventTile_content .markdown-body code,
.mx_EventTile_content .markdown-body pre {
    font-family: monospace !important;
}
.mx_EventTile_content .markdown-body pre {
    line-height: 1.3;
}
*[aria-label="Spaces"] {
    display: none;
}
```

[WMAppleLogo]: https://mastodon.decentralised.social/@wezm/109827184573904673
[Stylus]: https://github.com/openstyles/stylus
[Work Sans]: https://github.com/weiweihuanghuang/Work-Sans
[Source Sans 3]: https://github.com/adobe-fonts/source-sans
[JoyPixels]: https://joypixels.com/
[PragmataPro]: https://fsd.it/shop/fonts/pragmatapro/
