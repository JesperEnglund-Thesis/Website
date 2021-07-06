# Architecture

## HTML

There are two HTML pages. `index.html` and `3dmap.html`.

### 3dmap.html
This page is the Unity build of the 3D-truck.
This is standalone in every way from the rest of the website and should be rebuilt and integrated to the rest of the website using a javascript library such as Three.js.

### index.html
This page is the home for the rest of the website. It contains skeleton code and code for some of the static elements.
The rest of the HTML is created dynamically in javascript.

## Javascript
The javascript has 4 main modules which are described below.

### script.js
This is the main script, containing global variables, general math, help functions and event handlers for most of the functionality of the website.

### mapBoxMain.js
This script initiates the mapbox map and is bundled to bundle.js in order to be able to use the require-method.

### firebase.js
This script handles database event. It listens for changes in the database and writes new data to the database.

### speedgauge.js
This script handles the speed gauge movement and styling. The speed gauge is the only gauge on the dashboard that is "live".

### Unity
The Unity build also has javascript but except for the loading screen, the build is unreadable.

**Controls**

- Alt + Drag: Rotate camera around vehicle
- Scroll: Zoom in and out.
- b: Start error alert in right wheel
- click right wheel: display hardcoded symptoms on right wheel

## CSS
The styling script style.css handles styling of elements.

## Firebase
The Firebase was set up with just one vehicle and the database has a JSON structure. A simplified version of that structure is seen below.

```
vehicle = {
  command: {
    action: {
      route = string,
      speed = string
    },
    takeControl = bool,
    verifyDiagnose = bool
  },
  diangoses:[
    {
      diagnose = string,
      likelyhood = float,
      prognoses: [
        {
          AvgLife = string,
          prognosis = string
        }
      ]
    }
  ],
  symptoms: {
    heat-wheel-1: {
      values: [
        {
          time = string,
          value = float
        }
      ]
    }
  },
  vehicleInfo: {
    VehicleLogs: [
      {
        content = string,
        time = string,
        type = string
      }
    ],
    comments: [
      {
      comment = string,
      sender = string,
      time = string
      }
    ],
    vehicleHealth: {
      gsh = int,
      symptoms: {
        symptomsobject = object
      }
    },
    vehicleInfo: {
      model = string,
      registration = string
    },
    vehicleInfoCurrent: {
      distance = int,
      distancedriven = int,
      localroute: [
        start = string,
        dest = string
      ],
      mission_finished = bool,
      route: [
        start = string,
        dest = string
      ],
      speed = int,
      totalDowntimeApprox = int
    }
  }
}
```

Below are some snapshots of the database:

![Commands](https://github.com/JesperEnglund-Thesis/Website/blob/main/images/docs/fbCommands.png?raw=true)

Any "document" in Firebase ("command" in the above example) can be overwritten. So if one would wish to change the structure in a document, it can be done. If that is not desired, one has to be careful to maintain the same structure when updating the database.

![Diagnosis](https://github.com/JesperEnglund-Thesis/Website/blob/main/images/docs/fbDiagnoses.png?raw=true)

The diagnoses document was created as a list to enable the diagnosis model to send several possible diagnoses. This was however not done in the end.

![Diagnosis](https://github.com/JesperEnglund-Thesis/Website/blob/main/images/docs/fbSymptoms.png?raw=true)

The symptoms weren't used at all but mostly created as a mock-up of how the operational data from sensors could be saved.

![Diagnosis](https://github.com/JesperEnglund-Thesis/Website/blob/main/images/docs/fbvLogs.png?raw=true)

![Diagnosis](https://github.com/JesperEnglund-Thesis/Website/blob/main/images/docs/fbComments.png?raw=true)

![Diagnosis](https://github.com/JesperEnglund-Thesis/Website/blob/main/images/docs/fbvHealth.png?raw=true)

![Diagnosis](https://github.com/JesperEnglund-Thesis/Website/blob/main/images/docs/fbVInfo.png?raw=true)

![Diagnosis](https://github.com/JesperEnglund-Thesis/Website/blob/main/images/docs/fbVInfoCurrent.png?raw=true)

# Environment
The website has only been tested in Google Chrome and does not necessarily fare well in other browsers.

The first clickeable prototype of the interface was created in Figma. A link can be found below:

https://www.figma.com/file/HlMZEbX2nJl16UWvDEW3Bu/Exjobb-Scania-Team-Library?node-id=315%3A2

# Further Development
- The code only considers one vehicle. In case multiple vehicles are added, the code needs restructuring.
- Some of the functions regarding the map are made to translate SVEA positions/rotations to real world positions/rotations. In case real world sensor data can be used to this end, code needs restructuring.
- The 3D-map of the vehicle ought to be rebuilt in a javascript library.
- Responsiveness needs to be optimized
