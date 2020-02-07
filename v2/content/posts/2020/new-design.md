+++
title = "New Design 2020"
date = 2020-01-27T15:42:29+11:00

# [extra]
# updated = 2019-07-01T22:40:53+10:00
+++

It's been more than 10 years since I started working on [the previous design]
for this website 😅. This feels like a good point to come up with a new one!

<!-- more -->

The previous design served me well. The uncluttered design focussed on text was
fast and responsive. It saw the introduction of new devices like iPad and a
gradual increase in mobile display size without needing updating. The new
design aims to retain these features while giving it a lighter, more modern
feel.

Inspired by [Chris Krycho] and [Shaun Inman] I've taken to versioning the
website instead of attempting to port all the existing content over to the new
technology. This makes the redesign more of a clean slate and leaves old posts
appearing how the did when originally posted. The new site is hosted under the
`/v2/` prefix.  This allows all existing pages to stay where they are and
retains the `www.wezm.net` domain. Compared to using a sub-domain it doesn't
mess with DNS or search ranking. I have put redirects in place to direct the
RSS feeds from the previous version to the new feed.

The new design uses the [Manrope] variable font for all text. Variable fonts
are a fairly recent addition to the web platform but they have good support
from fairly recent versions of all modern browsers and operating systems. On
older browsers/operating systems the layout will fall back to a sans-serif font.
Webfonts generally come with a non-trivial download cost. However, Manrope is
108kB and being a variable font that includes all weights between 200 and 800,
as well as italic!

Technology wise, the previous site was built with [Nanoc], a Ruby static site
compiler. I've been very happy with Nanoc over the years but as my programming
interests have shifted away from Ruby to Rust I've wanted to try a Rust static
site compiler.  I'm now using [Zola]. Zola is perhaps not quite as flexible as
Nanoc but I've been able to achieve everything I wanted to with it.  It's super
fast and has nice conveniences like live-reload when editing content. Being a
single file native binary also makes installation a breeze — no need to juggle
Ruby versions or install gems.

Finally, I've now made [the repository][repo] that the site is generated from
public. This is to allow others to see how the site is built and permit
corrections/fixes via issue or pull request.

[Chris Krycho]: https://v4.chriskrycho.com/2019/my-final-round-of-url-rewrites-ever.html
[Shaun Inman]: https://web.archive.org/web/20160422175043/http://shauninman.com/archive/2006/12/04/the_original_heap
[Nanoc]: https://nanoc.ws/
[the previous design]: https://www.wezm.net/technical/2010/07/new-design/
[Manrope]: https://manropefont.com/
[Zola]: https://www.getzola.org/
[repo]: https://github.com/wezm/wezm.net
