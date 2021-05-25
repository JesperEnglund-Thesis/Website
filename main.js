//mapbox
mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiamVyYmEiLCJhIjoiY2tvYjl4M3FvMGVwcTJvcGdqdTVlYWluMyJ9.ZVh7TLcOCeiArbhGrBN4PA';
map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/navigation-day-v1',
center: [15.054, 58.577],
zoom: 6.5
});

mapspecific = new mapboxgl.Map({
container: 'mapspecific',
style: 'mapbox://styles/mapbox/navigation-day-v1',
center: [15.054, 58.577],
zoom: 6.5
});

var canvas = map.getCanvasContainer();

var canvas2 = mapspecific.getCanvasContainer();

var maplist = ["map", "mapspecific"];

map.on('load', function() {
  for (i=0; i<trucks.length;i++){
    var truck = trucks[i];
    var start = truck.orig;
    var dest = truck.dest;
    var pos = truck.pos;
    // Add starting point to the map
    map.addLayer({
      id: truck.id + 'start',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: start
            }
          }
          ]
        }
      },
      layout: {
        visibility: 'none'
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#3887be'
      }
    });

    map.addLayer({
      id: truck.id + 'end',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: dest
            }
          }
          ]
        }
      },
      layout: {
        visibility: 'none'
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#f30'
      }
    });
  }

  //Add Workshops
  // Add an image to use as a custom marker
  map.loadImage(
    'images/wrenchcog.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('ws-marker', image);
      // Add a GeoJSON source with 2 points
      var wsFeatures = addWSfeatures();
      map.addSource('workshops', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': wsFeatures
      }
    });
    // Add a symbol layer
      map.addLayer({
      'id': 'workshops',
      'type': 'symbol',
      'source': 'workshops',
      'layout': {
          'icon-image': 'ws-marker',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          // get the title name from the source's "title" property
        }
      });
    }
  );
  //Add trucks
  map.loadImage(
    'images/TruckIcon.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('truck-marker', image);
      // Add a GeoJSON source with 2 points
      map.addSource('redtrucks', {
        'type': 'geojson',
        'data': getVehicleData(0)
      });

      // Add a symbol layer
      map.addLayer({
        'id': 'redtrucks',
        'type': 'symbol',
        'source': 'redtrucks',
        'layout': {
          'icon-image': 'truck-marker',
          'icon-size': 1.0,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'rotate'],
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 0],
          'text-anchor': 'top',
          'visibility': 'none'
          // get the title name from the source's "title" property
        }
      });
    }
  );
  map.loadImage(
    'images/TruckIconGreen.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('truck-marker-green', image);
      // Add a GeoJSON source with 2 points
      map.addSource('greentrucks', {
        'type': 'geojson',
        'data': getVehicleData(0)
      });

      // Add a symbol layer
      map.addLayer({
        'id': 'greentrucks',
        'type': 'symbol',
        'source': 'greentrucks',
        'layout': {
          'icon-image': 'truck-marker-green',
          'icon-size': 1.0,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'rotate'],
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 0],
          'text-anchor': 'top',
          'visibility': 'none'
          // get the title name from the source's "title" property
        }
      });
    }
  );
  map.loadImage(
    'images/TruckIconYellow.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('truck-marker-yellow', image);
      // Add a GeoJSON source with 2 points
      map.addSource('yellowtrucks', {
        'type': 'geojson',
        'data': getVehicleData(0)
      });

      // Add a symbol layer
      map.addLayer({
        'id': 'yellowtrucks',
        'type': 'symbol',
        'source': 'yellowtrucks',
        'layout': {
          'icon-image': 'truck-marker-yellow',
          'icon-size': 1.0,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'rotate'],
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 0],
          'text-anchor': 'top',
          'visibility': 'none'
          // get the title name from the source's "title" property
        }
      });
    }
  );

});

mapspecific.on('load', function() {
  for (i=0; i<trucks.length;i++){
    var truck = trucks[i];
    var start = truck.orig;
    var dest = truck.dest;
    var pos = truck.pos;
    // Add starting point to the map
    mapspecific.addLayer({
      id: truck.id + 'start',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: start
            }
          }
          ]
        }
      },
      layout: {
        visibility: 'none'
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#3887be'
      }
    });

    mapspecific.addLayer({
      id: truck.id + 'end',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: dest
            }
          }
          ]
        }
      },
      layout: {
        visibility: 'none'
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#f30'
      }
    });
  }

  //Add Workshops
  // Add an image to use as a custom marker
  mapspecific.loadImage(
    'images/wrenchcog.png',
    function (error, image) {
      if (error) throw error;
      mapspecific.addImage('ws-marker', image);
      // Add a GeoJSON source with 2 points
      var wsFeatures = addWSfeatures();
      mapspecific.addSource('workshops', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': wsFeatures
      }
    });
    // Add a symbol layer
      mapspecific.addLayer({
      'id': 'workshops',
      'type': 'symbol',
      'source': 'workshops',
      'layout': {
          'icon-image': 'ws-marker',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          // get the title name from the source's "title" property
        }
      });
    }
  );
  //Add trucks
  mapspecific.loadImage(
    'images/TruckIcon.png',
    function (error, image) {
      if (error) throw error;
      mapspecific.addImage('truck-marker', image);
      // Add a GeoJSON source with 2 points
      mapspecific.addSource('redtrucks', {
        'type': 'geojson',
        'data': getVehicleData(0)
      });

      // Add a symbol layer
      mapspecific.addLayer({
        'id': 'redtrucks',
        'type': 'symbol',
        'source': 'redtrucks',
        'layout': {
          'icon-image': 'truck-marker',
          'icon-size': 1.0,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'rotate'],
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 0],
          'text-anchor': 'top',
          'visibility': 'none'
          // get the title name from the source's "title" property
        }
      });
    }
  );
  mapspecific.loadImage(
    'images/TruckIconGreen.png',
    function (error, image) {
      if (error) throw error;
      mapspecific.addImage('truck-marker-green', image);
      // Add a GeoJSON source with 2 points
      mapspecific.addSource('greentrucks', {
        'type': 'geojson',
        'data': getVehicleData(0)
      });

      // Add a symbol layer
      mapspecific.addLayer({
        'id': 'greentrucks',
        'type': 'symbol',
        'source': 'greentrucks',
        'layout': {
          'icon-image': 'truck-marker-green',
          'icon-size': 1.0,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'rotate'],
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 0],
          'text-anchor': 'top',
          'visibility': 'none'
          // get the title name from the source's "title" property
        }
      });
    }
  );
  mapspecific.loadImage(
    'images/TruckIconYellow.png',
    function (error, image) {
      if (error) throw error;
      mapspecific.addImage('truck-marker-yellow', image);
      // Add a GeoJSON source with 2 points
      mapspecific.addSource('yellowtrucks', {
        'type': 'geojson',
        'data': getVehicleData(0)
      });

      // Add a symbol layer
      mapspecific.addLayer({
        'id': 'yellowtrucks',
        'type': 'symbol',
        'source': 'yellowtrucks',
        'layout': {
          'icon-image': 'truck-marker-yellow',
          'icon-size': 1.0,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'rotate'],
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 0],
          'text-anchor': 'top',
          'visibility': 'none'
          // get the title name from the source's "title" property
        }
      });
    }
  );

});

map.on('style.load', () => {
  const waiting = () => {
    if (!map.isStyleLoaded()) {
      setTimeout(waiting, 700);
    } else {
      getTruckCol(setVehicleCounts);
    }
  };
  waiting();
});

mapspecific.on('style.load', () => {
  const waiting = () => {
    if (!mapspecific.isStyleLoaded()) {
      setTimeout(waiting, 700);
    } else {
      getTruckCol(setVehicleCounts);
    }
  };
  waiting();
});

var layerlist = ['workshops', 'redtrucks', 'greentrucks', 'yellowtrucks'];

for (i=0; i<layerlist.length;i++){
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', layerlist[i], function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', layerlist[i], function () {
    map.getCanvas().style.cursor = '';
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  mapspecific.on('mouseenter', layerlist[i], function () {
    mapspecific.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  mapspecific.on('mouseleave', layerlist[i], function () {
    mapspecific.getCanvas().style.cursor = '';
  });
}

map.on('click', 'workshops', function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var title = e.features[0].properties.title;
  var description = e.features[0].properties.description;

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(title + description)
  .addTo(map);
});

mapspecific.on('click', 'workshops', function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var title = e.features[0].properties.title;
  var description = e.features[0].properties.description;

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(title + description)
  .addTo(mapspecific);
});

map.on('click', 'redtrucks', function (e) {
  showTruckDetails(e, "map");
});

map.on('click', 'greentrucks', function (e) {
  showTruckDetails(e, "map");
});

map.on('click', 'yellowtrucks', function (e) {
  showTruckDetails(e, "map");
});

mapspecific.on('click', 'redtrucks', function (e) {
  showTruckDetails(e, "mapspecific");
});

mapspecific.on('click', 'greentrucks', function (e) {
  showTruckDetails(e, "mapspecific");
});

mapspecific.on('click', 'yellowtrucks', function (e) {
  showTruckDetails(e, "mapspecific");
});

/*
map.on('load', function() {
  for (i=0; i<trucks.length;i++){
    var truck = trucks[i];
    var start = truck.orig;
    var dest = truck.dest;
    var pos = truck.pos;
    // Add starting point to the map
    map.addLayer({
      id: truck.id + 'start',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: start
            }
          }
          ]
        }
      },
      layout: {
        visibility: 'none'
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#3887be'
      }
    });

    map.addLayer({
      id: truck.id + 'end',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: dest
            }
          }
          ]
        }
      },
      layout: {
        visibility: 'none'
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#f30'
      }
    });
  }

  //Add Workshops
  // Add an image to use as a custom marker
  map.loadImage(
    'images/wrenchcog.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('ws-marker', image);
      // Add a GeoJSON source with 2 points
      var wsFeatures = addWSfeatures();
      map.addSource('workshops', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': wsFeatures
      }
    });
    // Add a symbol layer
      map.addLayer({
      'id': 'workshops',
      'type': 'symbol',
      'source': 'workshops',
      'layout': {
          'icon-image': 'ws-marker',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
          // get the title name from the source's "title" property
        }
      });
    }
  );
  //Add trucks
  map.loadImage(
    'images/TruckIcon.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('truck-marker', image);
      // Add a GeoJSON source with 2 points
      map.addSource('redtrucks', {
        'type': 'geojson',
        'data': getVehicleData(0)
      });

      // Add a symbol layer
      map.addLayer({
        'id': 'redtrucks',
        'type': 'symbol',
        'source': 'redtrucks',
        'layout': {
          'icon-image': 'truck-marker',
          'icon-size': 1.0,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'rotate'],
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 0],
          'text-anchor': 'top',
          'visibility': 'none'
          // get the title name from the source's "title" property
        }
      });
    }
  );
  map.loadImage(
    'images/TruckIconGreen.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('truck-marker-green', image);
      // Add a GeoJSON source with 2 points
      map.addSource('greentrucks', {
        'type': 'geojson',
        'data': getVehicleData(0)
      });

      // Add a symbol layer
      map.addLayer({
        'id': 'greentrucks',
        'type': 'symbol',
        'source': 'greentrucks',
        'layout': {
          'icon-image': 'truck-marker-green',
          'icon-size': 1.0,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'rotate'],
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 0],
          'text-anchor': 'top',
          'visibility': 'none'
          // get the title name from the source's "title" property
        }
      });
    }
  );
  map.loadImage(
    'images/TruckIconYellow.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('truck-marker-yellow', image);
      // Add a GeoJSON source with 2 points
      map.addSource('yellowtrucks', {
        'type': 'geojson',
        'data': getVehicleData(0)
      });

      // Add a symbol layer
      map.addLayer({
        'id': 'yellowtrucks',
        'type': 'symbol',
        'source': 'yellowtrucks',
        'layout': {
          'icon-image': 'truck-marker-yellow',
          'icon-size': 1.0,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'rotate'],
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 0],
          'text-anchor': 'top',
          'visibility': 'none'
          // get the title name from the source's "title" property
        }
      });
    }
  );

});

map.on('style.load', () => {
  const waiting = () => {
    if (!map.isStyleLoaded()) {
      setTimeout(waiting, 700);
    } else {
      getTruckCol(setVehicleCounts);
    }
  };
  waiting();
});

var layerlist = ['workshops', 'redtrucks', 'greentrucks', 'yellowtrucks'];

for (i=0; i<layerlist.length;i++){
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', layerlist[i], function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', layerlist[i], function () {
    map.getCanvas().style.cursor = '';
  });
}

map.on('click', 'workshops', function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var title = e.features[0].properties.title;
  var description = e.features[0].properties.description;

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(title + description)
  .addTo(map);
});

map.on('click', 'redtrucks', function (e) {
  showTruckDetails(e);
});

map.on('click', 'greentrucks', function (e) {
  showTruckDetails(e);
});

map.on('click', 'yellowtrucks', function (e) {
  showTruckDetails(e);
});

*/
