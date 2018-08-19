To date I've posted 718 posts to [Read Rust]. I can't profess to having read
every single one completely (although I have read a lot of them) but I have at
least skimmed them all and extracted the information required to post them to
the site. Some blogs make this easier than others. In this post I cover some
things you can do to make your blog, and the posts upon it, easier for readers
and myself alike, to read and share with as many people as possible.

I'll cover four areas:

1. Tell a Story
1. Sign Your Work
1. Make It Easy to Read Future Posts
1. Provide Metadata

<h2><img src="/images/2018/noun_Book_1561008.svg" class="heading-icon" alt ="" /> Tell a Story</h2>

A story has a beginning, middle, and end. Blog posts benefit from this
structure too. The beginning sets the scene, and provides a shared starting
point for the main content of your post. When a post just dives straight into
the details without context it can be hard to follow the topic,
the background, and the motivations behind the work.

Once you've set the scene in your introduction, you can dig into the details
knowing your readers are on the same page, and more likely to follow along. This
is where the bulk of your post is written.

At the end of your post wrap up with a conclusion. This may include a
summary, details of future work, or unsolved problems.

<h2><img src="/images/2018/noun_write_1560855.svg" class="heading-icon" alt ="" /> Sign Your Work</h2>

Writing a post takes time and effort. You can be proud of that and sign your
work! I'm aware that some people prefer not to use their real names online. A
pseudonym, or handle, work well too. When posting to Read Rust it's important to
me to attribute the article to the original author. When there is no
information on a post it's hard to work out how to credit the post.

<h2><img src="/images/2018/noun_Transmitter_1560979.svg" class="heading-icon" alt ="" /> Make It Easy to Read Future Posts</h2>

If you've written an interesting post that readers have enjoyed, often they
will want to read future posts that you write. You can make this easy using an
RSS feed. Pretty much all blogging software supports RSS. If you aren't already
generating a feed I highly recommended adding one.

If you already have an RSS feed on your blog ensure it's easily discoverable by
linking it. Perhaps in the header, footer, sidebar, or about page. Additionally
include a `<link rel="alternate">` tag in the `<head>` of your HTML to make the
feed automatically discoverable by feed readers. MDN have a great tutorial series
about RSS covering these details: [Syndicating content with RSS][rss].

When looking for posts for Read Rust it would be impractical for me to manually
visit the websites of every interesting blog to see if there are new posts.
RSS lets me subscribe to blogs in my feed reader of choice ([Feedbin]),
allowing me and other readers to discover, and read your new posts all in one
place.

<h2><img src="/images/2018/noun_Tag_1560911.svg" class="heading-icon" alt ="" /> Provide Metadata</h2>

There are actually two audiences for your content: humans and machines.  The
humans are the readers, the machines are computers such as [search engine
indexers][ddg], [web archivers][archive], and the Read Rust tools! Ideally your
content should be easy for both to read.

The [add-url tool in the Read Rust codebase][add-url] looks for a number
of pieces of metadata in order to fill in the details that are included
in the entry for every post:

* **Title** in a `<title>` tag.
* **Author Name** in a `<meta name="author" …>` tag.
* **Author URL** in a `<link rel="author" …>` tag.
* **Date Published** in a `<time>` tag, typically nested within an `<article>` tag.
* **Post Summary** (excerpt) in a `<meta name="description" …>` tag.

The tool looks for these in the post itself, as well as in the RSS
feed if found. Often it still turns up empty. You can help your
content be more machine readable by including this metadata in your
HTML. The example below shows all of these properties in use.

```language-html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1.0" />
  <title>Post Title</title>
  <meta name="description" content="The design and operation of the little Rust content aggregator I built.">
  <meta name="author" content="Wesley Moore">
  <link rel="alternate" href="http://www.wezm.net/feed/" type="application/atom+xml" title="WezM.net - All Articles" />
  <link rel="author" href="http://www.wezm.net/" />
</head>
<body>
  <!-- header, nav, etc. -->

  <main>
    <article>
      <h1>Post Title</h1>
      <time datetime="2018-06-03T07:34">03 June 2018</time>

      <!-- post content -->
    </article>
  </main>

  <!-- footer, etc. -->
</body>
</html>
```

So that's it. Four things you can do to help make your blog more readable,
attributable, and discoverable. Your readers, human and machine will thank you.

With thanks to Gregor Cresnar from the Noun Project for the icons used in this post:

* [Book](https://thenounproject.com/search/?q=book&collection=46510&i=1561008#)
* [Tag](https://thenounproject.com/search/?q=tag&collection=46510&i=1560911#)
* [Transmitter](https://thenounproject.com/search/?q=signal&collection=46510&i=1560979#)
* [Write](https://thenounproject.com/search/?q=write&collection=46510&i=1560855#)

[Feedbin]: http://feedbin.com/
[add-url]: https://github.com/wezm/read-rust/blob/d41672caaa269fc7f4584e5db2154bd9b3bd3c92/src/bin/add-url.rs
[Read Rust]: https://readrust.net/
[ddg]: https://duckduckgo.com/
[archive]: https://web.archive.org/
[rss]: https://developer.mozilla.org/en-US/docs/Web/RSS/Getting_Started
