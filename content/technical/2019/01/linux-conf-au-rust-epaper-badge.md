This week I attended linux.conf.au (for the first time) in Christchurch, New
Zealand. It's a week long conference covering Linux, open open source software
and hardware, privacy, security and much more. The theme this year was [IoT].
In line with the theme I built a digital conference badge to take to the
conference. It used a tri-colour e-Paper display and was powered by a Rust
program I built running on Raspbian Linux. This post describes how it was
built, how it works, and how it fared at the conference.

### Building

After booking my tickets in October I decided I wanted to build a digital
conference badge. I'm not entirely sure what prompted me to do this but it was
a combination of seeing projects like the [BADGEr] in past, the theme of
linux.conf.au 2019 being IoT, and an excuse to write more Rust. Since it was
ostensibly a Linux conference it also seemed appropriate for it to run Linux.

Over the next few weeks I collected the parts and adaptors to build the badge. The main components were:

* [Raspberry Pi Zero W] - AU$15.00
* [Pimoroni Inky pHAT] e-Paper display - AU$38.00

The Raspberry Pi Zero W is a single core 1Ghz ARM SoC with 512Mb RAM, Wi-FI,
Bluetooth, microSD card slot, and mini HDMI. The Inky pHAT is a 212x104 pixel
tri-colour (red, black, white) e-Paper display. It takes about 15 seconds to
refresh the display but it draws very little power in between updates and the
image persists even when power is removed.

I powered the badge with a several year old 4800mAh USB battery pack that I
already owned. Some rough calculations suggested that it should run for many
hours on this battery but I didn't actually test this until day 1 of the
conference.

### Support Crates

The first part of the project involved building a Rust driver for the
controller in the e-Paper display. That involved determining what controller
the display used, as Pimoroni did not document the display they used for the
Inky pHAT. Searching online  for some of the comments in the Python driver
suggested the display was possibly a HINK-E0213A07 - Electronic Paper display
from Holitech Co. Further searching based on [the datasheet for that
display][HINK-E0213A07] suggested that the controller was a [Solomon Systech
SSD1675][SSD1675]. Cross referencing the display datasheet, [SSD1675
datasheet], and the [Python source of Pimoroni's Inky pHAT
driver][https://github.com/pimoroni/inky] suggested I was on the right track.

I set about building the Rust driver for the SSD1675 using the [embedded HAL
traits]. These traits allow embedded Rust drivers to be built against a
defacto-standard set of traits that allow the driver to be used in any
environment that implements the traits. For example I make use of traits for
[SPI] devices, and [GPIO] pins, which are implemented for
[Linux][embedded-linx], as well as say, [STM32 dev boards]. This allows the
driver to be written once and be potentially usable on may different devices.

The result was the [ssd1675 crate]. It's a so called no-std crate. That means
it does not use the Rust standard library, instead sticking only to the core
library.  This allows the crate to be used in devices and microcontrollers
without features like file systems, or heap allocators. The crate also makes
use of the [embedded-graphics crate][embedded-graphics], which makes it easy to
draw text and basic shapes on the display in a memory efficient manner.

Whilst testing the ssd1675 crate I also built another crate, [profont], which
provides 7 sizes of the [ProFont font] for embedded graphics. The profont crate
was published 24 Nov 2018, and ssd1675 was published a month later on 26 Dec
2018.

### The Badge Itself

Now that I had all the prerequisites in place I could start working on the
badge proper. I had a few goals for the badge and its implementation:

* I wanted the badge to have some interactive component.
* I wanted there to be some sort of Internet aspect to tie in with the IoT
  theme of the conference.
* I wanted the badge to be entirely powered by a single, efficient Rust binary,
  that did not shell out to other commands, or anything like that.
* Ideally it would be relatively power efficient.

<figure>
  <img src="/images/2019/badge-early-revision_thumb.jpg" width="600" alt="Photo of e-Paper display showing my name, websize, IP address and uname information." />
  <figcaption>An early revision of the badge from 6 Jan 2019</figcaption>
</figure>

I settled on having the badge program serve up a web page with some information
about the project, myself, and some live stats of the Raspberry Pi (uptime,
free RAM, etc.). The plain text version of the page looked like this:

[Insert sample response hre]

The interactive part came in the form of a virtual 'hi' counter. Each HTTP POST
to the `/hi` endpoint incremented the count, which was shown on the badge. The
badge showed a URL to access in order to view the page, the URL was just the
badge's IP address on the conference Wi-Fi. To provide a little protection
against abuse I added code that only allowed a give IP to increment the count
once per hour.

When building the badge software these are some of the details and goals I implemented:

* Wi-Fi going away
* IP address changing
* Memory use of large POSTs (don
* Prevent duplicate submissions
* Pluralisation of text on the badge and on the web page
* Automatically shift the text as the count requires more digits
* If the web page is requested with an `Accept` header that doesn't include
  `text/html` (E.g. `curl`) then the response is plain text and the method to
  "say hello" is a curl command. If the user agent indicates they accept HTML
  then the page is HTML and conttains a form with a button to, "say hello".
* Avoid aborting on errors:
  * I kind of ran out of time to handle all errors well, but most are handled
    gracefully and won't abort the program. In some cases a default is used in
    the face of an eror. In other cases I just resorted to logging a mesasge and
    carrying on.
* Keep memory usage low:
  * The web server efficiently discards any large POST requests sent to it, to
    avoid exhausing RAM. Typical RAM stats showed around 420Mb free of the
    512Mb most of the time, of which some is taken for the GPU. The Rust
    program itself using about 4Mb.
* Be relatively power efficient
  * Use Rust instead of a scripting language
  * Only update the display when something it's showing changes
  * Only check for changes every 15 seconds (the rest of the time that tread just slept)
  * Put the display into deep sleep after updating

I used [hyper] for the HTTP server. To get a feel for the limits of the device
I did some rudimentary HTTP benchmarking with [wrk] and concluded that 300 requests
per second was was probably going to be fine. ;)

    Running 10s test @ http://10.0.0.18:8080/
      4 threads and 100 connections
      Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency   316.58ms   54.41ms   1.28s    92.04%
        Req/Sec    79.43     43.24   212.00     67.74%
      3099 requests in 10.04s, 3.77MB read
    Requests/sec:    308.61
    Transfer/sec:    384.56KB

### Mounting

When I started the project I imagined it would hang it around my neck like
conference lanyard. When departure day arrived I still hadn't worked out how
this would work in practice (power delivery being a major concern). In the end
I settled on attaching it to the strap on my backpack. My bag has lots of
webbing so there were plenty of loops to hold it in place. I was also able to
use the velcro covered holes intended for water tubes to get the cable neatly
into the bag.

## At the Conference

I had everything pretty much working for the start of the conference, although
I did make some final improvements and add a systemd unit to automatically start
and restart the Rust binary once I arrived in my accommodation on the Sunday
before the conference. At this point there were still two unknowns: battery
life and how the Raspberry Pi would handle coming in and out of Wi-Fi range.
The Wi-Fi turned out fine: automatically reconnecting whenever it came into
range of the Wi-Fi.

<figure>
  <img src="/images/2019/badge-sunday-night_thumb.jpg" width="600" alt="Badge display a count of zero." />
  <figcaption>Ready for day 1</figcaption>
</figure>

### Reception

At this point I had not had time to test battery life, so day one I hooked it
up and hoped for the best. Day 1 was a success! I had my first few people talk
to me about the badge and increment the counter. Battery life was good too.
After 12 hours of uptime the battery was still showing it was half full. Later
in the week I left the badge running overnight to hit 24 hours uptime. The
battery level indicator was on the last light so I suspect there wasn't much
juice left.

<figure>
  <img src="/images/2019/badge-first-hello_thumb.jpg" width="600" alt="Badge display showing a hello count of 1." />
  <figcaption>Me after receiving my first hello on the badge</figcaption>
</figure>

On day 2 I had had several people suggest that I needed a QR code for the URL.
Turns out entering an IP address on a phone keyboard is tedious. So after talks
that evening I added a QR code to the display. It's dynamically generated and
contains the same URL that is shown on the display. There were several good crates
to choose from. Ultimately I picked one that didn't have any image
dependencies, which allowed my to convert the data into embedded-graphics
pixels. The change was a success, most people scanned the QR code from this
point on.

<figure>
  <img src="/images/2019/badge-with-qr-code_thumb.jpg" width="600" alt="Badge display now including QR code." />
  <figcaption>Badge display showing the newly added QR code</figcaption>
</figure>

On day 2 I also ran into [E. Dunham][edunham], and rambled briefly about my
badge project and that it was built with Rust. To my absolute delight [the
project was featured in their talk the next day][edunham-talk]. The project was
mentioned and linked on slide and I was asked to raise my hand in case anyone
wanted to chat afterwards.

<figure>
  <img src="/images/2019/badge-edunham-talk_thumb.jpg" width="600" alt="Photo of E. Dunham's slide with a link to my git repo." />
  <figcaption>Photo of E. Dunham's slide with a link to my git repo</figcaption>
</figure>

At the end of the talk the audience was asked to talk about a Rust project they
were working on. Each person to do so got a little plush Ferris. I spoke about
[Read Rust] and am now the proud owner of a litle Ferris.

[Insert Ferris here]

### CHANGEME What did I learn?

By the end of the conference the badge showed a count of 12. It had worked
flawlessly over the five days.

Small projects with a fairly hard deadline are a good way to ensure it's seen
through to completion. Also a great motivator to publish some open source code.

I think I greatly overestimated the number of people that would interact with
the badge. Of those that did I think most tapped the button to increase the
counter and didn't read much else on the page. For example no one commented on
the system stats at the bottom of the page. I had imagined the badge as a sort
of digital business card but this did not really eventuate in practice.

Attaching the Pi and display to my bag worked out pretty well although I did
have to be careful when putting my bag on and it was easy to catch on my
clothes. Also one day it started raining on the way back to the accommodation.
I had not factored that in at all and given it wasn't super easy to take on and
off I ended up shielding it with my hand all the way back.

TODO: Link to code
TODO: Add images

### Would I do it again?

If I were to do it again I might do something less interactive and perhaps more
informational but updated more regularly. For example showing the previous and
next talks to attend. Perhaps even allowing free text.


Maybe. I think if I were to do something along these lines again I might try to tie into a talk submission.
For example I could have submitted a talk about using the embedded Rust ecosystem on a Rasperry Pi and made
reference to the badge in the talk or used it for examples. I think this would give more info about the project
to a bunch of people at once and also potentially teach them something at the same time.

[BADGEr]: https://wyolum.com/projects/badger/
[HINK-E0213A07]: https://www.unisystem-displays.com/en/fileuploader/download/download/?d=0&file=custom%2Fupload%2Ffile%2F6f3084488018ca68c5bf0a26460e7c57%2FHINK-E0213A07-V1.1-Spec.pdf
[SSD1675]: http://www.solomon-systech.com/en/product/advanced-display/bistable-display-driver-ic/SSD1675/
[SSD1675 datasheet]: https://www.buydisplay.com/download/ic/SSD1675A.pdf
[edunham-talk]: https://youtu.be/uCnnhMleoKA?t=530
[edunham]: http://edunham.net/
