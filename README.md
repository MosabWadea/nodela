#nodela (V2)
##Browser Interface for the Roland MDX-15/20

nodela was developed for PCB fabrication using the MDX-15/20 milling machines. It is a browser-based interface for quickly sending PCB designs and toolpaths from an Eagle `.brd` file to the milling machine.

[Video tutorial on preparing your Eagle design for nodela](https://vimeo.com/119003450)

[Video tutorial on setting up and running a job on the Modela](https://vimeo.com/119725323)
"videos will be updated"

##The New Version
The original version was developed by [AndySingler](https://github.com/andySigler) and the way it operates is different.
This version was modified by me and it has the features to:

+ detect circles and make mill path out of them.
+ updated the interface to have some information about preferred options.
+ a script file to make it easy to run the nodela.
+ spooler cleaner script file added to the directory.
+ added tutorial for the a new more accurate method to make mill paths.

##Install

This version must be run on a Window's PC, with the Roland MDX-15/20 drivers already installed. Using the Modela without any drivers requires further research and probably some USB sniffing...

Node.js must already be installed on the Window's PC.
[Install Node.js from here](https://nodejs.org/en/)

Download  .zip, or using Git:

`git clone https://github.com/MosabWadea/nodela`

Use the windows command line to install dependencies with npm:

```cd nodela```

```npm install```


##Use

To run with node, use windows command line to run:
```node nodela.js```.
Or just run the script file: "RunNodela"

The script will attempt to open `localhost` in your default browser, and the interface will prompt you to drag your `.brd` Eagle file onto the screen.

When installing the Roland driver, the machine will have been assigned a port name. Mine is called `com3`. To work with your configuration, open `nodela.js` in an editor and edit the following line:

```var rolandPortName = YOUR_PORT_NAME_HERE;```

##Features

####Run straight from your `.brd` Eagle File

No need to export from Eagle. Simply drag and drop your `.brd` file into the browser, and your design will be loaded. The interface is currently searching for only three things in your design file:

 - Wires
 - Part Holes
 - Vias

You can check this method to make mill paths using the `mill-outline.ulp` that is built-in in eagle.

Watch the tutrial:

[![How to make mill paths using mill-outline.ulp](http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](http://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)

""I will add the video once I upload it""

[Or check out the instructable here](#)

####Jog the bit to select origin

Mill anywhere on your copper plate by jogging the head around. The interface will also mirror your design for when milling the bottom of your PCB.

####Automatic speed and plunge settings

By selecting the current bit and cut depth, nodela will decide the best settings to run at. This will prevent bits from breaking, and greatly decrease your cut time.

####New Bed Design

The original nodela developed by [AndySingler](https://github.com/andySigler) has a different bed design.

in this version I made a different design for the bed. Please check out my repo to get the design files and to see all the steps [github.com/MosabWadea/ModelaBed](https://github.com/MosabWadea/ModelaBed)