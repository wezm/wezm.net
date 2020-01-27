_This is my response to the [call for 2019 roadmap blog posts][rust2019]
proposing goals and directions for 2019 and future editions. See also [Read
Rust][readrust], where I've collected all the #Rust2019 posts._

2018 was a very busy year for the Rust project. A new edition was released,
progress on stabilising Rust's asynchronous I/O story was made, a new website
was launched, and so much more! In 2019 I'd like to see the language and
wider crates community become more sustainable, address some common gothca's
that newcomers experience, and promote more platforms/architectures to tier 1
status.

## 2018 Retrospective

Before diving into 2019 goals I think it's worth tracking how the project went
on my ideas from [last year][rust2018]:

1. Become a better option for building network daemons and HTTP
   micro-services.
1. Continue to improve the discoverability and approachability of crates and
   Rust's web presence in general.
1. Gain wider, more diverse tier-1 platform support (especially on servers).
1. Start delivering on the prospect of safer system components, with fewer
   security holes.

### Network Services

A lot of progress was made on [Futures] async/await in 2018. The keywords were
reserved in the 2018 edition but are not yet usable on a stable release. [Are
we async yet?][areweasyncyet] shows there's still some work to do. [Hyper] saw
more major changes to keep up with the Futures work and added HTTP/2 support!

### Improve Rust's Web Presence

The Rust web presence was improved with the release of the new website and
blog. The rest of the ecosystem remains much the same. Content from crates.io
is still largely invisible to non-Google search engines such as
[DuckDuckGo][ddg-results] (my primary web search tool), and Bing. The [Rust
Cookbook][rust-cookbook] remains in the nursery.

### Platform Support

[Tier 1 platform support][platform-support] remains unchanged from last year.
There were a number Tier 2 additions/promotions.

### System Components and Increased Safety

The oxidisation of [librsvg] continued in 2018 to the point where almost all
the public API is done in terms of Rust. I'm not aware of many other projects
following this path at the moment:

<iframe src="https://mastodon.social/@federicomena/101383973224691323/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400"></iframe><script src="https://mastodon.social/embed.js" async="async"></script>

----

## Rust 2019

In 2019 I'd like to see the Rust community focus on three areas:

1. Sustainable development
1. Make is easier for newcomers to write fast code / don't surprise people
1. More portability

## Sustainable Development

Recently [Murphy Randle](https://twitter.com/splodingsocks) and [Jared
Forsyth](https://twitter.com/jaredforsyth) were discussing the [event-stream
compromise][event-stream] on the Reason Town podcast. Jared commented:

> The problems of having infrastructure that’s based on unpaid labour that has
> a high degree of burnout.

— [Reason Town podcast episiode 13 @ 19:29](https://overcast.fm/+LfcjXelpg/19:29)

This is a pretty succinct summary of the problem with our industry. Rust hasn't
shied away from tackling hard problems before and taking on the sustainability
of open source doesn't feel out of the question. There's evidence that many of
the folks deeply involved with the Rust project are already feeling the
pressure and we don't want to lose them to burnout. Such as these posts:

* [Organizational Debt](https://boats.gitlab.io/blog/post/rust-2019/) by withoutboats
* [ Thoughts on Rust in 2019](https://words.steveklabnik.com/thoughts-on-rust-in-2019) by Steve Klabnik
* [Rust in 2019: Focus on sustainability](http://smallcultfollowing.com/babysteps/blog/2019/01/07/rust-in-2019-focus-on-sustainability/) by Niko Matsakis

Part of this revolves around culture. The Rust community generally values
quality, correctness, performance, and treating each other with respect. I
think it would be possible to make it normal to contribute financially, or
other means (equipment, education) to Rust language and crate developers (where
people are in a position to do so). A simple first step might be allowing for a
donate badge, akin to CI badges to be added to crate meta data and have this
shown on the Crate page.

Michael Gattozzi covered some similar thoughts in his,
[Rust in 2019: The next year and edition](https://mgattozzi.com/rust-in-2019-the-next-year-and-edition/),
post.

## Naïve Code Is Fast Code

People hear that Rust is fast and lean, they try it out converting something
from a language they already know and are surprised to find that it's slower
and/or a much larger binary.

There are
[many](https://www.reddit.com/r/rust/comments/adyd9j/why_is_the_rust_version_of_this_fn_60_slower_than/)
[many](https://www.reddit.com/r/rust/comments/aaood3/go_version_of_program_is_40_quicker_than_rust/)
[many](https://www.reddit.com/r/rust/comments/7w3v77/why_is_my_rust_code_100x_slower_than_python/)
[many](https://www.reddit.com/r/rust/comments/aaood3/go_version_of_program_is_40_quicker_than_rust/)
examples of this in the [Rust Reddit][reddit]. Things that frequently seem to
trip newcomers up are:

1. Not compiling with `--release`
1. Stdio locking
1. Binary size

It would be good to apply the [principle of least surprise][pls] here. I think
the current defaults are inspired by the behaviours expected from C/C++
developers, Rust's original target audience. However the Rust audience is now
much wider than that. With that in mind it might worth reevaluating some of
these things in terms of the current audience. These need not require API
changes, perhaps they could be `clippy` lints. Perhaps they could be slight
changes to language. For example, `cargo` currently says:

> `Finished dev [unoptimized + debuginfo] target(s) in 0.11s`

Perhaps a second line could be added that says: 

> `Compile with --release for an optimized build`

to help guide people.

## More Tier 1 Platforms

This one is inherited from last year. I do all my server hosting with [FreeBSD]
and up until recently used it as my desktop OS as well. It's not uncommon to
uncover portability bugs or assumptions when using such a platform. Portability
is type of diversity of software. It makes it stronger and useful to more
people.

Rust is already appealing to people because of its portability. I was recently
talking to a veteran developer at the [Melbourne Rust meetup's hack
night][meetup] about what got them into Rust. It was the combination of modern
language features, native binary **and** portability that drew them to Rust.

To this end I'd like to see more platforms and CPU architectures promoted to
tier 1 status. Up until recently one thing that made this difficult was the
lack of hosted CI services with support for anything other than Linux, macOS,
and Windows. Recently two options have become available that make it possible
to test on other systems, such as FreeBSD. There is [Cirrus CI] which includes
a FreeBSD image in their hosted option, as well as the ability to create
custom images. Secondly there is [sr.ht], a completely open source (but hosted)
option that supports a variety of Linux distributions, and FreeBSD, with more
planned.

[Pietro Albini suggested in his
post](https://www.pietroalbini.org/blog/rust-2019-wishlist/) that the Rust
infrastructure team is already planning to start the discussion on CI options.
I think this would be a perfect opportunity to integrate more platforms into
the CI infrastructure:

> One of the biggest one is switching away from Travis CI for the compiler
> repository. In the past year we had countless issues with them (both small
> and big), and that's not acceptable when we're paying (a lot) for it. The
> infra team is already planning to start the discussion on where we should
> migrate in the coming weeks, and we'll involve the whole community in the
> discussion when it happens.

## Conclusion

After an intense 2018 it sounds like the Rust project needs to focus on making
the project sustainable over time. I'd love to see some improvements to
address issues newcomers often experience and push more platforms to tier
1 status. Rust is still very exciting to me. I can't wait to see what 2019
brings!

_For more great #Rust2019 posts check out [readrust.net][readrust]._

[Cirrus CI]: https://cirrus-ci.org/
[sr.ht]: https://meta.sr.ht/
[pls]: http://principles-wiki.net/principles:principle_of_least_surprise
[event-stream]: https://github.com/dominictarr/event-stream/issues/116
[reddit]: https://www.reddit.com/r/rust/new/
[Futures]: https://rust-lang-nursery.github.io/futures-rs/
[#Rust2018]: https://twitter.com/search?f=tweets&vertical=default&q=%23Rust2018&src=typd
[areweasyncyet]: https://areweasyncyet.rs/
[ddg-results]: https://duckduckgo.com/?q=site%3Acrates.io&t=ffab&ia=web
[FreeBSD]: https://www.freebsd.org/
[Hyper]: https://hyper.rs/
[librsvg]: https://people.gnome.org/~federico/news-2016-10.html#25
[platform-support]: https://forge.rust-lang.org/platform-support.html
[readrust]: https://readrust.net/rust-2019/
[rust-cookbook]: https://rust-lang-nursery.github.io/rust-cookbook/
[rust2019]: https://blog.rust-lang.org/2018/12/06/call-for-rust-2019-roadmap-blogposts.html
[rust2018]: /2018/01/goals-directions-rust-2018/
[meetup]: https://www.meetup.com/Rust-Melbourne/
