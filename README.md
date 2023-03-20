![](https://github.com/honiemun/combies/blob/master/images/combieslogo-orange.png)

# The Combies 2022 Visualizer

A helper website designed to simplify viewing nominations on The Combies 2022 livestream, without having to manually create video files.

## Dependencies

[http-server](https://www.npmjs.com/package/http-server) (`npm i http-server`)

## How to run

Execute `http-server -c-1` on root, and open it up any of the available URLs. For the time being, only Chromium based browsers are compatible. (Sorry Firefox, I have betrayed you).

The nomination category shown is random. To pick a specific one, use the argument `slide` on the URL (for example: `http://192.168.1.39:8080?slide=fucked-up-dm/` will only show Most Fucked Up DM).

Add or remove categories and nominees by editing the `nominees.json` file.
