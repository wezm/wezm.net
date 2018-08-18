To date I've posted 718 posts to [Read Rust]. I can't profess to having read
every single one but I have skimmed them all and have definitely extracted
the information required to post them to the site. Some blogs make this
easier than others. In this post I cover some things you can do to make your
blog and the posts upon it easier for readers and myself alike.

I'll cover four areas:

1. Tell a Story
1. Sign Your Work
1. Make It Easy to Read Future Posts
1. Provide Meta Data

## Tell a Story

A story has a beginning, middle, and end. Blog posts can benefit from this
structure too. The beginning sets the scene, and provides a shared starting
point for the main content of your post. When a post just dives straight into
the details, without context it can be hard to work out what the topic is,
what background there is, or what the motivations behind the work are.

Once you've set the scene in your introduction you can dive into the
details knowing your readers are on the same page. This is where the
bulk of your post is written.

At the end of your post wrap up with a conclusion. This may include a
summary, details of future work, or unsolved problems.

## Sign Your Work

Writing a post takes time and effort. You can be proud of that and sign your
work! Be it with your real name, a pseudonym, or handle. When posting to
ReadRust it's important to me to attribute the article to the original author.
I'm aware that some people prefer not to use their real names online and that's
totally ok. When there is no name, a pseudonym, or handle on a blog it is hard
to work out how to credit the author.

## Make It Easy to Read Future Posts

So you've written an interesting post that readers have enjoyed, often
they will be interested in reading future posts that you write. You can
make this easy.

When
looking for posts for Read Rust it would be impractical for me to
manually visit the websites of every interesting blog to see if there
are new posts. That's where [RSS] comes in. RSS lets my subscribe to
your blog in my feed reader of choice and then it will check for new
posts on the sites I follow, allowing me to read them all in one place.

Pretty much all blogging software supports RSS. If you aren't already
generating a feed I highly recommended adding one.

If you already have an RSS on your blog ensure it's easily discoverable by
including a link to it on your blog, perhaps in the header, footer, sidebar, or
about page. Additionally include a `<link>` tag on the `<head>` of you HTML to
make the feed automatically discoverable.

## Provide Meta Data

There are actually two audiences for your content: humans and machines.
The humans are the readers, the machines are computers such as search
engine indexers, Web Archives, the Read Rust tools! Ideally your content
should be easy for both to read.

The [add-url tool in the Read Rust codebase][add-url] looks for a number
of pieces of metadata in order to fill in the details that are included
in the entry for every post:

* **Title** in a `<title>` tag.
* **Author Name** in a `<meta name="author"` tag.
* **Author URL** in a `<link rel="author"` tag.
* **Date Published** in a `<time>` tag, typically nested within an `<article>` tag.
* **Post Summary** (excerpt) in a `<meta name="description"` tag.

The tool looks for these in the post itself, as well as in the RSS
feed if found. Often it still turns up empty. You can help your
content be more machine readable by including this meta data in your
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


[add-url]: https://github.com/wezm/read-rust/blob/d41672caaa269fc7f4584e5db2154bd9b3bd3c92/src/bin/add-url.rs
[Read Rust]: https://readrust.net/
