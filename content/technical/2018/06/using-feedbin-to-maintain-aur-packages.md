One of the many reasons that makes using Arch Linux a pleasure is the Arch User
Repository (AUR). The AUR allows users to contribute the scripts (`PKGBUILD`)
to build a package installable by `pacman`, the system package manager. The
benefit installing sortware this was, is that all fails are tracked, it's
easily uninstallable, dependencies can be expressed and installed when needed,
and you end up helping the community by making it easier for other to install
software.

When I encounter some software that is not yet packaged in the main repos or
AUR I'll often create an AUR package for it. In doing so I become the
maintainer of that package and am responsible for keeping it up to date. At the
time of writing I currently maintain 12 packages. 

It would be tiresome to have to repeatedly visit the source repository of every
project to check for new releases. Fortunately there's a solution to this
problem that has been around for a long time: RSS RSS lets you subscribe to a
feed then your feed read checks for new entries and shows them. All you have to
do is check on your feed reader periodically.

A perhaps little known fact is that there is an Atom feed for the releases of
every GitHub project. The URL is that of the release page with `.atom`
appended. E.g. https://github.com/wezm/titlecase/releases.atom

