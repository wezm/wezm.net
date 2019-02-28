For more than a decade I have run one or more servers to host a number of
personal websites and web applications. Recently I decided it was time to
rebuild the servers to address some issues and make improvements. The last time
I did this was in 2016 when I switched the servers from [Ubuntu] to [FreeBSD].
The outgoing servers were managed with [Ansible]. After being a Docker skeptic
for a long time I have finally come around to it recently and decided to
rebuild on [Docker]. This post aims to describe some of the choices made, and
why I made them.

_Before we start I'd like to take a moment to acknowledge this infrastructure
is built to my values in a way that works for me. You might make different
choices and that's ok. I hope you find this post interesting but not
prescriptive._

Before the rebuild this is what my infrastructure looked like:

- FreeBSD 11 server in [DigitalOcean] hosting:
  - [PostgreSQL] 9
  - [nginx]
  - [Varnish]
  - 2 [Rails] apps
  - Static sites
- Debian 9 server in DigitalOcean hosting:
  - Wizards [Mattermost] instance
- FreeBSD 12 server in [Vultr] hosting:
  - [rust.melbourne] Mattermost instance
  - PostgreSQL 11

You'll note 3 servers, across 2 countries, and 2 hosting providers. Also the
Rust Melbourne server was not managed by Ansible like the other two were.

I had a number of goals in mind with the rebuild:

- Move everything to Australia (where I live)
- Consolidate onto one server
- https enable all websites

I set up my original infrastructure in the US because it was cheaper at the
time and most traffic to the websites I host comes from the US. The Wizards
Mattermost instance was added later. It's for a group of friends that are all
in Australia. Being in the US made it quite slow at times, especially when
sharing and viewing images.

Another drawback to administering servers in the US from AU was that it makes
the Ansible cycle time of "make a change, run it, fix it, repeat", excruciatingly
slow. It had been on my to do list for a long time to move Wizards to Australia
but I kept putting it off because I didn't want to deal with Ansible.

While having a single server that does everything wouldn't be the
recommended architecture for business systems, for personal hosting where the
small chance of downtime isn't going to result in loss of income the simplicity
won out, at least for now.

This is what I ended up building. Each box is a Docker container running on the
host machine:

![Graph of services](/images/2019/services.svg)

- `pkb` is <https://linkedlist.org>
- `binary_trance` is <https://binarytrance.com>
- `wizards` and `rust_melbourne` are [Mattermost] instances
- The rest are software of the same name

I haven't always been in favour of Docker but I think enough time has passed to
show that it's probably here to stay. There are some really nice benefits to
Docker managed services too. Such as, building locally and then shipping the image
to production, and isolation from the host system (in the sense you can just
nuke the container and rebuild it if needed).

## Picking a Host OS

Moving to Docker unfortunately ruled out FreeBSD as the host system. There is a
[very old Docker port for FreeBSD][docker-freebsd] but my previous attempts at using it showed
that it was not in a good enough state to use for hosting. That meant I
needed to find a suitable Linux distro to act as the Docker host.

Coming from FreeBSD I'm a fan of the stable base + up-to-date packages model.
For me this ruled out Debian (stable) based systems, which I find often
have out-of-date or missing packages -- especially in the latter stages of
the release cycle. I did some research to see if there were any distros that
used a BSD style model. Most I found were either abandoned or one person
operations.

I then recalled that as part of his [Sourcehut] work, [Drew DeVault was
migrating][sr.ht-announce] things to [Alpine Linux]. I had played with Alpine
in the past (before it became famous in the Docker world), and I consider Drew's
use some evidence in its favour.

Alpine describes itself as follows:

> Alpine Linux is an independent, non-commercial, general purpose Linux
> distribution designed for power users who appreciate security, simplicity and
> resource efficiency.

Now that's a value statement I can get behind! Other things I like about Alpine
Linux:

- It's small, only including the bare essentials:
  - It avoids bloat by using [musl-libc] (which is MIT licensed) and
    [busybox userland][busybox].
  - It has a 37Mb installation ISO intended for virtualised server
    installations.
- It was likely to be (and ended up being) the base of my Docker images.
- It enables a number of security features by default.
- Releases are made every ~6 months and are supported for 2 years.

Each release also has binary packages available in a stable channel that
receives bug fixes and security updates for the lifetime of the release as well
as a rolling edge channel that's always up-to-date.

Note that Alpine Linux doesn't use [systemd], it uses [OpenRC]. This didn't
factor into my decision at all. `systemd` has worked well for me on my Arch
Linux systems. It may not be perfect but it does do a lot of things well. Benno
Rice did a great talk at linux.conf.au 2019, titled, [The Tragedy of
systemd][systemd-tragedy], that makes for interesting viewing on this topic.

## Building Images

So with the host OS selected I set about building Docker images for each of the
services I needed to run. There are a lot of pre-built Docker images for
software like nginx, and PostgreSQL available on [Docker Hub]. Often they also
have an `alpine` variant that builds the image from an Alpine base image. I
decided early on that these weren't really for me:

- A lot of them build the package from source instead of just installing the
  Alpine package.
- The Docker build was more complicated that I needed as it was trying to be
  a generic image that anyone could pull and use.
- I wasn't a huge fan of pulling random Docker images from the Internet, even
  if they were official images.

In the end I only need to trust one image from [Docker Hub]: The 5Mb [Alpine
image][alpine-docker-image]. All of my images are built on top of this one
image.

An aspect of Docker that I don't really like is that inside the container you
are root by default. When building my images I made a point of making the
entrypoint processes run as a non-privileged user or configure the service drop
down to a regular user after starting.

Most services were fairly easy to Dockerise. For example here is my nginx
`Dockerfile`:

```language-docker
FROM alpine:3.9

RUN apk update && apk add --no-cache nginx

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /usr/share/www/ /run/nginx/ && \
  rm /etc/nginx/conf.d/default.conf

EXPOSE 80

STOPSIGNAL SIGTERM

ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
```

I did not strive to make the images especially generic. They just need to work
for me. However I did make a point not to bake any credentials into the images
and instead used environment variables for things like that.

## Let's Encrypt

I've been avoiding [Let's Encrypt] up until now. Partly because the short expiry of the
certificates seems easy to mishandle. Partly because of [certbot], the recommended
client. By default `certbot` is interactive, prompting for answers when you run
it the first time, it wants to be installed alongside the webserver so it can
manipulate the configuration, it's over 30,000 lines of Python (excluding
tests, and dependencies), the documentation suggests running magical
`certbot-auto` scripts to install it... Too big and too magical for my liking.

Despite my reservations I wanted to enable https on all my sites and I wanted
to avoid paying for certificates. This meant I had to make Let's Encrypt work
for me. I did some research and finally settled on [acme.sh]. It's
written in POSIX shell and uses `curl` and `openssl` to do its bidding.

To avoid the need for `acme.sh` to manipulate the webserver config I opted to
use the DNS validation method (`certbot` can do this too). This requires a DNS
provider that has an API so the client can dynamically manipulate the records.
I looked through the large list of supported providers and settled on [LuaDNS].

LuaDNS has a nice git based workflow where you define the DNS zones with small
Lua scripts and the records are published when you push to the repo. They also
have the requisite API for `acme.sh`. You can see my DNS repo at:
<https://github.com/wezm/dns>

Getting the [acme.sh] + [hitch] combo to play nice proved to be bit of a
challenge. `acme.sh` needs to periodically renew certificates from Let's
Encrypt, these then need to be formatted for `hitch` and `hitch` told about
them.  In the end I built the `hitch` image off my `acme.sh` image. This goes
against the Docker ethos of one service per container but `acme.sh` doesn't run
a daemon, it's periodically invoked by cron so this seemed reasonable.

Docker and cron is also a challenge. I ended up solving that with a
simple solution: use the host cron to `docker exec` `acme.sh` in the `hitch`
container. Perhaps not "pure" Docker but a lot simpler than some of the options
I saw.

## Hosting

I've been a happy [DigitalOcean] customer for 5 years but they don't have a
data centre in Australia. [Vultr], which have a similar offering -- low cost,
high performance servers and a well-designed admin interface -- do have a
Sydney data centre. Other obvious options include AWS and GCP. I wanted to
avoid these where possible as their server offerings are more expensive, and
their platforms have a tendency to lock you in with platform specific features.
Also in the case of Google, they are a massive [surveillance capitalist] that I
don't trust at all. So Vultr were my host of choice for the new server.

Having said that, the thing with building your own images is that you need to
make them available to the Docker host somehow. For this I used an [Amazon
Elastic Container Registry][ECR]. It's much cheaper than Docker Hub for private
images and is just a standard container registry so I'm not locked in.

## Orchestration

Once all the services were Dockerised, there needed to be a way to run the
containers, and make them aware of each other. A popular option for this is
[Kubernetes] and for a larger, multi-server deployment it might be the right
choice. For my single server operation I opted for [Docker Compose], which is,
"a tool for defining and running multi-container Docker applications". With
Compose you specify all the services in a YAML file and it takes care of
running them all together.

My Docker Compose file looks like this:

```language-yaml
version: '3'
services:
  hitch:
    image: 791569612186.dkr.ecr.ap-southeast-2.amazonaws.com/hitch
    command: ["--config", "/etc/hitch/hitch.conf", "-b", "[varnish]:6086"]
    volumes:
      - ./hitch/hitch.conf:/etc/hitch/hitch.conf:ro
      - ./private/hitch/dhparams.pem:/etc/hitch/dhparams.pem:ro
      - certs:/etc/hitch/cert.d:rw
      - acme:/etc/acme.sh:rw
    ports:
      - "443:443"
    env_file:
      - private/hitch/development.env
    depends_on:
      - varnish
    restart: unless-stopped
  varnish:
    image: 791569612186.dkr.ecr.ap-southeast-2.amazonaws.com/varnish
    command: ["-F", "-a", ":80", "-a", ":6086,PROXY", "-p", "feature=+http2", "-f", "/etc/varnish/default.vcl", "-s", "malloc,256M"]
    volumes:
      - ./varnish/default.vcl:/etc/varnish/default.vcl:ro
    ports:
      - "80:80"
    depends_on:
      - nginx
      - pkb
      - binary_trance
      - wizards
      - rust_melbourne
    restart: unless-stopped
  nginx:
    image: 791569612186.dkr.ecr.ap-southeast-2.amazonaws.com/nginx
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./volumes/www:/usr/share/www:ro
    restart: unless-stopped
  pkb:
    image: 791569612186.dkr.ecr.ap-southeast-2.amazonaws.com/pkb
    volumes:
      - pages:/home/pkb/pages:ro
    env_file:
      - private/pkb/development.env
    depends_on:
      - syncthing
    restart: unless-stopped
  binary_trance:
    image: 791569612186.dkr.ecr.ap-southeast-2.amazonaws.com/binary_trance
    env_file:
      - private/binary_trance/development.env
    depends_on:
      - db
    restart: unless-stopped
  wizards:
    image: 791569612186.dkr.ecr.ap-southeast-2.amazonaws.com/mattermost
    volumes:
      - ./private/wizards/config:/mattermost/config:rw
      - ./volumes/wizards/data:/mattermost/data:rw
      - ./volumes/wizards/logs:/mattermost/logs:rw
      - ./volumes/wizards/plugins:/mattermost/plugins:rw
      - ./volumes/wizards/client-plugins:/mattermost/client/plugins:rw
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      - db
    restart: unless-stopped
  rust_melbourne:
    image: 791569612186.dkr.ecr.ap-southeast-2.amazonaws.com/mattermost
    volumes:
      - ./private/rust_melbourne/config:/mattermost/config:rw
      - ./volumes/rust_melbourne/data:/mattermost/data:rw
      - ./volumes/rust_melbourne/logs:/mattermost/logs:rw
      - ./volumes/rust_melbourne/plugins:/mattermost/plugins:rw
      - ./volumes/rust_melbourne/client-plugins:/mattermost/client/plugins:rw
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      - db
    restart: unless-stopped
  db:
    image: 791569612186.dkr.ecr.ap-southeast-2.amazonaws.com/postgresql
    volumes:
      - postgresql:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    env_file:
      - private/postgresql/development.env
    restart: unless-stopped
  syncthing:
    image: 791569612186.dkr.ecr.ap-southeast-2.amazonaws.com/syncthing
    volumes:
      - syncthing:/var/lib/syncthing:rw
      - pages:/var/lib/syncthing/Sync:rw
    ports:
      - "127.0.0.1:8384:8384"
      - "22000:22000"
      - "21027:21027/udp"
    restart: unless-stopped
volumes:
  postgresql:
  certs:
  acme:
  pages:
  syncthing:
```

Bringing all the services up is one command:

    docker-compose -f docker-compose.yml -f production.yml up -d

The best bit is I can develop and test it all in isolation locally. Then when
it's working, push to ECR and then run `docker-compose` on the server to bring
in the changes. This is a huge improvement over my previous Ansible workflow
and should make adding or removing new services in the future fairly painless.

## Closing Thoughts

The new server has been running issue free so far. All sites are now
redirecting to their https variants with `Strict-Transport-Security` headers
set and get an A grade on the [SSL Labs test]. The Wizards Mattermost is _much_
faster now that it's in Australia too.

There is one drawback to this move though: my sites are now slower for a lot of
visitors. https adds some initial negotiation overhead and if you're reading
this from outside Australia there's probably a bunch more latency than
before.

I did some testing with [WebPageTest] to get a feel for the impact of this.
My sites are already quite compact. Firefox tells me this page and all
resources is 171KB / 54KB transferred. So there's not a lot of slimming
to be done there. One thing I did notice was the TLS negotiation was happening
for each of the parallel connections the browser opened to load the site.

Some research suggested HTTP/2 might help as it multiplexes requests on a
single connection and only performs the TLS negotiation once. So I decided to
live on the edge a little and enable [Varnish's experimental HTTP/2
support][varnish-http2]. Retrieving the site over HTTP/2 did in fact reduce the
TLS negotiations to one.

Thanks for reading, I hope the bits didn't take too long to get from Australia
to wherever you are. Happy computing!

[acme.sh]: https://github.com/Neilpang/acme.sh
[Alpine Linux]: https://alpinelinux.org/
[alpine-docker-image]: https://hub.docker.com/_/alpine
[Ansible]: https://www.ansible.com/
[busybox]: https://www.busybox.net/
[certbot]: https://certbot.eff.org/
[DigitalOcean]: https://m.do.co/c/0eb3d3d839ea
[Docker Compose]: https://docs.docker.com/compose/overview/
[Docker Hub]: https://hub.docker.com/
[docker-freebsd]: https://www.freshports.org/sysutils/docker-freebsd/
[Docker]: https://www.docker.com/
[ECR]: https://aws.amazon.com/ecr/
[FreeBSD]: https://www.freebsd.org/
[hitch]: https://hitch-tls.org/
[Kubernetes]: https://kubernetes.io/
[Let's Encrypt]: https://letsencrypt.org/
[LuaDNS]: https://luadns.com/
[Mattermost]: https://mattermost.com/
[musl-libc]: http://www.musl-libc.org/
[OpenRC]: https://wiki.gentoo.org/wiki/Project:OpenRC
[rust.melbourne]: https://rust.melbourne/
[Sourcehut]: https://sourcehut.org/
[sr.ht-announce]: https://lists.sr.ht/~sircmpwn/sr.ht-announce/%3C20190117003837.GA6037%40homura.localdomain%3E
[SSL Labs test]: https://www.ssllabs.com/ssltest/index.html
[surveillance capitalist]: https://en.wikipedia.org/wiki/Surveillance_capitalism
[systemd-tragedy]: https://youtu.be/o_AIw9bGogo
[systemd]: https://freedesktop.org/wiki/Software/systemd/
[Ubuntu]: https://www.ubuntu.com/
[Vultr]: https://www.vultr.com/?ref=7903263
[WebPageTest]: https://www.webpagetest.org/
[Varnish]: https://varnish-cache.org/
[varnish-http2]: https://info.varnish-software.com/blog/varnish-cache-5-http2-support
[nginx]: http://nginx.org/
[PostgreSQL]: https://www.postgresql.org/
[Rails]: https://rubyonrails.org/
