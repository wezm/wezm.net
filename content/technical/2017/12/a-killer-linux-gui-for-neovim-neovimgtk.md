Back in October Kade Killary wrote, [A Killer GUI For Neovim: VimR][kade-vimr].
[VimR] is an excellent Neovim GUI on macOS but ever since reading the article
I've been meaning the write about the Neovim GUI I use on Linux: [NeovimGtk].

NeovimGtk doesn't have quite as many bells and whistles as VimR (yet) but it does
have a few. Like VimR, it's a native application (no Electron, etc.). It's
developed in [Rust], and as the name implies uses the GTK toolkit to feel right
at home on a GNOME desktop.

I am a huge fan of the [PragmataPro] font, and one of NeovimGtk's killer
features for me is support for font [ligatures]. This means it renders text
with wonderful typographic beauty.

<figure>
  <img src="/images/2017/neovim-gtk-ligatures.png" alt="NeovimGtk displaying Rust code in PragmataPro with ligatures" />
  <figcaption>NeovimGtk displaying Rust code in PragmataPro with ligatures.</figcaption>
</figure>

Ligature support was what initially drew me to NeovimGtk but since I've started
using it, its creator, [daa84], and a handful of contributors have added
several more features.

There is a file/project picker to open recent files and projects (directories).
Checking the check box on a directory makes that item always available in the
list for quick access.

<figure>
  <img src="/images/2017/neovim-gtk-project-switcher.png" alt="NeovimGtk displaying the file/project picker" />
  <figcaption>The file/project picker.</figcaption>
</figure>

One of the more recent additions was a plugin manager. It lists installed vim
plugins and allows news ones to be added. Behind the scenes it uses the
excellent [vim-plug].

<figure>
  <img src="/images/2017/neovim-gtk-plugin-manager.png" alt="NeovimGtk plugin manager" />
  <figcaption>Plugin manager.</figcaption>
</figure>

Another recent addition enabled support for wide glyphs. PragmataPro has a few
of these in the non-Mono variant of the font. The extra width is used to make
the glyph more legible. This makes [devicons] and [Neomake] warnings render nicely.

<figure>
  <img src="/images/2017/neovim-gtk-wide-glyphs.png" alt="NeovimGtk displaying a double wide warning symbol next to a line with a compiler warning" width="451" />
  <figcaption>A double wide warning symbol next to a line with a compiler warning.</figcaption>
</figure>


Native controls are used for the tab bar and pop-up menus.

<figure>
  <img src="/images/2017/neovim-gtk-gui-menu.png" alt="NeovimGtk displaying a native pop-up menu" />
  <figcaption>Native pop-up menu.</figcaption>
</figure>

<figure>
  <img src="/images/2017/neovim-gtk-native-tabs.png" alt="NeovimGtk displaying open tabs using a native tab control" />
  <figcaption>Native tabs.</figcaption>
</figure>

So if you're a Neovim user on Linux I can certainly recommend you check out NeovimGtk. Installation
currently requires building from source. However for Arch Linux users I have created an [AUR
package] for easy installation.

[kade-vimr]: https://medium.com/@kadek/a-killer-gui-for-neovim-vimr-ce68e4fa1a3b
[NeovimGtk]: https://github.com/daa84/neovim-gtk
[Rust]: https://www.rust-lang.org/
[PragmataPro]: https://www.fsd.it/shop/fonts/pragmatapro/
[ligatures]: https://en.wikipedia.org/wiki/Typographic_ligature
[daa84]: https://github.com/daa84
[VimR]: http://vimr.org/
[vim-plug]: https://github.com/junegunn/vim-plug
[AUR package]: https://aur.archlinux.org/packages/neovim-gtk-git
[devicons]: https://github.com/ryanoasis/vim-devicons
[Neomake]: https://github.com/neomake/neomake
