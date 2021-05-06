var myIndex = 0;
//carousel();

var slideIndex = 1;
//showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}

// Used to toggle the menu on small screens when clicking on the menu button
function myFunction() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

// When the user clicks anywhere outside of the modal, close it
var modals = document.getElementsByClassName("w3-modal");
var modalsLength = modals.length;
window.onclick = function(event) {
  for (var i = 0; i < modalsLength; i++){
    if (event.target == modals[i]) {
      modals[i].style.display = "none";
    }
  }
}

var ffirst = document.getElementById("ffirst");
ffirst.addEventListener('click', function(){
    slidemodal(0, 1);
});
var bfirst = document.getElementById("bfirst");
bfirst.addEventListener('click', function(){
    slidemodal(0, 3);
});
var fsecond = document.getElementById("fsecond");
fsecond.addEventListener('click', function(){
    slidemodal(1, 2);
});
var bsecond = document.getElementById("bsecond");
bsecond.addEventListener('click', function(){
    slidemodal(1, 0);
});
var fthird = document.getElementById("fthird");
fthird.addEventListener('click', function(){
    slidemodal(2, 3);
});
var bthird = document.getElementById("bthird");
bthird.addEventListener('click', function(){
    slidemodal(2, 1);
});
var ffourth = document.getElementById("ffourth");
ffourth.addEventListener('click', function(){
    slidemodal(3, 0);
});
var bfourth = document.getElementById("bfourth");
bfourth.addEventListener('click', function(){
    slidemodal(3, 2);
});

function slidemodal(current, newmodal) {
  for (var i = 0; i < modalsLength; i++){
    if (modals[i].id == modals[current].id){
      modals[newmodal].style.display = "block";
      modals[i].style.display = "none";
    }
  }
}

function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}


//mapbox
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiamVyYmEiLCJhIjoiY2tvYjl4M3FvMGVwcTJvcGdqdTVlYWluMyJ9.ZVh7TLcOCeiArbhGrBN4PA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/navigation-day-v1',
center: [15.054, 58.577],
zoom: 6.5
});

var hubs = {
  stockholm: [18.03126, 59.29206],
  sodertalje: [17.64809, 59.16777],
  gothenburg: [12.00000, 57.69819],
  malmo: [13.03502, 55.62952],
  jonkoping: [14.19974, 57.76585],
  linkoping: [15.66582, 58.42696],
  norrkoping: [16.17880, 58.60902],
  nykoping: [16.99747, 58.76082]
}

var workshops = {
  stockholm: [18.01134, 59.34909],
  sodertalje: [17.64491, 59.17247],
  gothenburg: [12.01286, 57.66076],
  malmo: [13.06614, 55.62797],
  norrkoping: [16.15390, 58.62239]
}

var trucks = [
    {
      id: 'truck1',
      element : document.getElementById("truck1"),
      pos: [15.054, 58.577],
      orig: [17.64809, 59.16777],
      dest: [14.19974, 57.76585]
    }
  ];

var truck1Marker = new mapboxgl.Marker({
  id: 'truck1',
  element: trucks[0].element,
  rotation: rotateMarker(trucks[0].dest, trucks[0].orig)
}).setLngLat(trucks[0].pos)
.addTo(map);

/*
map.on('click', function(e) {
  for (i=0; i<trucks.length;i++){
    hideDetails(trucks[i]);
  }
});
*/

map.on('mouseenter', 'places', function () {
map.getCanvas().style.cursor = 'pointer';
});

truck1Marker.getElement().addEventListener('click', () => {
  showDetails(trucks[0]);
});

function rotateMarker(destination, origin){
  var dLon = destination[1]-origin[1];
  var dLat = destination[0]-origin[0];
  var angle = -((Math.atan2(dLon, dLat) * 180 / Math.PI));
  return angle;
}

var canvas = map.getCanvasContainer();

function showDetails(truck) {
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

function getRoute(start, end, routeid, col) {
  var url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onload = function() {
    var json = JSON.parse(req.response);
    var data = json.routes[0];
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
    if (map.getSource(routeid + 'route')) {
      map.getSource(routeid + 'route').setData(geojson);
    } else { // otherwise, make a new request
      map.addLayer({
        id: routeid + 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
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
/*
map.on('load', function() {
  for (i=0; i<trucks.length;i++){
    var truck = trucks[i];
    var start = truck.orig;
    var dest = truck.dest;
    var pos = truck.pos;
    getRoute(pos, dest, truck.id + 'driven', '#f30');
    getRoute(start, pos, truck.id + 'remaining', '#3887be');

    // Add starting point to the map
    map.addLayer({

    });

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
    getRoute(pos, dest, truck.id + 'driven', '#f30');
    getRoute(start, pos, truck.id + 'remaining', '#3887be');
  }
});
*/
map.on('load', function () {
  // Add an image to use as a custom marker
  map.loadImage(
    'images/wrenchcog.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('custom-marker', image);
      // Add a GeoJSON source with 2 points
      map.addSource('points', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              // feature for Mapbox DC
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [18.01134, 59.34909]
              },
              'properties': {
              'title': 'WS Stockholm'
            }
          },
          {
            // feature for Mapbox SF
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [16.15390, 58.62239]
            },
            'properties': {
              'title': 'WS Nkpg'
            }
          }
        ]
      }
    });

    // Add a symbol layer
      map.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': 'points',
      'layout': {
          'icon-image': 'custom-marker',
          'icon-size': 0.1,
          // get the title name from the source's "title" property
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 1.25],
          'text-anchor': 'top'
        }
      });
    }
  );
});

/*
map.on('load', function () {
  map.addSource('places', {
  // This GeoJSON contains features that include an "icon"
  // property. The value of the "icon" property corresponds
  // to an image in the Mapbox Streets style's sprite.
  'type': 'geojson',
  'data': {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {
        'description':
        '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
        'icon': 'theatre-15'
      },
      'geometry': {
      'type': 'Point',
      'coordinates': [-77.038659, 38.931567]
      }
    }
  ]
  }
  });
  // Add a layer showing the places.
  map.addLayer({
    'id': 'trucks',
    'type': 'symbol',
    'source': 'trucks',
    'layout': {
      'icon-image': '{icon}',
      'icon-allow-overlap': true
    }
  });

  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'trucks', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'trucks', function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'trucks', function () {
    map.getCanvas().style.cursor = '';
  });
});

*/
