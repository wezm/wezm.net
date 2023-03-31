+++
title = "How to use DeRez"
date = 2023-03-20T12:44:38+10:00

#[extra]
#updated = 2023-03-01T21:54:06+10:00
+++

After my post on trying to run
[Rust on Classic Mac OS post](@/posts/2023/rust-on-ppc-classic-mac-os/index.md) I continued trying to
find a modern language that I can use to build classic Mac OS software. I've
had some success with [Nim] and built a little
[temperature converter application][nim-temp-src]. As part of this I wanted to be able to use
[ResEdit] to edit the layout of the dialog. The problem was that I need a way
to convert the modified resources back into the textual representation used in
the source code. In this post I describe how I did this with `DeRez`.

<!-- more -->

{{ video(video="posts/2023/derez/mac-nim-temp.mp4", height=227, poster="png", preload="auto", alt="Video of the temperature converter application.", caption="Video of the temperature converter application.") }}

To build the temperature converter I started with the [Dialog sample] from
[Retro68], which looks like this:

{{ figure(image="posts/2023/derez/Dialog.png", link="posts/2023/derez/Dialog.png", pixelated=true, alt="Screenshot of the Dialog sample from Retro68. It has a static text item, edit text item, check box, two radio buttons, and a Quit button.", caption="Dialog Sample") }}

I opened it up in ResEdit and edited the `DITL` (Dialog Template) resource to
add the icon and temperature fields. I also added a new `ICON` resource and
drew a little thermometer:

{{ figure(image="posts/2023/derez/DITL.png", link="posts/2023/derez/DITL.png", pixelated=true, alt="Screenshot of the ResEdit DITL editor editing the DITL resource for my temperature converter.", caption="Editing DITL resource in ResEdit") }}

With the changes made, I now wanted to convert the binary resources stored in
the resource fork back into the [textual format used in the source code][dialog.r].
I believe the format is called `Rez`, here's a snippet of it:

```
resource 'DITL' (128) {
	{
		{ 190-10-20, 320-10-80, 190-10, 320-10 },
		Button { enabled, "Quit" };

		{ 190-10-20-5, 320-10-80-5, 190-10+5, 320-10+5 },
		UserItem { enabled };

		{ 10, 10, 30, 310 },
		StaticText { enabled, "Static Text Item" };

		{ 40, 10, 56, 310 },
		EditText { enabled, "Edit Text Item" };

		{ 70, 10, 86, 310 },
		CheckBox { enabled, "Check Box" };

		{ 90, 10, 106, 310 },
		RadioButton { enabled, "Radio 1" };

		{ 110, 10, 126, 310 },
		RadioButton { enabled, "Radio 2" };
	}
};
```

This turned out to be a bit of journey and the motivation for this blog post.
As part of the [Macintosh Programmers Workshop][mpw] (MPW) theres is a tool
called `DeRez` that does what I want. First up I had to work out how to operate
MPW. It's an editable shell where you run commands with ⌘-Return. Once I worked
that out I could run `DeRez` on my edited application but I only got the
fullback hexadecimal representation of the resources, not the structured output
I wanted:

```
data 'DITL' (128) {
	$"0007 0000 0000 00A0 00E6 00B4 0136 0404"            /* ....... .æ.´.6.. */
	$"5175 6974 0000 0000 009B 00E1 00B9 013B"            /* Quit......á.¹.; */
	$"0000 0000 0000 0046 000A 005A 0136 0808"            /* .......F...Z.6.. */
	$"4865 6C6C 6F20 5E30 0000 0000 001E 000A"            /* Hello ^0........ */
	$"003E 002A A002 0597 0000 0000 0014 0032"            /* .>.* .........2 */
	$"0024 007D 8807 4365 6C73 6975 7300 0000"            /* .$.}.Celsius... */
	$"0000 0014 00AA 0024 00F5 8809 4661 7265"            /* .....ª.$.õÆFare */
	$"6E68 6569 7400 0000 0000 0029 0036 0039"            /* nheit......).6.9 */
	$"0081 1009 4564 6974 2054 6578 7400 0000"            /* ..ÆEdit Text... */
	$"0000 002B 00AE 003B 00F9 1009 4564 6974"            /* ...+.®.;.ù.ÆEdit */
	$"2054 6578 7400"                                     /*  Text. */
};
```

`Help DeRez` in MPW didn't shed much light on the problem but after a lot of
searching online I eventually found some extra details in the [man page for
`DeRez`][DeRez man] shipped on Mac OS X. Specifically:

> The type declarations for the standard
> Macintosh resources are contained in the `Carbon.r` resource header file,
> contained in the Carbon framework.  You may use the ${RIncludes} shell
> environment variable to define a default path to resource header files.
> If you do not specify any type declaration files, `DeRez` produces data
> statements in hexadecimal form.

and

> You can also specify resource description
> files containing type declarations.  For each type declaration file on
> the command line, DeRez applies the following search rules:
> 
> 1. DeRez tries to open the file with the name specified as is.
> 
> 2. If rule 1 fails and the filename contains no colons or begins with a
>    colon, DeRez appends the filename to each of the pathnames specified by
>    the {RIncludes} environment variable and tries to open the file.

With this information I was able to construct a command that worked:


```
DeRez -i 'Macintosh HD:MPW-GM:Interfaces&Libraries:Interfaces:RIncludes:' "Macintosh HD:Retro68:Retro68App" Carbon.r
```

`-i` sets the include path for type declarations and `Carbon.r` tells it to use
that file for resource descriptions. Running the command I was now rewarded
with textual resources:

{{ figure(image="posts/2023/derez/MPW.png", link="posts/2023/derez/MPW.png", pixelated=true, alt="Screenshot of an MPW worksheet on Mac OS 8 showing the output of running DeRez on an application.", caption="DeRez output in MPW") }}

To get the text out of the VM I copied and pasted it into a new document in
[BBEdit] (version 5.0) and saved it with Unix line endings to the Unix folder
that [SheepShaver] shares with the host and with that I was able to update the
[resource file in my temperature converter project][my dialog.r].

### Honorable Mention

Whilst trying to work out how to do all this I was also reminded of Ninji's
[mpw-emu] project ([detailed write-up on their blog][mpw-emu-blog]). It
combines an emulator with implementations of library functions in order to be
able to run MPW tools directly (outside a Mac OS emulator). It has gained
support for `DeRez` so you can run `DeRez` directly on a host system like
Linux. 

I [MacBinaried][MacBinary] `DeRez` in SheepShaver and copied it to my Linux host. Then with a bit
of fussing with `mpw-emu` Rust code I was able to run it:

```
$ mpw-emu ~/Documents/Classic\ Mac/Shared\ 2/DeRez.bin
[2023-03-20T02:11:07Z ERROR emulator] Unimplemented call to InterfaceLib::SetFScaleDisable @10012C6C
[2023-03-20T02:11:07Z ERROR stdio] Unimplemented format character: P
[2023-03-20T02:11:07Z ERROR emulator] Unimplemented call to InterfaceLib::SecondsToDate @1000B2A4
### /home/wmoore/Documents/Classic Mac/Shared 2/DeRez.bin - No filename to de-compile was specified.
### /home/wmoore/Documents/Classic Mac/Shared 2/DeRez.bin - Usage: /home/wmoore/Documents/Classic Mac/Shared 2/DeRez.bin resourceFile [-c] [-d name[=value]] [-e] [-i path] [-m n] [-noResolve [output | include]] [-only type[(id[:id])]] [-p] [-rd] [-s type[(id[:id])]] [-script japanese | tradChinese | simpChinese | korean] [-u name] [file…].
```

Amazing!

Unfortunately I don't think `DeRez` will work this way outside a macOS host. It
needs to be able to read the resource fork of the application I edited with
ResEdit and that is not preserved on Linux:

```
$ mpw-emu ~/Documents/Classic\ Mac/Shared\ 2/DeRez.bin Dialog.APPL
[2023-03-20T02:14:05Z ERROR emulator] Unimplemented call to InterfaceLib::SetFScaleDisable @10012C6C
[2023-03-20T02:14:05Z ERROR stdio] Unimplemented format character: P
[2023-03-20T02:14:05Z ERROR emulator] Unimplemented call to InterfaceLib::SecondsToDate @1000B2A4
### /home/wmoore/Documents/Classic Mac/Shared 2/DeRez.bin - The resource fork of "Dialog.APPL" is empty and uninitialized.
```

If you're on macOS I think that this would actually work. Although now I think
about it Xcode ships (or at least used to) a native version of `DeRez` so now
I'm not sure what Ninji's motivation for making it work in `mpw-emu` was.
Perhaps it is possible to use on Linux somehow...

[Nim]: https://nim-lang.org/
[ResEdit]: https://en.wikipedia.org/wiki/ResEdit
[Retro68]: https://github.com/autc04/Retro68
[Dialog sample]: https://github.com/autc04/Retro68/tree/5f882506013a0a8a4335350197a1b7c91763494e/Samples/Dialog
[dialog.r]: https://github.com/autc04/Retro68/blob/5f882506013a0a8a4335350197a1b7c91763494e/Samples/Dialog/dialog.r
[DeRez man]: https://www.manpagez.com/man/1/DeRez/
[BBEdit]: http://www.barebones.com/products/bbedit/index.html
[SheepShaver]: https://sheepshaver.cebix.net/
[my dialog.r]: https://github.com/wezm/classic-mac-nim/blob/39e6ed7c2b31c20b775782319cde8ae5a43e1512/dialog.r
[mpw-emu]: https://github.com/Treeki/mpw-emu
[mpw-emu-blog]: https://wuffs.org/blog/emulating-mac-compilers
[mpw]: https://en.wikipedia.org/wiki/Macintosh_Programmer%27s_Workshop
[MacBinary]: https://en.wikipedia.org/wiki/MacBinary
[nim-temp-src]: https://github.com/wezm/classic-mac-nim/tree/39e6ed7c2b31c20b775782319cde8ae5a43e1512
