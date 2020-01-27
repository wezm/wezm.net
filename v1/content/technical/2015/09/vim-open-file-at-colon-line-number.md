I regularly encounter paths that have line numbers attached such as,
`./spec/features/cases/edit_spec.rb:112`, or `src/fetcher.rs:543`, and want to
view or edit the file at the given line. For far too long I've been opening the
file in `vim` and then jumping to the relevant line. This week I wrote a shell
(`zsh`) function that does this automatically. It is simply called `v` and is
used in place of `vim` to edit a file. E.g.

<figure>
  <img src="/images/2015/vDemo.gif" style="max-width: 490px; max-height: 362px" alt="Animated GIF of v function in action">
  <figcaption>Demo</figcaption>
</figure>

## Source

The source of the function is below. It was written for `zsh` but should be
easy to adapt for other shells.

<script src="https://gist.github.com/wezm/f18e3ec540e7b59337fc.js"></script>

