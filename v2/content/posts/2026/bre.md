+++
title = "Platform Support for GNU Extensions to BREs"
date = 2026-06-26T18:20:15+10:00

# [extra]
# updated = 2026-01-27T09:25:58+10:00
+++

Recently as part of a code review I left a comment about a `grep` invocation a colleague had written:

    if grep -e '@[^@]\+@' "$DIR/install.sh" ; then

I thought the `\` before `+` was a mistake, and also pointed out that if `+`
was to be used we'd need to pass `-E` for extended regular expression (ERE)
support. The colleague replied that `\+` in a basic regular expression (BRE) was the same as
`+` in ERE.

This was news to me! That day I learned something. I wanted to know more so I turned to
The FreeBSD [re_format(7)][re_format] man page, where most of my knowledge about the
distinction about BREs and EREs came from. There was no mention of it there. So I spun
up a FreeBSD virtual machine, and sure enough it worked.

Meanwhile my colleague commented again that it turned out `\+` was not part of the POSIX
specification for BREs and was a GNU extension.

In glibc grep's regex syntax is

```
# define RE_SYNTAX_GREP							\
  ((RE_SYNTAX_POSIX_BASIC | RE_NEWLINE_ALT)				\
   & ~(RE_CONTEXT_INVALID_DUP | RE_DOT_NOT_NULL))
```

where `RE_SYNTAX_POSIX_BASIC` is:

```c
# define RE_SYNTAX_POSIX_BASIC						\
  (_RE_SYNTAX_POSIX_COMMON | RE_BK_PLUS_QM | RE_CONTEXT_INVALID_DUP)
```

and `RE_BK_PLUS_QM` is:

```c
/* If this bit is not set, then + and ? are operators, and \+ and \? are
     literals.
   If set, then \+ and \? are operators and + and ? are literals.  */
# define RE_BK_PLUS_QM (RE_BACKSLASH_ESCAPE_IN_LISTS << 1)
```

The GNU extension has been present in glibc since at least 1995:
https://sourceware.org/git/?p=glibc.git;a=blob;f=posix/regex.h;h=42afd848817959e62a160404815dc235f7941700;hb=2b83a2a4d978012cdf78b648337c31091e20526d

I was curious about why it worked in FreeBSD `grep`, but was not mentioned in `re_format(7)`,
so poked around the FreeBSD source. This lead me to [regcomp.c] and code that handled
`\+` when a `gnuext` flag is set TODO: how is this set by grep?.
[The functionality was introduced in August 2020][freebsd-commit].

```c
#ifdef LIBREGEX
	} else if (p->gnuext && EATTWO('\\', '?')) {
		INSERT(OQUEST_, pos);
		ASTERN(O_QUEST, pos);
	} else if (p->gnuext && EATTWO('\\', '+')) {
		INSERT(OPLUS_, pos);
		ASTERN(O_PLUS, pos);
#endif
```

Now I wondered how widespread support for this extension was. I confirmed it worked
on a [Chimera Linux] machine, and yes, it was [added to musl libc in 2016][musl-commit].

macOS seems to use a version of TRE from circa 2009, which seems to have gained support 
for `\+` in [the Oct 2021 code dump](https://github.com/apple-oss-distributions/Libc/commit/0432a948ba54a0d62e6d3dd0b96a0f1e7dfd5fac)

https://github.com/apple-oss-distributions/Libc/blob/71bbe350ab79eef58113991d817ccc6165061a64/regex/TRE/lib/tre-parse.c#L1635

The corresponding code does not appear to be present in upstream TRE:

https://github.com/laurikari/tre/blob/71bfcaf0af3994384987c6c2679ed7d078ffe189/lib/tre-parse.c#L1174

NetBSD supports it via sync with FreeBSD in Feb 2021: https://github.com/NetBSD/src/commit/1ee269c3a208a14da224b6e9917e2e9798961fff

The extensions don't seem to be supported on OpenBSD: https://github.com/openbsd/src/blob/3a7ae229256d4c0f22c83dba5625ff455b6689a3/lib/libc/regex/regcomp.c#L465
Illumos: https://github.com/illumos/illumos-gate/blob/edd2f3461fcd719ff41d34b395ef3f5b5994fad1/usr/src/lib/libc/port/regex/regcomp.c#L700

Redox OS uses the posix-regex crate, which does appear implement the extension https://gitlab.redox-os.org/redox-os/posix-regex/-/blob/063882aa6051b5075062d20d00b41ddc0fb8cd89/src/compile.rs#L214
since 2018: https://gitlab.redox-os.org/redox-os/posix-regex/-/commit/7648b78f45122826ca827ecd15111c4639aa68bd#line_16f7fc429_A254

Haiku since 2014 via import of gnuregex https://codeberg.org/haiku/haiku/commit/b55c918f579fb523946747cf26dde829fe7fe8c2
https://codeberg.org/haiku/haiku/src/commit/2b75ca9e1c15526b9ff7613363bb792a28a7f7ac/src/build/libgnuregex/regex.h#L179

SerenityOS does not support https://github.com/SerenityOS/serenity/blob/341274075a32952223a8c8fe08e702fb7cbb2a04/Userland/Libraries/LibRegex/RegexParser.cpp#L399

[regcomp.c]: https://github.com/freebsd/freebsd-src/blob/961f4814286820f242d8d5407b9fd7238e896936/lib/libc/regex/regcomp.c#L969
[freebsd-commit]: https://github.com/freebsd/freebsd-src/commit/18a1e2e9b9f109a78c5a9274e4cfb4777801b4fb
[musl-commit]: https://git.musl-libc.org/cgit/musl/commit/?id=25160f1c08235cf5b6a9617c5640380618a0f6ff
