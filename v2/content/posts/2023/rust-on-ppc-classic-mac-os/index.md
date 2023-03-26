+++
title = "Trying to Run Rust on Classic Mac OS"
date = 2023-02-27T10:06:28+10:00

[extra]
updated = 2023-03-26T14:27:05+10:00
+++

I recently acquired a Power Macintosh 9500/150 and after cleaning it up and
building a [BlueSCSI] to replace the failed hard drive it's now in a
semi-operational state. This weekend I thought I'd see if I could build a Mac
app for it that called some Rust code. This post details my trials and
tribulations.

<!-- more -->

I started by building [Retro68], which is a modernish GCC based toolchain
that allows cross-compiling applications for 68K and PPC Macs. With Retro68
built I set up a VM in [SheepShaver] running Mac OS 8.1. Using the LaunchAAPL
and LaunchAAPLServer tools that come with Retro68 I was able to build the
sample applications and launch them in the emulated Mac.

With the basic workflow working I set about creating a Rust project that built
a static library with one very basic exported function. It just returns a
static [Pascal string] when called.

```rust
#![no_std]
#![feature(lang_items)]

use core::panic::PanicInfo;

static MSG: &[u8] = b"\x04Rust";

#[no_mangle]
pub unsafe extern "C" fn hello_rust() -> *const u8 {
    MSG.as_ptr()
}

#[panic_handler]
fn panic(_panic: &PanicInfo<'_>) -> ! {
    loop {}
}

#[lang = "eh_personality"]
extern "C" fn eh_personality() {}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_msg_is_pascal_string() {
        assert_eq!(MSG[0], MSG[1..].len().try_into().unwrap());
    }
}
```

Classic Mac OS is not a target that Rust knows about so I created a custom
target JSON definition named `powerpc-apple-macos.json` based on prior work by
kmeisthax in [this GitHub discussion](https://github.com/autc04/Retro68/discussions/123#discussioncomment-597268):

```json
{
  "arch": "powerpc",
  "data-layout": "E-m:a-p:32:32-i64:64-n32",
  "executables": true,
  "llvm-target": "powerpc-unknown-none",
  "max-atomic-width": 32,
  "os": "macosclassic",
  "vendor": "apple",
  "target-endian": "big",
  "target-pointer-width": "32",
  "linker": "powerpc-apple-macos-gcc",
  "linker-flavor": "gcc",
  "linker-is-gnu": true
}
```

I was able to build the static library with this cargo invocation:

```
cargo +nightly build --release -Z build-std=core --target powerpc-apple-macos.json
```

It's using nightly because it's using unstable features to build `core` and the
`eh_personality` lang item in the code.

This successfully compiles and produces
`target/powerpc-apple-macos/release/libclassic_mac_rust.a`

I used the [Dialog sample] from Retro68 as the basis of my Mac app. Here it is
running prior to Rust integration:

{{ figure(image="posts/2023/rust-on-ppc-classic-mac-os/dialog-sample.png", link="posts/2023/rust-on-ppc-classic-mac-os/dialog-sample.png", alt="Screenshot of SheepShaver running Mac OS 8.1. It shows some Finder windows with a frontmost dialog that has a text label, text field, radio buttons, check box and Quit button.", caption="Dialog Sample") }}

This is my tweaked version of the C file:

```c
/*
    Copyright 2015 Wolfgang Thaller.

    This file is part of Retro68.

    Retro68 is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Retro68 is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Retro68.  If not, see <http://www.gnu.org/licenses/>.
*/

#include <Quickdraw.h>
#include <Dialogs.h>
#include <Fonts.h>

#ifndef TARGET_API_MAC_CARBON
    /* NOTE: this is checking whether the Dialogs.h we use *knows* about Carbon,
             not whether we are actually compiling for Cabon.
             If Dialogs.h is older, we add a define to be able to use the new name
             for NewUserItemUPP, which used to be NewUserItemProc. */

#define NewUserItemUPP NewUserItemProc
#endif

extern ConstStringPtr hello_rust(void);

pascal void ButtonFrameProc(DialogRef dlg, DialogItemIndex itemNo)
{
    DialogItemType type;
    Handle itemH;
    Rect box;

    GetDialogItem(dlg, 1, &type, &itemH, &box);
    InsetRect(&box, -4, -4);
    PenSize(3,3);
    FrameRoundRect(&box,16,16);
}

int main(void)
{
#if !TARGET_API_MAC_CARBON
    InitGraf(&qd.thePort);
    InitFonts();
    InitWindows();
    InitMenus();
    TEInit();
    InitDialogs(NULL);
#endif
    DialogPtr dlg = GetNewDialog(128,0,(WindowPtr)-1);
    InitCursor();
    SelectDialogItemText(dlg,4,0,32767);

    ConstStr255Param param1 = hello_rust();

    ParamText(param1, "\p", "\p", "\p");

    DialogItemType type;
    Handle itemH;
    Rect box;

    GetDialogItem(dlg, 2, &type, &itemH, &box);
    SetDialogItem(dlg, 2, type, (Handle) NewUserItemUPP(&ButtonFrameProc), &box);

    ControlHandle cb, radio1, radio2;
    GetDialogItem(dlg, 5, &type, &itemH, &box);
    cb = (ControlHandle)itemH;
    GetDialogItem(dlg, 6, &type, &itemH, &box);
    radio1 = (ControlHandle)itemH;
    GetDialogItem(dlg, 7, &type, &itemH, &box);
    radio2 = (ControlHandle)itemH;
    SetControlValue(radio1, 1);

    short item;
    do {
        ModalDialog(NULL, &item);

        if(item >= 5 && item <= 7)
        {
            if(item == 5)
                SetControlValue(cb, !GetControlValue(cb));
            if(item == 6 || item == 7)
            {
                SetControlValue(radio1, item == 6);
                SetControlValue(radio2, item == 7);
            }
        }
    } while(item != 1);

    FlushEvents(everyEvent, -1);
    return 0;
}
```

And this is the resource file (`dialog.r`):

```
/*
	Copyright 2015 Wolfgang Thaller.

	This file is part of Retro68.

	Retro68 is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Retro68 is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with Retro68.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "Dialogs.r"

resource 'DLOG' (128) {
	{ 50, 100, 240, 420 },
	dBoxProc,
	visible,
	noGoAway,
	0,
	128,
	"",
	centerMainScreen
};

resource 'DITL' (128) {
	{
		{ 190-10-20, 320-10-80, 190-10, 320-10 },
		Button { enabled, "Quit" };

		{ 190-10-20-5, 320-10-80-5, 190-10+5, 320-10+5 },
		UserItem { enabled };

		{ 10, 10, 30, 310 },
		StaticText { enabled, "Hello ^0" };

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

#include "Processes.r"

resource 'SIZE' (-1) {
	reserved,
	acceptSuspendResumeEvents,
	reserved,
	canBackground,
	doesActivateOnFGSwitch,
	backgroundAndForeground,
	dontGetFrontClicks,
	ignoreChildDiedEvents,
	is32BitCompatible,
#ifdef TARGET_API_MAC_CARBON
    isHighLevelEventAware,
#else
	notHighLevelEventAware,
#endif
	onlyLocalHLEvents,
	notStationeryAware,
	dontUseTextEditServices,
	reserved,
	reserved,
	reserved,
#ifdef TARGET_API_MAC_CARBON
	500 * 1024,	// Carbon apparently needs additional memory.
	500 * 1024
#else
	100 * 1024,
	100 * 1024
#endif
};
```

The main differences are:

* `extern` declaration for the Rust function
* Using the string returned from `hello_rust` to set `ParamText`
* Changing the StaticText control's text to "Hello ^0" in order to make use of
  the `ParamText`
* Adding `target_link_libraries(Dialog ${CMAKE_SOURCE_DIR}/target/powerpc-apple-macos/release/libclassic_mac_rust.a)`
  to `CMakeLists.txt` to have CMake link with the Rust library.

{{ figure(image="posts/2023/rust-on-ppc-classic-mac-os/ParamText.jpg", link="posts/2023/rust-on-ppc-classic-mac-os/ParamText.jpg", alt="Photo of ParamText documentation from my copy of Inside Macintosh Volume Ⅰ", caption="ParamText documentation from my copy of Inside Macintosh Volume Ⅰ") }}

Now when building the project we get…

```
ninja: Entering directory `cmake-build-retro68ppc'
[1/4] Linking C executable Dialog.xcoff
FAILED: Dialog.xcoff
: && /home/wmoore/Source/github.com/autc04/Retro68-build/toolchain/bin/powerpc-apple-macos-gcc  -Wl,-gc-sections CMakeFiles/Dialog.dir/dialog.obj -o Dialog.xcoff  /home/wmoore/Projects/classic-mac-rust/target/powerpc-apple-macos/release/libclassic_mac_rust.a && :
/home/wmoore/Source/github.com/autc04/Retro68-build/toolchain/lib/gcc/powerpc-apple-macos/9.1.0/../../../../powerpc-apple-macos/bin/ld:/home/wmoore/Projects/classic-mac-rust/target/powerpc-apple-macos/release/libclassic_mac_rust.a: file format not recognized; treating as linker script
/home/wmoore/Source/github.com/autc04/Retro68-build/toolchain/lib/gcc/powerpc-apple-macos/9.1.0/../../../../powerpc-apple-macos/bin/ld:/home/wmoore/Projects/classic-mac-rust/target/powerpc-apple-macos/release/libclassic_mac_rust.a:1: syntax error
collect2: error: ld returned 1 exit status
ninja: build stopped: subcommand failed.
```

It doesn't like `libclassic_mac_rust.a`. Some investigation shows that the objects in the library
are in ELF format. `powerpc-apple-macos-objcopy --info` shows that Retro68 does not handle
ELF:

```
BFD header file version (GNU Binutils) 2.31.1
xcoff-powermac
 (header big endian, data big endian)
  powerpc:common
  rs6000:6000
srec
 (header endianness unknown, data endianness unknown)
  powerpc:common
  rs6000:6000
symbolsrec
 (header endianness unknown, data endianness unknown)
  powerpc:common
  rs6000:6000
verilog
 (header endianness unknown, data endianness unknown)
  powerpc:common
  rs6000:6000
tekhex
 (header endianness unknown, data endianness unknown)
  powerpc:common
  rs6000:6000
binary
 (header endianness unknown, data endianness unknown)
  powerpc:common
  rs6000:6000
ihex
 (header endianness unknown, data endianness unknown)
  powerpc:common
  rs6000:6000

               xcoff-powermac srec symbolsrec verilog tekhex binary ihex
powerpc:common xcoff-powermac srec symbolsrec verilog tekhex binary ihex
   rs6000:6000 xcoff-powermac srec symbolsrec verilog tekhex binary ihex
```

It looks like it really only supports `xcoff-powermac`, which was derived from
rs6000 AIX. At this point I tried to find a way to convert my ELF objects to
XCOFF. I eventually stumbled across
[this thread on the Haiku forum](https://discuss.haiku-os.org/t/xcoff-pef/12445/15)
that mentions that `powerpc-linux-gnu-binutils` on Debian knows about
`aixcoff-rs6000`. So I fired up a Debian docker container and tried converting
my `.a`, and it worked:

```
docker run --rm -it -v $(pwd):/src debian:testing
apt update
apt install binutils-powerpc-linux-gnu
powerpc-linux-gnu-objcopy -O aixcoff-rs6000 /src/target/powerpc-apple-macos/release/libclassic_mac_rust.a /src/target/powerpc-apple-macos/release/libclassic_mac_rust.obj
```

Examining the objects in the new archive showed that they were now in the same
format as the objects generated by Retro68. I updated the `CMakeLists.txt` to
point at the new library and tried building again:

```
/home/wmoore/Source/github.com/autc04/Retro68-build/toolchain/lib/gcc/powerpc-apple-macos/9.1.0/../../../../powerpc-apple-macos/bin/ld: /home/wmoore/Projects/classic-mac-rust/target/powerpc-apple-macos/release/libclassic_mac_rust.obj(classic_mac_rust-80e61781bab75910.classic_mac_rust.9ba2ce33-cgu.0.rcgu.o): class 2 symbol `hello_rust' has no aux entries
```

Now we get further. It can read the `.a` now and even sees the `hello_rust`
symbol but it 
[looks like it's looking for an aux entry to determine the symbol type](https://github.com/autc04/Retro68/blob/5f882506013a0a8a4335350197a1b7c91763494e/binutils/bfd/xcofflink.c#L1461-L1478)
but not finding one. AUX entries are an
[XCOFF](https://www.ibm.com/docs/en/aix/7.2?topic=formats-xcoff-object-file-format)
thing.

One other thing I tried was setting the `llvm-target` in the custom target JSON
to `powerpc-ibm-aix`. Due to the heritage of PPC Mac OS the ABI is the same
(Apple used the AIX toolchain, which is why object files use XCOFF even though
executables use PEF). This target would be ideal as it would use the right ABI
and emit XCOFF by default.

Unfortunately it runs into unimplemented parts of LLVM's XCOFF implementation:

> LLVM ERROR: relocation for paired relocatable term is not yet supported

Rust uses a fork/snapshot of LLVM but the
[issue is still present in LLVM master](https://github.com/rust-lang/llvm-project/blob/5ef9f9948fca7cb39dd6c1935ca4e819fb7a0db2/llvm/lib/MC/XCOFFObjectWriter.cpp).
[This post on writing a Mac OS 9 application in Swift][swift] goes down a
similar path using the AIX target and also mentions patching the Swift compiler
to avoid the unsupported parts of LLVMs XCOFF implementation. That's an avenue
for future experimentation.

### rustc\_codegen\_gcc

At this point I decided to try a different approach.
[rustc\_codegen\_gcc](https://github.com/rust-lang/rustc_codegen_gcc) is a
codegen plugin that uses [libgccjit] for code generation instead of LLVM. The
motivation of the project is promising for my use case:

> The primary goal of this project is to be able to compile Rust code on
> platforms unsupported by LLVM.

I found the instructions for using `rustc_codegen_gcc` a bit difficult to
follow, especially when trying to build a cross-compiler.

I eventually managed to rebuild Retro68 with `libgccjit` enabled and then coax
`rustc_codegen_gcc` to use it. Unsurprisingly that quickly failed as Retro68 is
based on GCC 9.1 and  `rustc_codegen_gcc` is building against GCC master and
there were many missing symbols.

Undeterred I noted that there is a WIP GCC 12.2 branch in the Retro68 repo so I
built that and tweaked  `rustc_codegen_gcc` to disable the `master` cargo
feature that should in theory allow it to build against a GCC release. This did
in fact allow me to get a bit further but I ran into more issues in the step
that attempts to build `compiler-rt` and `core`. Eventually I gave up on this
route too. I was probably too far off the well tested configuration of x86,
against GCC master.

Future work here is to trying building a `powerpc-ibm-aix` libgccjit from GCC
master and see if that works.

### Wrap Up

[Bastian on Twitter](https://twitter.com/turbolent/status/1617231570573873152)
has had some success compiling Rust to Web Assembly, Web Assembly to C89, C89
to Mac OS 9 binary, which is definitely cool but I would still love to be able
to generate native PPC code directly from `rustc` somehow.

This is where I have parked this project for now. I actually only discovered
the post on building a Mac OS 9 application with Swift while writing this post.
There are perhaps some ideas in there that I could explore further.

[swift]: https://belkadan.com/blog/2020/04/Swift-on-Mac-OS-9/
[BlueSCSI]: https://github.com/erichelgeson/BlueSCSI
[Retro68]: https://github.com/autc04/Retro68
[SheepShaver]: https://sheepshaver.cebix.net/
[Dialog sample]: https://github.com/autc04/Retro68/tree/5f882506013a0a8a4335350197a1b7c91763494e/Samples/Dialog
[Pascal string]: https://en.wikipedia.org/wiki/String_(computer_science)#Length-prefixed
[libgccjit]: https://gcc.gnu.org/onlinedocs/jit/
