+++
title = "Slowing Down Read Rust Posting"
date = 2020-09-07T10:00:00+10:00

[extra]
#updated = 2020-06-19T09:30:00+10:00
+++

After nearly 3 years and more than 3200 posts I'm going to slow down the
posting frequency on Read Rust. I hope this will free up some spare time and
make it easier to take breaks from social media. I aim to share all of the
[#rust2021] posts I can find, but after that I'll probably only share posts
that seem particularly noteworthy or interesting.

<!-- more -->

I started [Read Rust] in January 2018 to track the posts being shared as part of
the [inaugural call for blog posts][inaugural-call]. When I started there were
only a handful of new posts each day to triage. Now there are many more and
unless I triage and publish daily they quickly pile up.

Also, I've kind of built a reflex of trying to "complete the Internet" each day
by ensuring that I read my whole Twitter feed, and new posts on [/r/rust]. I
would like to break this habit and be able to take breaks from these things,
without feeling like I might miss an important post.

Whilst I think there is value in the curation and archiving of posts on Read
Rust, the website doesn't see a lot of use. I think most of the value for
people is following the [Twitter], [Mastodon], and [Facebook] accounts.
However, there's a fair amount of overlap between posts shared on [/r/rust],
[@rustlang], and [This Week in Rust][twir]. So, I think that if folks keep an
eye on one or more of those they will still see most posts of note.

If you're not into social media, the full list of more than 450 Rust RSS feeds
I subscribe to is available via an OPML file on the site. So, feel free to use
that to subscribe to a bunch of feeds instead. [Rust blogs OPML][opml].

It's been fun to build, and rebuild the website and surrounding tooling over
the years. Read Rust was initially just an RSS feed but after requests for an
actual web-page I built a small site with the [Cobalt static site
compiler][cobalt]. In late 2019 in an effort to streamline the sharing of posts
I rebuilt the site as dynamic web app. In early 2020 I added full test search.

As mentioned in the introduction, from here I plan to share [#rust2021] posts and
after that posting will be much less frequent. Thanks for reading, and happy
coding 🦀.

### Frequently Anticipated Questions

#### Q. What about getting others to help share posts?

I considered this, and it it was actually part of the motivation for the
rebuild in 2019. However, ultimately Rust is now large enough and continuing to
grow such that it's become less and less feasible to curate the entire
firehose of Rust content.

#### Q. What about making it a sort of RSS powered Rust [planet]?

I think there's value in curation. Rust is popular enough now that there's a
lot of low effort posts, or repetitious getting started posts. Also, people
rightly have diverse interests and their blog may not solely contain Rust
posts. So, I'd prefer to keep the archive in the focussed state it's in now.

#### Q. What will happen to the site and social media accounts now?

I plan to keep the site up and running indefinitely. I am a strong believer in
not breaking links on the web, and I think I have a pretty decent track record.
For example, this site has been online for 13 years and I still have redirects
in place from the very first version of it. I may still share the occasional
post but in general I hope to free up a bit of time to work on other things.

[inaugural-call]: https://blog.rust-lang.org/2018/01/03/new-years-rust-a-call-for-community-blogposts.html
[#rust2021]: https://blog.rust-lang.org/2020/09/03/Planning-2021-Roadmap.html
[cobalt]: https://cobalt-org.github.io/
[Twitter]: https://twitter.com/read_rust
[Mastodon]: https://botsin.space/@readrust
[Facebook]: https://www.facebook.com/readrust/
[/r/rust]: https://www.reddit.com/r/rust/
[@rustlang]: https://twitter.com/rustlang
[libstriptags]: https://github.com/wezm/libstriptags
[feedfinder]: https://github.com/wezm/feedfinder
[feedbin-sharing]: https://feedbin.com/help/sharing-read-it-later-services/
[planet]: https://en.wikipedia.org/wiki/Planet_(software)
[opml]: https://readrust.net/rust-blogs.opml
[twir]: https://this-week-in-rust.org/
[Read Rust]: https://readrust.net/
