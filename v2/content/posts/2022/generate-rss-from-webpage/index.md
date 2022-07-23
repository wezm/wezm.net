+++
title = "Generating RSS Feeds From Web Pages With RSS Please"
date = 2022-07-04T09:54:29+10:00

[extra]
updated = 2022-07-24T09:28:15+10:00
+++

Sometimes I come across a web page that I'd like to revisit when there's
new content. Typically, I do this by subscribing to the [RSS feed][feed] in
[Feedbin]. Unfortunately some sites don't provide an RSS feed, which is why I
built [RSS Please][rsspls] (`rsspls`). RSS Please allows you to generate an RSS
feed by extracting specific parts of a web page. In this post I give a bit of
background on the tool and how I'm running it in my Docker infrastructure.

<!-- more -->

### Background

Sometimes an RSS feed isn't available on a website. If the site is open source
I will often try to [open a PR to add or enable one][rss-pr]. That's not always
possible though. Other times the page may be one that the author wouldn't
naturally think to provide a feed for, but one would still be useful.

As an example, when we were looking to buy a house I noticed that listings
would often go live on agent's websites several days or more before they were
published to the big aggregators. The market was very competitive so I was
regularly visiting all the real estate agent websites to run my search, and
check for new listings. At the time I used [Feedfry] to create RSS feeds from
the search results. I could then subscribe to them in [Feedbin]. Paired with
the [Feedbin Notifier app][notifier] I received a notification on my phone
whenever there was a new listing matching my search criteria.

Feedfry is free with ads or paid subscription. I paid while house shopping but
let that lapse afterwards. I don't begrudge them funding the service with ads or
subscriptions but I figured I could probably put something together and
self-host it. At the same time providing a bit more control over how the
elements of the page were extracted to generate the feed. [RSS Please][rsspls]
is the result.

RSS Please is an open-source command line application implemented in Rust. It
has no runtime dependencies and runs on UNIX-like platforms including FreeBSD,
Linux, and macOS. Once I resolve [this issue][windows-issue] it will run on
Windows too. The following sections describe how it's configured and how I'm
running it on my server.

### Configuration

The `rsspls` configuration file allows a number of feeds to be defined. It
uses [CSS Selectors][css] to describe how parts of each page will be extracted
to produce a feed. As an example here's a configuration that builds a feed
from this site—although I already have an RSS feed at
<https://www.wezm.net/v2/rss.xml> if you want to subscribe.

```toml
# The configuration must start with the [rsspls] section
[rsspls]
output = "/tmp"

[[feed]]
# The title of the channel in the feed
title = "Example WezM.net Feed"
# The output filename within the output directory to write this feed to.
filename = "wezm.rss"

[feed.config]
url = "https://www.wezm.net/"
item = "article"
heading = "h3 a"
summary = ".post-body"
date = "time"
```

The configuration format is [TOML]. The `item` key selects `article` elements
from the page. `heading`, `summary`, and `date` are selectors upon the element
selected by `item`. `summary` and `date` are optional. `heading` is expected to
select an element with a `href` attribute, which is used as the link for the
item in the feed.

### Running It

Once installed running `rsspls` will update the configured feeds. Caching is
used to skip updates when the origin server indicates nothing has changed since
last time. By default `rsspls` looks for its configuration file in
`$XDG_CONFIG_HOME/rsspls/feeds.toml`, defaulting to
`~/.config/rsspls/feeds.toml` if `XDG_CONFIG_HOME` is not set. Alternatively
the path can be supplied with `--config`.

{{ figure(image="posts/2022/generate-rss-from-webpage/rsspls-output.png", link="posts/2022/generate-rss-from-webpage/rsspls-output.png", alt="Screenshot of the output when running rsspls. It has several log messages prefixed with INFO describing the actions taken", caption="rsspls prints informational messages when updating feeds", width=335, border=false) }}

### Deployment

Since I
[host my things with Docker + Compose](@/posts/2022/alpine-linux-docker-infrastructure-three-years/index.md)
I'm running `rsspls` with Docker as well, but that's not required. There are
plenty of other ways you could go about it. E.g. you could have `cron` run
`rsspls` on your computer and `rsync` the feeds to a server. Some RSS aggregators
like [Liferea] even let you subscribe to local files.

I create a Docker image from the `rsspls` binaries I publish:

```dockerfile
FROM wezm-alpine:3.16.0

# UID needs to match owner of /home/rsspls/feeds volume
ARG PUID=1000
ARG PGID=1000
ARG USER=rsspls

RUN addgroup -g ${PGID} ${USER} && \
    adduser -D -u ${PUID} -G ${USER} -h /home/${USER} -D ${USER}

ARG RSSPLS_VERSION=0.2.0

RUN cd /usr/local/bin && \
    wget -O - https://releases.wezm.net/rsspls/${RSSPLS_VERSION}/rsspls-${RSSPLS_VERSION}-x86_64-unknown-linux-musl.tar.gz | tar zxf - && \
    mkdir /home/${USER}/feeds && \
    chown ${USER}:${USER} /home/${USER}/feeds

COPY ./entrypoint.sh /home/${USER}/entrypoint.sh

WORKDIR /home/${USER}

USER ${USER}

VOLUME ["/home/rsspls/feeds"]
ENTRYPOINT ["./entrypoint.sh"]
```

It uses my standard [Alpine] base image which is built from the "Mini root
filesystem" they publish and does not require any other packages to be
installed.

I use an entry point script to run `rsspls` every 12 hours:

```sh
#!/bin/sh

set -e

trap 'exit' TERM INT

while true; do
  rsspls --config /etc/rsspls.toml
  sleep 1036800 # 12 hours
done
```

In my `docker-compose.yml` I have the following:

```yaml
  rsspls:
    image: example.com/rsspls
    volumes:
      - ./rsspls/rsspls.toml:/etc/rsspls.toml:ro
      - ./volumes/www/rsspls.wezm.net:/home/rsspls/feeds
    restart: unless-stopped
```

The `./volumes/www/rsspls.wezm.net` path is shared with the container running `nginx`, so
the generated feeds are accessible at `rsspls.wezm.net`—although I'm not making them
obvious to visitors (there's no directory index so visiting that domain will just give
a 403 Forbidden error).

### Conclusion

This was a fun project to put together over a weekend. I get a lot of
satisfaction from building and self-hosting tools to solve my own problems. Not
everyone has the time or desire to do that though so if you're looking for
similar functionality check out [Feed43] and [Feedfry].

As mentioned the tool is open-source (MIT or Apache 2.0). Check out the repo at
<https://github.com/wezm/rsspls> and if you like what you see maybe give it a
star.


[Alpine]: https://alpinelinux.org/
[css]: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors
[Feed43]: https://feed43.com/
[feed]: https://en.wikipedia.org/wiki/RSS
[Feedbin]: https://feedbin.com/
[Feedfry]: https://feedfry.com/
[notifier]: https://feedbin.com/notifier
[rss-pr]: https://github.com/pulls?q=is%3Apr+author%3Awezm++rss+is%3Aclosed+
[rsspls]: https://github.com/wezm/rsspls
[windows-issue]: https://github.com/wezm/rsspls/issues/4
[TOML]: https://toml.io/
[Liferea]: http://lzone.de/liferea/
