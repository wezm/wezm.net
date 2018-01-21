## Supporting Rust by using Rust: An exploration of great tools written in Rust

I presented at the September [Melbourne Rust Meetup][rust-melbourne]. My talk
was about some of the great tools that are being built in Rust, the benefits
that brings and how using and promoting these tools can help
with the wider adoption of Rust in the development community. I demonstrated
a selection of such tools.

A [video of the talk is on YouTube](https://www.youtube.com/watch?v=4-H6Hn_i4PQ).

The [slides are available online][slides]. The presenter notes I wrote for
myself are included below.

[rust-melbourne]: https://www.meetup.com/Rust-Melbourne/
[slides]: /technical/2017/09/rust-tools-talk/slides/

## Slide Notes

### Promoting Rust

* Rust is new, most of us here probably think its great. Some of us would even
  like to be able to work on Rust projects in our day jobs.
* To help cement its future, get more people using it at work and get more jobs
  we need it to be successful.
* Some ways that we can help are:
  * Use tools that are written in Rust
  * Promote tools that are written in Rust. Someone asks what tool should I
    use search code: Suggest ripgrep
* We'll be looking at a few that I use tonight.
* Mostly command line tools. GUI apps in Rust are possible but it's still
  very early days.

### Why Rust tools are great

* Performance
  * Fast and efficient with resources
  * Fearless concurrency
* No runtime
  * Often just a single binary, no need to install ruby, python, node, etc.
* Cross Platform
  * Linux, macOS, BSD and often Windows
* Easy to install
  * No need for npm, gem, pip. Just `cargo install` or better yet
    install with system package manager where available
* Usable
  * cargo makes it easy to pull in crates that do:
    * command line argument parsing with shell completion and built in help
    * generate coloured output

### Demos

Some notes on the demos that I'll be performing:

* Examples will be shell and UNIX focussed as that's the env I use every day.
  I'm demoing on Linux but most of these tools will work on macOS, BSD and many
  on Windows too.
* I'm going to assume you're familiar with the UNIX shell, cargo,
  and git. If anything is foreign, feel free to ask.
* Whilst I'll mostly be demoing on the command line, many of these tools can be
  integrated into your editor of choice, for me this is Neovim.
* For examples intended to operate on file trees I'm using a recent git
  checkout as the sample tree. In the version I checked out there are 11002
  files amounting to 404Mb on disk.

#### watchexec - Executes commands in response to file modifications

<https://github.com/mattgreen/watchexec>

* Epitomises many of the features touted previously.

Example:

Watch rust dir, echo changed files on touch

    watchexec -w src 'echo $WATCHEXEC_UPDATED_PATH'

Other terminal:

    touch src/libstd/collections/hash/map.rs
    touch src/libstd/collections/hash/set.rs

#### fd - A simple, fast and user-friendly alternative to find.

<https://github.com/sharkdp/fd>

You might be familiar with `find`, for finding files by name:

    find . -name '*option*'

It's pretty quick but there's a bunch of typing for the common case of just
wanting a partial match on filename.

`fd` does the same thing with a simple interface for that common case, while
honoring `.gitignore`, coloured output and smart case for matching (no need for
`iname`/`name`. 

    fd option

The pattern is a regular expression instead of a glob. The current directory is
the implied path to search if not specified.

#### fe - A super-fast and easy to use fuzzy file searcher

<https://github.com/btipling/fe>

`fe` is similar to `fd` except that it's a fuzzy matcher. It uses a smart fuzzy
search algorithm similar to that used in IDEs and editors for finding files.

> Searches start matching at word start, and on match failure stop matching
> until the next word

Example:

    fe lopt

You can see we got fewer results with a shorter pattern.

#### exa - a modern replacement for ls

<https://the.exa.website/>

`exa` is a replacement for `ls` with helpful defaults like human readable
files sizes, colourized output for permissions, file type, and a tree view.

Example:

    exa -lh

Here we see exas table output (-l). (-h) adds headers. You can see that
colour is used to help group similar concepts.

Tree view:

    exa --tree src/etc/installer

Colour scale for file sizes:

    exa -l --colour-scale ~/Downloads

The larger the file the more intense the colour, shifting from green to yellow.

It also has git integration and can show the status of files tracked in git.

`exa` calls itself a replacement for `ls`, which I think is accurate. I have `ls`
aliased to it in my shell:

    which ls

#### rg - the usability of The Silver Searcher with the raw speed of [GNU] grep.

<https://github.com/BurntSushi/ripgrep/>

You may have heard of `ack`, or the silver searcher. They are tools to rapidly
search the content of files in a directory tree, often code. A faster version
of `grep -r` that ignores binary files, files ignored by git ignore file
ripgrep is a similar tool: Fast code
search (regex) honoring git ignore without optional filtering by language.

Great blog post by the author (Andrew Gallant) that compared ripgreps performance and
correctness to similar tools.

Example 1:

    rg Option

If you blinked you may have missed that but about 11,000 were checked.

Example 2:

    rg è

`rg` has complete support for Unicode

Example 3:

ripgrep knows about file types and regexes so if we want all function that contain into
and return a String (on one line):

    rg -t rust 'fn.+into.+-> String'


#### alt - Command line tool to find alternate files

<https://github.com/uptech/alt>

`alt` prints the alternate for a file. Has editor integration so you can do it
in you favourite editor (Neovim). Works well for languages that have file
pairs. In my case I work on Ruby apps, which have spec files in a tree
mirroring the app tree. For example in pkb, which is a Rails app I wrote:

Example:

    alt app/models/page.rb

Ignore the trailing %, that's my shell telling me the output didn't end in a
new line. This one is super helpful in your editor to switch to the "alternate file".

#### tac

<https://neosmart.net/blog/2017/a-high-performance-cross-platform-tac-rewrite/>

`tac` is a Rust implementation of the tool with the same name commonly only found on
Linux systems. It prints the lines of a files in reverse. This can come in handy
when dealing with large log files.

Example:

We have a 3.8Gb log file. We want to see the last request in the log that was
made by a visitor using the Opera web browser with the Presto rendering engine:

    grep Presto ~/Documents/webserver.log | tail -n1

That's great but it took a little while, we can do better with `tac`:

    tac ~/Documents/webserver.log | grep Presto | head -n1

Yay quick!

#### dot - Yet another management tool for dotfiles

<https://github.com/ubnt-intrepid/dot>

Dot is a dot file manager. It can automatically clone a git repo then
symlink the files according to a mappings file. You can have mappings
that are OS specific. It's a single binary so downloading and bootstrapping
a new system is easy.

Hard to demo but my dotfiles are managed with it:

<https://github.com/wezm/dotfiles>

#### titlecase - Capitalise text according to a style guide

<https://github.com/wezm/titlecase>

* Shameless self promotion. A rust implementation of John Gruber's title case
  style. There are several implementations around (Perl, JavaScript, Python)
  I wanted a nice single binary version.

Example:

In vim filter some text through it:

Before:

The iPhone X: "a detailed guide to designing for a notch"

After:

The iPhone X: "A Detailed Guide to Designing for a Notch"

    vim demos/titlecase.md
    # duplicate the line so you can see before and after
    :'<,'>!titlecase

Notes:

* It left iPhone alone
* It capitalised the initial A inside the quotes by not _to_, _for_ and the _a_ inside the quotes.

#### ion shell - A shell written in Rust for Redox and Linux

<https://github.com/redox-os/ion>

Lastly if you feel like living on the edge... There is a project called 
Redox to build an operating system in Rust. They've made a stack of progress
so far and one of the components they've build is a shell called ion, which
also runs on Linux. It has some neat features reminiscent of the `fish` shell.


Example:

    ls
    ls -lh
    which ls

As you can see it works, it's not full of features yet so probably not ready for
full time use. Maybe try it out to hep test it, report any issues you find.

#### wesers - Single file webserver

<https://github.com/wdv4758h/wesers>

Depending on time:

* The slides were served by a little web server called `wesers`.
* Single file download
* Run in a directory to serve that directory

### Are you the next great tool author

* We've just looked at a bunch of handy tools.
* Each of these was prompted by someone that wanted a better, faster, easier to
  install, or wider platform option to existing tools and built it.
* You can also build these tools
    * If you use a tool that is frustrating to install due to runtime
      requirements or dependency issues, perhaps its a candidate for a Rust
      version.
    * Use a tool that is error prone or could benefit from fearless
      concurrency.

### Conclusion

* Talked about some great tools
    * Try them out
    * Recommend them if they work well for you
    * Improve them, submit PRs
