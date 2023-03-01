+++
title = "Creating a Podcast From a Mastodon Account With XSLT"
date = 2023-03-01T18:33:33+10:00

#[extra]
#updated = 2023-01-11T21:11:28+10:00
+++

{% aside(title="Just want the feed?", float="right") %}
Here you go:<br>
[ATPrewind podcast feed](https://files.wezm.net/aptrewind.rss)
{% end %}

I recently discovered the [ATPrewind account on Mastodon][ATPrewind]. It's an account
sharing "gems discovered while re-listening to [@atpfm] from the very first
episode. By [@joshua]". ATP is a tech Podcast that's been running for about 10
years. Each post (so far) from ATPrewind includes a short clip from the show in the
form of a little video.

This post describes how I was nerd sniped into creating a podcast from the ATPrewind posts.

<!-- more -->

It all started when [I posted the following][my-post] on Mastodon:

> Ahh this ATP Rewind account is gold https://social.tupo.space/@ATPrewind
>
> Keep up the great work @joshua

[Kashyap replied][Kashyap]:

> Indeed! This should also be a podcast 🙃

This was a great idea and it got me thinking about how to do it with the least
amount of effort.

In this day and age I imagine many programmers would reach for
their favourite programming language and code up something to generate a
podcast feed (real podcasts are just RSS). Perhaps using the Mastodon API or
similar and then work out a way to host their program.

With [my recent experience with Deno Deploy][deno-deploy] fresh in my mind I
considered using it. However I opted for a decidedly late 90s solution: [XSLT].
According to Wikipedia "XSLT is a language originally designed for transforming
XML documents into other XML documents". The 'originally' refers to fact that
you can now generate any text with it, not just XML.
Since it was created in the era of "XML ALL THE THINGS", XSL templates are
themselves XML documents. It also makes extensive use of [XPath] expressions to
select nodes and extract their content.

### Creating a Podcast Feed

Every Mastodon account has an RSS feed so I created an XSL template to process
the ATPrewind RSS feed and add the missing elements required to turn it into a
valid podcast feed. With some help from [this Dr. Drang][drdrang] post this is
what I came up with:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:media="http://search.yahoo.com/mrss/">

<xsl:output method="xml" encoding="utf-8" indent="yes"/>

<!-- First, get everything. -->
<xsl:template match="node() | @*">
   <xsl:copy>
       <xsl:apply-templates select="node() | @*"/>
   </xsl:copy>
</xsl:template>

<!-- Update items to include title and enclosure elements. -->
<xsl:template match="/rss/channel/item">
   <item>
     <xsl:apply-templates select="node()" />
     <title>Post on <xsl:value-of select="pubDate"/></title>
     <enclosure url="{media:content/@url}" length="{media:content/@fileSize}" type="audio/mp4; codecs=&quot;mp4a.40.2&quot;" />
  </item>
</xsl:template>

</xsl:stylesheet>
```

XML noise aside this document should be fairly self explanatory. It copies all
nodes from the source RSS feed, then processes each `item` element. To each one
it adds a `title` element derived from the text "Post on" and the publication
date of the post, and an `enclosure` element derived from the `media:content`
element.

I lie a bit by saying that the enclosure MIME type is `audio/mp4;
codecs="mp4a.40.2"`. I.e. AAC-LC in MP4 container for the video in each post.
Running `curl -L https://social.tupo.space/@ATPrewind.rss | xsltproc
podcast.xsl` produces the podcast feed.

It took a few tries to get it to work but eventually I was able to convince
[Overcast] that it was a real podcast. One trick that I'm exploiting here is
that the MP4 container for video and audio is the same, the audio only version
is just lacking the video stream. I figured that podcast players might still be
able to play the video and at least for Overcast it works:

{{ figure(image="posts/2023/xslt-podcast/overcast-screenshot.png", link="posts/2023/xslt-podcast/overcast-screenshot.png", alt="Screenshot of Overcast showing the podcast 'episodes'.", caption="Screenshot of Overcast showing the 'episodes'.", width=393) }}


### Deployment

To deploy this contraption I created a Docker image with `curl` and `libxslt`
installed:

```dockerfile
FROM wezm-alpine:3.17.2

# UID needs to match owner of /home/rss/feeds volume
ARG PUID=1000
ARG PGID=1000
ARG USER=rss

RUN addgroup -g ${PGID} ${USER} && \
    adduser -D -u ${PUID} -G ${USER} -h /home/${USER} -D ${USER}

RUN apk --update add curl libxslt

COPY ./entrypoint.sh /home/${USER}/entrypoint.sh
COPY ./podcast.xsl /home/${USER}/podcast.xsl

WORKDIR /home/${USER}

USER ${USER}

VOLUME ["/home/rss/feeds"]
ENTRYPOINT ["./entrypoint.sh"]
```

I made a small script as the entrypoint to the container:

```sh
#!/bin/sh

set -e

trap 'exit' TERM INT

while true; do
  curl -L https://social.tupo.space/@ATPrewind.rss | xsltproc podcast.xsl - > /home/rss/feeds/atprewind.rss
  sleep 3600 # 1 hour
done
```

It regenerates the podcast feed each hour. I bind mount the directory for
files.wezm.net into the container in my Docker Compose config, which takes
advantage of the fact that nginx is already serving that directory.

Some may argue that the Docker part of this is not in the spirit of, "least
amount of effort", but I already have all this set up on my server so adding
one more container is very little effort. I've written previously about [my
Alpine Linux server][server] if you'd like to read more.

Once I pushed the Docker image the podcast was live. The URL is:<br>
<https://files.wezm.net/aptrewind.rss> if you'd like to subscribe.

### Future Work

I whipped all this up before work today and made an assumption that might not
always hold: there is a single video media attachment on each post. So far
that's true but I should update the XSL template to only try to generate an
`enclosure` element if the attachment is present. It would also be a good idea
to filter for audio and video only in case a post appears with images.

For now I shall eagerly look forward to the next post appearing in Overcast.

[@atpfm]: https://mastodon.social/@atpfm
[@joshua]: https://social.tupo.space/@joshua
[ATPrewind]: https://social.tupo.space/@ATPrewind
[Overcast]: https://overcast.fm/
[XPath]: https://www.w3.org/TR/xpath-31/
[XSLT]: https://www.w3.org/TR/xslt-30/
[deno-deploy]: https://www.youtube.com/watch?v=d-tsfUVg4II
[drdrang]: https://leancrew.com/all-this/2022/08/filtering-my-rss-reading/
[server]: https://www.wezm.net/technical/2019/02/alpine-linux-docker-infrastructure/
[my-post]: https://mastodon.decentralised.social/@wezm/109940341596949214
[Kashyap]: https://mastodon.social/@kgrz/109942702497796855
