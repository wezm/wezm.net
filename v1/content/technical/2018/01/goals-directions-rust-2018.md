_This is my response to the [call for community blog posts reflecting on
Rust][rust2018] in 2017 and proposing goals and directions for 2018. See also
[readrust.net][readrust], where I've collected all the #Rust2018 posts._

2017 saw some great progress in the Rust space. The project had a [clear roadmap for the
year][rust-roadmap] and followed it quite closely. It was a pleasure to see the
outcomes of the 2017 survey systematically addressed in the roadmap.

Over the course of the year we saw some software outside of Firefox and
developer tools (such as [rustfmt], [racer], [rustup]) gain wider use and make
it into OS package archives. At the time of writing there are [17 ports
dependent on rust in the FreeBSD ports tree][rust-ports], and [20 packages in
the Arch Linux package repos][arch-rust] including:

- [bingrep](https://github.com/m4b/bingrep) --- grep for binaries (executables)
- [pijul](https://pijul.org/) --- distributed version control system
- [tokei](https://github.com/Aaronepower/tokei) --- count lines of code, quickly
- [xi-core](https://github.com/google/xi-editor) --- a text editor
- [librespot](https://github.com/plietar/librespot) --- open source Spotify client library
- [exa](https://the.exa.website/) --- a more user friendly replacement for `ls`
- [fd](https://github.com/sharkdp/fd) --- a more user friendly alternative to `find`
- [flowgger](https://github.com/jedisct1/flowgger) --- a fast log data collector
- [ripgrep](https://github.com/BurntSushi/ripgrep/) --- a faster alternative to grep and ack
- [xsv](https://github.com/BurntSushi/xsv) --- a toolkit for manipulating and extracting data from CSV
- [alacritty](https://github.com/jwilm/alacritty) --- A cross-platform, GPU-accelerated terminal emulator

As I spoke about at the [September Melbourne Rust Meetup][rust-talk], I think
adoption of tools written in Rust outside the Rust community helps increase
adoption of the language as whole. It means [packaging systems are updated to
support Rust][uses-cargo], tools are exposed to more diverse environments, and
people are more likely to raise bugs or contribute fixes and improvements. They
may even learn some Rust in the process.

We also saw the initial release of Futures and [Tokio] --- the initial answer
to how Rust will support asynchronous I/O. I think these components will be
essential in making Rust a viable option for people wanting to build network
daemons and HTTP micro-services that can compete with the likes of
[Node.js][node] and [Go]. I found the fact that Futures were architected in a
way that upholds the [abstraction without overhead][zero-cost] (zero-cost
abstractions) goal of Rust to be particularly impressive.

## 2018

With most of 2018 ahead there are four areas that I would like to see Rust
improve on this year:

1. Become a better option for building network daemons and HTTP
   micro-services.
1. Continue to improve the discoverability and approachability of crates and
   Rust's web presence in general.
1. Gain wider, more diverse tier-1 platform support (especially on servers).
1. Start delivering on the prospect of safer system components, with fewer
   security holes.

### Network Services

There's a [lot of interest these days in HTTP micro-services][microservices-trend],
often running in containers on clusters. This is an area that Go does quite well at.
Its minimal runtime, language level async support, core http library, and easy
cross compilation make it well suited to this task. Node.js too can work well for
these types of services. On the face of it Rust should be as good or better than
Go and Node at these types of services with its even smaller runtime footprint,
sophisticated type system and extra guarantees. However, until Tokio matures it's
not really in the running.

I would like to see work continue on stabilising [async/await][async-await],
stabilisation of [Hyper] and support for [HTTP/2][hyper-http2]. So that when
a decision is being made about which technology to use for these types of services
Rust is one of the contenders.

### Improve Rust's Web Presence

This is in part a continuation of the 2017 goal, [Rust should provide easy
access to high quality crates][rust-crates] and the, [Improve the
Approachability of the Design of rust-lang.org and/or
crates.io](https://blog.rust-lang.org/2017/06/27/Increasing-Rusts-Reach.html#3-improve-the-approachability-of-the-design-of-rust-langorg-andor-cratesio)
proposal in the [Increasing Rust's Reach][rust-reach] program.

Having a consistent, approachable, discoverable, and well designed web presence
makes it easier for visitors to find what they're looking for and adds signals
of credibility, attention to detail, and production readiness to the project.
It would be wonderful to see the proposal above picked up and completed.

The large amount of Rust code that already exists is not particularly visible
unless you know to look on crates.io or GitHub. Crates and Rust libraries
should be more discoverable through traditional search engines. [Aside from the
static documentation, no pages on crates.io show up as search results on
DuckDuckGo][ddg-results]. They do show up in Google but the titles and
descriptions shown often aren't super useful.

When posting links to crates on Twitter or Slack, there is no rich preview,
which would help potential visitors know more about the link and what they
will find there.

<figure>
  <img src="/images/2018/crate-tweet.png" width="586" alt="Screenshot showing how a crate looks when tweeted." />
  <figcaption>How a crate looks when [tweeted](https://twitter.com/mitsuhiko/status/936749790553083905).</figcaption>
</figure>

<figure>
  <img src="/images/2018/npm-tweet.png" width="589" alt="Screenshot showing how an npm package looks when tweeted." />
  <figcaption>How an npm package looks when [tweeted](https://twitter.com/jaredforsyth/status/949497032087146498).</figcaption>
</figure>

The [Rust Cookbook][rust-cookbook] is an excellent resource, especially for
those just starting out. It should graduate from the nursery and be made more
discoverable, perhaps by integrating it with the [categories on
crates.io][crate-categories].

### Platform Support

Currently there are three [OSes with tier 1 support][platform-support]: Linux,
macOS, and Windows. These are the three most popular OSes and it's great that
they're all supported. However, it would be great to see more OSes gain tier 1
support. Platform diversity makes Rust a viable option for more projects and
can also [help find bugs][llvm-linker-bug].

Personally I would like to see [FreeBSD] promoted to tier 1 support. This would
be difficult at first as CI infrastructure would need to be built, contributors
would need to learn to address issues that would [break the build on
FreeBSD][freebsd-nightly-broken], etc. but in the end it would be easier to add
more platforms in the future and the ecosystem would be more robust for it.

### System Components and Increased Safety

One of Rust's strengths is memory safety. Jokes about, "Rewrite it Rust", and
the [Rust Evangelism Strike Force][resf] aside there has been a lot of talk
about the possibility for Rust to prevent some common causes of vulnerabilities
in C and C++ code. It would be nice to see some of this talk turn into action.
I'm not talking about rewiting Linux or [cURL] in Rust but start with replacing
some high value parts of existing C libraries like what Federico Mena-Quintero
has done with [librsvg].

Maybe these start as forks/experimental branches that can be used as drop in
substitutes for the original so that adventurous users on bleeding edge systems
like Arch, FreeBSD, or Gentoo could test them out.

While this is perhaps less of a goal for the Rust project and more of one for
the Rust community there are parts of it that relate to the project. For
example building these hybrid libraries would surely exercise and provide
feedback for the ongoing task to [improve the ability for Rust projects to
integrate with existing build systems][rust-build-systems].

## Conclusion

So they are my hopes and dreams for Rust in 2018. I feel that in some ways I'm
just sitting back telling other people about all the hard work they should do.
On the other hand I feel like I am contributing as well by writing and
publishing Rust code, doing talks, and providing bug reports and pull requests.

Here's to another successful year of Rust ahead!

_For more great #Rust2018 posts check out [readrust.net][readrust]._

[#Rust2018]: https://twitter.com/search?f=tweets&vertical=default&q=%23Rust2018&src=typd
[arch-rust]: https://www.archlinux.org/packages/community/x86_64/rust/
[async-await]: https://github.com/rust-lang/rfcs/issues/1081
[crate-categories]: https://crates.io/categories
[cURL]: https://curl.haxx.se/
[ddg-results]: https://duckduckgo.com/?q=site%3Acrates.io&t=ffab&ia=web
[freebsd-nightly-broken]: https://github.com/rust-lang/rust/issues/43427
[FreeBSD]: https://www.freebsd.org/
[Go]: https://golang.org/
[hyper-http2]: https://github.com/hyperium/hyper/issues/304
[Hyper]: https://hyper.rs/
[librsvg]: https://people.gnome.org/~federico/news-2016-10.html#25
[llvm-linker-bug]: https://twitter.com/wezm/status/931124516054491137
[mgattozzi]: https://mgattozzi.com/rust-wasm
[microservices-trend]: https://trends.google.com/trends/explore?date=today%205-y&q=microservices
[node]: https://nodejs.org/
[platform-support]: https://forge.rust-lang.org/platform-support.html
[racer]: https://github.com/phildawes/racer
[readrust]: https://readrust.net/rust-2018/
[resf]: https://twitter.com/rustevangelism
[rust-build-systems]: https://blog.rust-lang.org/2017/12/21/rust-in-2017.html#rust-should-integrate-easily-into-large-build-systems
[rust-cookbook]: https://rust-lang-nursery.github.io/rust-cookbook/
[rust-crates]: https://blog.rust-lang.org/2017/12/21/rust-in-2017.html#rust-should-provide-easy-access-to-high-quality-crates
[rust-ports]: https://www.freshports.org/search.php?stype=depends_all&method=match&query=lang%2Frust&num=100&orderby=category&orderbyupdown=asc&search=Search&format=html&branch=head
[rust-reach]: https://blog.rust-lang.org/2017/06/27/Increasing-Rusts-Reach.html
[rust-roadmap]: https://blog.rust-lang.org/2017/02/06/roadmap.html
[rust-servers]: https://blog.rust-lang.org/2017/12/21/rust-in-2017.html#rust-should-be-well-equipped-for-writing-robust-servers
[rust-talk]: /technical/2017/09/rust-tools-talk/
[rust2018]: https://blog.rust-lang.org/2018/01/03/new-years-rust-a-call-for-community-blogposts.html
[rustfmt]: https://github.com/rust-lang-nursery/rustfmt
[rustup]: https://github.com/rust-lang-nursery/rustup.rs
[Tokio]: https://tokio.rs/
[uses-cargo]: https://www.freebsd.org/news/status/report-2017-04-2017-06.html#A-New-USES-Macro-for-Porting-Cargo-Based-Rust-Applications
[zero-cost]: http://blog.rust-lang.org/2015/05/11/traits.html
