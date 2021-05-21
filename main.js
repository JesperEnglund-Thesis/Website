//mapbox
mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiamVyYmEiLCJhIjoiY2tvYjl4M3FvMGVwcTJvcGdqdTVlYWluMyJ9.ZVh7TLcOCeiArbhGrBN4PA';
map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/navigation-day-v1',
center: [15.054, 58.577],
zoom: 6.5
});

var canvas = map.getCanvasContainer();

function showRoute(truck) {
  map.setLayoutProperty(
    truck.id + 'driven' + 'route',
    'visibility',
    'visible'
  );
  map.setLayoutProperty(
    truck.id + 'remaining' + 'route',
    'visibility',
    'visible'
  );
  map.setLayoutProperty(
    truck.id + 'start',
    'visibility',
    'visible'
  );
  map.setLayoutProperty(
    truck.id + 'end',
    'visibility',
    'visible'
  );
}

function hideDetails(truck){
  map.setLayoutProperty(
    truck.id + 'driven' + 'route',
    'visibility',
    'none'
  );
  map.setLayoutProperty(
    truck.id + 'remaining' + 'route',
    'visibility',
    'none'
  );
  map.setLayoutProperty(
    truck.id + 'start',
    'visibility',
    'none'
  );
  map.setLayoutProperty(
    truck.id + 'end',
    'visibility',
    'none'
  );
}

function addWSfeatures(){
  var features = [];
  for (var i = 0; i < workshops.length; i++){
    var feature = {
        // feature for Mapbox DC
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': workshops[i].coordinates
        },
        'properties': {
        'title': workshops[i].title,
        'description':workshops[i].description
      }
    };
    features[i] = feature;
  }
  return features;
}

/*
function getRoute(start, end, vid, partofroute, col) {
  var url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onload = function() {
    var json = JSON.parse(req.response);
    var data = json.routes[0];
    if (partofroute == 'driven'){
      trucks[vid].distanceDriven = data.distance;
    }
    else{
      trucks[vid].distanceLeft = data.distance;
    }
    var route = data.geometry.coordinates;
    var geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    // if the route already exists on the map, reset it using setData
    if (map.getSource(vid + partofroute + 'route')) {
      map.getSource(vid + partofroute + 'route').setData(geojson);
    } else { // otherwise, make a new request
      map.addLayer({
        id: vid + partofroute + 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {
              'distance': ['get', 'distance'],
              'duration': ['get', 'duration']
            },
            geometry: {
              type: 'LineString',
              coordinates: geojson
            }
          }
        },
        paint: {
          'line-color': col,
          'line-width': 5,
          'line-opacity': 0.75
        },
        layout: {
          'visibility': 'none',
          'line-join': 'round',
          'line-cap': 'round'
        }
      });
    }
    // add turn instructions here at the end
  };
  req.send();
}
*/

map.on('load', function() {
  for (i=0; i<trucks.length;i++){
    var truck = trucks[i];
    var start = truck.orig;
    var dest = truck.dest;
    var pos = truck.pos;
    //getRoute(pos, dest, truck.id, 'remaining', '#f30');
    //getRoute(start, pos, truck.id, 'driven', '#3887be');
    //getWSDist(pos, i);
    //getClosestWS(distances, i);
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
    //getRoute(pos, dest, truck.id, 'remaining', '#f30');
    //getRoute(start, pos, truck.id, 'driven', '#3887be');
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

function showTruckDetails(e){
  var coordinates = e.features[0].geometry.coordinates.slice();
  var id = e.features[0].properties.id;
  var distToDest = e.features[0].properties.distToDest;
  showRoute(trucks[id]);
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  truckpopup = new mapboxgl.Popup()
  .setLngLat(coordinates)
  //.setHTML(htmlcode)
  .setMaxWidth("800px")
  .addTo(map);
  loadPopup(id);

  truckpopup.on('close', function(e) {
    for (i=0; i<trucks.length; i++){
      hideDetails(trucks[0]);
    }
  });
}
