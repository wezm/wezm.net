I'm currently working on a [node.js][node] module ([node-genx]) with a C++ component.
Each time a change was made to the code its necessary to rebuild the
module then run the tests. This was getting tiring so I decided to use
[guard] to automate the process.

[node]: http://nodejs.org/
[node-genx]: https://github.com/wezm/node-genx
[guard]: https://github.com/guard/guard

guard is a ruby gem that provides a DSL for performing actions when
a set of watched files change. There a bunch of "guards" available
that provide out of the box support for things like [rspec], [jammit],
[sass] and [CoffeeScript][coffee-script]. For simple custom cases
like mine there is also [guard-shell], which will run a shell
command when one of its watched files changes.

[coffee-script]: http://jashkenas.github.com/coffee-script/
[rspec]: http://rspec.info/
[jammit]: http://documentcloud.github.com/jammit/
[sass]: http://sass-lang.com/
[guard-shell]: https://github.com/guard/guard-shell

guard uses a Guardfile akin to a Makefile in you project directory to
configure the guards. Mine looks like this:

    guard 'shell' do
      watch(%r".*\.(?:cc|h)") { |m| `node-waf build && jasbin` }
      watch(%r"spec/.*_spec\..*") {|m| `jasbin --verbose` }
    end

This runs `node-waf build && jasbin` to rebuild the module and run the
tests when any of the C++ source files or headers change. It just runs
the the tests when any of the spec files change.

Once your Guardfile is setup simply run `guard` in you project directory
and it will start watching for changes.