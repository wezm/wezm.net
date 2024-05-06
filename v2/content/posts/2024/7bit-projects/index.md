+++
title = "7bit Projects: Dew Point Forecast, MacBinary, RSS Please, Titlecase"
date = 2024-05-04T16:20:49+10:00

#[extra]
#updated = 2024-02-21T10:05:19+10:00
+++

Today I compiled my [titlecase] Rust crate to Web Assembly and wrapped a
web-page around it so that it can be used online. It's published on my
"projects domain", [7bit.org]. After I published it I realised I hadn't
written about the other projects that are on `7bit.org`. They are
Dew Point Forecast, MacBinary, RSS Please, and Titlecase.

<!-- more -->

A few years ago I decided that it was a bad idea to speculatively register
domains for projects because:

1. I don't finish all (\*cough\* most) projects
2. They get expensive

In an attempt to curb spending on domain names I searched for a short,
nondescript domain to use as a dumping ground for projects that were complete,
but not significant enough to warrant their own domain. Thus `7bit.org` was
born.

So far I've published four projects to it, all of which are open-source.

### Titlecase

[Titlecase] is one of the earliest Rust crates I wrote. The first commit was in
2017. It converts text into title case. Specifically it uses [a style described
by John Gruber][style] for post titles on his website [Daring Fireball].

Instead of simply capitalizing each word `titlecase` does the following
(amongst other things):

* Lower case small words like an, of, or in.
* Don't capitalize words like iPhone.
* Don't interfere with file paths, URLs, domains, and email addresses.
* Always capitalize the first and last words, even if they are small words
  or surrounded by quotes.
* Don't interfere with terms like "Q&A", or "AT&T".
* Capitalize small words after a colon.

I have compiled it to WebAssembly so that it can be [used online][Titlecase].

{{ figure(image="posts/2024/7bit-projects/Convert%20Text%20to%20Titlecase%20-%207bit.org.png", link="https://7bit.org/titlecase/", border=1, width="739", alt='Screenshot of the Titlecase web page showing the result of converting the text ‘an iPhone review: "our take in 10 minutes"’ to title case with the tool. The resulting text is ‘An iPhone Review: "Our Take in 10 Minutes"’.', caption="Screenshot of the Titlecase web page") }}

### RSS Please

[RSS Please] is a tool to generate RSS feeds from web pages. It uses
CSS selectors to extract parts of the page to generate the feed from.
It's implemented as a command line tool in Rust.

{{ figure(image="posts/2024/7bit-projects/RSS%20Please.png", link="https://rsspls.7bit.org/", alt="Screenshot of the RSS Please website. It has a teal backgound and features a screenshot of the tool running in a terminal. There is an orange RSS logo in the top left and download button in the bottom left.", caption="Screenshot of the RSS Please website") }}

### Dew Point Forecast

[Dew Point Forecast] provides weather forecasts that include the dew point. The
dew point relates to how humid it feels. It's a better measure than relative
humidity as the value does not vary with the air temperature the way the
relative humidity percentage does.

I built this one after moving to Queensland in 2021 and it was the first
project published to `7bit.org`. It's implemented in Rust using the [Rocket]
web framework.

{{ figure(image="posts/2024/7bit-projects/Dew%20Point%20-%20Forecast%20for%20Brisbane%20City.png", link="https://dewpoint.7bit.org/", border=1, width="739", alt="Screenshot of the dew point forecast for Brisbane, Australia. There are boxes for current conditions, Sat 4 May, Sun 5 May, and Mon 6 May. Each box contains values for temperature, dew point, sunrise, sunset, UV index, and relative humidity.", caption="Dewpoint forecast for Brisbane") }}

### MacBinary

[MacBinary] allows inspection and downloading of individual components in
MacBinary encoded files that were used by the classic Mac OS. It's available as
a Rust crate for use in third-party projects. I have compiled it to WebAssembly
for use on [the web page][MacBinary]. I wrote more about this project in [this
post](@/posts/2023/rust-classic-mac-os-app/index.md#macbinary).


{{ figure(image="posts/2024/7bit-projects/Decode%20MacBinary%20Online%20-%207bit.org.png", link="https://7bit.org/macbinary/", border=1, width="739", alt="Screenshot of the MacBinary webpage. It is showing the parsed information from a file called 'bbedit_lite_612.smi_.bin'. Several resources are lists such as 'BNDL', and 'CODE'.", caption="Screenshot of the MacBinary web page") }}

### Comments

* [Fediverse](https://mastodon.decentralised.social/@wezm/112391817575822540)

[RSS Please]: https://rsspls.7bit.org/
[Dew Point Forecast]: https://dewpoint.7bit.org/
[Titlecase]: https://7bit.org/titlecase/
[MacBinary]: https://7bit.org/macbinary/
[7bit.org]: https://7bit.org/
[style]: https://daringfireball.net/2008/05/title_case
[Daring Fireball]: https://daringfireball.net/
[Rocket]: https://rocket.rs/
