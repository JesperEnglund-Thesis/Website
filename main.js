var myIndex = 0;
//carousel();

var slideIndex = 1;
//showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showContent(n){
  var sections = document.getElementsByClassName("mySection");
  for (i = 0; i < x.length; i++) {
    if (i == n){
      sections[i].style.display = "block";
    }
    else{
      sections[i].style.display = "none";
    }
  }
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

var workshops = [
  {
    city: 'Stockholm',
    title: 'Stockholm Service Center',
    description: '<p><img src="images/wsdesc.png" style="width:100%"/></p>',
    coordinates: [18.01134, 59.34909]
  },
  {
    city: 'Södertälje',
    title: 'Södertälje Service Center',
    description: '<p><img src="images/wsdesc.png" style="width:100%"/></p>',
    coordinates: [17.64491, 59.17247]
  },
  {
    city: 'Gothenburg',
    title: 'Gothenburg Service Center',
    description: '<p><img src="images/wsdesc.png" style="width:100%"/></p>',
    coordinates: [12.01286, 57.66076]
  },
  {
    city: 'Malmö',
    title: 'Malmö Service Center',
    description: '<p><img src="images/wsdesc.png" style="width:100%"/></p>',
    coordinates: [13.06614, 55.62797]
  },
  {
    city: 'Norrköping',
    title: 'Norrköping Service Center',
    description: '<p><img src="images/wsdesc.png" style="width:100%"/></p>',
    coordinates: [16.15390, 58.62239]
  }
]

/*
var trucks = [
    {
      id: 0,
      reg: 'abc123',
      element : document.getElementById("truck1"),
      pos: [17.0, 59.0],
      orig: [17.64809, 59.16777],
      origText: 'Södertälje',
      dest: [14.19974, 57.76585],
      destText: 'Jönköping',
      distanceDriven: 0,
      distanceLeft: 0,
      distanceWS: undefined,
      speed: 0,
      gsh: 90,
      alerts: {
        wheels: ['none','none','none','none','none','none'],
        oillevel: 'none',
        airpressure: 'none'
      }
    }
  ];
  */

function getRotation(destination, origin){
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

var distances = [];

async function getClosestWS(distances, vid){
  var closestDist;
  let mydistances = await distances;
  for(i = 0; i < mydistances.length; i++){
    if (mydistances[i] < closestDist || closestDist == undefined){
      closestDist = mydistances[i];
    }
  }
  trucks[vid].distanceWS = closestDist;
}

function getWSDist(pos, vid){
  //var ws = workshops[key];
  var f = (function(){
    var req = [], i;
    var closestDist;
    for(i = 0; i < workshops.length; i++){
        (function(i, closestDist){
            var ws = workshops[i].coordinates;
            req[i] = new XMLHttpRequest();
            var url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + pos[0] + ',' + pos[1] + ';' + ws[0] + ',' + ws[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
            req[i].open("GET", url, true);
            req[i].onreadystatechange = function(){
              if (req[i].readyState === 4 && req[i].status === 200){
                var json = JSON.parse(req[i].response);
                var data = json.routes[0];
                if (data.distance < trucks[vid].distanceWS || trucks[vid].distanceWS == undefined){
                  trucks[vid].distanceWS = data.distance;
                  distances[i] = data.distance;
                }
                /*
                if (data.distance < closestDist){
                  closestDist = data.distance;
                  console.log(closestDist);
                }*/
                /*
                console.log(workshops[i].city);
                console.log('Response from request ' + i + ' [ ' + data.distance + ']');
                */
              }
            };
            req[i].send();
        })(i, closestDist);
    }
    trucks[vid].distanceWS = closestDist;
  })();
}
/*
function getWSDist(pos, vid){
  var closestDist = 9999999999;
  for (var key in workshops){
    var ws = workshops[key];
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + pos[0] + ',' + pos[1] + ';' + ws[0] + ',' + ws[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function() {
      var json = JSON.parse(req.response);
      var data = json.routes[0];
      console.log(data.distance);
      if (data.distance < closestDist){
        closestDist = data.distance;
      }
      trucks[vid].distanceWS = closestDist;
    }
    req.send();
  }
}
*/

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

map.on('load', function() {
  for (i=0; i<trucks.length;i++){
    var truck = trucks[i];
    var start = truck.orig;
    var dest = truck.dest;
    var pos = truck.pos;
    getRoute(pos, dest, truck.id, 'remaining', '#f30');
    getRoute(start, pos, truck.id, 'driven', '#3887be');
    getWSDist(pos, i);
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
    getRoute(pos, dest, truck.id, 'remaining', '#f30');
    getRoute(start, pos, truck.id, 'driven', '#3887be');
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
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              // feature for Mapbox DC
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': trucks[0].pos
              },
              'properties': {
                'id': 0,
                'registration':'abc123',
                'origin': trucks[0].origText,
                'destination': trucks[0].destText,
                'distToDest': '0' + 'remainingroute',
                'rotate': getRotation(trucks[0].dest, trucks[0].orig)
              }
            }
          ]
        }
      });

      // Add a symbol layer
      map.addLayer({
        'id': 'redtrucks',
        'type': 'symbol',
        'source': 'redtrucks',
        'layout': {
          'icon-image': 'truck-marker',
          'icon-size': 0.9,
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
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              // feature for Mapbox DC
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': trucks[0].pos
              },
              'properties': {
                'id': 0,
                'registration':'abc123',
                'origin': trucks[0].origText,
                'destination': trucks[0].destText,
                'distToDest': '0' + 'remainingroute',
                'rotate': getRotation(trucks[0].dest, trucks[0].orig)
              }
            }
          ]
        }
      });

      // Add a symbol layer
      map.addLayer({
        'id': 'greentrucks',
        'type': 'symbol',
        'source': 'greentrucks',
        'layout': {
          'icon-image': 'truck-marker-green',
          'icon-size': 0.9,
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

function getTruckCol(){
  if (map.getLayer("greentrucks") && map.getLayer("redtrucks")) {
    for (i=0; i<trucks.length;i++){
      if (trucks[i].gsh < 50){
        map.setLayoutProperty(
          'greentrucks',
          'visibility',
          'none'
        );
        map.setLayoutProperty(
          'redtrucks',
          'visibility',
          'visible'
        );
      }
      else{
        map.setLayoutProperty(
          'greentrucks',
          'visibility',
          'visible'
        );
        map.setLayoutProperty(
          'redtrucks',
          'visibility',
          'none'
        );
      }
    }
  }
}

map.on('style.load', () => {
  const waiting = () => {
    if (!map.isStyleLoaded()) {
      setTimeout(waiting, 100);
    } else {
      getTruckCol();
    }
  };
  waiting();
});

var layerlist = ['workshops', 'redtrucks', 'greentrucks'];

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

function showTruckDetails(e){
  var coordinates = e.features[0].geometry.coordinates.slice();
  var id = e.features[0].properties.id;
  var distToDest = e.features[0].properties.distToDest;
  //getWSDist(trucks[id].pos, id);
  var htmlcode =
  '<div class="my-row" style="width:300px">' +
    '<div class="my-col" style="color: #9FA2B4; text-align:right">' +
      'Registration<br>' +
      'Origin<br>' +
      'Destination<br>' +
      'Route dist.<br>' +
      'Dist. to dest.<br>' +
      'Dist. to WS<br>' +
      'Speed<br>' +
      'GSH<br>' +
      'Alerts<br>' +
    '</div>' +
    '<div class="my-col" style="text-align:left">' +
      trucks[id].reg + '<br>' +
      trucks[id].origText + '<br>' +
      trucks[id].destText + '<br>' +
      Math.round((trucks[id].distanceDriven + trucks[id].distanceLeft)/1000).toString() + ' km<br>' +
      Math.round(trucks[id].distanceLeft/1000).toString() + ' km<br>' +
      Math.round(trucks[id].distanceWS/1000).toString() + ' km<br>' +
      trucks[id].speed.toString() + ' km/h<br>' +
      trucks[id].gsh.toString() + ' %<br>' +
    '</div>' +
  '</div>' +
  '<div class="my-row" style="width:300px">' +
    '<button class="moreBtn" onclick="openVehicle(' + id + ')">More</button>' +
  '</div>';
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  showDetails(trucks[id]);
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  let truckpopup = new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(htmlcode)
  .setMaxWidth("800px")
  .addTo(map);

  truckpopup.on('close', function(e) {
    for (i=0; i<trucks.length; i++){
      hideDetails(trucks[0]);
    }
  });
}
