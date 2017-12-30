I replaced Hugo with Cobalt on [Bit Cannon].
Hugo is great, I had no complaints, but as mentioned in my [last post][rust-tools]
I want to make use of Rust tools where reasonably possible, to help them and
Rust itself gain traction.

The conversion was relatively straight forward. I wrote [a little Ruby script
(hugo2cobalt)][hugo2cobalt] to convert the front matter from TOML to YAML and
ensure the dates were in the right format. I ported the "theme" to Liquid.
Cobalt doesn't have any support for pagination at the moment, so that didn't make
the cut, which is fine with the number of posts I have. Tag support is limited
but I've only used one tag on the site so far, so it was easy to manually add
a tag page for, '[#wesonlinux]'. I was able to preserve the same URL structure
for all pages, so that was easy.

Cobalt supports [JSON Feed], so I enabled that. 

[Bit Cannon]: http://bitcannon.net/
[hugo2cobalt]: https://github.com/wezm/hugo2cobalt
[JSON Feed]: https://jsonfeed.org/
[rust-tools]: /technical/2017/09/rust-tools-talk/
[#wesonlinux]: http://bitcannon.net/tags/wesonlinux/
