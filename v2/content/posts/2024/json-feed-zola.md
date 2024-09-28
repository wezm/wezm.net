+++
title = "Generate a JSON Feed for a Zola Website"
date = 2024-09-28T20:50:30+10:00

#[extra]
#updated = 2024-06-06T08:24:45+10:00
+++

[JSON Feed] is a specification for representing an RSS-style feed in JSON. I
wanted to add one as an alternative alongside the Atom feed on a new website
I'm building. The website is built with [Zola], which unfortunately [doesn't
support the format][zola-issue], so this is how I went about adding one.

<!-- more -->

My first idea was to add a Tera template `json.feed` and try to generate JSON
in the template. This was foiled on multiple fronts:

1. Zola only loads files matching `*.{*ml,md}` and `robots.txt` as templates,
   so it didn't render my `json.feed` template.
2. Tera has a `json_encode` filter but [does not support object literals][tera-issue],
   which makes building well formed JSON tricky.

My next thought was to write a tool to convert the Atom feed to JSON. Rust is
my scripting language of choice these days (only a tiny bit joking) but I
didn't feel like adding a Rust project and build step for this. I then wondered
if it could be done with [jq], or in my case [jaq]—a `jq` implementation in
Rust. Short answer it can. Here's what I came up with:

I created `templates/dump.xml` with these contents:

```tera
{{ __tera_context }}
```

This dumps the whole Tera context as JSON when rendered into `public/dump.xml`.
It's `.xml` so that Zola will render it as a template. I added it to
`feed_filenames` in the Zola `config.toml`:

```toml
feed_filenames = [
  "atom.xml",
  "dump.xml", # HACK: This just dumps the Tera context as JSON
]
```

Then I wrote this `jaq` filter (`json-feed.jaq`) to generate a JSON Feed
`feed.json` from the rendered version of the template.

```jq
# vim: ft=jq
# Generate a JSON feed from context of a Zola feed template
{
    "version": "https://jsonfeed.org/version/1.1",
    "title": .config.title,
    "home_page_url": .config.base_url,
    "feed_url": .feed_url | sub("dump\\.xml$"; "feed.json"),
    "authors": [ { "name": .config.author } ],
    "language": "en-AU",
    "items": .pages | map({
            "id": .permalink,
            "url": .permalink,
            "title": .title,
            "content_html": .content,
            "date_published": .date,
            "tags": .taxonomies.tags,
    } + if .updated then {"date_modified": .updated} else {} end
      + if .extra.link then {"external_url": .extra.link} else {} end)
}
```

It turned out quite nice. The main challenge with the `jaq` filter was working
out how to conditionally include a key only if the value was non-null. I ended
up with the trailing [if-then-else-end] expressions. If there's a better way
I'd be keen to hear about it.

Finally, to coordinate all this I added a `Makefile` that deletes `dump.xml`
afterwards:

```make
help:
	@echo "Available tasks:"
	@echo
	@echo "- build"
	@echo "- deploy"

build:
	zola build
	jaq --from-file json-feed.jaq public/dump.xml > public/json.feed
	rm public/dump.xml

deploy:
	@echo todo

.PHONY: build depoly
```

[JSON Feed]: https://www.jsonfeed.org/
[tera-issue]: https://github.com/Keats/tera/issues/898
[zola-issue]: https://github.com/getzola/zola/issues/311
[Zola]: https://www.getzola.org/
[jq]: https://jqlang.github.io/jq/
[jaq]: https://github.com/01mf02/jaq
[if-then-else-end]: https://jqlang.github.io/jq/manual/#if-then-else-end
