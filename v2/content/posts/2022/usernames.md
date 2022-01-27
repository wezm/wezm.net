+++
title = "ASCII-centric Usernames"
date = 2022-01-27T18:38:25+10:00

[extra]
updated = 2022-01-27T21:07:32+10:00
+++

I'm working on a web-based side project in my spare time. The great thing about
side projects is you get to make all the choices and question the common
wisdom. Recently I've been building out the sign-up flow and I started thinking
about usernames—specifically the characters that they may be comprised of.

<!-- more -->

I poked around a few sites to see what they did: Twitter, GitHub, Discourse
all restrict your username to a mostly ASCII alphanumeric character set, perhaps
with `-`, `_`, and `.` thrown in.

It struck me that this is fine for me, an English speaker, but must suck for
folks that can't have a username in their own language. It is however not
without precedent. The Internet's origins in the US linger on with similar
restrictions on e-mail and DNS ([Punycode] is but a workaround) for example.
Some further thinking and research led to some possible reasons for this:

1. There's the obvious precedent set by e-mail and other systems: that's how
   we've always done it so it just continues.
1. Some languages require a dedicated [input system][ime] in order to type
   naturally. That means it would be difficult for people without familiarity
   with that system to be able to type the username such as might be necessary
   when @ mentioning someone.
1. Similar to above, most keyboards have some way to type the English alphabet.
1. ASCII alpha-numeric characters are able to be in URLs without [percent-encoding].

That last one is the most compelling reason I saw. For an application that has
user profile pages where the username goes in the URL it seems advantageous for
that to be able to happen directly without encoding.

Now this is all very biased by my monolingual, English speaking, Western viewpoint.
Perhaps it is more common to permit native language usernames in applications that
target non-English markets?

I did find a couple of examples that were more permissive with usernames.
Discord happily let me set my username to "🦊 こんにちは". Slack rejected the
emoji with a cute message, "Of course you want a name with an emoji. Sadly, it
is not to be. Try letters?", but was otherwise happy with "こんにちは". In both
cases @ mentioning the user appears to require typing their name, although you
could also find them in the people directory first.

Notably Discord and Slack don't have public profile pages (that would need a
URL). I'd be curious if there were systems out there with public profile pages
where the usernames are permissive and the name is in the URL (and not the
account id number for example).

[Punycode]: https://en.wikipedia.org/wiki/Punycode
[percent-encoding]: https://en.wikipedia.org/wiki/Percent-encoding
[ime]: https://en.wikipedia.org/wiki/Input_method
