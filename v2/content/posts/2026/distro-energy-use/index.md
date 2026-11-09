+++
title = "How Much Energy Does Building Distro Packages Use"
date = 2026-11-09T16:38:01+10:00

[extra]
updated = 2026-11-09T17:14:51+10:00
+++

{{ figure(image="posts/2026/distro-energy-use/bento-slide.svg", link="posts/2026/distro-energy-use/bento-slide.svg", alt="A series of metrics arranged in round rects: 2786 commits, 7 months, 1 builder, 5200 package builds, 98kWh energy consumed", caption="Some metrics") }}

When I set up the infrastructure for [Casuarina Linux] I repurposed an AMD AM4 system with
Ryzen&nbsp;9&nbsp;5950X 16-Core CPU (105W TDP) and 32Gb of DDR4 RAM as the build server. I set it up
in our laundry, connected it via a smart plug, and reset its counters. Over the course of the
project I would regularly pull package updates from [Chimera Linux], build and install them locally,
and then push them to the repo, which would trigger Buildbot to build and publish them.

<!-- more -->

{% aside(title="All prices are quoted in Australian dollars", float="right") %}
You can select a different currency, which will use exchange rates from the time of writing.

{{ select_currency(path="content/posts/2026/distro-energy-use/forex.json") }}
{% end %}

The project ran from 30 March 2026 to 8 November 2026 (a bit over 7 months) the total
energy used was 98.4 kWh. My electricity plan is a 100% renewable plan (meaning they offset the
non-renewable parts) and costs {{ money(amount=0.33) }} kWh. Ignoring the daily service fee the cost of that
electricity is {{ money(amount=32.47) }}.

Since it turned out I was the only one doing package updates I kept the builder off when idle. When
there were packages to build I'd hit the power button (on the machine, not the smart plug) and some
time later when it was done it press it again to shut it down. This was pretty beneficial as the
idle draw was about 55W.

The number of package builds was around 5000. `SELECT COUNT(name) FROM logs WHERE name LIKE
'pkg:%';` from the Buildbot `state.sqlite` yields 5201, however that's probably slightly inflated
due to rebuilds/packages that failed to build on the first try.

The actual usage is likely more than double the 98kWh figure as all packages were built on my
desktop machine first, before pushing to the repository for the builder to pick up. That machine is
an AM5 system with AMD Ryzen 9 9950X3D 16-Core CPU (170W TDP), 64Gb DDR5 RAM. Additionally our house
has rooftop solar, and where possible I would kick off builds during the day so there was a better
chance of using the solar. That would have reduced the actual cost, but I have no way to measure the
specific amount.

The slowest package by far to build was Chromium, taking just shy of 4 hours to complete. Power draw
measured by the smart plug when the builder was fully loaded is about 193W. So 4 hours at 193W is
0.77kWh, which means a Chromium build costs about 25 cents.

Overall it cost a bit under {{ money(amount=5) }} a month (ignoring solar, and my workstation) to
build all the packages for a Linux distribution. That's not too bad I think.


{{ include_forex_script() }}

[Casuarina Linux]: https://casuarina.org/
[Chimera Linux]: https://chimera-linux.org/
