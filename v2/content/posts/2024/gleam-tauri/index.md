+++
title = "Building a Hybrid Native Application With Gleam and Tauri"
date = 2024-02-19T09:56:49+10:00

[extra]
updated = 2024-02-20T22:57:15+10:00
+++

I took a few hours this weekend to experiment with building a hybrid
native app with Gleam and Tauri. This post is a summary of that project. If
you'd just like to see the code, I have published that at:

<https://forge.wezm.net/wezm/gleam-tauri-experiment>

{{ figure(image="posts/2024/gleam-tauri/screenshot.png", link="posts/2024/gleam-tauri/screenshot.png", alt="Screenshot of the application showing a name field, minus button, plus button, Greet button and the current time.", caption="Screenshot of the application.", width="650") }}

<!-- more --> 

### Introduction

[Gleam] is statically typed functional language originally written to target
the Erlang virtual machine. Now it also has a JavaScript back-end that allows
Gleam code to run in the browser as well as in [node.js] and [Deno]. The generated
JavaScript is quite readable similar to [Elm] and [ReScript]/[ReasonML].

Gleam appeals to me as an option for writing front-end code because it's
stricter than TypeScript, has nominal types, is fast to compile, has a nice
all-in-one developer experience like cargo with the `gleam` CLI.

One of the things that makes writing front-end applications in Gleam feasible
is the delightful [Lustre] package. It's an implementation of the [Elm
architecture] in Gleam. If you've used Elm a Lustre application will look
extremely familiar. In this context Gleam is kind of like an actively
maintained Elm without the restrictions on interop with existing JavaScript
code.

To get started here's some Gleam code that demonstrates a decent chunk of the
language:

```gleam
import gleam/io
import gleam/list
import gleam/int

pub type Temperature {
  F(Float)
  C(Float)
}

pub type Celsius {
  Celsius(Float)
}

pub fn main() {
  let temps = [C(22.0), C(-5.0), F(0.0), C(0.0), F(32.0)]
  io.debug(avg(temps))
}

pub fn avg(measurements: List(Temperature)) -> Celsius {
  let sum =
    list.fold(measurements, 0.0, fn(sum, val) {
      let Celsius(c) = to_c(val)
      sum +. c
    })
  let length =
    list.length(measurements)
    |> int.to_float
  Celsius(sum /. length)
}

fn to_c(temp: Temperature) -> Celsius {
  case temp {
    C(c) -> Celsius(c)
    F(f) -> Celsius({ f -. 32.0 } /. 1.8)
  }
}
```

When run it outputs:

    Celsius(1.8444444444444443)

The generated JavaScript (as of Gleam v1.0.0-rc2) is shown below. While it's
certainly longer than what you might naively write in JavaScript directly it's
pretty clear what's going on.

```javascript
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $io from "../gleam_stdlib/gleam/io.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import { toList, CustomType as $CustomType, divideFloat } from "./gleam.mjs";

export class F extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class C extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Celcius extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

function to_c(temp) {
  if (temp instanceof C) {
    let c = temp[0];
    return new Celcius(c);
  } else {
    let f = temp[0];
    return new Celcius(divideFloat((f - 32.0), 1.8));
  }
}

export function avg(measurements) {
  let sum = $list.fold(
    measurements,
    0.0,
    (sum, val) => {
      let $ = to_c(val);
      let c = $[0];
      return sum + c;
    },
  );
  let length = (() => {
    let _pipe = $list.length(measurements);
    return $int.to_float(_pipe);
  })();
  return new Celcius(divideFloat(sum, length));
}

export function main() {
  let temps = toList([
    new C(22.0),
    new C(-5.0),
    new F(0.0),
    new C(0.0),
    new F(32.0),
  ]);
  return $io.debug(avg(temps));
}
```


### Building a Hybrid Native App

{% aside(title="Version Information", float="right") %}
I used the following pre-release versions of Gleam and Tauri:

- Gleam 1.0.0-rc2
- Tauri 2.0.0-beta.1.
{% end %}

[Tauri] is a framework for building hybrid native applications. By that I mean
an application that uses native code for the back-end and web technology for the
user interface. This is similar to [Electron] except that Tauri does not include
a copy of Chromium in every application, instead relying on the system web view
on the host operating system.

You implement your application logic in Rust and communicate with the UI
by emitting and listening to events. The end result is a cross-platform desktop
app that is a lot smaller than if it were built with Electron.

This weekend I decided to try combining these things to see how feasible it
would be to build a hybrid desktop app with Gleam and Tauri. I started by
following [the Tauri guide for setting up a Vite project][tauri-vite]. [Vite]
is a bundler that takes care of transforming source files on the front-end as
well is providing a nice auto-reloading development experience.

Once that was working I initialised a Gleam project in the same directory:

    gleam new --name gleamdemo gleam-demo

**Note:** I originally called my application `videopls` there are still some
references to it in the code.

I then followed [Erika Rowland's guide to using Gleam with Vite][erika]. This
resulted in a simple counter demo running in the Tauri window. At this point
the Gleam code was almost identical to Erika's post.

{{ figure(image="posts/2024/gleam-tauri/phase1.png", link="posts/2024/gleam-tauri/phase1.png", alt="Screenshot of the application showing a counter with plus and minus buttons", caption="Phase 1 complete.", width="650") }}

Now came the uncharted waters: how to integrate [Tauri's command
system][tauri-command] to invoke commands in the back-end. Commands are a sort
of in-process communication mechanism where the UI can invoke a function
implemented in Rust on the back-end.

I added a Tauri command to the back-end:

```rust
// src-tauri/src/main.rs

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
```

I then needed to be able to use [the `invoke` function][invoke] from the
[@tauri-apps/api npm package][tauri-apps/api]. Following the pattern I observed
in other Gleam packages I created a JavaScript file to act as a bridge between
Gleam and `@tauri-apps/api`:

```javascript
// src/ffi/commands.js

import { invoke } from '@tauri-apps/api/core';
import { Ok, Error } from "../../build/dev/javascript/videopls/gleam.mjs";

export async function greet(name) {
  try {
    return new Ok(await invoke('greet', { name: name }));
  } catch (error) {
    return new Error(error.toString());
  }
}
```

I could then define the external function in the Gleam code and call it:

```gleam
// src/demo.gleam

@external(javascript, "./ffi/commands.js", "greet")
pub fn greet(name: String) -> Promise(Result(String, String))
```

The next challenge was `greet` is an async function, so it returns a promise,
which does not integrate into a [lustre.simple] application well. Fortunately
there is the less simple [lustre.application] that adds effects. After looking
at some existing code I was finally able to come up with a working solution.
The full Gleam code is shown below. `get_greeting` and `do_get_greeting` being
the main parts of interest.

```gleam
// src/demo.gleam

import gleam/int
import gleam/javascript/promise.{type Promise}
import lustre
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import lustre/event
import lustre/effect.{type Effect}

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(dispatch) = lustre.start(app, "#app", Nil)

  dispatch
}

type Model {
  Model(count: Int, greeting: String, name: String)
}

fn init(_) -> #(Model, Effect(Msg)) {
  #(Model(0, "", ""), effect.none())
}

pub type Msg {
  Increment
  Decrement
  Greet
  GotGreeting(String)
  UpdateName(String)
}

fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    Increment -> #(Model(..model, count: model.count + 1), effect.none())
    Decrement -> #(Model(..model, count: model.count - 1), effect.none())
    Greet -> #(model, get_greeting(model.name))
    GotGreeting(greeting) -> #(
      Model(..model, greeting: greeting),
      effect.none(),
    )
    UpdateName(name) -> #(Model(..model, name: name), effect.none())
  }
}

fn get_greeting(name: String) -> Effect(Msg) {
  effect.from(do_get_greeting(name, _))
}

fn do_get_greeting(name: String, dispatch: fn(Msg) -> Nil) -> Nil {
  greet(name)
  |> promise.map(fn(response) {
    case response {
      Ok(greeting) -> GotGreeting(greeting)
      Error(err) -> GotGreeting("Error: " <> err)
    }
  })
  |> promise.tap(dispatch)

  Nil
}

@external(javascript, "./ffi/commands.js", "greet")
pub fn greet(name: String) -> Promise(Result(String, String))

fn update_name(text: String) -> Msg {
  UpdateName(text)
}

// -- VIEW

fn view(model: Model) -> Element(Msg) {
  let count = int.to_string(model.count)

  html.div([], [
    html.h1([], [element.text("Gleam + Vite + Tauri")]),
    html.div([attr.class("field text-center")], [
      html.label([attr.for("greet_name")], [element.text("Name")]),
      element.text(" "),
      html.input([
        attr.type_("text"),
        attr.name("greet_name"),
        event.on_input(update_name),
      ]),
    ]),
    html.p([attr.class("text-center")], [
      element.text(model.greeting <> " " <> count <> " ✨"),
    ]),
    html.div([attr.class("text-center")], [
      html.button([event.on_click(Decrement)], [element.text("-")]),
      html.button([event.on_click(Increment)], [element.text("+")]),
      html.button([event.on_click(Greet)], [element.text("Greet")]),
    ]),
  ])
}
```

I added a `Greet` message for when the "Greet" button is clicked. The `update`
function that doesn't update the model but calls `get_greeting` as its
side-effect. That builds an `Effect` from `do_get_greeting`, which calls the
FFI function and maps the `Result` to a `GotGreeting` message containing the
greeting or an error message.

`update` handles the `GotGreeting` message by updating the model, which in
turn updates the UI. I'm skipping over the `Model`, `view`, `update`
architecture of this Lustre application since it's basically the [Elm
architecture]. A similar pattern is seen in Reason React, ReScript, and [React
with actions and reducers][react-reducer].

At this point I had worked out how to invoke Rust functions in the back-end via
Tauri commands but I wanted to take it step further. In a real application you
can imagine that the back-end might be performing actions that it needs to tell
the UI about. For example, when updated data is available after a sync.
To do this Tauri provides a way for both parts of the application to emit
events with a payload, and listen for those events. It's all very similar to how
events work in JavaScript.

I wanted to test this out by periodically having the back-end emit an event and
have the UI listen for the event and update as a result. I decided to have
the back-end emit the current time each second as a UNIX timestamp. Working out
how to do this on back-end stumped me for a bit but I eventually worked out I
could spawn a thread in the `setup` function:

```rust
// src-tauri/src/main.rs

use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use tauri::EventTarget;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app = app.handle().clone();
            std::thread::spawn(move || {
                loop {
                    let now = SystemTime::now();
                    let duration = now.duration_since(UNIX_EPOCH).unwrap();
                    app.emit_to(EventTarget::any(), "tick", duration.as_secs())
                        .unwrap();
                    std::thread::sleep(Duration::from_secs(1));
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

In a production application you'd want a mechanism for cleanly shutting the
thread down but for experimentation purposes I skipped that. Now I needed to
listen for the `tick` event in the UI. I added another glue function to the FFI
file:

```gleam
// src/ffi/commands.js

export async function listenForTick(handler) {
  await listen('tick', (event) => {
    handler(event.payload);
  });
}
```

And added a function to the Gleam code to call it and dispatch a message when
it was received:

```gleam
// src/demo.gleam

fn bind_clock() -> Effect(Msg) {
  effect.from(fn(dispatch) {
    listen_for_tick(fn(time) {
      tick(time)
      |> dispatch
    })

    Nil
  })
}
```

As a first pass I just rendered the number in the UI but I then extended it to
parse the timestamp into a JavaScript Date and render the stringified version
of it. Surprisingly the [gleam_javascript] package doesn't have Date bindings
yet so I created some for what I needed:

```gleam
// src/ffi/js_extra.js

export function from_unix(timestamp) {
    return new Date(timestamp * 1000);
}

export function date_to_string(date) {
    return date.toString();
}
```

I think in an ideal world simple bindings like this (especially `toString`)
would be able to be expressed solely though the `@external` attribute. That
doesn't seem to be possible yet but if it is please let me know.

I bound those in Gleam:

```gleam
// src/demo.gleam

pub type Date

@external(javascript, "./ffi/js_extra.js", "from_unix")
pub fn new_date(timestamp: Int) -> Date

@external(javascript, "./ffi/js_extra.js", "date_to_string")
pub fn date_to_string(date: Date) -> String
```

and updated the application to use them. The result is a clock at the bottom of
the page that updates each second:

<div class="text-center">
    <video src="gleam-tauri2-2024-02-19_15.26.34.mp4" width="659" height="359" controls></video>
</div>

The final Gleam application looks like this:

```gleam
// src/demo.gleam

import gleam/int
import gleam/javascript/promise.{type Promise}
import lustre
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import lustre/event
import lustre/effect.{type Effect}

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(dispatch) = lustre.start(app, "#app", Nil)

  dispatch
}

type Model {
  Model(count: Int, greeting: String, name: String, time: Int)
}

fn init(_) -> #(Model, Effect(Msg)) {
  #(Model(0, "", "", 0), bind_clock())
}

pub type Msg {
  Increment
  Decrement
  Greet
  GotGreeting(String)
  UpdateName(String)
  Tick(Int)
}

fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    Increment -> #(Model(..model, count: model.count + 1), effect.none())
    Decrement -> #(Model(..model, count: model.count - 1), effect.none())
    Greet -> #(model, get_greeting(model.name))
    GotGreeting(greeting) -> #(
      Model(..model, greeting: greeting),
      effect.none(),
    )
    UpdateName(name) -> #(Model(..model, name: name), effect.none())
    Tick(time) -> #(Model(..model, time: time), effect.none())
  }
}

fn get_greeting(name: String) -> Effect(Msg) {
  effect.from(do_get_greeting(name, _))
}

fn do_get_greeting(name: String, dispatch: fn(Msg) -> Nil) -> Nil {
  greet(name)
  |> promise.map(fn(response) {
    case response {
      Ok(greeting) -> GotGreeting(greeting)
      Error(err) -> GotGreeting("Error: " <> err)
    }
  })
  |> promise.tap(dispatch)

  Nil
}

fn bind_clock() -> Effect(Msg) {
  effect.from(fn(dispatch) {
    listen_for_tick(fn(time) {
      tick(time)
      |> dispatch
    })

    Nil
  })
}

@external(javascript, "./ffi/commands.js", "greet")
pub fn greet(name: String) -> Promise(Result(String, String))

type UnlistenFn =
  fn() -> Nil

@external(javascript, "./ffi/commands.js", "listenForTick")
pub fn listen_for_tick(handler: fn(Int) -> Nil) -> Promise(UnlistenFn)

pub type Date

@external(javascript, "./ffi/js_extra.js", "from_unix")
pub fn new_date(timestamp: Int) -> Date

@external(javascript, "./ffi/js_extra.js", "date_to_string")
pub fn date_to_string(date: Date) -> String

fn update_name(text: String) -> Msg {
  UpdateName(text)
}

fn tick(time: Int) -> Msg {
  Tick(time)
}

// -- VIEW

fn view(model: Model) -> Element(Msg) {
  let count = int.to_string(model.count)
  let time =
    model.time
    |> new_date
    |> date_to_string

  html.div([], [
    html.h1([], [element.text("Gleam + Vite + Tauri")]),
    html.div([attr.class("field text-center")], [
      html.label([attr.for("greet_name")], [element.text("Name")]),
      element.text(" "),
      html.input([
        attr.type_("text"),
        attr.name("greet_name"),
        event.on_input(update_name),
      ]),
    ]),
    html.p([attr.class("text-center")], [
      element.text(model.greeting <> " " <> count <> " ✨"),
    ]),
    html.div([attr.class("text-center")], [
      html.button([event.on_click(Decrement)], [element.text("-")]),
      html.button([event.on_click(Increment)], [element.text("+")]),
      html.button([event.on_click(Greet)], [element.text("Greet")]),
    ]),
    html.div([attr.class("clock text-center")], [
      element.text("Clock: " <> time),
    ]),
  ])
}
```

### Conclusion

I successfully built a hybrid native application with Gleam and Tauri. While
what I built is clearly experimental code I think it was enough to work out the
approach and patterns you could use to build a larger application. Using Gleam
to build a web components or web front-ends seems quite feasible.

Some unanswered questions I have from this experiment are:

1. Does binding to external functions in the JS platform or npm packages always
   require some JS glue code? It seems it does at the moment.
2. What is the right way to import `gleam.mjs` from JavaScript code?
3. What is the structure of the Gleam `build` directory?
   * I see `dev` and `prod` sub-directories.
   * Is the `prod` on used when targeting JavaScript
     * I can't see any equivalent of Cargo's `--release` in the `gleam` CLI help.

The full project code is available here:

<https://forge.wezm.net/wezm/gleam-tauri-experiment>

#### Thanks

Special thanks to the following folks:

* [Hayleigh Thompson][Hayleigh] for building Lustre.
* [Enderchief] for [vite-gleam], which makes it super easy to integrate Gleam code with Vite.
* [Erika Rowland] for [her Gleam Vite guide][erika]. [The follow up on `esgleam`][esgleam] is also good.


[Elm]: https://elm-lang.org/
[Elm architecture]: https://guide.elm-lang.org/architecture/
[Tauri]: https://tauri.app/
[Gleam]: https://gleam.run/
[Lustre]: https://github.com/lustre-labs/lustre
[Vite]: https://vitejs.dev/
[ReScript]: https://rescript-lang.org/
[ReasonML]: https://reasonml.github.io/
[Electron]: https://www.electronjs.org/
[tauri-vite]: https://tauri.app/v1/guides/getting-started/setup/vite
[erika]: https://erikarow.land/notes/gleam-vite
[Erika Rowland]: https://erikarow.land/
[Hayleigh]: https://github.com/hayleigh-dot-dev
[Enderchief]: https://github.com/Enderchief
[vite-gleam]: https://github.com/Enderchief/gleam-tools/tree/master/packages/vite-gleam
[esgleam]: https://erikarow.land/notes/esgleam-embed
[node.js]: https://nodejs.org/
[Deno]: https://deno.com/
[tauri-command]: https://tauri.app/v1/references/architecture/inter-process-communication/#commands
[invoke]: https://beta.tauri.app/references/v2/js/core/namespacecore/#invoke
[tauri-apps/api]: https://www.npmjs.com/package/@tauri-apps/api
[lustre.simple]: https://lustre.build/api/lustre#simple
[lustre.application]: https://lustre.build/api/lustre#application
[react-reducer]: https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers
[gleam_javascript]: https://hexdocs.pm/gleam_javascript/
