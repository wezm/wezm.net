+++
title = "Automated Chimera Linux Installation With pyinfra"
date = 2024-11-22T12:59:32+10:00

# [extra]
# updated = 2024-07-26T09:58:10+10:00
+++


I have written some pyinfra deploys to make installing Chimera Linux quick and easy.
They allow me to go from a machine booted into the installer to booting itself in
a minute or two. The deploys are targetted at virtual machines, either running on
my desktop with KVM, or on a VPS host like Digital Ocean, Vultr, or RackNerd.
I've also included a way to bootstrap remote access to the machine for Installation
using `xdotool`.

- There are variants for EFI and BIOS based systems.
- The code is at: ...
- It's not a completely generic framework; feel free to tweak settings as needed
- You can just run it again if you want to tweak things, reboot, re-run bootstrap; then re-run pyinfra

<!-- more -->

My examples will demonstrate using the tooling on a Vultr$ VM but I've also run them
against VMs running on my Linux desktop with KVM, and machines hosted on RackNerd — they should work in most places.

- Assumptions: 
    - Linux X11 host
        - If you know how to do xdotool on Wayland let me know.
- initial setup
    - You've cloned the `chimera-pyinfra` repo and `pwd` is it
    - create venv, activate, install pyinfra
- Boot from the Chimera Live CD
- Bootstrap access to the machine with xdotool
- Note IP and disk path
- Verify access with pyinfra: `exec uname` or something
- Run pyinfra against the machine
- Hit Enter to continue
- `exec reboot`
- Done, you should be able to ssh to the machine
- From here you can do post-installation tasks; install additional packages, etc.
- You may choose to continue to manage the system with pyinfa, or just use this
  to install, then manage by hand.
