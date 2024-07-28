+++
title = "Announcing Feedlynx"
date = 2024-07-29T09:43:57+10:00

#[extra]
#updated = 2024-07-26T10:34:50+10:00
+++

{{ float_svg(image="images/feedlynx.svg", width=75, float="left",
   alt="Feedlynx logo: a caricature of a Lynx with a stem in its mouth. At the end of the stem is the orange RSS logo.") }}

My latest project, [Feedlynx], is a self-hosted tool that allows you to
collect links in an RSS feed[^1]. You subscribe to the feed in your RSS reader of
choice and read or watch later at your leisure. Plus it has an adorable mascot!

Feedlynx runs on most mainstream operating systems including Linux, macOS, BSD,
and Windows and has no runtime dependencies. Check out [the latest release][releases] to
download pre-compiled binaries for some common platforms.

After a few weeks using Feedlynx myself I think it's ready for others to check out.
Read on for more information about my motivations behind building Feedlynx.

<!-- more -->

### Motivation

Since [moving all my YouTube subscriptions to my RSS
reader](@/posts/2024/youtube-subscriptions-opml/index.md) there was one thing I
missed from using YouTube directly: Watch Later. For videos that I'd encounter
on social media, or shared in chats I missed having a way to quickly stash
them for later. This is what motivated me to build Feedlynx.

You might wonder, though, why I didn't use one of the existing bookmarking
or read-later services. Well, the main reason was that I wanted the links to
show up in the same place that I was already watching videos: in my RSS reader.
Of course, I also really like building little self-hosted tools to solve my own
problems.

### Usage

The Feedlynx server is implemented in Rust (as is tradition) and provides HTTP
endpoints to accept new links and serve the RSS feed.

On a real computer new links are added via [the Firefox browser extension][feedlynx-ext] I
wrote. Click the icon and a moment later a notification is shown indicating the
link was added.

{{ figure(image="posts/2024/announcing-feedlynx/notification.png",
   link="posts/2024/announcing-feedlynx/notification.png",
   width=303,
   alt="TODO",
   caption="Notification from Firefox extension.") }}

On my phone, I've set up a workflow using the Shortcuts app that lets me add
links directly from the share sheet.. The Shortcut can be installed on iOS,
iPadOS, and macOS. It's linked in [the README][Feedlynx].

When a new link is submitted to the server it fetches the page to try to
extract [OpenGraph metadata][OpenGraph] to help fill out the item in the RSS
feed. The title of the tab is also submitted by the browser extension as a fall
back.

The fall back is particularly necessary for YouTube since it seems they often
[block simple requests for the HTML of the video page][block]. Instead of the
video page they return a `200 Ok` response with a "prove you're not a robot
page" and a generic title and description.

Adding new links via `cURL` is also quite simple, should you want to do so from
a script:

    curl -d 'url=https://example.com/' \
         -d 'token=ExampleExampleExampleExample1234' \
         http://localhost:8001/add

### Implementation Notes

Some notes on the implementation:

- I _tried_ to keep the number of dependencies low and favoured dependencies
  that had few dependencies of their own.
- I vendored code from a few crates since I only needed a small piece
  of their functionality. These are acknowledged in the README and in
  the code.
- Since this is only intended to serve sporadic requests for one person it
  doesn't use async Rust. Regular synchronous code is more than enough and
  avoids the need to pull in a whole async runtime.
- The RSS feed is the data store, no need for a DB or anything like that.
  The file is guarded by a lock.
- Adding a feed and fetching the feed requires two different tokens that
  are read from the environment when the server starts.
- The browser extension requests the bare minimum permissions necessary to get
  the job done. It is not able to see the content of pages.
- YouTube links are detected and an `iframe` embed is included in the RSS
  item to allow watching in your RSS reader.

### Future Work/Ideas

My primary use-case was stashing videos to watch later but as I was building
Feedlynx it made sense to make it work for any link. It seems like an logical
extension to have Feedlynx manage multiple feeds so that you can send videos
to one feed and other links to one or more other feeds.

I only use Firefox so that's the only browser extension that exists so far. It
should be straightforward to port the extension to other browsers
(contributions welcome). I haven't submitted the extension to
addons.mozilla.org yet. I'll do that soon.

Since Feedlynx manages an RSS feed on disk it could be useful to have a mode
where the server is not run, instead relying on an existing HTTP server like
`nginx` to serve the feed. A command like `feedlynx add some-url` could be
used to add new entries.

I've been considering offering low-cost paid hosting for tools like Feedlynx
and [RSS Please] for folks that don't want to deal with their own server. If
you'd be interested in that let me know.

### Links

- [Source code][Feedlynx]
- [Browser extension code][feedlynx-ext]

----

[^1]: I refer to the feed as an RSS feed throughout but it's actually an Atom feed.

[Feedlynx]: https://github.com/wezm/feedlynx
[RSS Please]: https://rsspls.7bit.org/
[feedlynx-ext]: https://github.com/wezm/feedlynx-ext
[OpenGraph]: https://ogp.me/
[block]: https://github.com/iv-org/invidious/issues/4734
[releases]: https://github.com/wezm/feedlynx/releases/latest
