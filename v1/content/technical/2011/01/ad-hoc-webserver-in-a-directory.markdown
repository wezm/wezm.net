From time to time I have the need to make the contents of a directory available
via HTTP. There are a few ways to achieve this. If its content you want to
access frequently you might set up a virtual host in Apache or nginx. For more
ad-hoc needs the options include [Python's SimpleHTTPServer][python] module,
which is part of the standard library:

    python -m SimpleHTTPServer

[python]: http://docs.python.org/library/simplehttpserver.html

And [mongoose]. A cross-platform (Windows, \*nix), minimal web server written in
C without any external dependencies. In its simplest case you run mongoose from
the directory to be served. If more advanced usage is required such as SSL,
authorisation or CGI these can be enabled on the command line or in a
configuration file.

[mongoose]: http://code.google.com/p/mongoose/

Both SimpleHTTPServer and mongoose support directory listings and index
files out of the box.
