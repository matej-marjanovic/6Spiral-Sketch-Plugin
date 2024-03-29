**This plugin no longer works with the latest version of Sketch but there is an updated version that works with Figma:**
- https://github.com/matej-marjanovic/6Spiral-Figma-Plugin

If you need to have a spiral and/or helix in Sketch just make it using the new plugin in Figma and `Copy as SVG -> Paste` into Sketch.

<img src="https://user-images.githubusercontent.com/2822227/46310803-307acd80-c575-11e8-9015-cb1a066849ea.jpeg" alt="6spiral_logo_image" width="430" height="">

# 🌀6Spiral Sketch Plugin v1.0.2

[![Price: free](https://img.shields.io/badge/price-FREE-0098f7.svg)](https://github.com/matej-marjanovic/6Spiral-Sketch-Plugin/blob/master/LICENSE.txt)
[![Version: 1.0.2](https://img.shields.io/badge/version-1.0.2_-green.svg)](https://github.com/matej-marjanovic/6Spiral-Sketch-Plugin/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/matej-marjanovic/6Spiral-Sketch-Plugin/blob/master/LICENSE.txt)
[![License: MIT](https://img.shields.io/badge/works_with-Sketch_52-blue.svg)](https://www.sketchapp.com/updates/)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Make%20great%20looking%20spiral%20and%20helix%20shapes%20in%20Sketch&url=https://github.com/matej-marjanovic/6Spiral-Sketch-Plugin&hashtags=design,sketch,sketchapp,uiux)

6Spiral is a sketch plugin to draw spirals and it also allows you to convert the 2D spirals into 3D-like helix shapes at a specified angle in parallel projection.

6Spirals supports creation of the two most common types of spirals: Archimedean Spirals and Logarithmic Spirals. 

<a href="http://bit.ly/SketchRunnerWebsite">
  <img width="160" height="41" src="http://sketchrunner.com/img/badge_blue.png" >
</a>
 

# Getting Started

1. Download the [latest release](https://github.com/matej-marjanovic/6Spiral-Sketch-Plugin/releases) (latest release works with Sketch 52. **If you're on Sketch 51.3 then use version 1.0.1.** Older Sketch versions are not supported).
2.  Unzip and double click on `6Spiral.sketchplugin` to install the plugin.
3. Make and select a shape and then go to `Plugins -> 🌀6Spiral - Make Spiral`  
(or use the shortcut `Control + Shift + 6`). 
4. Change the parameters to make the initial shape of the spiral/helix that you'd like.
5. You might want to do some suggested common cleanup steps before applying your own style. *See section below.*

![6spiral_in_plugin_menu](https://user-images.githubusercontent.com/2822227/45353465-b5bf2380-b56f-11e8-904a-5107077eedf8.png)
<img width="506" alt="6spiral_demo_1" src="https://user-images.githubusercontent.com/2822227/45353519-dd15f080-b56f-11e8-91e1-05ce76b5ff1a.png">

Plugin will create a spiral with the origin at the center of the selected shape.
*The center of the spiral shape is not the same as the origin (first point) of the spiral.*


[There is also a sketch file with a tutorial and some examples that you can download here.](https://github.com/matej-marjanovic/6Spiral-Tutorial-Example-Sketch-File/raw/master/6Spiral%20Examples%20and%20Tutorial.sketch)

## Making a Spiral
![6spiral_making_spirals](https://user-images.githubusercontent.com/2822227/45357080-13586d80-b57a-11e8-851c-8366dbbc45b5.gif)

## Making a Helix
![6spiral_making_helix](https://user-images.githubusercontent.com/2822227/45357902-a5617580-b57c-11e8-9050-9b617be0d2c8.gif)

# Cleanup After Spiral is Made
6Spiral will always make an origin point, which can then be deleted.
*(If the inner radius is set to 0 there will be two points at the very beginning of the shape).* 
You'll likely want to change the border edges to to have rounded ends and joins.

![6spiral_round_cap_and_corners](https://user-images.githubusercontent.com/2822227/45471004-8c73d400-b6e4-11e8-9c24-87b08db8e407.png)

A nice way to make a completely smooth spiral is to set a large corner radius on all points (except the last and first point).

![setting_radius_on_spiral_points](https://user-images.githubusercontent.com/2822227/45354068-a214bc80-b571-11e8-80fe-f39d50c222d0.gif)

# Few Examples Shapes

## Logarithmic Spirals Example
![log_spiral_examples_wide](https://user-images.githubusercontent.com/2822227/45360143-89150700-b583-11e8-9fda-bfed87f18dfb.png)

## Spiral Helix Examples at 60° isometric angle
![helix_spiral_examples](https://user-images.githubusercontent.com/2822227/45360142-89150700-b583-11e8-912b-6972eb293bd7.png)


## Helix Example with 4 points per one revolution
![helix_low_point](https://user-images.githubusercontent.com/2822227/45360141-89150700-b583-11e8-93eb-fb01493b578d.png)

## 🌀6Spiral + Looper Example
![6spiral_and_looper](https://user-images.githubusercontent.com/2822227/45360140-89150700-b583-11e8-86fd-408fae35aa6c.png)

[Looper is a great plugin](http://sureskumar.com/looper/) you can use in combination with 6Spiral to make interesting effects. Before using Looper you'll probably want to group the spiral with a shape centered on the origin of the spiral that has bounds that are larger than that of the spiral so that the center of the group is centered on the origin of the spiral.

# Reporting Issues, Feedback, More Info, ... 
👋 Hi. Feel free to contact me at matej.marjanovich@gmail.com or [open an issue here on Github](https://github.com/matej-marjanovic/6Spiral-Sketch-Plugin/issues).

[This medium article has some of the same info but also includes more ideas and suggestions on where to use this plugin.](https://medium.com/@matejmarjanovic/4a921c13f5ef)

Thanks to [Sures](https://github.com/sureskumar/) for feedback on the beta version of this plugin.

## Known Issues

- Setting some of the parameters to just the minus sign will make the spiral dissapear. Simply close and reopen the plugin (you will have to change the parameters again from the defaults). If you're setting a negative value, make sure that you're adding a minus in front of a number, not just on its own.
- Having too much fun with 6Spiral can cause Sketch to crash sometimes 😅.

Issues can also be mitigated/lessened by disabling the "Continously Update" option and pressing the "Update Spiral" each time you want to update the spiral to the changed parameters.

Also, if you're using many other Sketch plugins, certain other plugins may interfere with 6Spiral so if you're having issues (spirals aren't being drawn, for example) the recommended step is to **try disabling all plugins other than 6Spiral and then restarting Sketch** and checking if the plugin then works.

## A few resources that I found useful for developing this Sketch Plugin
- https://developer.sketchapp.com/guides/
- https://awkward.co/blog/how-to-create-floating-sketch-plugins-i/
- https://github.com/turbobabr/Sketch-Plugins-Cookbook
- https://www.smashingmagazine.com/2017/08/create-sketch-plugin-front-end-technologies/
- https://designcode.io/sketch-plugin
- ... looking at the sourcecode of several sketch plugins found on Github.
