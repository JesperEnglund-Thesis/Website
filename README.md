# Remote Interface for Driverless Vehicles

This is an interface for fault handling of driverless vehicle fleets. It includes a map overview for monitoring fleets and various tools for analyzing faults on specific vehicles. It is currently connected to Firebase, a database through wich it communicates commands and information to and from the SVEA(Small-Vehicles-for-Autonomy)-platform. The information that is provided through the Firebase is displayed in realtime in the interface. However, as this was built as a demonstrator, some features are offline/hardcoded.

## Prerequisites

**Dependencies**
 - Mapbox
 - Firebase
 - Require method (Node.js)
 - jQuery
 - w3css
 - Font: Mulish
 - Font: DIN Condensed
 - Unity

**Installation**
Mapbox, Firebase, jQuery and the CSS styling all use CDNs and no installation is required.

The Require method is however installed through the CLI with the aid of Browserify `https://browserify.org/`.
- Install the uniq module with npm `npm install uniq`
- Bundle up required modules from main.js to bundle.js with the borwserify command `browserify mapBoxMain.js -o bundle.js`
- Anytime the mapBoxMain.js file is updated, this command needs to be run.

The Unity dependency does not require any installation for running but would need a Unity-installation in case of further development. This is however not advised and in fact, not possible anymore.
The 3D-map of the truck was made in Unity and built for the web with WebGL in a non-readable javascript form. Any changes to this component would therefore need to be changed in the Unity project and then built and added to this project. The unity project was inadvertently lost locally and never published to publicly. In case this component is further developed, it ought to be rebuilt with a Javascript library such as three.js. Even if it was possible to continue with the same setup, it's too complicated for expansion and dynamic parameters. The values of the demo version of this 3D map were hardcoded.

## Running the code locally

Set up an auto updating server:

`npm install -g browser-sync`

Run with:

`browser-sync start --server -f -w`

Available at:

> http://localhost:3000

## Contributions
Contributions can be made to this GitHub repository.

## Citation
link is coming

## Contact
Contact me at jesper.enbglund92@gmail.com
