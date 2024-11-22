+++
title = "Tiny CDN"
#title = "Overengineering my low traffic website"
#title = "Running a tiny CDN for $3/m"
#title = "Deploying my Rust web application around the world"
date = 2024-11-22T08:55:40+10:00

# [extra]
# updated = 2024-07-26T09:58:10+10:00
+++

- Linked List is a Rust application
- I track how long it takes to generate a response. I.e. from request received to response generated
- On my Vultr VM this took 1ms or less, however some pages like the home page would sometimes take multiple milliseconds, I felt I could do better.
- The application loads the content into memory and renders on the fly for each request
- I added caching so that the body is only generated once, then served for future requests
- Response generation time now averages about a third of a millisecond 323µs
- I was satisfied with that until I saw the charts in updown.io
- Unsurprisingly with my server in Australia, the actual times people would experience when
  vesting could be a lot higher. [image]
- I could have slapped Clouflare or Fastly in front of the site and called it a day but
  a. that's no fun
  b. I'd prefer to avoid giving them (especially Cloudflare) even more of the Internet's
     traffic, no matter how miniscule.
- Based on basic stats from GoatCounter the bulk of my visitors were coming from the US
  or Europe, so I wanted to have the site running in those locations in addition to AU
- Being a native exeutable the application is extremely lightweight so I did some
  research on bargain basement VPS's on LowEndBox and found a provider that offered
  KVM based VMs, custom ISO support, and had US and European data centres: RackNerd.
- I created a server in New York, and another in France, they each cost about US$12 per **year** — probably still more than Cloudflare or Fastly but pretty cheap for a MV with 1Gb RAM.
- I did some initial testing to verify that responses from these servers were in fact going to improve things (because they were so cheap I wanted to make sure the network and underlying hardware was not over provisioned)
- I then installed Chimera Linux on each of the two new servers using my pyinfa install scripts
- todo: chimera resource usage RAM and disk
- I wrote more pyinfra code to install and configure other stuff that they needed like nginx
- I defined a cports template for the linkedlist binary so that it could be installed as an apk package on the system, with dinit config to manage the service
- SSL certs proved to be a challenge as the all needed a copy of the certs. I explored various options here, it's common problem with a bunch of hosted and self-hosted solutions. But all seems too complicated just for syncing two files between servers
- I use lego to manage certs from Let's Encrypt
- I wasn't super keen on the idea of one of the app servers needing to know about and push the certs to the others
- In the end I revived a fanless Qotom Mini PC https://qotom.net/product/29.html, again using my Chimera install scripts to set it up followed by more
  pyinfra code to configure it
- This machine is in my home is responsible for managing the certs with lego and pushing out updated files when they're renewed via a new hook script
- I already had a third server in Australia hosting my Chimera Linux mirror that I roped into being an AU POP for Linked List
- I coordinate thigs with a simple Makefile
- make apk will build the linkedlist apk using cbuild. This works on Arch Linux as well as my Chimera WSL2 install on my Windows ARM laptop: cross-compiling is build into cbuild/cports
- make deploy-apk pushes out the updated apk to the servers, updates them, and restarts it
- make deploy, rsyncs the content to the servers. I use xargs to do this in parallel to them all
- Now all the servers were running the application I needed to work out how to route traffic to them
- I toyed with using Deno Deploy's edge network to act as a proxy (link to sample code) but I didn't like that this added the additional latency of an extra request.
- I ended up using gcode managed DNS, which has a GeoDNS feature where you can resolve requests based on geo ip info
  - I'm happy to pay for this but I'm currently in their free tier.
- This is the config I used there:
    - x goes to y, z goes to a, b is default as it's the most powerful
- I used ping bear to check things as well as updown
- This is the end result
