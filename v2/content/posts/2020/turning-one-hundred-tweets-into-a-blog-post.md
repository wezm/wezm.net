+++
title = "Turning One Hundred Tweets Into a Blog Post"
date = 2020-11-03T11:40:00+11:00

[extra]
#updated = 2020-06-19T09:30:00+10:00
+++

Near the conclusion of my [#100binaries] Twitter series I started working on
[the blog post that contained all the tweets](@/posts/2020/100-rust-binaries/index.md).
It ended up posing a number of interesting challenges and design decisions, as
well as a couple of Rust binaries. Whilst I don't think the process was
necessary optimal I thought I'd share the process to show my approach to
solving the problem. Perhaps the tools used and approach taken is
interesting to others.

<!-- more -->

My initial plan was to use Twitter embeds. Given a tweet URL it's relatively
easy to turn it into some HTML markup. By including Twitter's embed JavaScript
on the page the markup turns into rich Twitter embed. However there were a few
things I didn't like about this option:

* The page was going to end up massive, even split across a couple of pages
  because the Twitter JS was loading all the images for each tweet up front.
* I didn't like relying on JavaScript for the page to render media.
* I didn't really want to include Twitter's JavaScript (it's likely it would be
  blocked by visitors with an ad blocker anyway).

So I decided I'd render the content myself. I also decided that I'd host the
original screenshots and videos instead of saving them from the tweets. This
was relatively time consuming as they were across a couple of computers and
not named well but I found them all in the end.

To ensure the page wasn't enormous I used the [`loading="lazy"`][lazy-loading]
attribute on images. This is a relatively new attribute that tells the browser
to delay loading of images until they're within some threshold of the
view port. It currently works in Firefox and Chrome.

I used `preload="none"` on videos to ensure video data was only loaded if the
visitor attempted to play it.

To prevent the blog post from being too long/heavy I split it across two pages.

### Collecting All the Tweet URLs

With the plan in mind the first step was getting the full list of tweets. For
better or worse I decided to avoid using any of Twitter's APIs that require
authentication. Instead I turned to [nitter] (an alternative Twitter
front-end) for its simple markup and JS free rendering.

For each page of [search results for '#100binaries from:@wezm'][search] I ran
the following in the JS Console in Firefox:

```javascript
tweets = []
document.querySelectorAll('.tweet-date a').forEach(a => tweets.push(a.href))
copy(tweets.join("\n"))
```

and pasted the result into [tweets.txt] in Neovim.

When all pages had be processed I turned the nitter.net URLs in to twitter.com URLs:
`:%s/nitter\.net/twitter.com/`.

This tells Neovim: for every line (`%`) substitute (`s`) `nitter.net` with `twitter.com`.

### Turning Tweet URLs Into Tweet Content

Now I needed to turn the tweet URLs into tweet content. In hindsight it may
have been better to use [Twitter's GET statuses/show/:id][get-status] API to do
this (possibly via [twurl]) but that is not what I did. Onwards!

I used the unauthenticated [oEmbed API][oembed] to get some markup for each
tweet. `xargs` was used to take a line from `tweets.txt` and make the API
(HTTP) request with `curl`]

```
xargs -I '{url}' -a tweets.txt -n 1 curl https://api.twitter.com/1/statuses/oembed.json\?omit_script\=true\&dnt\=true\&lang\=en\&url\=\{url\} > tweets.json
```

This tells `xargs` to replace occurrences of `{url}` in the command with a line
(`-n 1`) read from `tweets.txt` (`-a tweets.txt`).

The result of one of these API requests is JSON like this (formatted with
[`jq`][jq] for readability):

```json
{
  "url": "https://twitter.com/wezm/status/1322855912076386304",
  "author_name": "Wesley Moore",
  "author_url": "https://twitter.com/wezm",
  "html": "<blockquote class=\"twitter-tweet\" data-lang=\"en\" data-dnt=\"true\"><p lang=\"en\" dir=\"ltr\">Day 100 of <a href=\"https://twitter.com/hashtag/100binaries?src=hash&amp;ref_src=twsrc%5Etfw\">#100binaries</a><br><br>Today I&#39;m featuring the Rust compiler — the binary that made the previous 99 fast, efficient, user-friendly, easy-to-build, and reliable binaries possible.<br><br>Thanks to all the people that have worked on it past, present, and future. <a href=\"https://t.co/aBEdLE87eq\">https://t.co/aBEdLE87eq</a> <a href=\"https://t.co/jzyJtIMGn1\">pic.twitter.com/jzyJtIMGn1</a></p>&mdash; Wesley Moore (@wezm) <a href=\"https://twitter.com/wezm/status/1322855912076386304?ref_src=twsrc%5Etfw\">November 1, 2020</a></blockquote>\n",
  "width": 550,
  "height": null,
  "type": "rich",
  "cache_age": "3153600000",
  "provider_name": "Twitter",
  "provider_url": "https://twitter.com",
  "version": "1.0"
}
```

The output from `xargs` is lots of these JSON objects all concatenated
together. I needed to turn [tweets.json] into an array of objects to make it
valid JSON. I opened up the file in Neovim and:

* Added commas between the JSON objects: `%s/}{/},\r{/g`.
  * This is, substitute `}{` with `},{` and a newline (`\r`), multiple times (`/g`).
* Added `[` and `]` to start and end of the file.

I then reversed the order of the objects and formatted the document with `jq` (from within Neovim): `%!jq '.|reverse' -`.

This filters the whole file though a command (`%!`). The command is `jq` and it
filters the entire document `.`, read from stdin (`-`), through the `reverse`
filter to reverse the order of the array. `jq` automatically pretty prints.

It would have been better to have reversed `tweets.txt` but I didn't
realise they were in reverse chronological ordering until this point and
doing it this way avoided making another 100 HTTP requests.

### Rendering tweets.json

I created a custom [Zola shortcode][shortcode], [tweet_list] that reads
`tweets.json` and renders each item in an ordered list. It evolved over time as
I kept adding more information to the JSON file. It allowed me to see how
the blog post looked as I implemented the following improvements.

### Expanding t.co Links

{% aside(title="You used Rust for this!?", float="right") %}
This is the sort of thing that would be well suited to a scripting language
too.  These days I tend to reach for Rust, even for little tasks like this.
It's what I'm most familiar with nowadays and I can mostly write a "script"
like this off the cuff with little need to refer to API docs.
{% end %}

The markup Twitter returns is full of `t.co` redirect links. I wanted to avoid
sending my visitors through the Twitter redirect so I needed to expand these
links to their target. I whipped up a little Rust program to do this:
[expand-t-co]. It finds all `t.co` links with a regex
(`https://t\.co/[a-zA-Z0-9]+`) and replaces each occurrence with the target
of the link.

The target URL is determined by making making a HTTP HEAD request for the
`t.co` URL and noting the value of the `Location` header. The tool
caches the result in a `HashMap` to avoid repeating a request for
the same `t.co` URL if it's encountered again.

I used  the [ureq] crate to make the HTTP requests. Arguably it would have been
better to use an async client so that more requests were made in parallel but
that was added complexity I didn't want to deal with for a mostly one-off
program.

### Adding the Media

At this point I did a lot of manual work to find all the screenshots and videos
that I shared in the tweets and [added them to my blog][media-files]. I also
renamed them after the tool they depicted. As part of this process I noted the
source of media files that I didn't create in a `"media_source"` key in
`tweets.json` so that I could attribute them. I also added a `"media"` key with
the name of the media file for each binary.

Some of the externally sourced images were animated GIFs, which lack
playback controls and are very inefficient file size wise. Whenever I encountered an
animated GIF I converted it to an MP4 with `ffmpeg`, resulting in large space savings:

```
ffmpeg -i ~/Downloads/so.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" so.mp4
```

This converts `so.gif` to `so.mp4` and ensures the dimensions are a divisible
by 2, which is apparently a requirement of H.264 streams encapsulated in MP4. I
worked out how to do this from: <https://unix.stackexchange.com/a/294892/5444>

I also wanted to know the media dimensions for each file so that I could have them
scaled properly on the page — most images are HiDPI and need to be presented at
half their pixel width to appear the right size.

For this I used `ffprobe`, which is part of `ffmpeg`. I originally planned to
use another tool to handle images (as opposed to videos) but it turns out
`ffprobe` handles them too.

Since I wanted to update the values of JSON objects in `tweets.json` I opted to
parse the JSON this time. Again I whipped up a little Rust "script":
[add-media-dimensions]. It parses `tweets.json` and for each object in the
array runs `ffprobe` on the media file, like this:

```
ffprobe -v quiet -print_format json -show_format -show_streams file.mp4
```

I learned how to do this from: <https://stackoverflow.com/a/11236144/38820>

With this invocation `ffprobe` produces JSON so `add-media-dimensions` also
parses that and adds the width and height values to `tweets.json`. At the end
the updated JSON document is printed to stdout. This turned out to be a handy
sanity check as it detected a couple of copy/paste errors and typos in the
manually added `"media"` values.

### Cleaning Up pic.twitter.com Links

The oEmbed markup that Twitter returns includes links for each piece of media. Now that
I'm handling that myself these can be deleted. Neovim is used for this:

```
:%s/ <a href=\\"https:\/\/twitter\.com[^"]\+\(photo\|video\)[^"]\+">pic.twitter.com[^<]\+<\/a>//
```

For each line of the file (`%`) substitute (`s`) matches with nothing. And that
took care of them. Yes I'm matching HTML with a regex, no you shouldn't do this
for something that's part of a program. For one-off text editing it's fine
though, especially since you can eyeball the differences with `git diff`, or in
my case `tig status`.

### Adding a HiDPI Flag

I initially tried using a heuristic in `tweet_list` to determine if a media
file was HiDPI or not but there were a few exceptions to the rule. I decided to
add a `"hidpi"` value to the JSON to indicate if it was HiDPI media or not. A
bit of trial and error with [jq] led to this:

```
jq 'map(. + if .width > 776 then {hidpi: true} else {hidpi:false} end)' tweets.json > tweets-hidpi.json
```

If the image is greater then 776 pixels wide then set the `hidpi` property to
`true`, otherwise `false`. 776 was picked via visual inspection of the rendered
page. Once satisfied with the result I examined the rendered result and flipped
the `hidpi` value on some items where the heuristic was wrong.

### Adding alt Text

[Di], ever my good conscience when it comes to such things enquired at one
point if I'd added `alt` text to the images. I was on the fence since the
images were mostly there to show what the tools looked like — I didn't think
they were really essential content — but she made a good argument for including
some `alt` text even if it was fairly simplistic.

I turned to `jq` again to add a basic `"media_description"` to the JSON,
which `tweet_list` would include as `alt` text:

```
jq 'map(. + {media_description: ("Screenshot of " + (.media // "????" | sub(".(png|gif|mp4|jpg)$"; "")) + " running in a terminal.")})' tweets.json > tweets-alt.json
```

For each object in the JSON array it adds a `media_description` key with a
value derived from the `media` key (the file name with the extension removed).
If the object doesn't have a `media` value then it is defaulted to "????"
(`.media // "????"`).

After these initial descriptions were added I went though the rendered page and
updated the text of items where the description was incorrect or inadequate.

### Video Poster Images

As it stood all the videos were just white boxes with playback controls since I
has used `preload="none"` to limit the data usage of the page. I decided to pay
the cost of the larger page weight and add poster images to each of the videos.
I used `ffmpeg` to extract the first frame of each video as a PNG:

```
for m in *.mp4; do ffmpeg -i $m -vf "select=1" -vframes 1 $m.png; done
```

I learned how to do this from: <https://superuser.com/a/1010108>

I then converted the PNGs to JPEGs for smaller files. I could have generated
JPEGs directly from `ffmpeg` but I didn't know how to control the quality — I
wanted a relatively low quality for smaller files.

```
for f in *.mp4.png; do convert "$f" -quality 60 $f.jpg ; done
```

This produced files named `filename.mp4.png.jpg`. I'm yet to memorise how to
manipulate file extensions in `zsh`, despite having [been told how to do
it][zsh-ext], so I did a follow up step to rename them:

```
for f in *.mp4; do mv $f.png.jpg $f.jpg ; done
```

### Wrapping Up

Lastly I ran [`pngcrush`][pngcrush] on all of the PNGs. It reliably reduces the file size
in a lossless manner:

```
for f in *.png; do pngcrush -reduce -ow $f; done
```

With that I did some styling tweaks, added a little commentary and published
[the page](@/posts/2020/100-rust-binaries/index.md).

If you made it this far, thanks for sticking with it to the end. I'm not sure
how interesting or useful this post is but if you liked it let me know and I
might do more like it in the future.

[#100binaries]: https://twitter.com/search?q=%23100binaries%20from%3A%40wezm&src=typed_query&f=live
[nitter]: https://nitter.net/about
[search]: https://nitter.net/search?f=tweets&q=%23100binaries+from%3A%40wezm
[tweets.txt]: https://github.com/wezm/wezm.net/blob/master/v2/content/posts/2020/100-rust-binaries/tweets.txt
[tweets.json]: https://github.com/wezm/wezm.net/blob/master/v2/content/posts/2020/100-rust-binaries/tweets.json
[get-status]: https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-show-id
[twurl]: https://github.com/twitter/twurl
[oembed]: https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-oembed
[jq]: https://stedolan.github.io/jq/
[expand-t-co]: https://github.com/wezm/expand-t-co
[media-files]: https://github.com/wezm/wezm.net/tree/master/v2/content/posts/2020/100-rust-binaries
[add-media-dimensions]: https://github.com/wezm/add-media-dimensions
[shortcode]: https://www.getzola.org/documentation/content/shortcodes/
[tweet_list]: https://github.com/wezm/wezm.net/blob/master/v2/templates/shortcodes/tweet_list.html
[Di]: https://didoesdigital.com/
[zsh-ext]: https://twitter.com/Sasha_Boyd/status/1300666988608454656
[ureq]: https://github.com/algesten/ureq
[lazy-loading]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading
[pngcrush]: https://pmt.sourceforge.io/pngcrush/index.html
