+++
title = "New Design 2020"
date = 2020-01-27T15:42:29+11:00

# [extra]
# updated = 2019-07-01T22:40:53+10:00
+++

It's been more than 10 years since I started working on [the previous design]
for this website 😅, although it won't have been public for 10 years until July
2020. This feels like a good point to come up with a one!

<!-- more -->

The previous design served me well. The uncluttered design focussed on text was
fast and responsive. It saw the introduction of new devices like iPad and a
gradual increase in mobile display size without needing updating. The new
design aims to retain these features while giving it a lighter feel. I'm using
the [Manrope] variable font for all text.

Technology wise, the previous site was built with [Nanoc], a Ruby static site
compiler. I've been very happy with Nanoc. As my programming interests have
shifted away from Ruby to Rust in the last decade I wanted to try a Rust static
site compiler. The site is now built with [Zola]. Zola is perhaps not quite as
flexible as Nanoc but I've been able to achieve everything I wanted to with it.
It's super fast and has nice conveniences like live-reload when editing
content. Being a single file native binary also makes installation
straightforward — no need to juggle Ruby versions or install gems.

Inspired by [Chris Krycho] and [Shaun Inman] I've taken to versioning the
website instead of attempting to port all the existing content over to the new
technology.  This makes the redesign more of a clean slate and leaves old posts
appearing how the did when originally posted. The new site is hosted under the
`/v2/` prefix.  This allows all existing pages to stay where they are and
retains the `www.wezm.net` domain.

Finally, I've now open sourced [the repository][repo] that the site is generated from. This
is to allow others to see how the site is built and also to submit corrections/fixes
if they're noticed.

[Chris Krycho]: https://v4.chriskrycho.com/2019/my-final-round-of-url-rewrites-ever.html
[Shaun Inman]: https://web.archive.org/web/20160422175043/http://shauninman.com/archive/2006/12/04/the_original_heap
[Nanoc]: https://nanoc.ws/
[the previous design]: https://www.wezm.net/technical/2010/07/new-design/
[Manrope]: https://manropefont.com/
[Zola]: https://www.getzola.org/
[repo]: https://github.com/wezm/wezm.net
