+++
title = "Fixing OpenBSD panic dc_atapi_start: not ready in KVM"
date = 2023-09-17T12:13:24+10:00

[extra]
updated = 2023-09-22T11:56:57+10:00
+++

I tried creating an OpenBSD 7.3 virtual machine on my new computer (Arch Linux
host) and the installer kept crashing with the error:

{{ figure(image="posts/2023/openbsd-db-atapi-start-not-ready/openbsd_panic_dc_atapi_start_not_ready.png", link="posts/2023/openbsd-db-atapi-start-not-ready/openbsd_panic_dc_atapi_start_not_ready.png", alt="Screenshot of the installer crash.", caption="Screenshot of the installer crash.") }}

```
dc_atapi_start: not ready, st = 50
fatal protection fault in supervisor mode trap type 4 code 0 rip ffffffff810089d9 cs 8 rflags 10282 cr2 287eb3000 cpl 6 rsp ffff800014fd11a0
gssbase Oxffffffff818fbff0 kgsbase Ox0
panic: trap type 4, code=0, pc=ffffffff810089d9
syncing disks...12 12 12 12 12 12 12 12 12 12 12 12 12 12 12 12 12 12 12 _
```

<!-- more -->

I did a bunch of searching online and tried a several different suggestions but that one that
worked for me was from [this Reddid thread][reddit]:

> **tinneriw31**
>
> Switch the virtual cd drive from ide to sata. Worked for me. Exact same issue.

I use [virt-manager] to manage VMs. These are the steps to do that when creating the VM:

1. Create the VM and at the last step choose "Customize configuration before install"
2. Click on the "IDE CDROM 1" tab and change "Disk bus" to SATA
3. Then click Apply, and then Begin installation in the top left.

After that the VM installed successfully.

{{ figure(image="posts/2023/openbsd-db-atapi-start-not-ready/virt-manager-customize-configuration.png", link="posts/2023/openbsd-db-atapi-start-not-ready/virt-manager-customize-configuration.png", alt="Screenshot of step 5 in the new virtual machine wizard in virt-manager showing the 'Customize configuration before install' option checked.", caption="Customize configuration before install.", width=504) }}

{{ figure(image="posts/2023/openbsd-db-atapi-start-not-ready/virt-manager-sata-cd-rom.png", link="posts/2023/openbsd-db-atapi-start-not-ready/virt-manager-sata-cd-rom.png", alt="Screenshot of the virt-manager CD ROM tab showing 'Disk bus: SATA' selected.", caption="Disk bus: SATA", width=1028) }}

[reddit]: https://www.reddit.com/r/openbsd/comments/12jzg2y/when_i_tried_to_install_openbsd_73_in_qemu_i/jhhk1gx/
[virt-manager]: https://virt-manager.org/
