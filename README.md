# Remote Interface for Driverless Vehicles

This is an interface for fault handling of driverless vehicle fleets. It includes a map overview for monitoring fleets and various tools for analyzing faults on specific vehicles. It is currently connected to Firebase, a database through wich it communicates commands and information to and from the SVEA(Small-Vehicles-for-Autonomy)-platform. The information that is provided through the Firebase is displayed in realtime in the interface. However, as this was built as a demonstrator, some features are offline/hardcoded.

## Prerequisites

**Dependencies**
 - Mapbox
 - browserify

 Install the uniq module with npm `npm install uniq`
 Bundle up required modules from main.js to bundle.js with the borwserify command `browserify main.js -o bundle.js`
 Anytime the main.js file is updated, this command needs to be run.
