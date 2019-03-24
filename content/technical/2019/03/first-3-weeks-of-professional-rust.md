For the last 15 years as a professional programmer I have worked mostly with
dynamic languages. First [Perl], then [Python], and for the last 10 years or so,
[Ruby]. I've also been writing [Rust] on the side for personal projects for
nearly four years. Recently I started a new job and for the first time I'm
writing Rust professionally. Rust represents quite a shift in language
features, development process and tooling. I thought it would be interesting to
reflect on that experience so far.

_Note that some of my observations are not unique to Rust and would be equally
present in other languages like [Haskell], [Kotlin], or [OCaml]._

## Knowledge

In my first week I hit up pretty hard against my knowledge of [lifetimes in
Rust][lifetimes]. I was reasonably confident with them conceptually and their
simple application but our code has some interesting type driven zero-copy
parsing code that tested my knowledge. When encountering some compiler errors I
was fortunate to have experienced colleagues to ask for help. It's been nice to
extend my knowledge and learn as I go.

Interestingly I had mostly been building things without advanced lifetime
knowledge up until this point. I think that sometimes the community puts too
much emphasis on some of Rust's more advanced features when citing its learning
curve. If you read [the book] you can get a very long way. Although that will
depend on the types of applications or [data structures][linked-list] you're
trying to build.

## Confidence

In my second week I implemented a change to make a certain pattern more
ergonomic. It was refreshing to be able to build the initial functionality and
then make a project-wide change, confident that given it compiled after the
change I _probably_ hadn't broken anything. I don't think I would have had the
confidence to make such a change as early on in the Ruby projects I've worked
on previously.

## Testing

I cringe whenever I see proponents of statically typed languages say things
like, "if it compiles, it works", with misguided certainty. The compiler and
language do eliminate whole classes of bugs that you'd need to test for in a
dynamic language but that doesn't mean tests aren't needed.

Rust has great built in support for testing and I've enjoyed being able to
write tests focussed solely on the behaviour and logic of my code. Compared to
Ruby where I have to write tests that ensure there are no syntax errors, `nil`
is handled safely, arguments are correct, in addition to the behaviour and
logic.

## Editor and Tooling

[Neovim] is my primary text editor. I've been using [vim] or a derivative since
the early 2000s. I have the [RLS] set up and working in my Neovim environment
but less than a week in I started using [IntelliJ IDEA][IntelliJ] with the Rust
and Vim emulation plugins for work. A week after that I started trialling
[CLion] as I wanted a debugger.

<figure>
  <img class="with-border" src="/images/2019/jetbrains-clion.png" alt="JetBrains CLion IDE" />
  <figcaption>JetBrains CLion IDE</figcaption>
</figure>

The impetus for the switch was that I was working with a colleague on a
change that had a fairly wide impact on the code. We were practicing
[compiler driven development] and were doing a repeated cycle of fix an error,
compile, jump to next top most error. Vim's [quickfix] list + [:make] is
designed to make this cycle easier too but I didn't have that set up at the
time. I was doing a lot of manual jumping between files, whereas in IntelliJ I
could just click the paths in the error messages.

It's perhaps the combination of working on a foreign codebase and also trying
to maximise efficiency when working with others that pushed me to seek out
better tooling for work use. There is ongoing to work to improve the RLS so I
may still come back to Neovim and I continue to use it for personal
projects.

Other CLion features that I'm enjoying:

* Reliable autocomplete
* Reliable jump to definition, jump to impl block, find usages
* Refactoring tooling (rename across project, extract method, extract variable)
* Built in debugger

[VS Code] offers some of these features too. However, since they are built on
the RLS they suffer many of the same issues I had in Neovim. Additionally I
think the Vim emulation plugin for IntelliJ is more complete, or at least more
predictable for a long time vim user. This is despite the latter actually using
Neovim under the covers.

## Debugging

In Ruby with a gem like [pry-byebug] it's trivial to put a `binding.pry` in
some code to be dropped into a debugger + REPL at that point in the code. This
is harder with Rust. `println!` or `dbg!` based debugging can get you a
surprisingly long way and had served me well for most of my personal projects.

When building some parsing code I quickly felt the need to use a real
debugger in order to step through and examine execution of a failing test.
It's possible to do this on the command line with the `rust-gdb` or `rust-lldb`
wrappers that come with Rust. However, I find them fiddly to use
and verbose to operate.

CLion makes it simple to add and remove break points by clicking in the gutter,
run a single test under the debugger, visually step through the code, see all
local variables, step up and down the call stack, etc. These are possible with
the command line tools (which CLIon is using behind the scenes), but it's nice
to have them built in and available with a single click of the mouse.

## Conclusion

So far I am enjoying my new role. There have been some great learning
opportunities and surprising tooling changes. I'm also keen to keep an eye on
the frequency of bugs encountered in production, their type (such as panic or
incorrect logic), their source, and ease of resolution. I look forward to
writing more about our work in the future.

<div class="seperator"><hr class="left">✦<hr class="right"></div>

Previous Post: [A Coding Retreat and Getting Embedded Rust Running on a SensorTag](/technical/2019/03/sensortag-embedded-rust-coding-retreat/)


[:make]: https://neovim.io/doc/user/quickfix.html#:make
[CLion]: https://www.jetbrains.com/clion/
[compiler driven development]: https://doc.rust-lang.org/book/ch20-02-multithreaded.html#building-the-threadpool-struct-using-compiler-driven-development
[linked-list]: https://rust-unofficial.github.io/too-many-lists/
[Haskell]: https://www.haskell.org/
[IntelliJ]: https://www.jetbrains.com/idea/
[Kotlin]: https://kotlinlang.org/
[lifetimes]: https://doc.rust-lang.org/book/ch19-02-advanced-lifetimes.html
[Neovim]: https://neovim.io/
[null]: https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare
[OCaml]: https://ocaml.org/
[Perl]: https://www.perl.org/
[pry-byebug]: https://github.com/deivid-rodriguez/pry-byebug
[Python]: https://www.python.org/
[quickfix]: https://neovim.io/doc/user/quickfix.html
[RLS]: https://github.com/rust-lang/rls
[Ruby]: https://www.ruby-lang.org/en/
[Rust]: https://www.rust-lang.org/
[the book]: https://doc.rust-lang.org/book/index.html
[vim]: https://www.vim.org/
[VS Code]: https://code.visualstudio.com/
