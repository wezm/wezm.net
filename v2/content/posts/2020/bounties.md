+++
title = "Software Bounties"
date = 2020-05-22T20:07:43+10:00

[extra]
updated = 2020-06-19T09:30:00+10:00
+++

I don't have time to build all the things I'd like to build, so I'm offering
bounties on the following work.

<!-- more -->

**Details**

* Payment will be made via PayPal when the criteria is met. If you would prefer
  another mechanism, feel free to suggest it, but no guarantees.
* Amounts are in Australian dollars.
* I will not pay out a bounty after the expiration date.
* I may choose to extend the expiration date.
* _How can I trust you'll pay me?_ I like to think that I'm a trustworthy
  person. However, if you would like to discuss a partial payment prior
  to starting work please get in touch.
* You have to be the primary contributor to claim the bounty. If someone else
  does all the work and you just nudge it over the line the other person is
  the intended recipient.
* If in doubt contact me.

### Cairo user-font With Colour Bitmap Always Comes Out Black

The [Evince] PDF viewer uses [Poppler] to render PDFs, which in turn uses
[Cairo].  Emoji embedded in a PDF using a PDF Type 3 font always come out as a
black silhouette instead of the colour image when viewed in Evince do to a
limitation in Cairo's user-font functionality.

**Issues:**

* <https://gitlab.freedesktop.org/cairo/cairo/-/issues/389>,
* <https://gitlab.freedesktop.org/poppler/poppler/-/issues/729>

**Criteria:** Implement support for colour user-fonts in Cairo, resulting in
the Cairo issue being closed as completed.  
**Language:** C  
**Amount:** AU$500  
**Expires:** 2021-01-01T00:00:00Z  

[Evince]: https://wiki.gnome.org/Apps/Evince
[Poppler]: https://gitlab.freedesktop.org/poppler/poppler
[Cairo]: https://www.cairographics.org/

### Emoji Reactions in Fractal

[Fractal] is a [Matrix] client written in Rust using GTK.

**Issue:** <https://gitlab.gnome.org/GNOME/fractal/-/issues/530>  
**Criteria:** Implement emoji reactions in Fractal to the satisfaction of the
maintainers, resulting in the issue being closed as completed.  
**Language:** Rust  
**Amount:** AU$500  
**Expires:** 2021-01-01T00:00:00Z  

[Fractal]: https://gitlab.gnome.org/GNOME/fractal
[Matrix]: https://matrix.org/

### Update Mattermost Server to Support Emoji Added After Unicode 9.0

[Mattermost's][Mattermost] emoji picker is stuck on emoji from Unicode 9. We're
now up to Unicode 13 and many emoji added in the last few years are missing.
This bounty pertains only to the work required in the Mattermost server, not
the desktop and mobile apps.

**Issue:** <https://mattermost.atlassian.net/browse/MM-13676>  
**Criteria:** Update the list of emoji in the Mattermost server to Unicode
13.0, resulting in the issue being closed as completed.  
**Language:** Go  
**Amount:** AU$200  
**Expires:** 2021-01-01T00:00:00Z  

[Mattermost]: https://mattermost.com/
