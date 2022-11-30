+++
title = "Burning 2.5Tb of Bandwidth Hosting a Nitter Instance"
date = 2021-08-26T09:10:54+10:00

#[extra]
#updated = 2021-05-15T10:15:08+10:00
+++

On 24 August I received an email from [Vultr] saying that my server had used 78%
of its 3Tb bandwidth allocation for the month. This was surprising as last time
I looked I only used a small fraction of this allocation across the various
[things I host][alpine-docker].

After some investigation I noticed that the [Nitter] instance I [set up six
months ago][nitter-instance] at `nitter.decentralised.social` seemed to be
getting a lot of traffic. In particular it seemed that there were several
crawlers including Googlebot and bingbot attempting to index the whole site and
all its media.

<!-- more -->

Nitter is an alternate UI for Twitter that is simpler, faster, and free of
tracking. I mainly set it up so that I could share Twitter links with my
friends, without them having to visit Twitter proper. It's obvious in hindsight
but a Nitter instance is basically a proxy for the entirety of Twitter so any
bots that start crawling it are basically trying to suck all of Twitter through
my little server.

Nitter doesn't have a `robots.txt` by default so the first thing I did was fork
it and [add one that blocked all robots][robots.txt]. Unsurprisingly this
didn't have an immediate impact and I was concerned that if the traffic kept up
I'd hit my bandwidth limit and start having to pay per Gb thereafter.

I concluded the best option for now was to block most traffic to the instance
until I could work out what to do. Since [Varnish] fronts most of my web
traffic I used it to filter requests and return a very basic 404 page for all
but a handful of routes. A day later the impact of this change is obvious in
the usage graphs.

{{ figure(image="posts/2021/nitter-bandwidth/daily-bandwidth.png", link="posts/2021/nitter-bandwidth/daily-bandwidth.png", alt="Chart showing daily bytes sent and received for the last 30 days. The last day shows a significant drop", caption="Daily data sent and received for the last 30 days") }}

{{ figure(image="posts/2021/nitter-bandwidth/network-usage.png", link="posts/2021/nitter-bandwidth/network-usage.png", alt="Chart showing network activity for the last week with a significant drop in the last two days", caption="Network activity, last 7 days") }}

{{ figure(image="posts/2021/nitter-bandwidth/cpu-usage.png", link="posts/2021/nitter-bandwidth/cpu-usage.png", alt="Chart showing CPU usage for the last week with a significant drop in the last two days", caption="CPU usage, last 7 days") }}

After letting the changes sit overnight I was still seeing a lot of requests
from user-agents that appear to be Chinese bots of some sort. They almost
exactly matched the user-agents in this blog post: [Blocking aggressive Chinese
crawlers/scrapers/bots](https://www.johnlarge.co.uk/blocking-aggressive-chinese-crawlers-scrapers-bots/).

As a result I added some additional configuration to Varnish to block requests
from these user-agents, as they were clearly not honouring the `robots.txt` I
added:

```c
sub vcl_recv {
    if (req.http.user-agent ~ "(Mb2345Browser|LieBaoFast|OPPO A33|SemrushBot)") {
        return (synth(403, "User agent blocked due to excessive traffic."));
    }

    # rest of config here
}
```

### What Now?

I liked having the Nitter instance for sharing links but now I'm not sure how
to run it in a way that only proxies the things I'm sharing. I don't really
want to be responsible for all of the content posted to Twitter flowing through
my server. Perhaps there's a project idea lurking there, or perhaps I just make
my peace with linking to Twitter.

[alpine-docker]: https://www.wezm.net/technical/2019/02/alpine-linux-docker-infrastructure/
[Nitter]: https://github.com/zedeus/nitter
[nitter-instance]: https://decentralised.social/notice/A41E2cjuM14UYFAF7o
[robots.txt]: https://github.com/wezm/nitter/commit/4e7bd7b8853bf36008a3d1e79ee97deaa68743da
[Varnish]: https://varnish-cache.org/
[Vultr]: https://www.vultr.com/?ref=7903263
