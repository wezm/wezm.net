On 3 Jan 2018 the Rust blog put out a [call for community blog
posts][call-for-posts] that reflected on 2017 and proposed goals and directions
for Rust in 2018. Responses came in across Twitter, Reddit, and elsewhere. I
was enjoying reading all the posts so decided to build a little website to
collect them all together: Thus [Read Rust] was born.

Initially it was just an RSS feed of the posts but it soon acquired a list of
the posts themselves that proved useful as January progressed. The #Rust2018
period is now over and the [Rust roadmap for 2018][roadmap] has been drafted
with the responses. Read Rust got linked near the top, which made me happy.
With January over I had to decided what to do with the site. Since I built the
workflow for aggregating and publishing posts I decided to continue it past
January as a more general Rust content aggregator.

Yesterday I launched the update. A number of new categories join the initial
Rust 2018 category, bringing the list to:

* [All Posts](http://readrust.net/all/)
* [Computer Science](http://readrust.net/computer-science/)
* [Crates](http://readrust.net/crates/)
* [Embedded](http://readrust.net/embedded/)
* [Games and Graphics](http://readrust.net/games-and-graphics/)
* [Operating Systems](http://readrust.net/operating-systems/)
* [Performance](http://readrust.net/performance/)
* [Rust 2018](http://readrust.net/rust-2018/)
* [Tools and Applications](http://readrust.net/tools-and-applications/)
* [Web and Network Services](http://readrust.net/web-and-network-services/)

Each category has its own page and RSS feed in case readers are only interested
in that category. I also set up a Twitter account, [@read_rust], that tweets
new posts.

## Tooling

Read Rust is built with the [Cobalt] static site compiler, which itself is
written in Rust. Most of the content is derived from a central [JSON Feed] file
that lists all the posts. Each of the category pages uses [Cobalt's support for
data files][data-files] to load the JSON Feed and render a list of links tagged
with that particular category.

I also wrote a couple of tools (in Rust) to help with managing the site.
`add-url` is used to add a new link to the site. It is supplied a URL and one
or more categories. It then resolves redirects (to remove t.co, bit.ly, etc.)
to come up with the canonical URL, then fetches the page and with varying
success extracts the title, description, author, and publication date from it.

A simple `Makefile` combined with the second tool, `generate-rss` takes the main
JSON Feed and filters it to generate each of the feeds for the different
categories in both RSS and JSON Feed formats.

All the content and [source code is available on GitHub][readrust-github].

## Design Decisions

### Feeds

The site promotes the RSS and JSON Feeds available. Despite rumours of their
death, Feed readers are a still a thing and provide a very pleasant reading
environment without all the ads, tracking and other junk that often accompanies
some of the alternatives. Additionally the feeds allow the content to be reused
in other ways. For example Florian Gilcher wrote [a Rust tutorial that uses the
Read Rust feed to a build command line reader for Read Rust][florian-tutorial].

### Managing Content

Managing the site is a manual process. This was done initially to make getting
the site online during January as quick as possible. I could have easily put
together a basic Rails site but that brings along with it more demanding
hosting requirements, and the need to stay on top of Ruby, Rails, and gem
upgrades. Being a static site means that it's just a simple collection of files
that are cheap and easy to host.

The drawback to a static site is it's harder to implement dynamic behaviour.
I've been able to work around this when needed:

* For post submissions from the community I set up an [issue template in
  GitHub][issue-template] that pre-fills the issue with prompts for the
  information I need to add a new post. Given the target audience is likely to
  have a GitHub account this seems like a reasonable choice.
* For site search I have a little search form that performs a search on
  [DuckDuckGo], limited to readrust.com.
* In order to have the Read Rust Twitter account automatically tweet new posts
  I was able to leverage the RSS feed and [IFTTT] to tweet each new entry in
  the feed.

### Privacy, Tracking, and Performance

Read Rust respects your privacy. There are no trackers, analytics, ads,
crypto-coin miners, or other third party code on the site at all. In fact
**there is no JavaScript** on the site at all.

The styling, basic as it is, was designed almost from scratch so there's not
thousands of lines of unused CSS framework downloading behind the scenes.
There's just 111 lines of CSS, initially derived from
[bettermotherf\*\*\*ingwebsite.com](http://bettermotherfuckingwebsite.com/).

My one indulgence is the [Nunito Sans] font, which adds about 40kb.

The page weight for a first time visitor to the home page is about 50kb and the
site is often fully loaded in 1 or 2 seconds. That's not to say it couldn't be
smaller of faster (by adding a CDN for example), just that by considering
choices when building the site, it is fast, responsive, cacheable, and
respectful of visitors almost for free.

Page load times (fully loaded) reported by [WebPagetest] are:

* 0.533s for New York, USA (where the server is hosted)
* 1.790s for Sydney, Australia (same country as me)
* 0.948s for Paris, France
* 2.130s for Rose Hill, Mauritius

## Conclusion

So that is the process that led to making Read Rust the way it is and how the
content is managed. If you stumble across an interesting Rust post feel free
to [submit it][submit]!

[@read_rust]: https://twitter.com/read_rust
[call-for-posts]: https://blog.rust-lang.org/2018/01/03/new-years-rust-a-call-for-community-blogposts.html
[Cobalt]: http://cobalt-org.github.io/
[data-files]: http://cobalt-org.github.io/docs/data.html
[DuckDuckGo]: https://duckduckgo.com/
[florian-tutorial]: http://asquera.de/blog/2018-01-20/getting-started-with-rust-on-the-command-line/
[IFTTT]: https://ifttt.com/
[issue-template]: https://github.com/wezm/read-rust/blob/master/.github/ISSUE_TEMPLATE/missing_post.md
[JSON Feed]: https://jsonfeed.org/
[Nunito Sans]: https://www.fontsquirrel.com/fonts/nunito-sans
[Read Rust]: http://readrust.net/
[readrust-github]: https://github.com/wezm/read-rust
[roadmap]: https://github.com/aturon/rfcs/blob/roadmap-2018/text/0000-roadmap-2018.md
[submit]: https://github.com/wezm/read-rust/issues/new?labels=missing-post&title=Add+post&template=missing_post.md
[WebPagetest]: http://www.webpagetest.org/
