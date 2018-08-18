I maintain a number of packages in the Arch User Repository (AUR). In this post
I describe how I use the RSS reader service, Feedbin, to stay on top of updates
so that users of my packages don't need to flag the package out of date when
new versions are released.

One of the many reasons that makes using Arch Linux a pleasure is the Arch User
Repository (AUR). The AUR allows users to contribute the scripts (`PKGBUILD`)
to build a package installable by the system package manager `pacman`. The
benefit installing software this was, is that all files are tracked, it's
easily uninstallable, dependencies can be expressed and installed when needed,
and you end up helping the community by making it easier for other to install
software.

When I encounter some software that is not yet packaged in the main repos or
AUR I'll often create an AUR package for it. In doing so I become the
maintainer of that package and am responsible for keeping it up to date. At the
time of writing I currently maintain 12 packages.

When a new version of the upstream software is release the AUR package needs
to be updated. It would be tiresome to have to repeatedly visit the source repository of every
project to check for new releases. Fortunately there's a solution to this
problem that has been around for a long time: RSS. RSS lets you subscribe to a
feed then your feed read checks for new entries and shows them. All you have to
do is check on your feed reader periodically.

A perhaps little known fact is that there is an Atom feed for the releases of
every GitHub project. The URL is that of the release page with `.atom`
appended. E.g. <https://github.com/wezm/titlecase/releases.atom>

My feed reader of choice is [Feedbin]. Feedbin is a hosted feed reader that
is supported by a number of number of clients. The code to Feedbin is open
source but I happily pay the $5/month knowing that I'm helping support it
and know that my data is not being sold on. (Feedbin's privacy policy is tiny)

Since the majority of projects that I am packaging are hosted on GitHub I can
subscribe to the releases of each one in Feedbin. I tag them all with "Releases".

https://feedbin.com/privacy-policy
