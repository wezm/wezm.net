+++
title = "Platform Support for GNU Extensions to Basic Regular Expressions"
date = 2026-06-28T13:53:15+10:00

# [extra]
# updated = 2026-01-27T09:25:58+10:00
+++

Recently I was reviewing some shell script a colleague had written:

```sh
if grep -e '@[^@]\+@' "$DIR/install.sh" ; then
```

I thought the `\` before the `+` was a mistake, and also pointed out that if
`+` was to be used we'd probably need to pass `-E` for extended regular
expression (ERE) support. The colleague replied that `\+` in a basic regular
expression (BRE) was the same as `+` in ERE (one or more repetitions).

This was news to me! I wanted to know more, so I turned to the FreeBSD
[re_format(7)][re_format] man page. Historically this is where most of my
knowledge about the distinction between BREs and EREs came from. There was no
mention of it there. I spun up a FreeBSD virtual machine and performed a quick
test, which confirmed that `\+` did in fact work.

<!-- more -->

Meanwhile my colleague replied that it turned out `\+` was not part of
the POSIX specification for BREs and was a GNU extension. Referring to
the [most recent POSIX spec][posix] it says:

> …it is implementation-defined whether `\?`, `\+`, and `\|` each match the
> literal character `?`, `+`, or `|`, respectively, or behave as described for
> the ERE special characters `?`, `+`, and `|`, respectively

with the additional note:

> A future version of this standard may require `\?`, `\+`, and `\|` to behave
> as described for the ERE special characters `?`, `+`, and `|`, respectively.

So treating `\+` as `+` is not currently standardised.

I was curious about why it worked in FreeBSD `grep`, but was not mentioned in
`re_format(7)`, so poked around the FreeBSD source code. This led me to
[regcomp.c]:

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

[The functionality was introduced in August 2020][freebsd-commit]. The `gnuext` flag
is set unless the `REG_POSIX` flag is set on the regex, which [it is not][grepbehave]
when `grep` is in basic mode.


Next I turned to the source of extension: glibc. Regex syntax is quite customisable in glibc.
[The definition of basic regexes][glibc-regex], `RE_SYNTAX_POSIX_BASIC`, is:

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

Digging into the origin of this GNU extension, I found that it's been [present
in glibc since at least
1995](https://sourceware.org/git/?p=glibc.git;a=blob;f=posix/regex.h;h=42afd848817959e62a160404815dc235f7941700;hb=2b83a2a4d978012cdf78b648337c31091e20526d).
I wondered how widespread support for the extension was. The following were my
findings:

- ✅ [Chimera Linux](https://chimera-linux.org/) (and other musl based distributions)
  - [Added to musl libc in 2016][musl-commit].
- ✅ [macOS](https://en.wikipedia.org/wiki/MacOS)
  - Seems to use a version of [TRE] from [circa 2009](https://github.com/apple-oss-distributions/Libc/blob/71bbe350ab79eef58113991d817ccc6165061a64/.upstream_base_commits#L521).
  - Appears to have gained [support
for `\+`](https://github.com/apple-oss-distributions/Libc/blob/71bbe350ab79eef58113991d817ccc6165061a64/regex/TRE/lib/tre-parse.c#L1635) in [the Oct 2021 code dump](https://github.com/apple-oss-distributions/Libc/commit/0432a948ba54a0d62e6d3dd0b96a0f1e7dfd5fac).
  - The corresponding code does not appear to be present in [upstream TRE](https://github.com/laurikari/tre/blob/71bfcaf0af3994384987c6c2679ed7d078ffe189/lib/tre-parse.c#L1174).
- ✅ [NetBSD](https://netbsd.org/)
  - Supports it via [sync with FreeBSD in Feb 2021](https://github.com/NetBSD/src/commit/1ee269c3a208a14da224b6e9917e2e9798961fff).
- ❌ [OpenBSD](https://www.openbsd.org/)
  - [Doesn't seem to be supported](https://github.com/openbsd/src/blob/3a7ae229256d4c0f22c83dba5625ff455b6689a3/lib/libc/regex/regcomp.c#L465).
- ❌ [Illumos](https://illumos.org/)
  - [Doesn't seem to be supported](https://github.com/illumos/illumos-gate/blob/edd2f3461fcd719ff41d34b395ef3f5b5994fad1/usr/src/lib/libc/port/regex/regcomp.c#L700).
- ✅ [Redox OS](https://www.redox-os.org/)
  - Uses the [posix-regex] crate, which [does appear to implement the extension](https://gitlab.redox-os.org/redox-os/posix-regex/-/blob/063882aa6051b5075062d20d00b41ddc0fb8cd89/src/compile.rs#L214).
  - [Since 2018](https://gitlab.redox-os.org/redox-os/posix-regex/-/commit/7648b78f45122826ca827ecd15111c4639aa68bd#line_16f7fc429_A254).
- ✅ [Haiku](https://www.haiku-os.org/)
  - [Supported](https://codeberg.org/haiku/haiku/src/commit/2b75ca9e1c15526b9ff7613363bb792a28a7f7ac/src/build/libgnuregex/regex.h#L179).
  - Since 2014 [via import of gnuregex](https://codeberg.org/haiku/haiku/commit/b55c918f579fb523946747cf26dde829fe7fe8c2).
- ❌ [SerenityOS](https://serenityos.org/)
  - [Does not support it](https://github.com/SerenityOS/serenity/blob/341274075a32952223a8c8fe08e702fb7cbb2a04/Userland/Libraries/LibRegex/RegexParser.cpp#L399).

### Conclusion

It sure was fun poking through the code of a bunch of open-source operating
systems. It was interesting to see all the implementations, and how widely
they varied in readability. TRE in macOS was by far the most difficult to
follow. musl was very clear as usual. FreeBSD was more complicated, but still
relatively straightforward.

Ultimately the conclusion is that this is a non-standardised
extension that it is relatively widely supported, but not everywhere. So it is
best to explicitly use extended regular expressions via `-E` or similar when
their functionality is desired.

[regcomp.c]: https://github.com/freebsd/freebsd-src/blob/961f4814286820f242d8d5407b9fd7238e896936/lib/libc/regex/regcomp.c#L969
[freebsd-commit]: https://github.com/freebsd/freebsd-src/commit/18a1e2e9b9f109a78c5a9274e4cfb4777801b4fb
[musl-commit]: https://git.musl-libc.org/cgit/musl/commit/?id=25160f1c08235cf5b6a9617c5640380618a0f6ff
[re_format]: https://man.freebsd.org/cgi/man.cgi?query=re_format&apropos=0&sektion=7&manpath=FreeBSD+15.1-STABLE&format=html
[grepbehave]: https://github.com/freebsd/freebsd-src/blob/9e1bbfb88e986b209709ea765189a3ebb6581bcd/usr.bin/grep/grep.c#L650
[posix-regex]: https://gitlab.redox-os.org/redox-os/posix-regex
[TRE]: https://github.com/laurikari/tre
[posix]: https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap09.html#tag_09_03_02
[glibc-regex]: https://sourceware.org/git/?p=glibc.git;a=blob;f=posix/regex.h;h=2d8392cf84aeb42f9bbcd672f6e607d7be02f220;hb=bcbd6736005876dadd3d4751cad509568bc4bf28
