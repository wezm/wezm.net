+++
title = "Building a Tiny CDN With pyinfra and Chimera Linux"
date = 2024-12-09T10:02:49+10:00

# [extra]
# updated = 2024-07-26T10:34:50+10:00
+++

In my quest to make [linkedlist.org][linkedlist]—my link blog—faster, I set
up multiple deployments around the world. I used [pyinfra] to automate the
process and [Chimera Linux] as the host operating system. Join me on this
adventure in over-engineering to see how I dropped the average response time
across nine global locations from 807ms to 189ms without spending a fortune.

<figure class="text-center">
<svg
   width="93.756485mm"
   height="168.49266mm"
   style="width: 250px; height: auto;"
   viewBox="0 0 93.756485 168.49266"
   version="1.1"
   id="svg1"
   aria-labelledby="title desc"
   role="img"
   xml:space="preserve"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
   <title>Network diagram of Linked List infrastructure</title>
   <desc>A network diagram showing a user at the top. An arrow from the user points downward to a node labelled Gcore GeoDNS. Three dashed arrows point down from the Gcore node to three servers labelled: AU, FR, and NY. Below the servers at the bottom of the diagram is another smaller server titled Qotom. It has arrows pointing up to each of the other servers with a label over the arrows, "Certs".</desc>
   <defs
     id="defs1"><marker
       style="overflow:visible"
       id="marker67"
       refX="0"
       refY="0"
       orient="auto-start-reverse"
       markerWidth="1"
       markerHeight="1"
       viewBox="0 0 1 1"
       preserveAspectRatio="xMidYMid"><path
         transform="scale(0.5)"
         style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"
         d="M 5.77,0 -2.88,5 V -5 Z"
         id="path67" /></marker><marker
       style="overflow:visible"
       id="marker62"
       refX="0"
       refY="0"
       orient="auto-start-reverse"
       markerWidth="1"
       markerHeight="1"
       viewBox="0 0 1 1"
       preserveAspectRatio="xMidYMid"><path
         transform="scale(0.5)"
         style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"
         d="M 5.77,0 -2.88,5 V -5 Z"
         id="path62" /></marker><marker
       style="overflow:visible"
       id="Triangle"
       refX="0"
       refY="0"
       orient="auto-start-reverse"
       markerWidth="1"
       markerHeight="1"
       viewBox="0 0 1 1"
       preserveAspectRatio="xMidYMid"><path
         transform="scale(0.5)"
         style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"
         d="M 5.77,0 -2.88,5 V -5 Z"
         id="path135" /></marker><linearGradient
       xlink:href="#gradient0-3"
       id="linearGradient31"
       gradientUnits="userSpaceOnUse"
       x1="27.65"
       y1="-1.9400001"
       x2="51.700001"
       y2="19.120001" /><linearGradient
       xlink:href="#gradient1-6"
       id="linearGradient32"
       gradientUnits="userSpaceOnUse"
       x1="48.049999"
       y1="-27.809999"
       x2="77.269997"
       y2="-16.549999" /><linearGradient
       xlink:href="#gradient2-61"
       id="linearGradient33"
       gradientUnits="userSpaceOnUse"
       x1="31.91"
       y1="46.25"
       x2="4.4099998"
       y2="34.93" /><linearGradient
       xlink:href="#gradient3-65"
       id="linearGradient34"
       gradientUnits="userSpaceOnUse"
       x1="54.040001"
       y1="-6.4099998"
       x2="60.5"
       y2="1.62" /><linearGradient
       xlink:href="#gradient0-3"
       id="linearGradient47"
       gradientUnits="userSpaceOnUse"
       x1="27.65"
       y1="-1.9400001"
       x2="51.700001"
       y2="19.120001" /><linearGradient
       xlink:href="#gradient1-6"
       id="linearGradient48"
       gradientUnits="userSpaceOnUse"
       x1="48.049999"
       y1="-27.809999"
       x2="77.269997"
       y2="-16.549999" /><linearGradient
       xlink:href="#gradient2-61"
       id="linearGradient49"
       gradientUnits="userSpaceOnUse"
       x1="31.91"
       y1="46.25"
       x2="4.4099998"
       y2="34.93" /><linearGradient
       xlink:href="#gradient3-65"
       id="linearGradient50"
       gradientUnits="userSpaceOnUse"
       x1="54.040001"
       y1="-6.4099998"
       x2="60.5"
       y2="1.62" /><linearGradient
       xlink:href="#gradient0-3"
       id="linearGradient51"
       gradientUnits="userSpaceOnUse"
       x1="27.65"
       y1="-1.9400001"
       x2="51.700001"
       y2="19.120001" /><linearGradient
       xlink:href="#gradient1-6"
       id="linearGradient52"
       gradientUnits="userSpaceOnUse"
       x1="48.049999"
       y1="-27.809999"
       x2="77.269997"
       y2="-16.549999" /><linearGradient
       xlink:href="#gradient2-61"
       id="linearGradient53"
       gradientUnits="userSpaceOnUse"
       x1="31.91"
       y1="46.25"
       x2="4.4099998"
       y2="34.93" /><linearGradient
       xlink:href="#gradient3-65"
       id="linearGradient54"
       gradientUnits="userSpaceOnUse"
       x1="54.040001"
       y1="-6.4099998"
       x2="60.5"
       y2="1.62" /></defs><g
     id="layer1"
     transform="translate(-63.291283,-13.793306)"><g
       style="color-interpolation:linearRGB"
       id="g1"
       transform="matrix(0.26458333,0,0,0.26458333,97.868591,13.793306)"><g
         id="g14"><path
           style="fill:#010101;fill-opacity:0.4235"
           d="m 28,64 c 0,0 5,0 10,0 5,0 10.2,-3.04 14.75,-2.88 10.37,0.38 14.5,-4.75 8.12,-6.75 C 57.04,53.17 52,53.25 49.12,51.25 45.45,48.69 38,48 38,48 v 7 z"
           id="path1" /><path
           style="fill:none;stroke:#000000;stroke-width:4"
           d="m 12,18 v 17 l 4,4 v 17 l 4,2 h 2 l 1,1.5 5,2.5 8,-8 V 43 l 4,-4 V 21 L 21,12 Z"
           id="path2" /><linearGradient
           id="gradient0"
           gradientUnits="userSpaceOnUse"
           x1="73.739998"
           y1="-57.07"
           x2="116.61"
           y2="-8.0500002"><stop
             offset="0"
             stop-color="#ffdb97"
             id="stop2" /><stop
             offset="1"
             stop-color="#fcaf29"
             id="stop3" /></linearGradient><path
           style="fill:url(#gradient0)"
           d="m 12,18 v 17 l 4,4 v 17 l 4,2 h 2 l 1,1.5 5,2.5 V 45 h 4 V 27 Z"
           id="path3" /><linearGradient
           id="gradient1"
           gradientUnits="userSpaceOnUse"
           x1="-43.970001"
           y1="-33.98"
           x2="-24.83"
           y2="-51.950001"><stop
             offset="0"
             stop-color="#fff7ea"
             id="stop4" /><stop
             offset="0.9962"
             stop-color="#fdd17b"
             id="stop5" /></linearGradient><path
           style="fill:url(#gradient1)"
           d="M 12,18 32,27 40,21 26,20 31.99,16.99 21,12 Z"
           id="path5" /><linearGradient
           id="gradient2"
           gradientUnits="userSpaceOnUse"
           x1="54.23"
           y1="-52.610001"
           x2="75.839996"
           y2="-45.970001"><stop
             offset="0"
             stop-color="#c85805"
             id="stop6" /><stop
             offset="1"
             stop-color="#f06306"
             id="stop7" /></linearGradient><path
           style="fill:url(#gradient2)"
           d="m 32,45 h -4 v 17 l 8,-8 V 43 l 4,-4 V 21 l -8,6 z"
           id="path7" /><path
           style="fill:#a32904"
           d="m 28,45 v 6 l 8,-8 -4,2 z"
           id="path8" /><linearGradient
           id="gradient3"
           gradientUnits="userSpaceOnUse"
           x1="28.92"
           y1="-64"
           x2="39.07"
           y2="-64"><stop
             offset="0"
             stop-color="#c85804"
             id="stop8" /><stop
             offset="1"
             stop-color="#dc952f"
             id="stop9" /></linearGradient><path
           style="fill:url(#gradient3)"
           d="m 26,20 14,1 -8,-4 z"
           id="path9" /><path
           style="fill:none;stroke:#000000;stroke-width:4"
           d="m 26,2 c -4,0 -8,4 -8,8 0,4 4,8 8,8 4,0 8,-4 8,-8 0,-4 -4,-8 -8,-8 z"
           id="path10" /><radialGradient
           id="gradient4"
           gradientUnits="userSpaceOnUse"
           cx="0"
           cy="0"
           r="64"
           gradientTransform="matrix(0.2361,0,0,0.2321,22.625,6.375)"><stop
             offset="0"
             stop-color="#f2f2f2"
             id="stop10" /><stop
             offset="0.6742"
             stop-color="#7d7a7a"
             id="stop11" /><stop
             offset="1"
             stop-color="#bca184"
             id="stop12" /></radialGradient><path
           style="fill:url(#gradient4)"
           d="m 26,2 c -4,0 -8,4 -8,8 0,4 4,8 8,8 4,0 8,-4 8,-8 0,-4 -4,-8 -8,-8 z"
           id="path12" /><linearGradient
           id="gradient5"
           gradientUnits="userSpaceOnUse"
           x1="54.23"
           y1="-52.610001"
           x2="75.839996"
           y2="-45.970001"><stop
             offset="0"
             stop-color="#c85805"
             id="stop13" /><stop
             offset="1"
             stop-color="#f06306"
             id="stop14" /></linearGradient><path
           style="fill:url(#gradient5)"
           d="m 20,58 h 2 V 44 l -2,-1 z"
           id="path14" /></g></g><g
       style="color-interpolation:linearRGB"
       id="g2"
       transform="matrix(0.34933984,0,0,0.34933984,93.821125,57.788386)"><g
         id="g18"><path
           style="fill:#010101;fill-opacity:0.4313"
           d="m 44,64 h 5 L 64,48 60,46 Z M 19,20 c -7.19,0 -13,2.23 -13,5 0,2.75 5.81,5 13,5 7.17,0 13,-2.25 13,-5 0,-2.77 -5.83,-5 -13,-5 z"
           id="path1-3" /><path
           style="fill:none;stroke:#010101;stroke-width:4;stroke-opacity:0.4313"
           d="M 32,42 C 32,42 18,42 18,38 18,30 34,28 34,22 34,18 23,18 23,18"
           transform="matrix(1,0,0,0.9285,2,3.1428)"
           id="path2-6" /><path
           style="fill:none;stroke:#000000;stroke-width:4"
           d="M 32,42 C 32,42 18,42 18,38 18,30 34,28 34,22 34,18 23,18 23,18 m 26,4 9,3 V 48 L 44,62 34,56 V 32 Z M 14,2 C 7.37,2 2,7.37 2,14 2,20.61 7.37,26 14,26 20.61,26 26,20.61 26,14 26,7.37 20.61,2 14,2 Z"
           id="path3-7" /><linearGradient
           id="gradient0-5"
           gradientUnits="userSpaceOnUse"
           x1="33.689999"
           y1="1.88"
           x2="51.599998"
           y2="3.6700001"><stop
             offset="0"
             stop-color="#d7d7d7"
             id="stop3-3" /><stop
             offset="1"
             stop-color="#b8b8b8"
             id="stop4-5" /></linearGradient><path
           style="fill:url(#gradient0-5)"
           d="m 44,36 v 26 l -2.13,-1.38 v -10 L 36,48 36.02,57.21 34,56 V 32 Z"
           id="path4" /><path
           style="fill:#949494"
           d="M 37.48,48.66 36,48 l 0.02,9.21 1.29,0.75 z"
           id="path5-6" /><linearGradient
           id="gradient1-2"
           gradientUnits="userSpaceOnUse"
           x1="33.689999"
           y1="1.88"
           x2="51.599998"
           y2="3.6700001"><stop
             offset="0"
             stop-color="#d2d2d2"
             id="stop5-9" /><stop
             offset="1"
             stop-color="#858585"
             id="stop6-1" /></linearGradient><path
           style="fill:url(#gradient1-2)"
           d="m 40.39,49.96 -2.91,-1.3 -0.17,9.3 3.06,1.79 z"
           id="path6" /><path
           style="fill:#c4c4c4"
           d="m 41.87,60.62 v -10 l -1.48,-0.66 -0.02,9.79 z"
           id="path7-2" /><linearGradient
           id="gradient2-7"
           gradientUnits="userSpaceOnUse"
           x1="24"
           y1="7.9899998"
           x2="64"
           y2="7.9899998"><stop
             offset="0"
             stop-color="#f4f4f4"
             id="stop7-0" /><stop
             offset="1"
             stop-color="#dbdbdb"
             id="stop8-9" /></linearGradient><path
           style="fill:url(#gradient2-7)"
           d="M 49,22 58,25 44,36 34,32 Z"
           id="path8-3" /><linearGradient
           id="gradient3-6"
           gradientUnits="userSpaceOnUse"
           x1="55.689999"
           y1="-10.23"
           x2="74.970001"
           y2="-5.4099998"><stop
             offset="0"
             stop-color="#5c5c5c"
             id="stop9-0" /><stop
             offset="1"
             stop-color="#838383"
             id="stop10-6" /></linearGradient><path
           style="fill:url(#gradient3-6)"
           d="M 44,36 58,25 V 48 L 44,62 Z"
           id="path10-2" /><linearGradient
           id="gradient4-6"
           gradientUnits="userSpaceOnUse"
           x1="33.689999"
           y1="1.88"
           x2="51.599998"
           y2="3.6700001"><stop
             offset="0"
             stop-color="#d2d2d2"
             id="stop11-1" /><stop
             offset="1"
             stop-color="#858585"
             id="stop12-8" /></linearGradient><path
           style="fill:none;stroke:url(#gradient4-6);stroke-width:1"
           d="m 40,38 v 2 l 2,0.5 v -2 z"
           id="path12-7" /><path
           style="fill:#a9ff00"
           d="m 40,38 v 2 l 2,0.5 v -2 z"
           id="path13" /><radialGradient
           id="gradient5-9"
           gradientUnits="userSpaceOnUse"
           cx="0"
           cy="0"
           r="64"
           gradientTransform="matrix(0.25,0,0,0.25,10,10)"><stop
             offset="0.044"
             stop-color="#9eedff"
             id="stop13-2" /><stop
             offset="0.1457"
             stop-color="#67ceff"
             id="stop14-0" /><stop
             offset="1"
             stop-color="#0473b3"
             id="stop15" /></radialGradient><path
           style="fill:url(#gradient5-9)"
           d="M 14,2 C 10.46,2 7.27,3.52 5.07,5.96 5.07,5.96 8,6 8,8 8,10 4,14 4,14 v 2 c 0,0 2,0 4,2 2,2 0,4 0,4 l 2.27,3.41 C 11.44,25.78 12.69,26 14,26 c 2.99,0 5.72,-1.1 7.83,-2.93 L 20,22 22,18 c 0,0 -6,-2 -6,-4 0,-2 4,-6 4,-6 L 18,6 15.87,8 H 14 L 16,6 14,4 17.39,2.48 C 16.31,2.16 15.17,2 14,2 Z"
           id="path15" /><radialGradient
           id="gradient6"
           gradientUnits="userSpaceOnUse"
           cx="0"
           cy="0"
           r="64"
           gradientTransform="matrix(0.25,0,0,0.25,10,10)"><stop
             offset="0"
             stop-color="#b9ff97"
             id="stop16" /><stop
             offset="0.7457"
             stop-color="#05d65e"
             id="stop17" /><stop
             offset="1"
             stop-color="#049943"
             id="stop18" /></radialGradient><path
           style="fill:url(#gradient6)"
           d="M 5.07,5.96 C 3.16,8.08 2,10.9 2,14 c 0,5.32 3.47,9.84 8.27,11.41 L 8,22 C 8,22 10,20 8,18 6,16 4,16 4,16 V 14 C 4,14 8,10 8,8 8,6 5.07,5.96 5.07,5.96 Z M 14,8 h 2.37 L 18,6 20,8 c 0,0 -4,4 -4,6 0,2 6,4 6,4 l -2,4 1.83,1.07 C 24.38,20.88 26,17.62 26,14 26,8.54 22.36,3.95 17.39,2.48 L 14,4 16,6 Z"
           id="path18" /></g></g><g
       style="color-interpolation:linearRGB"
       id="g3"
       transform="matrix(0.26458333,0,0,0.26458333,96.533333,159.16141)"><g
         id="g11"><path
           style="fill:#010101;fill-opacity:0.5019"
           d="m 36,61 h 5 l 23,-31 -6,-3 1,4 z"
           id="path1-2" /><path
           style="fill:none;stroke:#010000;stroke-width:4"
           d="M 2,28 V 41 L 36,59 58,30 V 17 L 25,5 Z"
           id="path2-3" /><linearGradient
           id="gradient0-7"
           gradientUnits="userSpaceOnUse"
           x1="13.84"
           y1="-38.139999"
           x2="58.34"
           y2="-27.700001"><stop
             offset="0"
             stop-color="#ffffff"
             id="stop2-5" /><stop
             offset="1"
             stop-color="#d3d3d3"
             id="stop3-9" /></linearGradient><path
           style="fill:url(#gradient0-7)"
           d="M 2,28 36,43 58,17 25,5 Z"
           id="path3-2" /><linearGradient
           id="gradient1-28"
           gradientUnits="userSpaceOnUse"
           x1="44.720001"
           y1="-7.9000001"
           x2="86.099998"
           y2="10.51"><stop
             offset="0"
             stop-color="#474747"
             id="stop4-9" /><stop
             offset="1"
             stop-color="#a5a0a0"
             id="stop5-7" /></linearGradient><path
           style="fill:url(#gradient1-28)"
           d="M 36,43 V 59 L 58,30 V 17 Z"
           id="path5-3" /><linearGradient
           id="gradient2-6"
           gradientUnits="userSpaceOnUse"
           x1="22.969999"
           y1="92.589996"
           x2="-14.6"
           y2="67.290001"><stop
             offset="0"
             stop-color="#7d7d7d"
             id="stop6-12" /><stop
             offset="1"
             stop-color="#d4d4d4"
             id="stop7-9" /></linearGradient><path
           style="fill:url(#gradient2-6)"
           d="M 2,28 V 41 L 36,59 V 43 Z"
           id="path7-3" /><linearGradient
           id="gradient3-1"
           gradientUnits="userSpaceOnUse"
           x1="32.049999"
           y1="9.6800003"
           x2="43.48"
           y2="24.049999"><stop
             offset="0"
             stop-color="#596756"
             id="stop8-94" /><stop
             offset="1"
             stop-color="#ebb2b2"
             id="stop9-7" /></linearGradient><path
           style="fill:none;stroke:url(#gradient3-1);stroke-width:5;stroke-linecap:round"
           d="m 7,35 5.75,2.5"
           id="path9-8" /><path
           style="fill:none;stroke:#ff0000;stroke-width:2"
           d="m 6,35 3,1"
           transform="translate(4,1.5)"
           id="path10-4" /><path
           style="fill:none;stroke:#a7ff00;stroke-width:2"
           d="m 6,35 3,1"
           transform="translate(0,-0.25)"
           id="path11" /></g></g><g
       id="g54"
       transform="translate(6.6579919,2.8395622)"><g
         style="color-interpolation:linearRGB"
         id="g4"
         transform="matrix(0.26458333,0,0,0.26458333,55.574958,105.35719)"><g
           id="g13"><path
             style="fill:#000000;fill-opacity:0.3294"
             d="m 6,52 20,-14 18,-1 15,4 c 2,1 0,3 0,3 L 43,61 c -1,1 -3.04,1 -3.04,1 H 28 Z"
             id="path1-5" /><path
             style="fill:none;stroke:#000000;stroke-width:4"
             d="M 23,3 7,15 c 0,0 -1,0 -1,2 0,2 0,28 0,28 0,2 1,3 1,3 l 19,10 c 0,0 1,1 3,-1 L 46,39 c 0,0 0,-25 0,-27 0,-2 -1,-2 -1,-2 L 27.1,2.8 C 27.1,2.8 25,1 23,3 Z"
             id="path2-0" /><linearGradient
             id="gradient0-3"
             gradientUnits="userSpaceOnUse"
             x1="27.65"
             y1="-1.9400001"
             x2="51.700001"
             y2="19.120001"><stop
               offset="0"
               stop-color="#cecece"
               id="stop2-6" /><stop
               offset="1"
               stop-color="#acacac"
               id="stop3-1" /></linearGradient><path
             style="fill:url(#linearGradient51)"
             d="m 6,17 c 0,1 0,26 0,28 0,2 1.05,2.52 1.05,2.52 l 19.93,9.97 C 26.98,57.49 28,57 28,56 28,55 28,27 28,25 28,23 26.97,22.57 26.97,22.57 L 7,15 c 0,0 -1,0 -1,2 z"
             id="path3-0" /><linearGradient
             id="gradient1-6"
             gradientUnits="userSpaceOnUse"
             x1="48.049999"
             y1="-27.809999"
             x2="77.269997"
             y2="-16.549999"><stop
               offset="0"
               stop-color="#858585"
               id="stop4-3" /><stop
               offset="1"
               stop-color="#bababa"
               id="stop5-2" /></linearGradient><path
             style="fill:url(#linearGradient52)"
             d="M 28,25 V 57 L 46,39 V 11 Z"
             id="path5-0" /><linearGradient
             id="gradient2-61"
             gradientUnits="userSpaceOnUse"
             x1="31.91"
             y1="46.25"
             x2="4.4099998"
             y2="34.93"><stop
               offset="0"
               stop-color="#c3c3c3"
               id="stop6-5" /><stop
               offset="1"
               stop-color="#fffcf9"
               id="stop7-5" /></linearGradient><path
             style="fill:url(#linearGradient53)"
             d="M 25,2 7,15 27,23 45,10 Z"
             id="path7-4" /><path
             style="fill:#000000"
             d="m 18,20 v 2 c 0,0 4,1 4,4 0,1 0,29 0,29 l 5,2 V 26 c 0,-2 -1,-2 -1,-2 z"
             id="path8-7" /><linearGradient
             id="gradient3-65"
             gradientUnits="userSpaceOnUse"
             x1="54.040001"
             y1="-6.4099998"
             x2="60.5"
             y2="1.62"><stop
               offset="0"
               stop-color="#e8e8e8"
               id="stop8-6" /><stop
               offset="0.9973"
               stop-color="#a5a5a5"
               id="stop9-9" /></linearGradient><path
             style="fill:url(#linearGradient54)"
             d="m 28,25 c 0,0 0,-2 -1,-2 2,-1 18,-13 18,-13 0,0 1,0 1,2 -3,2 -18,13 -18,13 z"
             id="path9-3" /><path
             style="fill:#000000"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             id="path10-7" /><path
             style="fill:#000000"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             transform="translate(-10,11)"
             id="path11-4" /><path
             style="fill:#a9ff00"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             transform="matrix(-0.2449,-0.2777,0.1656,-0.4108,27.9469,59.752)"
             id="path12-5" /><path
             style="fill:#a9ff00"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             transform="matrix(-0.2449,-0.2777,0.1656,-0.4108,27.9469,64.752)"
             id="path13-2" /></g></g><g
         style="color-interpolation:linearRGB"
         id="g31"
         transform="matrix(0.26458333,0,0,0.26458333,126.32179,105.35719)"><g
           id="g30"><path
             style="fill:#000000;fill-opacity:0.3294"
             d="m 6,52 20,-14 18,-1 15,4 c 2,1 0,3 0,3 L 43,61 c -1,1 -3.04,1 -3.04,1 H 28 Z"
             id="path16" /><path
             style="fill:none;stroke:#000000;stroke-width:4"
             d="M 23,3 7,15 c 0,0 -1,0 -1,2 0,2 0,28 0,28 0,2 1,3 1,3 l 19,10 c 0,0 1,1 3,-1 L 46,39 c 0,0 0,-25 0,-27 0,-2 -1,-2 -1,-2 L 27.1,2.8 C 27.1,2.8 25,1 23,3 Z"
             id="path17" /><linearGradient
             id="linearGradient20"
             gradientUnits="userSpaceOnUse"
             x1="27.65"
             y1="-1.9400001"
             x2="51.700001"
             y2="19.120001"><stop
               offset="0"
               stop-color="#cecece"
               id="stop19" /><stop
               offset="1"
               stop-color="#acacac"
               id="stop20" /></linearGradient><path
             style="fill:url(#linearGradient31)"
             d="m 6,17 c 0,1 0,26 0,28 0,2 1.05,2.52 1.05,2.52 l 19.93,9.97 C 26.98,57.49 28,57 28,56 28,55 28,27 28,25 28,23 26.97,22.57 26.97,22.57 L 7,15 c 0,0 -1,0 -1,2 z"
             id="path20" /><linearGradient
             id="linearGradient22"
             gradientUnits="userSpaceOnUse"
             x1="48.049999"
             y1="-27.809999"
             x2="77.269997"
             y2="-16.549999"><stop
               offset="0"
               stop-color="#858585"
               id="stop21" /><stop
               offset="1"
               stop-color="#bababa"
               id="stop22" /></linearGradient><path
             style="fill:url(#linearGradient32)"
             d="M 28,25 V 57 L 46,39 V 11 Z"
             id="path22" /><linearGradient
             id="linearGradient24"
             gradientUnits="userSpaceOnUse"
             x1="31.91"
             y1="46.25"
             x2="4.4099998"
             y2="34.93"><stop
               offset="0"
               stop-color="#c3c3c3"
               id="stop23" /><stop
               offset="1"
               stop-color="#fffcf9"
               id="stop24" /></linearGradient><path
             style="fill:url(#linearGradient33)"
             d="M 25,2 7,15 27,23 45,10 Z"
             id="path24" /><path
             style="fill:#000000"
             d="m 18,20 v 2 c 0,0 4,1 4,4 0,1 0,29 0,29 l 5,2 V 26 c 0,-2 -1,-2 -1,-2 z"
             id="path25" /><linearGradient
             id="linearGradient26"
             gradientUnits="userSpaceOnUse"
             x1="54.040001"
             y1="-6.4099998"
             x2="60.5"
             y2="1.62"><stop
               offset="0"
               stop-color="#e8e8e8"
               id="stop25" /><stop
               offset="0.9973"
               stop-color="#a5a5a5"
               id="stop26" /></linearGradient><path
             style="fill:url(#linearGradient34)"
             d="m 28,25 c 0,0 0,-2 -1,-2 2,-1 18,-13 18,-13 0,0 1,0 1,2 -3,2 -18,13 -18,13 z"
             id="path26" /><path
             style="fill:#000000"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             id="path27" /><path
             style="fill:#000000"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             transform="translate(-10,11)"
             id="path28" /><path
             style="fill:#a9ff00"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             transform="matrix(-0.2449,-0.2777,0.1656,-0.4108,27.9469,59.752)"
             id="path29" /><path
             style="fill:#a9ff00"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             transform="matrix(-0.2449,-0.2777,0.1656,-0.4108,27.9469,64.752)"
             id="path30" /></g></g><g
         style="color-interpolation:linearRGB"
         id="g47"
         transform="matrix(0.26458333,0,0,0.26458333,90.948374,104.41229)"><g
           id="g46"><path
             style="fill:#000000;fill-opacity:0.3294"
             d="m 6,52 20,-14 18,-1 15,4 c 2,1 0,3 0,3 L 43,61 c -1,1 -3.04,1 -3.04,1 H 28 Z"
             id="path34" /><path
             style="fill:none;stroke:#000000;stroke-width:4"
             d="M 23,3 7,15 c 0,0 -1,0 -1,2 0,2 0,28 0,28 0,2 1,3 1,3 l 19,10 c 0,0 1,1 3,-1 L 46,39 c 0,0 0,-25 0,-27 0,-2 -1,-2 -1,-2 L 27.1,2.8 C 27.1,2.8 25,1 23,3 Z"
             id="path35" /><linearGradient
             id="linearGradient36"
             gradientUnits="userSpaceOnUse"
             x1="27.65"
             y1="-1.9400001"
             x2="51.700001"
             y2="19.120001"><stop
               offset="0"
               stop-color="#cecece"
               id="stop35" /><stop
               offset="1"
               stop-color="#acacac"
               id="stop36" /></linearGradient><path
             style="fill:url(#linearGradient47)"
             d="m 6,17 c 0,1 0,26 0,28 0,2 1.05,2.52 1.05,2.52 l 19.93,9.97 C 26.98,57.49 28,57 28,56 28,55 28,27 28,25 28,23 26.97,22.57 26.97,22.57 L 7,15 c 0,0 -1,0 -1,2 z"
             id="path36" /><linearGradient
             id="linearGradient38"
             gradientUnits="userSpaceOnUse"
             x1="48.049999"
             y1="-27.809999"
             x2="77.269997"
             y2="-16.549999"><stop
               offset="0"
               stop-color="#858585"
               id="stop37" /><stop
               offset="1"
               stop-color="#bababa"
               id="stop38" /></linearGradient><path
             style="fill:url(#linearGradient48)"
             d="M 28,25 V 57 L 46,39 V 11 Z"
             id="path38" /><linearGradient
             id="linearGradient40"
             gradientUnits="userSpaceOnUse"
             x1="31.91"
             y1="46.25"
             x2="4.4099998"
             y2="34.93"><stop
               offset="0"
               stop-color="#c3c3c3"
               id="stop39" /><stop
               offset="1"
               stop-color="#fffcf9"
               id="stop40" /></linearGradient><path
             style="fill:url(#linearGradient49)"
             d="M 25,2 7,15 27,23 45,10 Z"
             id="path40" /><path
             style="fill:#000000"
             d="m 18,20 v 2 c 0,0 4,1 4,4 0,1 0,29 0,29 l 5,2 V 26 c 0,-2 -1,-2 -1,-2 z"
             id="path41" /><linearGradient
             id="linearGradient42"
             gradientUnits="userSpaceOnUse"
             x1="54.040001"
             y1="-6.4099998"
             x2="60.5"
             y2="1.62"><stop
               offset="0"
               stop-color="#e8e8e8"
               id="stop41" /><stop
               offset="0.9973"
               stop-color="#a5a5a5"
               id="stop42" /></linearGradient><path
             style="fill:url(#linearGradient50)"
             d="m 28,25 c 0,0 0,-2 -1,-2 2,-1 18,-13 18,-13 0,0 1,0 1,2 -3,2 -18,13 -18,13 z"
             id="path42" /><path
             style="fill:#000000"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             id="path43" /><path
             style="fill:#000000"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             transform="translate(-10,11)"
             id="path44" /><path
             style="fill:#a9ff00"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             transform="matrix(-0.2449,-0.2777,0.1656,-0.4108,27.9469,59.752)"
             id="path45" /><path
             style="fill:#a9ff00"
             d="m 44,42 c 0,0 2,1 2,2 0,1 -2,3 -3,3 -1,0 -2,-2 -2,-2"
             transform="matrix(-0.2449,-0.2777,0.1656,-0.4108,27.9469,64.752)"
             id="path46" /></g></g></g><path
       style="font-weight:600;font-size:5.29167px;font-family:'Work Sans';-inkscape-font-specification:'Work Sans Semi-Bold'"
       d="m 67.490102,130.96066 h -0.756709 l -0.291042,-0.85196 h -1.338792 l -0.291042,0.85196 h -0.746125 l 1.275292,-3.4925 h 0.873126 z m -2.222501,-1.39171 h 1.010709 l -0.508001,-1.524 z m 5.52429,-2.10079 v 2.11667 q 0,0.71437 -0.381,1.07421 -0.381,0.35454 -1.11125,0.35454 -0.730251,0 -1.111251,-0.35454 -0.381,-0.35984 -0.381,-1.07421 v -2.11667 h 0.73025 v 2.08492 q 0,0.43921 0.185209,0.65087 0.1905,0.21167 0.576792,0.21167 0.386291,0 0.5715,-0.21167 0.185208,-0.21166 0.185208,-0.65087 v -2.08492 z"
       id="text54"
       aria-label="AU" /><path
       style="font-weight:600;font-size:5.29167px;font-family:'Work Sans';-inkscape-font-specification:'Work Sans Semi-Bold'"
       d="m 104.48671,128.08199 h -1.88383 v 0.88901 h 1.48695 v 0.58737 h -1.48695 v 1.42875 h -0.73025 v -3.4925 h 2.61408 z m 2.16429,-0.58737 q 0.59267,0 0.93133,0.28575 0.33867,0.28575 0.33867,0.76729 0,0.51329 -0.33867,0.78846 -0.33866,0.26988 -0.92604,0.26988 l -0.0741,0.0423 h -0.75142 v 1.33879 h -0.71967 v -3.4925 z m -0.0847,1.59808 q 0.30692,0 0.45509,-0.1217 0.15346,-0.127 0.15346,-0.3863 0,-0.25929 -0.15346,-0.381 -0.14817,-0.127 -0.45509,-0.127 h -0.73554 v 1.016 z m 0.42863,0.15346 1.13242,1.74096 h -0.82021 l -0.93663,-1.52929 z"
       id="text55"
       aria-label="FR" /><path
       style="font-weight:600;font-size:5.29167px;font-family:'Work Sans';-inkscape-font-specification:'Work Sans Semi-Bold'"
       d="m 138.23485,127.49462 v 3.4925 h -0.83608 l -1.22238,-2.05317 -0.30163,-0.5715 h -0.005 l 0.0212,0.60325 v 2.02142 h -0.65617 v -3.4925 h 0.83079 l 1.22238,2.04788 0.30163,0.57679 h 0.0106 l -0.0212,-0.60325 v -2.02142 z m 3.71475,0 -1.23825,2.18546 v 1.30704 h -0.73025 v -1.30704 l -1.23825,-2.18546 h 0.77788 l 0.56091,1.04775 0.26459,0.54504 0.26987,-0.54504 0.56092,-1.04775 z"
       id="text56"
       aria-label="NY" /><path
       style="font-weight:600;font-size:5.29167px;font-family:'Work Sans';-inkscape-font-specification:'Work Sans Semi-Bold'"
       d="m 99.119839,182.28596 q -0.3175,0 -0.576792,-0.11112 -0.254,-0.10583 -0.402167,-0.33867 -0.148167,-0.23283 -0.148167,-0.59266 0,-0.0847 0.01588,-0.17992 0.02117,-0.0952 0.0635,-0.18521 l 0.47625,-0.0741 q -0.03704,0.0952 -0.05821,0.17462 -0.01587,0.0741 -0.01587,0.13759 0,0.24341 0.08996,0.37041 0.08996,0.127 0.238125,0.17463 0.148166,0.0476 0.328083,0.0476 0.216959,0 0.370417,-0.0529 0.15875,-0.0476 0.264584,-0.13759 l 0.132291,0.54504 q -0.132291,0.10584 -0.354542,0.16405 -0.216958,0.0582 -0.423333,0.0582 z m -0.867834,-4.60375 q 0.518584,0 0.894292,0.21696 0.375709,0.21696 0.576792,0.61913 0.206375,0.40216 0.206375,0.96308 0,0.56092 -0.206375,0.96308 -0.201083,0.40217 -0.576792,0.61913 -0.375708,0.21696 -0.894292,0.21696 -0.518584,0 -0.899584,-0.21696 -0.375708,-0.21696 -0.582084,-0.61913 -0.201083,-0.40216 -0.201083,-0.96308 0,-0.56092 0.201083,-0.96308 0.206376,-0.40217 0.582084,-0.61913 0.381,-0.21696 0.899584,-0.21696 z m 0,0.59796 q -0.296334,0 -0.502709,0.13758 -0.206375,0.13759 -0.3175,0.40746 -0.105833,0.26459 -0.105833,0.65617 0,0.38629 0.105833,0.65617 0.111125,0.26987 0.3175,0.40746 0.206375,0.13758 0.502709,0.13758 0.291042,0 0.497417,-0.13758 0.206375,-0.13759 0.312208,-0.40746 0.111126,-0.26988 0.111126,-0.65617 0,-0.39158 -0.111126,-0.65617 -0.105833,-0.26987 -0.312208,-0.40746 -0.206375,-0.13758 -0.497417,-0.13758 z m 3.545415,0.24871 q 0.40217,0 0.70379,0.16404 0.30692,0.16404 0.47625,0.47096 0.17463,0.30692 0.17463,0.74083 0,0.42863 -0.17463,0.74084 -0.16933,0.30691 -0.47625,0.47096 -0.30162,0.16404 -0.70379,0.16404 -0.39688,0 -0.70379,-0.16404 -0.30692,-0.16405 -0.48154,-0.47096 -0.16934,-0.31221 -0.16934,-0.74084 0,-0.43391 0.16934,-0.74083 0.17462,-0.30692 0.48154,-0.47096 0.30691,-0.16404 0.70379,-0.16404 z m 0,0.53975 q -0.20108,0 -0.34396,0.0952 -0.13758,0.09 -0.21167,0.27517 -0.0741,0.1852 -0.0741,0.46566 0,0.28046 0.0741,0.46567 0.0741,0.18521 0.21167,0.28046 0.14288,0.09 0.34396,0.09 0.19579,0 0.33337,-0.09 0.14288,-0.0952 0.21696,-0.28046 0.0741,-0.18521 0.0741,-0.46567 0,-0.28046 -0.0741,-0.46566 -0.0741,-0.18521 -0.21696,-0.27517 -0.13758,-0.0952 -0.33337,-0.0952 z m 2.87031,-1.29646 v 2.59292 q 0,0.1905 0.0952,0.28046 0.10054,0.0847 0.26987,0.0847 0.13229,0 0.23284,-0.037 0.10054,-0.0423 0.17991,-0.11112 l 0.11642,0.48154 q -0.127,0.10054 -0.3175,0.15875 -0.1905,0.0582 -0.40217,0.0582 -0.26458,0 -0.47096,-0.0794 -0.20108,-0.0794 -0.3175,-0.254 -0.11112,-0.17462 -0.11112,-0.46566 v -2.50826 z m 0.84666,0.80963 v 0.53975 h -2.05846 v -0.53975 z m 1.69863,-0.0529 q 0.40217,0 0.70379,0.16404 0.30692,0.16404 0.47625,0.47096 0.17463,0.30692 0.17463,0.74083 0,0.42863 -0.17463,0.74084 -0.16933,0.30691 -0.47625,0.47096 -0.30162,0.16404 -0.70379,0.16404 -0.39687,0 -0.70379,-0.16404 -0.30692,-0.16405 -0.48154,-0.47096 -0.16933,-0.31221 -0.16933,-0.74084 0,-0.43391 0.16933,-0.74083 0.17462,-0.30692 0.48154,-0.47096 0.30692,-0.16404 0.70379,-0.16404 z m 0,0.53975 q -0.20108,0 -0.34396,0.0952 -0.13758,0.09 -0.21166,0.27517 -0.0741,0.1852 -0.0741,0.46566 0,0.28046 0.0741,0.46567 0.0741,0.18521 0.21166,0.28046 0.14288,0.09 0.34396,0.09 0.19579,0 0.33338,-0.09 0.14287,-0.0952 0.21696,-0.28046 0.0741,-0.18521 0.0741,-0.46567 0,-0.28046 -0.0741,-0.46566 -0.0741,-0.18521 -0.21696,-0.27517 -0.13759,-0.0952 -0.33338,-0.0952 z m 1.96322,2.159 v -2.64583 h 0.65087 l 0.0265,0.47625 q 0.13229,-0.26459 0.35983,-0.39688 0.23284,-0.13229 0.5133,-0.13229 0.28575,0 0.51329,0.13229 0.23283,0.13229 0.34925,0.39158 0.0847,-0.17462 0.22754,-0.29104 0.14288,-0.11641 0.3175,-0.17462 0.17463,-0.0582 0.35454,-0.0582 0.25929,0 0.47096,0.10583 0.21696,0.10584 0.34396,0.3175 0.127,0.21167 0.127,0.53975 v 1.73567 h -0.72496 v -1.59279 q 0,-0.29104 -0.127,-0.41275 -0.127,-0.12171 -0.32808,-0.12171 -0.15875,0 -0.29634,0.0794 -0.13229,0.0794 -0.21166,0.23813 -0.0741,0.15346 -0.0741,0.38629 v 1.42346 h -0.72496 v -1.59279 q 0,-0.29104 -0.13229,-0.41275 -0.127,-0.12171 -0.32808,-0.12171 -0.13758,0 -0.27517,0.0741 -0.13229,0.0741 -0.22225,0.23284 -0.0847,0.15875 -0.0847,0.41804 v 1.40229 z"
       id="text58"
       aria-label="Qotom" /><path
       style="font-weight:600;font-size:5.29167px;font-family:'Work Sans';-inkscape-font-specification:'Work Sans Semi-Bold'"
       d="m 121.1676,72.850387 q -0.48154,0 -0.84667,-0.211667 -0.35983,-0.211667 -0.56092,-0.613834 -0.20108,-0.402167 -0.20108,-0.968375 0,-0.560917 0.21167,-0.963084 0.21166,-0.407459 0.59796,-0.624417 0.39158,-0.216959 0.90487,-0.216959 0.56621,0 0.91546,0.211667 0.34925,0.206375 0.55563,0.645584 l -0.67734,0.291042 q -0.0847,-0.280459 -0.29104,-0.412751 -0.20108,-0.137583 -0.49742,-0.137583 -0.29633,0 -0.51329,0.142875 -0.21696,0.137583 -0.33337,0.407459 -0.11642,0.264583 -0.11642,0.650875 0,0.396875 0.11113,0.672042 0.11112,0.269875 0.32808,0.407459 0.22225,0.132291 0.54504,0.132291 0.17463,0 0.32279,-0.04233 0.15346,-0.04233 0.26459,-0.127 0.11112,-0.08467 0.17462,-0.216958 0.0635,-0.132292 0.0635,-0.306917 v -0.07937 h -0.91546 v -0.534459 h 1.54517 v 1.841501 h -0.51329 l -0.0529,-0.762 0.127,0.08996 q -0.11642,0.34925 -0.41275,0.53975 -0.29104,0.185209 -0.73554,0.185209 z m 3.51896,-2.751669 q 0.35454,0 0.59796,0.105834 0.2487,0.100542 0.39687,0.280458 0.15346,0.174625 0.21696,0.391584 l -0.67733,0.243417 q -0.0529,-0.238125 -0.17992,-0.359834 -0.127,-0.121708 -0.34396,-0.121708 -0.20108,0 -0.34396,0.09525 -0.14287,0.08996 -0.21696,0.280458 -0.0741,0.185209 -0.0741,0.465667 0,0.280459 0.0741,0.465667 0.0794,0.185209 0.22225,0.275167 0.14817,0.08996 0.34396,0.08996 0.15875,0 0.26988,-0.05292 0.11112,-0.05821 0.17991,-0.164042 0.0741,-0.105833 0.10055,-0.254 l 0.65616,0.211667 q -0.0582,0.238125 -0.21696,0.418042 -0.15875,0.179916 -0.40745,0.280458 -0.24871,0.100542 -0.5768,0.100542 -0.40745,0 -0.71966,-0.164042 -0.31221,-0.164042 -0.48155,-0.470959 -0.16933,-0.306916 -0.16933,-0.740833 0,-0.433917 0.16933,-0.740834 0.16934,-0.306917 0.47626,-0.470959 0.30691,-0.164042 0.70379,-0.164042 z m 2.98979,0 q 0.40216,0 0.70379,0.164042 0.30692,0.164042 0.47625,0.470959 0.17462,0.306917 0.17462,0.740834 0,0.428625 -0.17462,0.740833 -0.16933,0.306917 -0.47625,0.470959 -0.30163,0.164042 -0.70379,0.164042 -0.39688,0 -0.7038,-0.164042 -0.30691,-0.164042 -0.48154,-0.470959 -0.16933,-0.312208 -0.16933,-0.740833 0,-0.433917 0.16933,-0.740834 0.17463,-0.306917 0.48154,-0.470959 0.30692,-0.164042 0.7038,-0.164042 z m 0,0.539751 q -0.20109,0 -0.34396,0.09525 -0.13759,0.08996 -0.21167,0.275167 -0.0741,0.185208 -0.0741,0.465667 0,0.280458 0.0741,0.465667 0.0741,0.185208 0.21167,0.280458 0.14287,0.08996 0.34396,0.08996 0.19579,0 0.33337,-0.08996 0.14288,-0.09525 0.21696,-0.280458 0.0741,-0.185209 0.0741,-0.465667 0,-0.280459 -0.0741,-0.465667 -0.0741,-0.185209 -0.21696,-0.275167 -0.13758,-0.09525 -0.33337,-0.09525 z m 1.96321,2.159001 v -2.645835 h 0.62971 l 0.0476,0.518584 q 0.10584,-0.275167 0.30692,-0.423334 0.20638,-0.148167 0.51329,-0.148167 0.09,0 0.16404,0.01587 0.0741,0.01587 0.12171,0.04233 l -0.0847,0.608542 q -0.0529,-0.02117 -0.1323,-0.03175 -0.0741,-0.01058 -0.19579,-0.01058 -0.15875,0 -0.30691,0.07937 -0.14817,0.07408 -0.24342,0.232833 -0.0952,0.153458 -0.0952,0.391584 v 1.370542 z m 3.40826,0.05292 q -0.41804,0 -0.73025,-0.164042 -0.30691,-0.164042 -0.47625,-0.470959 -0.16933,-0.306916 -0.16933,-0.740833 0,-0.433917 0.16933,-0.740834 0.16934,-0.306917 0.47096,-0.470959 0.30692,-0.164042 0.6985,-0.164042 0.40217,0 0.68263,0.164042 0.28046,0.15875 0.42862,0.439209 0.14817,0.275167 0.14817,0.629709 0,0.105833 -0.005,0.201083 -0.005,0.09525 -0.0159,0.169333 h -2.11137 v -0.502708 h 1.79387 l -0.34925,0.127 q 0,-0.333375 -0.15346,-0.513292 -0.14816,-0.179917 -0.42333,-0.179917 -0.20108,0 -0.34925,0.09525 -0.14288,0.09525 -0.21696,0.28575 -0.0741,0.185209 -0.0741,0.470959 0,0.280458 0.0794,0.465667 0.0847,0.179917 0.23284,0.269875 0.15345,0.08996 0.36512,0.08996 0.23284,0 0.37571,-0.08996 0.14288,-0.08996 0.22225,-0.248708 l 0.57679,0.22225 q -0.0847,0.206375 -0.25929,0.354542 -0.16933,0.148166 -0.40746,0.227541 -0.23283,0.07408 -0.50271,0.07408 z m 4.96359,0 q -0.48154,0 -0.84667,-0.211667 -0.35983,-0.211667 -0.56091,-0.613834 -0.20109,-0.402167 -0.20109,-0.968375 0,-0.560917 0.21167,-0.963084 0.21167,-0.407459 0.59796,-0.624417 0.39158,-0.216959 0.90488,-0.216959 0.5662,0 0.91545,0.211667 0.34925,0.206375 0.55563,0.645584 l -0.67733,0.291042 q -0.0847,-0.280459 -0.29105,-0.412751 -0.20108,-0.137583 -0.49741,-0.137583 -0.29634,0 -0.51329,0.142875 -0.21696,0.137583 -0.33338,0.407459 -0.11642,0.264583 -0.11642,0.650875 0,0.396875 0.11113,0.672042 0.11112,0.269875 0.32808,0.407459 0.22225,0.132291 0.54504,0.132291 0.17463,0 0.3228,-0.04233 0.15345,-0.04233 0.26458,-0.127 0.11112,-0.08467 0.17462,-0.216958 0.0635,-0.132292 0.0635,-0.306917 v -0.07937 h -0.91545 V 70.95598 h 1.54516 v 1.841501 h -0.51329 l -0.0529,-0.762 0.127,0.08996 q -0.11641,0.34925 -0.41275,0.53975 -0.29104,0.185209 -0.73554,0.185209 z m 3.54542,0 q -0.41804,0 -0.73025,-0.164042 -0.30692,-0.164042 -0.47625,-0.470959 -0.16934,-0.306916 -0.16934,-0.740833 0,-0.433917 0.16934,-0.740834 0.16933,-0.306917 0.47096,-0.470959 0.30691,-0.164042 0.6985,-0.164042 0.40216,0 0.68262,0.164042 0.28046,0.15875 0.42863,0.439209 0.14816,0.275167 0.14816,0.629709 0,0.105833 -0.005,0.201083 -0.005,0.09525 -0.0159,0.169333 h -2.11138 v -0.502708 h 1.79388 l -0.34925,0.127 q 0,-0.333375 -0.15346,-0.513292 -0.14817,-0.179917 -0.42334,-0.179917 -0.20108,0 -0.34925,0.09525 -0.14287,0.09525 -0.21695,0.28575 -0.0741,0.185209 -0.0741,0.470959 0,0.280458 0.0794,0.465667 0.0847,0.179917 0.23283,0.269875 0.15346,0.08996 0.36513,0.08996 0.23283,0 0.3757,-0.08996 0.14288,-0.08996 0.22225,-0.248708 l 0.5768,0.22225 q -0.0847,0.206375 -0.25929,0.354542 -0.16934,0.148166 -0.40746,0.227541 -0.23284,0.07408 -0.50271,0.07408 z m 3.04271,-2.751669 q 0.40217,0 0.70379,0.164042 0.30692,0.164042 0.47625,0.470959 0.17463,0.306917 0.17463,0.740834 0,0.428625 -0.17463,0.740833 -0.16933,0.306917 -0.47625,0.470959 -0.30162,0.164042 -0.70379,0.164042 -0.39688,0 -0.70379,-0.164042 -0.30692,-0.164042 -0.48154,-0.470959 -0.16934,-0.312208 -0.16934,-0.740833 0,-0.433917 0.16934,-0.740834 0.17462,-0.306917 0.48154,-0.470959 0.30691,-0.164042 0.70379,-0.164042 z m 0,0.539751 q -0.20108,0 -0.34396,0.09525 -0.13758,0.08996 -0.21167,0.275167 -0.0741,0.185208 -0.0741,0.465667 0,0.280458 0.0741,0.465667 0.0741,0.185208 0.21167,0.280458 0.14288,0.08996 0.34396,0.08996 0.19579,0 0.33338,-0.08996 0.14287,-0.09525 0.21695,-0.280458 0.0741,-0.185209 0.0741,-0.465667 0,-0.280459 -0.0741,-0.465667 -0.0741,-0.185209 -0.21695,-0.275167 -0.13759,-0.09525 -0.33338,-0.09525 z m 3.35714,-1.333501 q 0.82021,0 1.27,0.455084 0.44979,0.449792 0.44979,1.291167 0,0.836084 -0.44979,1.291167 -0.44979,0.455084 -1.27,0.455084 h -1.34937 v -3.492502 z m -0.037,2.910418 q 0.49742,0 0.74612,-0.296333 0.25401,-0.301625 0.25401,-0.867834 0,-0.566209 -0.25401,-0.862542 -0.2487,-0.301625 -0.74612,-0.301625 h -0.58208 v 2.328334 z m 5.49275,-2.910418 v 3.492502 h -0.83608 l -1.22238,-2.053168 -0.30162,-0.5715 h -0.005 l 0.0212,0.60325 v 2.021418 h -0.65616 v -3.492502 h 0.83079 l 1.22237,2.047876 0.30163,0.576792 h 0.0106 l -0.0212,-0.60325 v -2.021418 z m 2.18546,-0.05292 q 0.47625,0 0.83609,0.164042 0.35983,0.164042 0.61383,0.486834 l -0.40746,0.470958 q -0.21696,-0.275167 -0.47625,-0.402167 -0.254,-0.132291 -0.59266,-0.132291 -0.22226,0 -0.37042,0.05821 -0.14288,0.05821 -0.21167,0.153458 -0.0635,0.09525 -0.0635,0.211667 0,0.142875 0.11113,0.243417 0.11112,0.09525 0.381,0.15875 l 0.65087,0.148167 q 0.51859,0.116417 0.74084,0.34925 0.22754,0.227542 0.22754,0.592667 0,0.343959 -0.17992,0.592667 -0.17992,0.243417 -0.50271,0.375709 -0.32279,0.127 -0.74083,0.127 -0.36513,0 -0.67204,-0.08467 -0.30163,-0.08996 -0.53975,-0.243417 -0.23813,-0.153458 -0.39688,-0.354542 l 0.41275,-0.492125 q 0.12171,0.169334 0.30163,0.301625 0.17991,0.132292 0.40745,0.211667 0.23284,0.07408 0.48684,0.07408 0.21696,0 0.36512,-0.04763 0.15346,-0.05292 0.22755,-0.142875 0.0794,-0.09525 0.0794,-0.227541 0,-0.137584 -0.0953,-0.232834 -0.09,-0.100542 -0.33867,-0.153458 l -0.70908,-0.15875 q -0.30692,-0.07408 -0.52917,-0.190501 -0.21696,-0.121708 -0.33337,-0.306916 -0.11113,-0.190501 -0.11113,-0.449792 0,-0.312209 0.16934,-0.560917 0.16933,-0.248709 0.48683,-0.391584 0.32279,-0.148167 0.77258,-0.148167 z"
       id="text59"
       aria-label="Gcore GeoDNS" /><path
       style="fill:none;fill-opacity:1;stroke:#000000;stroke-width:0.914483;stroke-opacity:1;marker-end:url(#Triangle)"
       d="m 105,35.169677 v 17.46231"
       id="path59" /><g
       id="g72"
       transform="translate(5.9813979,-79.950116)"><path
         style="fill:none;fill-opacity:1;stroke:#000000;stroke-width:0.914483;stroke-linecap:round;stroke-opacity:1;marker-start:url(#marker62)"
         d="m 99.016609,216.82519 v 20.07485"
         id="path61" /><path
         style="fill:none;fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:round;stroke-opacity:1;marker-end:url(#marker67)"
         d="M 98.971309,236.85147 71.211814,216.04016"
         id="path66" /><path
         style="fill:none;fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:round;stroke-opacity:1;marker-end:url(#marker67)"
         d="M 99.065889,236.85837 126.82539,216.04706"
         id="path68" /></g><g
       id="g71"
       transform="translate(2.39699)"><path
         style="fill:none;fill-opacity:1;stroke:#3a3a3a;stroke-width:0.914483;stroke-linecap:round;stroke-dasharray:2.74345, 1.82897;stroke-dashoffset:0;stroke-opacity:1;marker-start:url(#marker62)"
         d="M 102.6076,102.96746 V 82.846783"
         id="path69" /><path
         style="fill:none;fill-opacity:1;stroke:#3a3a3a;stroke-width:1;stroke-linecap:round;stroke-dasharray:3, 2;stroke-dashoffset:0;stroke-opacity:1;marker-end:url(#marker67)"
         d="m 102.56488,82.89535 -27.7595,20.81131"
         id="path70" /><path
         style="fill:none;fill-opacity:1;stroke:#3a3a3a;stroke-width:1;stroke-linecap:round;stroke-dasharray:3, 2;stroke-dashoffset:0;stroke-opacity:1;marker-end:url(#marker67)"
         d="m 102.64114,82.89535 27.7595,20.81131"
         id="path71" /></g><rect
       style="fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:bevel;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
       id="rect72"
       width="14.248107"
       height="4.8766723"
       x="97.148735"
       y="145.25316" /><path
       style="font-weight:500;font-size:4.23333px;font-family:'Work Sans';-inkscape-font-specification:'Work Sans Medium';stroke-linecap:round;stroke-linejoin:bevel"
       d="m 102.20201,148.16407 q -0.0847,0.254 -0.254,0.4318 -0.16933,0.17357 -0.39793,0.26247 -0.2286,0.0889 -0.50377,0.0889 -0.40217,0 -0.6985,-0.17357 -0.29633,-0.17356 -0.457199,-0.4953 -0.160866,-0.32173 -0.160866,-0.77046 0,-0.44873 0.160866,-0.77047 0.160869,-0.32173 0.457199,-0.4953 0.29633,-0.17356 0.69427,-0.17356 0.27516,0 0.4953,0.0762 0.22436,0.0762 0.381,0.2286 0.15663,0.1524 0.2413,0.381 l -0.42757,0.1905 q -0.0847,-0.24977 -0.24553,-0.36407 -0.16087,-0.11853 -0.4191,-0.11853 -0.25824,0 -0.45297,0.12276 -0.19473,0.12277 -0.3048,0.3556 -0.10583,0.23284 -0.10583,0.56727 0,0.3302 0.1016,0.56726 0.1016,0.23284 0.2921,0.3556 0.1905,0.12277 0.4572,0.12277 0.25823,0 0.4445,-0.13123 0.1905,-0.13547 0.27093,-0.40217 z m 1.4478,0.78317 q -0.3175,0 -0.5588,-0.13123 -0.2413,-0.13124 -0.37677,-0.37677 -0.13123,-0.24977 -0.13123,-0.59267 0,-0.34289 0.13123,-0.58843 0.13547,-0.24976 0.37254,-0.381 0.23706,-0.13123 0.53763,-0.13123 0.30903,0 0.52493,0.127 0.2159,0.127 0.3302,0.34713 0.1143,0.22014 0.1143,0.49953 0,0.0762 -0.004,0.14394 -0.004,0.0677 -0.0127,0.11853 h -1.7018 v -0.34713 h 1.50283 l -0.22437,0.0677 q 0,-0.28786 -0.14393,-0.44026 -0.14393,-0.15664 -0.3937,-0.15664 -0.18203,0 -0.3175,0.0847 -0.13546,0.0847 -0.20743,0.254 -0.072,0.1651 -0.072,0.4064 0,0.23706 0.0762,0.40216 0.0762,0.1651 0.2159,0.24977 0.1397,0.0847 0.3302,0.0847 0.21167,0 0.3429,-0.0804 0.13123,-0.0804 0.20743,-0.22436 l 0.35984,0.16933 q -0.0762,0.1524 -0.20744,0.2667 -0.127,0.11007 -0.3048,0.16933 -0.1778,0.0593 -0.38946,0.0593 z m 1.51553,-0.0423 v -2.11667 h 0.38523 l 0.0423,0.381 q 0.0847,-0.20743 0.24977,-0.31326 0.16933,-0.11007 0.41487,-0.11007 0.0635,0 0.127,0.0127 0.0635,0.008 0.10583,0.0296 l -0.0635,0.39794 q -0.0466,-0.0169 -0.10583,-0.0254 -0.055,-0.0127 -0.1524,-0.0127 -0.13124,0 -0.25824,0.072 -0.127,0.0677 -0.21166,0.20744 -0.0804,0.1397 -0.0804,0.35559 v 1.12184 z m 2.26652,-2.73897 v 2.10397 q 0,0.15663 0.0804,0.2286 0.0847,0.072 0.22437,0.072 0.1143,0 0.19896,-0.0339 0.0847,-0.0381 0.15663,-0.1016 l 0.1016,0.3302 q -0.0974,0.0847 -0.2413,0.13546 -0.13969,0.0466 -0.31326,0.0466 -0.18203,0 -0.33443,-0.0593 -0.1524,-0.0593 -0.23707,-0.1905 -0.0847,-0.13546 -0.0889,-0.35136 v -2.05317 z m 0.72813,0.6223 v 0.3556 h -1.5875 v -0.3556 z m 1.25306,2.159 q -0.3175,0 -0.57996,-0.12277 -0.26247,-0.12276 -0.41487,-0.34713 l 0.31327,-0.27093 q 0.0931,0.17356 0.2667,0.2794 0.1778,0.1016 0.42333,0.1016 0.19473,0 0.30903,-0.0677 0.1143,-0.0677 0.1143,-0.1905 0,-0.0804 -0.055,-0.1397 -0.0508,-0.0635 -0.19897,-0.0974 l -0.4445,-0.0931 q -0.33866,-0.0677 -0.4826,-0.2159 -0.14393,-0.1524 -0.14393,-0.38523 0,-0.17356 0.1016,-0.32173 0.1016,-0.14817 0.29633,-0.23707 0.19897,-0.0931 0.47414,-0.0931 0.3175,0 0.54186,0.1143 0.22437,0.11007 0.3429,0.3175 l -0.31326,0.26247 q -0.0804,-0.16934 -0.23707,-0.24977 -0.15663,-0.0847 -0.32597,-0.0847 -0.13546,0 -0.23283,0.0339 -0.0974,0.0339 -0.14817,0.0931 -0.0508,0.0593 -0.0508,0.1397 0,0.0847 0.0635,0.14817 0.0635,0.0635 0.2286,0.0974 l 0.4826,0.1016 q 0.3048,0.0593 0.42757,0.2032 0.127,0.1397 0.127,0.3429 0,0.2032 -0.10583,0.35984 -0.10584,0.1524 -0.3048,0.23706 -0.19897,0.0847 -0.47414,0.0847 z"
       id="text72"
       aria-label="Certs" /></g></svg>
<figcaption>

A digram of what we're building.[^1]

</figcaption>
</figure>

<!-- more -->

For some back story on Linked Listed see: [Building and Launching My
New Link Blog, linkedlist.org (Twice)](@/posts/2024/linked-list.md). While I
should have been focussing on writing content for the site, I instead continued
optimising what is currently a very low traffic website. Since the last post, I
added caching so that the application only renders a page once. After that, the
cached render result is reused for subsequent responses. These cached responses
are typically generated in about a third of a millisecond (~323µs on average),
which I was pretty happy with.

The problem was, for my convenience the server hosting Linked List was
located in Australia, where I live. Unfortunately most other people do not
live in Australia, and we're a long way from everywhere. This meant that
visitors would often encounter a lot of latency, just due to the
distances covered. Is this _really_ a problem for a lightweight website with
low traffic? Not really, but it bothered me, so I set about looking into
options to improve the situation.

{{ figure(image="posts/2024/tiny-cdn/response-times-before.png",
   link="posts/2024/tiny-cdn/response-times-before.png",
   resize_width=1600,
   alt="Screenshot of updown.io monitoring. It has response times for nine locations around the world. The average total time is 807ms.",
   caption="Average response timing from my monitoring at updown.io before the changes.") }}

I briefly explored options like Cloudflare and Fastly. These would have been
a cheap and sensible choice, but I didn't really feel like giving them (especially
Cloudflare) even more of the Internet's traffic, no matter how miniscule. Plus,
this is a personal project I do for fun, and just sticking a hosted cache in
front of it is no fun.

My stats in [GoatCounter] showed the top 10 visitor locations were:

1. Australia
1. United States
1. Germany
1. United Kingdom
1. Netherlands
1. France
1. Ireland
1. Japan
1. Canada
1. Poland

This suggested I'd get a decent improvement in latency for the most number of
visitors by adding presences in Europe and the US. It's probably worth noting
at this point that due to the nature of Linked List there is no central
database, so it's a relatively simple to improve performance by deploying an
instance in each location to be sped up.


Linked List is implemented in Rust and has very meagre system requirements. I
did some research into bargain-basement VPS's on [LowEndBox]. I found that
[RackNerd]<sup>(affiliate link)</sup> were offering [KVM] based VMs with 1Gb of
RAM[^2], custom ISO support, and US and European data centres for about US$12
per **year**—probably still more than Cloudflare or Fastly, but still cheap.

I created servers in the New York US datacentre, as well as France. These
servers were so cheap that I wanted to make sure the network and underlying
hardware was not over provisioned before committing to them. They were running
on older hardware[^3], but after some basic testing seemed fine.

### Provisioning & Configuration

{% aside(title="Want the code?", float="right") %}
I've [published the pyinfra install scripts to my git forge](https://forge.wezm.net/wezm/chimera-pyinfra)
if you're curious.
{% end %}

To provision the servers I used some some [pyinfra] code I'd written previously
to automate the installation of [Chimera Linux] in virtual machines. I picked
Chimera Linux because I like it and it's easy to do minimal installs with just
the things I want. There were some other benefits described later on too.

The basic steps for provisioning were:

1. Boot from the ISO and login as `root`
2. Bootstrap ssh access to the live environment with [xdotool]:
   * `xdotool windowfocus --sync $(xdotool selectwindow) type 'dinitctl start sshd && mkdir ~/.ssh && echo "ssh-rsa <key> wmoore-key" > ~/.ssh/authorized_keys && ip addr && fdisk -l'`
   * This works with local VMs in [virt-manager] as well as most web-based VNC
     consoles provided by VPC hosts, including RackNerd.
   * It uses `xdotool` to type into the selected window. The typed text enables
     sshd and adds my public key to the SSH authorized_keys, then prints some
     info about the network and disks that will be needed later.
3. Run the pyinfra installation deployment against the server:
   * `pyinfra -vvv --user root IP install-bios.py`

After that, the server is rebooted and boots off its disk. I wrote subsequent
pyinfra code to install and configure the server for hosting Linked List. This
includes things like installing packages, creating users, nginx configuration,
and ensuring services are started.

To deploy the Linked List application I defined a [cports] template to
build Linked List as a system ([apk]) package:

```python
pkgname = "linkedlist"
pkgver = "2.0.12"
pkgrel = 1
_gitrev = "5e1aed8"
_token = self.get_data("forge_token")
build_style = "cargo"
make_build_args = ["--bin", "linkedlistd"]
make_install_args = [*make_build_args]
hostmakedepends = ["cargo-auditable", "pkgconf"]
makedepends = [
    "oniguruma-devel",
    "rust-std",
]
pkgdesc = "Linked List web application"
maintainer = "Wesley Moore <wes@wezm.net>"
license = "custom:none"
url = "https://forge.wezm.net/wezm/linkedlist"
source = f"https://forge.wezm.net/api/v1/repos/wezm/linkedlist/archive/{_gitrev}.tar.gz?access_token={_token}>linkedlist-{pkgver}.tar.gz"
sha256 = "907978d15960b46f96fb1e5afaf3ff8dff888a00711dbe9c887e106314d85d70"

def post_install(self):
    self.install_sysusers(self.files_path / "sysusers.conf")
    self.install_tmpfiles(self.files_path / "tmpfiles.conf")
    self.install_service(self.files_path / "linkedlist")
```

As shown in the `post_install` hook, I was also able to make use of cports
support for `systemd-tmpfiles` and `systemd-sysusers`[^4] to create the
`linkedlist` user and data directory that will hold the content of the site.
There's also a [Dinit] service definition to run and manage the server:

```dinit
# linkedlist service

type = process
command = /usr/bin/linkedlistd
run-as = _linkedlist
env-file = linkedlist.env
logfile = /var/log/linkedlist.log
depends-on = local.target
smooth-recovery = true
```

The `env-file` allows the configuration to be changed without needing to rebuild the package.

The servers are configured with an additional `apk` repository that points at
my locally built packages. A pyinfa deployment takes care of building the
packages and syncing the repo to the servers.

{% aside(title="I thought cross-compiling Rust was easy?", float="right") %}
Cross-compiling Rust binaries is easy when just Rust is involved, but it gets
harder when there are system library dependencies. For example,
[oniguruma](https://github.com/kkos/oniguruma), which
Linked List uses transitively. Using `cports` makes managing this easy.
{% end %}

Using Chimera Linux and building the binary through `cports` has some other
neat benefits:

1. The cports build tool, `cbuild`, does not require a Chimera Linux host.
   I am able to re-build the package on my desktop that is still running Arch Linux.
   All that's required is a recent version of `apk-tools`, which is in the [AUR].
2. [My laptop](@/posts/2024/yoga-7x-snapdragon-developer-review/index.md) is
   aarch64 based, but the servers are not. Cross-compiling is trivial with
   `cbuild` though, just add `-a x86_64` to the `./cbuild -a x86_64 pkg
   user/linkedlist` command, and it doesn't matter what host architecture I'm
   on. This allows me to build and deploy an updated package from the
   aarch64 WSL2 Chimera install on my laptop as well as my x86\_64 desktop.

### TLS Certificates

At this point I had the application running on the servers. Next I needed to
handle certificates for `https`. I usually use [Lego] to manage certificates
from Let's Encrypt. This posed a challenge though, as each server needed to get
a copy of the same certificates.

I explored various options here. It's a common problem with a bunch of hosted
and self-hosted solutions. All seemed too complicated for my need of syncing
two files between three servers.

One option would be to designate one of the servers the primary, and have it sync
the certificates to the others. However, I wasn't keen on one of the internet
facing app servers having passwordless (key based) access to the others in
order to push updated certificates to them.

In the end I revived a [fanless Qotom Mini
PC](https://qotom.net/product/29.html) I had at home. I again used my pyinfra
Chimera install scripts to set it up, followed by more pyinfra code to
configure it. This machine is responsible for managing the certificates with Lego. It
pushes out updated files when they're renewed via a renew-hook script. The
script is managed by pyinfra and templated so that it syncs to each server in
my pyinfra inventory within the `linkedlist_servers` group:

```j2
#!/bin/sh -x

# push updated files to each server
# restart nginx on each server

if [ "$LEGO_CERT_DOMAIN" = "linkedlist.org" ]; then
  {%- for server in linkedlist_servers %}
    scp "$LEGO_CERT_PATH" "$LEGO_CERT_KEY_PATH" {{ server }}:/etc/ssl/lego/certificates/
    ssh {{ server }} doas dinitctl restart nginx
  {%- endfor %}
fi
```

The compromise here was that I had to allow the cert server `ssh` access to
each of the app servers, but each of the app servers has no access to the
others. I created a dedicated user for this purpose. A `doas` rule allows this
user to restart `nginx` to pick up the updated certificates:

```doas
permit nopass lego as root cmd dinitctl args restart nginx
```

### GeoDNS

The final piece of the puzzle was how to determine which server to send a
visitor to in order to minimise their latency. One option would be to use an
edge compute service like [Deno Deploy], and proxy the request to the desired
host. However, that adds another request, with its own latency—a bit over 20ms
in my testing. I wanted to avoid the extra hop, so I looked into GeoDNS. With
GeoDNS the source IP of DNS requests is geo-located in order to resolve to an
server IP that should minimise latency. Geo-location from IP addresses is
imperfect but good enough for this project.

I settled on [Gcore's Managed DNS service][gcore] as it had the necessary Geo
features, a generous free tier, and a reasonable paid tier if that was ever
reached. The UI is perhaps not super intuitive but I eventually got it set up
as desired:

{{ figure(image="posts/2024/tiny-cdn/gcore-dns-config.png",
   link="posts/2024/tiny-cdn/gcore-dns-config.png",
   width="709",
   alt="Screenshot of the Gcore DNS configuration. There's three records. The first is assigned to North America, the second Europe, Africa, and South America, the last one is the default fallback record.",
   caption="Gcore DNS configuration for linkedlist.org.") }}

* North America is served by the US server.
* Europe, Africa, and South America are served by the French server.
* Everything else is served by the Australian server.

The default is the AU server because it's an existing server I already had that
has more RAM and CPU than the others. Some of these mappings were informed by
results from [PingBear] \(down at the time of writing). I was also able to
utilise the health checking feature in Gcore to avoid resolving DNS requests to
servers that are down for some reason.

### Taking It Live

With the DNS sorted, I finally switched the NS records for `linkedlist.org` over
to Gcore and started seeing each of the servers handle traffic 🎉.

One final detail: how is new content deployed? The content is independent of
the application, which monitors the content directory for changes, reloading as
necessary. Therefore deploying new content is done with a simple `rsync`. All
three servers are synced in parallel, with a bit of help from `xargs`:

```sh
printf "au\nny\nfr\n" | xargs -P 0 -I {host} \
    rsync -azhP --delete content/ {host}.linkedlist.org:/var/lib/linkedlist/content/
```

Deployment is actually initiated via a Makefile, so I don't have to remember
all that: `make deploy`.

So how did I go, was this whole exercise in over-engineering worth it? Yep, it
looks like it was. This is the end result in [updown.io], which shows a decent
improvement over the stats at the beginning of the post:

{{ figure(image="posts/2024/tiny-cdn/response-times-after.png",
   link="posts/2024/tiny-cdn/response-times-after.png",
   resize_width=1600,
   alt="Screenshot of updown.io monitoring. It has response times for nine locations around the world. The average total time is 189ms.",
   caption="Average response timing from my monitoring after the changes") }}

Most of the monitored locations are showing lower average response times. In
particular, the times in Europe are much improved. It also scores 100 for
performance in a Lighthouse test in Chromium:

{{ figure(image="posts/2024/tiny-cdn/linked-list-lighthouse.png",
   link="posts/2024/tiny-cdn/linked-list-lighthouse.png",
   width="741",
   alt="Screenshot of a Lighthouse report for linkedlist.org in Chromium. It shows 100 for performance, 82 for accessibility, 100 for best practices, adn 92 for SEO.",
   caption="linkedlist.org Lighthouse report.") }}

While these results are good, I still only have a presence in three places
around the world. Notably absent are servers in Asia and Africa. Should I start
to see regular visitors from these or other countries the pyinfa config should
make it straightforward to add servers as needed.

For now though, I need to get back to writing on Linked List. If you haven't
checked it out already please do. It's also easy to [follow via RSS, Mastodon,
and Bluesky][follow].

### References

This series of three blog posts by Stefano Marinelli served as a good reference for
what I was trying to achieve. Stefano uses Varnish to add a layer of caching, which
I didn't do since the application manages caching itself.

* [Building a Self-Hosted CDN for BSD Cafe Media](https://it-notes.dragas.net/2024/08/26/building-a-self-hosted-cdn-for-bsd-cafe-media/)
* [Make Your Own CDN With OpenBSD Base and Just 2 Packages](https://it-notes.dragas.net/2024/08/29/make-your-own-cdn-openbsd/)
* [Make Your Own CDN With NetBSD](https://it-notes.dragas.net/2024/09/03/make-your-own-cdn-netbsd/)

[^1]: The icons in this diagram are from the [Haiku project][Haiku] used under
    the terms of [their BSD license][haiku-licence]. Haiku is a really cool
    operating system, you should check it out.
[^2]: This gave plenty of headroom, as each server is currently only using about 240MiB of memory.
[^3]: `/proc/cpuinfo` reports: Intel(R) Xeon(R) CPU E5-2680 v4 @ 2.40GHz
[^4]: I covered `systemd-sysusers` in [a previous post](@/posts/2023/systemd-sysusers-and-chimera-linux.md)

[apk]: https://gitlab.alpinelinux.org/alpine/apk-tools
[AUR]: https://aur.archlinux.org/
[Chimera Linux]: https://chimera-linux.org/
[cports]: https://github.com/chimera-linux/cports
[Deno Deploy]: https://deno.com/deploy
[dinit]: https://davmac.org/projects/dinit/
[follow]: https://linkedlist.org/follow
[gcore]: https://gcore.com/dns
[GoatCounter]: https://www.goatcounter.com/
[haiku-licence]: https://github.com/haiku/haiku/blob/8ada0c0e7c645e90d9e8d2addb10e7ffbd2bdf56/License.md
[Haiku]: https://www.haiku-os.org/
[KVM]: https://en.wikipedia.org/wiki/Kernel-based_Virtual_Machine
[Lego]: https://go-acme.github.io/lego/
[linkedlist]: https://linkedlist.org/
[LowEndBox]: https://lowendbox.com/
[PingBear]: https://pingbear.com/
[pyinfra]: https://pyinfra.com/
[RackNerd]: https://my.racknerd.com/aff.php?aff=12841
[updown.io]: https://updown.io/
[virt-manager]: https://virt-manager.org/
[xdotool]: https://github.com/jordansissel/xdotool