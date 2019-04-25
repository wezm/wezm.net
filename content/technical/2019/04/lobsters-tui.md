As a learning and practice exercise I built a [crate] for interacting with the
[Lobsters](https://lobste.rs/) programming community website. It's built on the
asynchronous Rust ecosystem. To demonstrate the crate I also built a terminal
user interface (TUI).

<figure>
  <img style="border: 2px solid black" src="/images/2019/lobsters-tui.png" alt="Screenshot of Lobsters TUI" />
  <figcaption>A screenshot of the TUI in <a href="https://github.com/jwilm/alacritty">Alacritty</a></figcaption>
</figure>

## Try It

[![crates.io](https://img.shields.io/crates/v/lobsters.svg)](https://crates.io/crates/lobsters)

Pre-built binaries with no runtime dependencies are available for:

- FreeBSD 12 amd64
- Linux armv6 (Raspberry Pi)
- Linux x86_64
- MacOS
- NetBSD 8 amd64
- OpenBSD 6.5 amd64

<a class="action-button action-button-ghost" href="https://git.sr.ht/~wezm/lobsters#download">Downloads</a>
<a class="action-button action-button-ghost" href="https://git.sr.ht/~wezm/lobsters">Source Code</a>


The TUI uses the following key bindings:

* `j` or `↓` — Move cursor down
* `k` or `↑` — Move cursor up
* `h` or `←` — Scroll view left
* `l` or `→` — Scroll view right
* `Enter` — Open story URL in browser
* `c` — Open story comments in browser
* `q` or `Esc` — Quit

As mentioned in the introduction the motivation for starting the client was to
practice using the async Rust ecosystem and it kind of spiralled from there.
The resulting TUI is functional but not especially useful, since it just opens
links in your browser. I can imagine it being slightly more useful if you could
also view and reply to comments without leaving the UI.

## Building It

The client proved to be an interesting challenge, mostly because Lobsters
doesn't have a full API. This meant I had to learn how to set up and use a
cookie jar along side [reqwest] in order to make authenticated requests.
Logging in requires supplying a cross-site request forgery token, which Rails
uses to prevent CSRF attacks. To handle this I need to first fetch the login
page, note the token, then POST to the login endpoint. I could have tried to
extract the token from the markup with a regex or substring matching but
instead used [kuchiki] to parse the HTML and then match on the `meta` element
in the `head`.

Once I added support for writing with the client (posting comments), not just
reading, I thought I best not test against the real site. Fortunately the site's
code is open source. I took this as an opportunity to use [my new-found Docker
knowledge][alpine-docker] and run it with Docker Compose. That turned out
pretty easy since I was able to base it on one of the Dockerfiles for a Rails
app I run. If you're curious the [Alpine Linux] based `Dockerfile` and
`docker-compose.yml` can be viewed in [this
paste](https://paste.sr.ht/%7Ewezm/6da6b05677f80069b166433b19ef2209176f036f).

After I had the basics of the client worked out I thought it would be neat to
fetch the front page stories and render them in the terminal in a style similar
to the site itself. I initially did this with [ansi_term]. It looked good but
lacked interactivity so I looked into ways to build a TUI along the lines of
[tig]. I built it several times with different crates, switching each time I
hit a limitation. I tried:

* [easycurses], which lived up to it's name and produced a working result
  quickly. I'd recommend this if your needs aren't too fancy, however I needed
  more control than it provided.
* [pancurses] didn't seem to be able to use colors outside the core 16 from
  ncurses.

Finally I ended up going a bit lower-level and used [termion]. It does
everything itself but at the same time you lose the conveniences ncurses
provides.  It also doesn't support Windows, so my plans of supporting that were
thwarted. Some time after I had the `termion` version working I revisited
[tui-rs], which I had initially dismissed as unsuitable for my task. In
hindsight it would probably have been perfect, but we're here now.

In addition to async and TUI I also learned more about:

- Building a robust and hopefully user friendly command line tool.
- Documenting a library.
- Publishing crates.
- Dockerising a Rails app that uses MySQL.
- How to build and publish pre-built binaries for many platforms.
- How to accept a password in the terminal without echoing it.
- Setting up multi-platform [CI builds on Sourcehut][builds].

Whilst the library and UI aren't especially useful the exercise was worth it. I got
to practice a bunch of things and learn some new ones at the same time.

<!-- <img src="/images/lobsters.png" alt="" width="16" class="lobsters"> [Discuss on Lobsters](https://lobste.rs/s/7op1vm/my_first_3_weeks_professional_rust) -->

<div class="seperator"><hr class="left">✦<hr class="right"></div>

Previous Post: [Cross Compiling Rust for FreeBSD With Docker](/technical/2019/03/cross-compile-freebsd-rust-binary-with-docker/)  
<!-- Next Post:  -->

[repo]: https://git.sr.ht/~wezm/lobsters
[ansi_term]: https://crates.io/crates/ansi_term
[tig]: https://jonas.github.io/tig/
[pancurses]: https://crates.io/crates/pancurses
[tui-rs]: https://crates.io/crates/tui
[termion]: https://crates.io/crates/termion
[builds]: https://man.sr.ht/builds.sr.ht/
[reqwest]: https://crates.io/crates/reqwest
[kuchiki]: https://crates.io/crates/kuchiki
[alpine-docker]: /technical/2019/02/alpine-linux-docker-infrastructure/
[easycurses]: https://crates.io/crates/easycurses
[Alpine Linux]: https://alpinelinux.org/
[crate]: https://crates.io/crates/lobsters
