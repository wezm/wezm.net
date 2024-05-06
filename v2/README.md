# wezm.net v2

Build with the [Zola] static site compiler:

    zola serve

## Dates

Generate dates in front-matter from vim:

    :r! date +\%Y-\%m-\%dT\%H:\%M:\%S\%:z
    :r! date -Iseconds

## Terminal screenshots

Resize:

    xdotool windowsize $(xdotool selectwindow) 1600 1200

## Video poster images

    for m in *.m4v; do ffmpeg -i $m -vf "select=1" -vframes 1 $m.png; done
    for f in *.m4v.png; do convert "$f" -quality 60 ${f%.png}.jpg ; done

[Zola]: https://www.getzola.org/
