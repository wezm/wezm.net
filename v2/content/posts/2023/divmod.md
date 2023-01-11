+++
title = "divmod, Rust, x86, and Optimisation"
date = 2023-01-11T19:48:09+10:00

[extra]
updated = 2023-01-11T21:11:28+10:00
+++

While reviewing some Rust code that did something like this:

```rust
let a = n / d;
let b = n % d;
```

I lamented the lack of a `divmod` method in Rust (that would return both the
quotient and remainder). My colleague [Brendan] pointed out that he actually
[added it][rust-div-mod] back in 2013 but it was moved out of the standard
library before the 1.0 release.

<!-- more -->

I also learned that the [`div` instruction on x86][div] provides the remainder
so there is potentially some benefit to combining the operation. I suspected
that LLVM was probably able to optimise the separate operations and a trip to
[the Compiler Explorer][compiler-explorer] confirmed it.

This function:

```rust
pub fn divmod(n: usize, d: usize) -> (usize, usize) {
    (n / d, n % d)
}
```

Compiles to the following assembly, which I have annotated with my
understanding of each line (Note: I'm still learning x86 assembly):

```asm
; rdi = numerator, rsi = denominator
example::divmod:
        test    rsi, rsi     ; check for denominator of zero
        je      .LBB0_5      ; jump to div zero panic if zero
        mov     rax, rdi     ; load rax with numerator
        or      rax, rsi     ; or rax with denominator
        shr     rax, 32      ; shift rax right 32-bits
        je      .LBB0_2      ; if the result of the shift sets the zero flag then numerator and
                             ; denominator are 32-bit since none of the upper 32-bits are set.
                             ; jump to 32-bit division implementation
        mov     rax, rdi     ; move numerator into rax
        xor     edx, edx     ; zero edx (I'm not sure why, might be relevant to the calling
                             ; convention and is used by the caller?)
        div     rsi          ; divide rax by rsi
        ret                  ; return, quotient is in rax, remainder in rdx

; 32 bit implementation
.LBB0_2:
        mov     eax, edi     ; move edi to eax (32-bit regs)
        xor     edx, edx     ; zero edx
        div     esi          ; divide eax by esi
        ret

; div zero panic
.LBB0_5:
        push    rax
        lea     rdi, [rip + str.0]
        lea     rdx, [rip + .L__unnamed_1]
        mov     esi, 25
        call    qword ptr [rip + core::panicking::panic@GOTPCREL]
        ud2

.L__unnamed_2:
        .ascii  "/app/example.rs"

.L__unnamed_1:
        .quad   .L__unnamed_2
        .asciz  "\017\000\000\000\000\000\000\000\002\000\000\000\006\000\000"

str.0:
        .ascii  "attempt to divide by zero"
```

I found it interesting that after checking for a zero denominator there's an
additional check to see if the values fit into 32-bits, and if so it jumps to an
instruction sequence that uses 32-bit registers. According to [the testing done
in this report][timing] 32-bit `div` has lower latency—particularly on older
models.

~~I wasn't able to work out why each implementation zeros `edx`. If you know,
send me a message and I'll update the post.~~

**Update:** [Brion Vibber on the Fediverse][edx] provided this explanation as to why `edx`
is being zeroed:

> iirc rdx / edx is the top word for the x86 division operation, which takes a double-word numerator -- the inverse of multiplication producing a double-word output.

This makes sense and looking back at [the docs][div] it does say that:

> 32-bit: Unsigned divide EDX:EAX by r/m32, with result stored in EAX := Quotient, EDX := Remainder.

> 64-bit: Unsigned divide RDX:RAX by r/m64, with result stored in RAX := Quotient, RDX := Remainder.



[View the Example on Compiler Explorer](https://rust.godbolt.org/z/hj9rb4Txa)

[Brendan]: https://github.com/brendanzab
[rust-div-mod]: https://github.com/rust-lang/rust/commit/f39152e07baf03fc1ff4c8b2c1678ac857b4a512
[div]: https://www.felixcloutier.com/x86/div
[compiler-explorer]: https://rust.godbolt.org/
[timing]: https://gmplib.org/~tege/x86-timing.pdf
[edx]: https://bikeshed.vibber.net/@brion/109670222269686433
