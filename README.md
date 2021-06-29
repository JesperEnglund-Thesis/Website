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

The 3D-map of the truck was made in unity and built for the web with WebGL in a non-readable javascript form. Any changes to this component would therefore need to be changed in the unity project and then built and added to this project. The Unity project is linked below:



In continuing this work forward, 


Mapbox implementation is NOT scalable in its current state.
