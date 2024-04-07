+++
title = "Testing a $4 Micro SD Card From AliExpress"
date = 2024-04-07T15:06:25+10:00

#[extra]
#updated = 2024-02-21T10:05:19+10:00
+++

I needed three low capacity micro SD cards for an upcoming project. There's
plenty of these available on AliExpress but its very difficult to know if you
if the actual capacity will match the packaging. I did some research and came
across [this interesting video][video] that tested 16 different cards. Their
recommendation was the Lexar ones. So I found [some 32Gb ones for
AU$4.13][mycards] and placed an order[^1].

{{ figure(image="posts/2024/testing-aliexpress-sdcards/lexar-32gb-micro-sd-card.jpg", link="posts/2024/testing-aliexpress-sdcards/lexar-32gb-micro-sd-card.jpg", alt="Photo of the micro SD card in its packaging.", caption="The card being tested.", resize_width=880, width=440) }}

As per the video's suggestion I tested one with an open-source tool called
[F3 (Fight Flash Fraud)][f3] when they arrived. F3 verifies the capacity against
what the drive advertises and verifies that that amount of data can be written
and read back without error.

<!-- more -->

The card passed all tests. The packaging said up to 100MB/s read and is marked
C10/U1/V10, which is minimum 10MB/s sequential write. The tests showed a
write speed of 30.7MB/s and a read speed of 90.9MB/s, which feels within the
values advertised.

No idea what the endurance of the flash memory will end up being but I intend
to use them in a low-write environment, where failure doesn't really matter. If
the data the cards was storing was not easily replaced, such as photos, I
would still purchase from a repeatable local seller. However, for holding an
operating system image for a non-critical single board computer these seem
fine.

### Full Results

```
$ doas f3probe --destructive --time-ops /dev/sde
F3 probe 8.0
Copyright (C) 2010 Digirati Internet LTDA.
This is free software; see the source for copying conditions.

WARNING: Probing normally takes from a few seconds to 15 minutes, but
         it can take longer. Please be patient.

Good news: The device `/dev/sde' is the real thing

Device geometry:
	         *Usable* size: 29.54 GB (61952000 blocks)
	        Announced size: 29.54 GB (61952000 blocks)
	                Module: 32.00 GB (2^35 Bytes)
	Approximate cache size: 0.00 Byte (0 blocks), need-reset=no
	   Physical block size: 512.00 Byte (2^9 Bytes)

Probe time: 1'02"
 Operation: total time / count = avg time
      Read: 347.8ms / 4815 = 72us
     Write: 1'02" / 4192321 = 14us
     Reset: 0us / 1 = 0us

$ f3write /run/media/wmoore/8BF0-E09E/
F3 write 8.0
Copyright (C) 2010 Digirati Internet LTDA.
This is free software; see the source for copying conditions.

Free space: 29.53 GB
Creating file 1.h2w ... OK!
Creating file 2.h2w ... OK!
Creating file 3.h2w ... OK!
Creating file 4.h2w ... OK!
Creating file 5.h2w ... OK!
Creating file 6.h2w ... OK!
Creating file 7.h2w ... OK!
Creating file 8.h2w ... OK!
Creating file 9.h2w ... OK!
Creating file 10.h2w ... OK!
Creating file 11.h2w ... OK!
Creating file 12.h2w ... OK!
Creating file 13.h2w ... OK!
Creating file 14.h2w ... OK!
Creating file 15.h2w ... OK!
Creating file 16.h2w ... OK!
Creating file 17.h2w ... OK!
Creating file 18.h2w ... OK!
Creating file 19.h2w ... OK!
Creating file 20.h2w ... OK!
Creating file 21.h2w ... OK!
Creating file 22.h2w ... OK!
Creating file 23.h2w ... OK!
Creating file 24.h2w ... OK!
Creating file 25.h2w ... OK!
Creating file 26.h2w ... OK!
Creating file 27.h2w ... OK!
Creating file 28.h2w ... OK!
Creating file 29.h2w ... OK!
Creating file 30.h2w ... OK!
Free space: 0.00 Byte
Average writing speed: 30.71 MB/s

$ f3read /run/media/wmoore/8BF0-E09E/
F3 read 8.0
Copyright (C) 2010 Digirati Internet LTDA.
This is free software; see the source for copying conditions.

                  SECTORS      ok/corrupted/changed/overwritten
Validating file 1.h2w ... 2097152/        0/      0/      0
Validating file 2.h2w ... 2097152/        0/      0/      0
Validating file 3.h2w ... 2097152/        0/      0/      0
Validating file 4.h2w ... 2097152/        0/      0/      0
Validating file 5.h2w ... 2097152/        0/      0/      0
Validating file 6.h2w ... 2097152/        0/      0/      0
Validating file 7.h2w ... 2097152/        0/      0/      0
Validating file 8.h2w ... 2097152/        0/      0/      0
Validating file 9.h2w ... 2097152/        0/      0/      0
Validating file 10.h2w ... 2097152/        0/      0/      0
Validating file 11.h2w ... 2097152/        0/      0/      0
Validating file 12.h2w ... 2097152/        0/      0/      0
Validating file 13.h2w ... 2097152/        0/      0/      0
Validating file 14.h2w ... 2097152/        0/      0/      0
Validating file 15.h2w ... 2097152/        0/      0/      0
Validating file 16.h2w ... 2097152/        0/      0/      0
Validating file 17.h2w ... 2097152/        0/      0/      0
Validating file 18.h2w ... 2097152/        0/      0/      0
Validating file 19.h2w ... 2097152/        0/      0/      0
Validating file 20.h2w ... 2097152/        0/      0/      0
Validating file 21.h2w ... 2097152/        0/      0/      0
Validating file 22.h2w ... 2097152/        0/      0/      0
Validating file 23.h2w ... 2097152/        0/      0/      0
Validating file 24.h2w ... 2097152/        0/      0/      0
Validating file 25.h2w ... 2097152/        0/      0/      0
Validating file 26.h2w ... 2097152/        0/      0/      0
Validating file 27.h2w ... 2097152/        0/      0/      0
Validating file 28.h2w ... 2097152/        0/      0/      0
Validating file 29.h2w ... 2097152/        0/      0/      0
Validating file 30.h2w ... 1102208/        0/      0/      0

  Data OK: 29.53 GB (61919616 sectors)
Data LOST: 0.00 Byte (0 sectors)
	       Corrupted: 0.00 Byte (0 sectors)
	Slightly changed: 0.00 Byte (0 sectors)
	     Overwritten: 0.00 Byte (0 sectors)
Average reading speed: 90.93 MB/s
```

[^1]: While these were branded Lexar there's really no way to know when ordering if they are
genuine or not. The main thing I care about is whether they hold as much data as they say.

[f3]: https://github.com/AltraMayor/f3
[video]: https://www.youtube.com/watch?v=efwDleEJY2w
[mycards]: https://www.aliexpress.com/item/1005005956657740.html
