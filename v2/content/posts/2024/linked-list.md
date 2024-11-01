+++
title = "Building and Launching My New Link Blog, linkedlist.org (Twice)"
date = 2024-10-31T13:56:30+10:00

#[extra]
#updated = 2024-06-06T08:24:45+10:00
+++

I've started a new tech focused link blog over at
[linkedlist.org](https://linkedlist.org). "Not another tech blog", I hear you
groan, and rightly so. However my intention is **not** to cover topics that are
already well reported upon like Apple, Google, Microsoft, the latest drama at
OpenAI, and other stuff like that. Instead, I plan to focus more open-source,
programming, hardware, software, Linux, Rust, retro computing etc. There's some
more details in [the welcome post][welcome].

In this post I'm going to cover the process I took to the build the site
(twice) and some of the considerations that went into it—for a site with only a
handful of pages there was a surprising amount of them.

<!-- more -->

When building Linked List my reference was [Daring Fireball] by John Gruber,
which I've enjoyed reading for close to two decades now (aside from some of the
recent takes on the EU DMA). The site is simple on the surface but it's clear
that John has put a bunch of thought into a number of different aspects of the
site.

The high-level things I wanted were:

- The distinction of a link post (to an external site) versus a first party post[^1].
- An RSS feed that has special accommodations for link posts where the item
  links to the external site.
- Automated publishing of new posts to Mastodon.
- A clean design.
- Responsive (mobile friendly).

### The First Build

I initially toyed with the idea of using [micro.blog] to host the site as it
can host blogs, micro or not, and has a lot of built-in support for
cross-posting to services like Mastodon. Ultimately I decided it wasn't quite
the right fit for what I was aiming for.

Concluding I'd need to build it myself I reached for my go-to
static-site-compiler: [Zola]. As part of the micro.blog experiment I took a
liking to their [Alpine theme], which as it was open-source I used as the base
style for the Zola site.

My first hurdle was that I wanted a particular URL hierarchy:

`linkedlist.org/YYYY/MM/DD/post-slug`

This proved a challenge to achieve with Zola. There was an [open issue]
about this sort of structure, which led me
<https://github.com/scouten/ericscouten.travel>. I was able to replicate the
approach used there to achieve what I wanted.

Creating a new post was a bit involved though as it required creating each of
the intermediate directories if they didn't exist, as well as an `_index.md`
file with particular content in each newly created directory. I automated this
with a Ruby script, which was also able to pre-populate the front matter for a
new link post.

### Cross-posting to Mastodon

For cross-posting I wanted to use the site's feed as the source and have the
tool post newly published items. There are dozens of these RSS to Mastodon
tools on GitHub. I evaluated 16 of them against a handful of requirements:

**No runtime[^2]**

This ruled out the vast majority, as many were written in Python or
JavaScript/TypeScript. I don't want to have to deal with operating tools using
these languages as I find handling their dependencies and breakage due to
upgrades annoying.

**Conditional Requests**

It feels like table stakes that a tool that is polling a HTTP resource will
make conditional requests using headers like `If-Modified-Since` or
`If-None-Match` so that it will only be fetched and processed if modified. The
vast majority of the tools I evaluated just fetched the feed every time they
polled it though.

**Robust Against Duplicate Posts**

I want to reduce the possibility of something causing a flood of posts or
duplicates. Some of the tools I evaluated did alright here, but many did not.

----

None felt like they covered all these, so I took [the code I had written for
the Read Rust tooter][tooter] and reworked it to use a feed as the data source
instead of a database. I spent a fair bit of time making it support
multiple feeds and feed formats, as well multiple posting targets. I plan to
open-source it in the future.

I protect against duplicate posts and post floods by:

- Marking all existing items of a feed as seen before on first run.
- Tracking the guid of each published item, and only publishing new ones.
- Tracking the content of each Mastodon post published so that if an item slips
  through the other guards it will hopefully be stopped at this point.
- Use idempotency keys when publishing to Mastodon so that if a post fails
  on the client but is actually successfully processed by the server,
  it will be rejected on a subsequent attempt to post it.

Before the scope creep in the cross-posting tool occurred I added a [JSON Feed]
to Linked List as these was a bit easier to consume than the Atom feed. Only
problem was [Zola didn't support JSON Feed][zola-json-feed]. I solved this with
a `jaq` script described in [my previous post](@/posts/2024/json-feed-zola.md).

With the cross-posting tool mostly feature complete I deployed it to a
Raspberry Pi Zero W, running on my desk. Every 15 mins `cron` fires it up to
check for, and post new items in the feed.

### Polish

There was a long tail of smaller things that I implemented before the initial
launch, such as:

- Dark mode
- [OpenGraph] metadata
- Mastodon account and verification metadata
- Archive pages such as `/2024` and `/2024/10`
- The myriad of favicon images
  ([realfavicongenerator.net](https://realfavicongenerator.net/) helped a lot
  here)

### Launch & Rewrite

Finally, on 11 October I soft-launched the site with a post on Mastodon. Over
the next couple of weeks I published posts to the site, eventually realising
I'd never added pagination to the home page. I went to add it that weekend and
discovered that it was going to be very difficult owing to how I'd achieved
the URL hierarchy with Zola.

Zola had got the site up, but I took this (as well as some of the earlier
friction) as a sign it was time for a custom approach. Over the next few
evenings and some weekend time I rewrote it in Rust using Axum as the HTTP
server layer.

Since things were more under my control now I took the opportunity to:

- Drop trailing slashes from URLs.
- Set long-lasting `Cache-Control` values for static files and include them
  with a cache busting hash.
- Bundle all static files like CSS and fonts into the binary in release builds.
- Add pagination to the home page.

I also had to do a bit of extra work to support things you get for free in a
Zola/static site:

- `Etag` headers
- Conditional request support
- `sitemap.xml`

On 30 October I deployed the new version of the site. It renders the same
Markdown files as the Zola site, so publishing new posts is still just rsyncing
the files.

The Markdown content is loaded from disk at start up and rendered out of RAM.
It doesn't currently cache the rendered result, but most responses are generated
in 1ms or less anyway. A filesystem watcher is used to notice when the files
are changed and automatically reload them.

With the rewrite out of the way I now have more time for more regular posting
to the site, I hope you'll [follow along].

[^1]: Gruber actually calls the collection of link posts on Daring Fireball
      [the Linked List][df-linked], although I was only tangentially aware of
      this when I embarked on this project. My main motivation was that I liked
      the cross-over with [the data structure][data-structure] and that I already
      had the `linkedlist.org` domain, originally registering it in 2011.
[^2]: I.e. a native binary that can be run without having to install an interpreter
      or similar first.

[Alpine theme]: https://github.com/microdotblog/theme-alpine
[Daring Fireball]: https://daringfireball.net/
[data-structure]: https://en.wikipedia.org/wiki/Linked_list
[df-linked]: https://daringfireball.net/linked/
[follow along]: https://linkedlist.org/follow
[JSON Feed]: https://www.jsonfeed.org/
[micro.blog]: https://micro.blog/
[open issue]: https://github.com/getzola/zola/issues/2275
[OpenGraph]: https://ogp.me/
[tooter]: https://github.com/wezm/read-rust/tree/master/rust/src
[welcome]: https://linkedlist.org/2024/09/14/welcome-to-linkedlist
[zola-json-feed]: https://github.com/getzola/zola/issues/311
[Zola]: https://www.getzola.org/
