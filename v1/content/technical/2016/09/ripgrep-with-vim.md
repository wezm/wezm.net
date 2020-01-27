[ripgrep][rg] (`rg`) is a new text search tool by [Andrew Gallant][BurntSushi]:

> ripgrep combines the usability of [The Silver Searcher][ag] (an [ack] clone)
> with the raw performance of [GNU grep][grep]. ripgrep is fast, cross platform
> (with binaries available for Linux, Mac and Windows) and written in
> [Rust][rust].

[BurntSushi]: http://blog.burntsushi.net/about/
[ack]: http://beyondgrep.com/
[ag]: https://github.com/ggreer/the_silver_searcher
[grep]: https://www.gnu.org/software/grep/
[rg]: https://github.com/BurntSushi/ripgrep
[rgbench]: http://blog.burntsushi.net/ripgrep/
[rust]: https://www.rust-lang.org/

Andrew has written in [extensive detail on the benchmarking][rgbench] he did,
which shows `ripgrep` is one of the fastest and most correct tools of this
nature. To make use of `ripgrep` within vim here are a few options:

Set [grepprg](http://vimdoc.sourceforge.net/htmldoc/options.html#'grepprg'),
which is used by [:grep][colon-grep] to search a project and add the matches
to the quickfix list:

    if executable("rg")
        set grepprg=rg\ --vimgrep\ --no-heading
        set grepformat=%f:%l:%c:%m,%f:%l:%m
    endif

[colon-grep]: http://vimdoc.sourceforge.net/htmldoc/quickfix.html#:grep

For use with [ack.vim](https://github.com/mileszs/ack.vim) set `g:ackprg` as
follows. Now when you run `:Ack` it will use `rg` instead:

    let g:ackprg = 'rg --vimgrep --no-heading'

One of my favourite plugins, [fzf.vim](https://github.com/junegunn/fzf.vim) has
built-in support for `ag`. I've created an [experimental fork][fork] that adds
support for `rg` to it.  My fork adds the `:Rg` user command, which works the
same way as the existing `:Ag` command.  To use my version of the plugin with
[vim-plug] add the following to your `.vimrc`:

    Plug 'wezm/fzf.vim', { 'branch': 'rg' }

The line will be similar in Vundle or pathogen.

**Update 30 Sep 2017:** You can now use `rg` with `fzf.vim` by defining a new
command and then mapping it to the shortcut of your choice:

    command! -bang -nargs=* Rg
          \ call fzf#vim#grep(
          \   'rg --column --line-number --no-heading --color=always --ignore-case '.shellescape(<q-args>), 1,
          \   <bang>0 ? fzf#vim#with_preview('up:60%')
          \           : fzf#vim#with_preview('right:50%:hidden', '?'),
          \   <bang>0)

    nnoremap <C-p>a :Rg 

[fork]: https://github.com/wezm/fzf.vim/tree/rg
[vim-plug]: https://github.com/junegunn/vim-plug
