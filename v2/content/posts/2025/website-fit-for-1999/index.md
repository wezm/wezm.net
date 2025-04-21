+++
title = "Building a Website Fit for 1999"
date = 2025-04-21T08:29:24+10:00

[extra]
updated = 2025-04-21T13:03:36+10:00
+++

Over the last week I've had a _lot_ of fun building a little retro-themed
website that I'm hosting at home. Inspired by [Ruben's Retro Corner][ruben]
I've been meaning to do this for a while, and actually started on it in June
last year. More recently Joel Humphries shared on [The Sizzle] forum that he'd
built [a little site][joel] that he was hosting at home on a Raspberry Pi. This
reignited my interest in getting my own site up again. For the fun of it I
decided to implement it in [HTML4] and serve it over plain HTTP so that it
would work on old computers.

{{ figure(image="posts/2025/website-fit-for-1999/nonsense-website-mac-os-8.png",
   link="posts/2025/website-fit-for-1999/nonsense-website-mac-os-8.png",
   alt="Screenshot of a Mac OS 8.1 desktop with a IE 4 window open showing Wes' Nonsense Website",
   caption="The site in IE 4.01 on Mac OS 8.1") }}

<!-- more -->

### Website on a Microcontroller?

Sticking with the retro theme I initially thought it might be fun to host the
site on an resource constrained device. So, on the first evening I put together
a simple page hosted on a RISC-V ESP32-C3 microcontroller using bare-metal Rust (with
the exception of some C libraries used for Wi-Fi support). This was fine, but
felt a little _too_ constrained, and there was some [non-ideal behaviour][edge-http]
of the http crate I used. Nonetheless I published [the code][esp32-website] to
my git forge.

{{ figure(image="posts/2025/website-fit-for-1999/esp32-c3.jpg",
   link="posts/2025/website-fit-for-1999/esp32-c3.jpg",
   width="350",
   resize_width=700,
   float="left",
   alt="Photo of a ESP32-C3 dev board sitting in red foam with a USB cable attached. A white LED on it is illuminated",
   caption="The ESP32 Rust powered web sever") }}

{{ figure(image="posts/2025/website-fit-for-1999/esp32-website.png",
   link="posts/2025/website-fit-for-1999/esp32-website.png",
   width="350",
   resize_width=700,
   float="right",
   alt="Screenshot of the web page hosted by the ESP32. Is includes basic information about the microcontroller and the internal temperature of the device.",
   caption="The ESP32 web page") }}

### The Best Server Is the Server You Already Have

The next version I threw together went back to basics. Digging up my website
building knowledge from university I constructed a two page site using HTML4,
complete with 88×31 buttons. Akin to my university website I hosted it on a ~wmoore path:

<http://home.wezm.net/~wmoore/>

This one was hosted by the [mini fanless Qotom computer][qotom] running
[Chimera Linux] already sitting on my desk. I wanted it to be _slightly_ more
interesting than just static HTML so I included `free` and `uptime` information
about the server on the home page:

{{ figure(image="posts/2025/website-fit-for-1999/untitled-website.png",
   link="posts/2025/website-fit-for-1999/untitled-website.png",
   width="655",
   border=1,
   alt="TODO",
   caption="TODO") }}

I used the [MiniJinja] CLI, [jaq], and [make] to regenerate the static HTML from templates,
funnelling the dynamic content into a JSON file.

```make
# minijinja-cli creates files with 600 perms, due to using a tempfile
# library to generate output. Fixed in main, but not released yet.
public/about.html: about.j2 data.json
	minijinja-cli $^ -o $@
	chmod 644 $@

public/index.html: index.j2 data.json
	minijinja-cli $^ -o $@
	chmod 644 $@

data.json: memory.json uptime.json generated.json
	cat $^ | jaq -s add > $@

memory.json:
	free -h | jaq -Rs '{memory: .}' > $@

uptime.json:
	uptime | jaq -Rs '{uptime: .}' > $@

generated.json:
	date | jaq -Rs '{generated: .}' > $@
```

To get the site online I made use of [Tailscale]. This allowed me to avoid
dealing with port forwarding on my Wi-Fi router, Dynamic DNS, and things like
that. The server hosting the page you are reading now (a VPS with
[Vultr]<sup>(affiliate link)</sup>) uses Nginx to reverse proxy to the
Tailscale IP of the Qotom server. Nginx on the Qotom serves the website. I set
up a cron job to run `make` and regenerate the dynamic content every 5 minutes.

<div style="text-align: center">

<pre style="color: #444; display: inline-block; text-align: left; font-size: 9pt; line-height: 1; margin: 0; padding: 0; overflow: initial">
            Internet

                │
                │
                │
     ┌─────────────────────┐
     │                     │
     │     Vultr Server    │
     │                     │
     │   ┌─────────────┐   │
     │   │    nginx    │   │
     │   └─────────────┘   │
     │        ┌──┐         │
     └────────│──│─────────┘
              │  │
              │  │ Tailscale
              │  │
┌───────────────────────────────┐
│             │  │              │
│    ┌────────│──│─────────┐    │
│    │        └──┘         │    │
│    │   ┌─────────────┐   │    │
│    │   │    nginx    │   │    │
│    │   └─────────────┘   │    │
│    │                     │    │
│    │       Qotom         │    │
│    │                     │    │
│    └─────────────────────┘    │
│                               │
│        Home Network           │
│        behind Router          │
│                               │
└───────────────────────────────┘
</pre>

</div>



### What if I Used CGI Instead?

This was fine, but I didn't like the idea that regenerating the site every five
minutes was causing unnecessary writes to the disk. It's just a cheap 32Gb
mSATA drive, and is the second one this machine has used over its lifetime.
For more retro nostalgia I thought it would be neat to generate the dynamic
content with [Common Gateway Interface][cgi] (CGI) scripts, served from `cgi‑bin` of
course.

I tinkered with this but in the end decided not to use actual CGI. Firstly,
Nginx doesn't support it, only FastCGI. Secondly it complicated development
as it required a dev server that supported CGI and static file hosting. The
best/closest option I found was [Lighttpd], but this all seemed harder than
it needed to be.

I fell back on the more modern approach of having web applications talk HTTP
directly behind a proxy. I put together a small [Rust] server with [Axum].
Sticking the with theme though, the dynamic pages are served on paths like
`cgi-bin/about.cgi`. In development the Rust binary serves the static files
and dynamic pages. In a release build it only serves dynamic content and
Nginx does the static files.

### The Joy of HTML4

Here's where the fun really began. I thoroughly enjoyed filling out the
pages on what was now known as "Wes' Nonsense Website"—nonsense in the
_extravagant foolishness or frivolity_ sense. It was genuinely fun to
write [about growing pineapples][pineapples], include pixelated GIF icons, and the
odd animated GIF.

Coding in HTML4 Transitional is somewhat freeing. CSS is great, but it's large
and sprawling. Throwing that away and sticking to only what you can achieve
with a comparatively small set of HTML tags and their attributes dramatically
reduces the scope of things. Also feels a bit cheeky to mix content and style
with wild abandon.

It wouldn't be the classic web without feeding your pages through the
[W3C Validator](https://validator.w3.org/). Amazingly the validator still
accepts and validates HTML4. The checks were useful for finding messed up
closing tags and other mistakes.

Now part of the reason to use HTML4 and serve the site over plain HTTP
is so that it has a chance of working on old computers. As I was building
the site I continually tested it in Internet Explorer 4.01 and Netscape
Navigator 3.01 running in Mac OS 8.1 in the [Basilisk II 68k emulator][BasiliskII].

{{ figure(image="posts/2025/website-fit-for-1999/netscape-and-ie.png",
   link="posts/2025/website-fit-for-1999/netscape-and-ie.png",
   alt="Screenshot of a Mac OS 8.1 desktop with a IE 4 and Netscape 3 windows showing Wes' Nonsense Website",
   caption="Testing in IE4 and Netscape 3") }}

These posed some unique challenges, mostly around text encoding. The content is
authored and served as UTF-8, but this was only supported by version 4 onwards
of IE and Netscape. To try to avoid issues, I initially stuck to the ASCII
subset of UTF-8 and used HTML entities for all characters outside this. Despite
my intentions I discovered that there were a number of [newly added
entities][entities] that were unsupported by the browsers I was testing on.
These included `&rsquo;` for &rsquo;, and `&sup1;` for &sup1;. Annoyingly, the
default encoding for HTML in the HTML4 era was ISO/IEC 8859-1 (aka Latin 1),
which [doesn't encode curly quotes][quotes] at all, unlike Mac Roman, which had
them in 1984.

The unknown entities were rendered as text like "Wesrsquo Nonsense", which was
not ideal. Since the version 4 browsers supported UTF-8 I switched to including
the desired characters directly. For &rsquo; this worked as desired in Netscape
4 and IE 4 (on Mac OS 8 at least). Neither of them handled ¹ properly though.
IE shows a normal 1, and Netscape a ?, For browsers that don't understand
UTF-8, like Netscape 3 most of the content is fine as it is just ASCII, but the
UTF-8 encoded chars come out using a Latin-1 rendition, such as "Wesâ\*™
Nonsense" for "Wes’ Nonsense". For a silly website, that's good enough.

Along with the static content I included some dynamic content. The [home page]
shows live energy information about the Qotom server. This is pulled from an
[Athom smart plug][athom] running [Tasmota] that the server is plugged into.
The Rust server refreshes this information every 10s. The [about page] shows
uptime and memory information, and [the Sunshine Coast page][sc] includes
climate and season information for the current month.

The primary drawback to sticking to HTML4 tags is that it somewhat implies
table based layouts, which are not responsive. Therefore the site isn't great
on smartphone sized screens. However, because it's only 640 pixels across it
does render respectably on a smartphone in landscape orientation.

### Deployment

Deployment is comprised of two parts:

1. The Rust binary
2. The rest of the content

The content is placed onto the server via a simple `git pull`. The Rust binary
is installed as an `apk` package. I am able to build this package on my Arch
Linux desktop and copy it over to the server to install. This is possible
because the Chimera Linux package tooling does all building in a sandbox and
doesn't require the host to be running Chimera. This is the package template:

```python
pkgname = "nonsense"
pkgver = "0.1.2_git20250420"
pkgrel = 0
_gitrev = "27dc77c"
build_style = "cargo"
hostmakedepends = ["cargo-auditable"]
makedepends = [
    "rust-std",
]
pkgdesc = "Nonsense web application"
license = "custom:none"
url = "https://forge.wezm.net/wezm/home.wezm.net"
source = f"https://forge.wezm.net/wezm/home.wezm.net/archive/{_gitrev}.tar.gz>nonsense-{pkgver}.tar.gz"
sha256 = "7bdbadb1e1f4b1fceadb7a8f3ccce3ec0b0a5b2d3b9e776e2d9dc13682d906c4"


def post_install(self):
    self.install_service(self.files_path / "nonsense")
```

Included in [the package][cport] is a [Dinit] service file that runs the binary
and provides process monitoring to restart it if it should exit for some
reason.

```dinit
type = process
command = /usr/bin/nonsense
working-dir = /home/wmoore/home.wezm.net
run-as = wmoore
env-file = nonsense.env
logfile = /var/log/nonsense.log
depends-on = local.target
smooth-recovery = true
```

For basic content updates I can do `git pull`, and then run `make` if the
changes are to static files or `doas dinitctl restart nonsense` if the dynamic
stuff has changed.

### What's Next

I still want to add more content on the [Computer] and [Calculator] pages, but
decided it was time to return to slightly less frivolous projects for a bit.
Finally, all [the code is published on my git forge][code], including the Nginx
virtual host configuration.

[Dinit]: https://davmac.org/projects/dinit/
[cport]: https://github.com/wezm/cports/blob/wezm/user/nonsense/template.py
[athom]: https://www.athom.tech/blank-1/au-plug
[quotes]: https://en.wikipedia.org/wiki/ISO/IEC_8859-1#Quotation_marks
[Chimera Linux]: https://chimera-linux.org/
[edge-http]: https://github.com/ivmarkov/edge-net/issues/62
[esp32-website]: https://forge.wezm.net/wezm/esp32-website
[jaq]: https://github.com/01mf02/jaq
[joel]: https://joelhumphries.com.au/
[make]: https://www.gnu.org/software/make/manual/make.html
[MiniJinja]: https://github.com/mitsuhiko/minijinja
[qotom]: https://qotom.net/product/29.html
[ruben]: http://retro.rubenerd.com/
[Tailscale]: https://tailscale.com/
[The Sizzle]: https://thesizzle.com.au/
[Vultr]: https://www.vultr.com/?ref=7903263
[Lighttpd]: https://www.lighttpd.net/
[Rust]: https://www.rust-lang.org/
[Axum]: https://github.com/tokio-rs/axum
[BasiliskII]: https://github.com/cebix/macemu
[Tasmota]: https://tasmota.github.io/docs/
[entities]: https://www.w3.org/TR/html401/sgml/entities.html#h-24.4
[sc]: http://home.wezm.net/~wmoore/cgi-bin/sunshinecoast.cgi
[Computer]: http://home.wezm.net/~wmoore/computers.html
[Calculator]: http://home.wezm.net/~wmoore/calculators.html
[code]: https://forge.wezm.net/wezm/home.wezm.net
[HTML4]: https://www.w3.org/TR/html401/cover.html
[cgi]: https://en.wikipedia.org/wiki/Common_Gateway_Interface
[pineapples]: http://home.wezm.net/~wmoore/pineapples.html
[home page]: http://home.wezm.net/~wmoore/
[about page]: http://home.wezm.net/~wmoore/cgi-bin/about.cgi
