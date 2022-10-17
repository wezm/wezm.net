+++
title = "Garage Door Monitor Update"
date = 2022-10-17T15:04:44+10:00

#[extra]
#updated = 2022-04-21T09:07:57+10:00
+++


[The garage door monitor that I built earlier in the year](@/posts/2022/garage-door-monitor/index.md)
has by all accounts been running perfectly since I installed it. Recently I
implemented a couple of new features that I've wished for over the last few
months.

<!-- more -->

The first new feature is a bit more visibility into the state of the system. I
added uptime and memory info to the web page:

{{ figure(image="posts/2022/garage-door-monitor-update/webpage.png", link="posts/2022/garage-door-monitor-update/webpage.png", alt="Screenshot of the web page served by the garage door monitor. It shows the state of the door, uptime of the device, and memory usage information.", caption="Screenshot of the web page now including uptime and memory info.", width=625) }}

The second and more practical addition is a subsequent notification when the
door is closed again after it was left open for longer that the trigger time (5
minutes).

{{ figure(image="posts/2022/garage-door-monitor-update/new-mattermost-notification.png", link="posts/2022/garage-door-monitor-update/new-mattermost-notification.png", alt="Screenshot of the message posted to Mattermost by the garage door monitor. It reads: Garage door closed after 5 minutes open.", caption="The new notification", width=403, border=true) }}

Since I set up the garage door monitor I haven't accidentally left it open.
However, I have triggered the notification when washing the car or packing for
a road trip. It's this latter scenario that I wanted to address. The issue is
that because the notification is triggered during packing if I did set off and
forget to close the door I wouldn't know. One way to deal with this would be
recurring notifications. I chose another option though.

When the door is closed after notifying that it was left open, it sends another
message saying that it's now closed. The benefit of this approach is that the
message log now properly tracks the state of the door, so if I'm a few kms down
the road and wonder if I closed the door it's just a matter of checking the
channel in Mattermost.

Before I powered it off to update the Buildroot image on the SD card I hooked
up a serial console and checked its uptime. I was pleased to see 100% uptime
since it was first installed:

```
 02:03:14 up 183 days, 20:26,  load average: 0.00, 0.00, 0.00
```

That's all for now, on to the next few hundred days of service!

[Garage door monitor source on GitHub](https://github.com/wezm/garage-door-monitor)
