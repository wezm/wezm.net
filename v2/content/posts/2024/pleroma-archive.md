+++
title = "Generating a Static Website From a Pleroma Archive"
date = 2024-11-25T20:21:44+10:00

#[extra]
#updated = 2024-06-06T08:24:45+10:00
+++

Almost two years ago, in January 2023 I migrated my Fediverse presence from a
self-hosted [Pleroma] instance to a single user Mastodon instance hosted by
[masto.host]. Since then I've wanted to retire the Pleroma instance, but I
didn't want to just take it offline. I wanted to preserve my posts and links to
them. That became a priority over the weekend so I built a tool,
[pleroma-archive] to do it.

<!-- more -->

A few months after the switch to Mastodon I tried pulling my posts via RSS, but
hit a runtime error. [I reported it to the project][runtime-error] but nothing
came of it.

I ignored it for another 18 months until this weekend. I tried to upgrade my
PostgreSQL server from version 12 to 16, and migrate it to a new host. I chose
the dump and load method of doing this, but when restoring the Pleroma database
it appeared to get stuck building one of the indexes. I estimated that it was
going to take something like 30 hours to complete. [I'm not the first one to
hit this problem either][pg-restore].

Retiring Pleroma had now become a priority. I discovered that there was now an
account backup option in the import/export section of the settings. I
downloaded my archive and set about building a tool that could generate a
website from it.

As usual I built the tool in Rust, my scripting language of choice. It's
imaginatively called `pleroma-archive`. It generates an index page of all posts
as well as a page for each individual post. The public URLs that Pleroma uses
are not part of the archive, so for each post the tool does a `HEAD` request
with the post id to determine the public URL of the post. The results of this
are cached so it only needs to do it once for each post.

With a little bit of help from [Nginx try\_files][try_files] a page like
`notice/ARQGKLTJNiP8Lu2gT2.html` can be served at `/notice/ARQGKLTJNiP8Lu2gT2`,
matching the URL it had when served by Pleroma:

```nginx
location / {
    try_files $uri $uri/index.html $uri.html =404;
}
```

The end result is at <https://decentralised.social/> and I have now retired
my Pleroma instance.

Source code and instructions for using `pleroma-archive` is available at
<https://forge.wezm.net/wezm/pleroma-archive>.

[Pleroma]: https://pleroma.social/
[masto.host]: https://masto.host/
[runtime-error]: https://git.pleroma.social/pleroma/pleroma/-/issues/3149
[pg-restore]: https://git.pleroma.social/pleroma/pleroma/-/issues/3031
[try_files]: https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files
[pleroma-archive]: https://forge.wezm.net/wezm/pleroma-archive
