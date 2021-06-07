//MAPBOX STUFF
var map;
var mapboxgl;

var mapspecific;

var trucks = [
  {
    id: 0,
    reg: 'abc123',
    chassi: 0123456789,
    model: "L-series 2021",
    element : document.getElementById("truck1"),
    pos: [17.0, 59.0],
    newPos: true, //To know whether distances to WS should be calculated anew.
    orig: [17.64809, 59.16777],
    origText: 'Sodertalje',
    dest: [14.19974, 57.76585],
    destText: 'Hej',
    currLeg: [],
    currLegText: undefined,
    distanceDriven: 0,
    distanceLeft: 0,
    distanceWS: undefined,
    speed: 0,
    downtime: 0,
    gsh: 90,
    symptoms: {
      wheels: {
        heat:  [false, false, false, false],
        vibration: [false, false, false, false]
      },
      oillevel: false,
      airpressure: false,
      brakeeng: false,
    },
    symptomList: [],
    log: [],
    comments: [],
    diagnoses: [],
    rotation: 0
  }
];

var workshops = [
  {
    city: 'Stockholm',
    title: 'Stockholm Service Center',
    description: '<p><img src="images/wsdesc.png" style="width:100%"/></p>',
    coordinates: [18.01134, 59.34909]
  },
  {
    city: 'Sodertalje',
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
    city: 'Malmo',
    title: 'Malmö Service Center',
    description: '<p><img src="images/wsdesc.png" style="width:100%"/></p>',
    coordinates: [13.06614, 55.62797]
  },
  {
    city: 'Norrkoping',
    title: 'Norrköping Service Center',
    description: '<p><img src="images/wsdesc.png" style="width:100%"/></p>',
    coordinates: [16.15390, 58.62239]
  },
  {
    city: 'Skavsta workshop',
    title: 'Skavsta workshop',
    description: '<p><img src="images/wsdesc.png" style="width:100%"/></p>',
    coordinates: [16.92770, 58.78340]
  }
]

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

var sympListCreated = false;

var upCount = 0;
var downCount = 0;
var alertedCount = 0;
var onholdCount = 0;

var mapup = true;
var mapdown = false;
var mapalerted = false;
var maponhold = false;
var truckColors = ['greentrucks', 'yellowtrucks', 'redtrucks'];

var pages = ['vehicleDetails', 'vehicles', 'contacts', 'knowledgeBase', 'analytics', 'settings']
var activePage = "vehicles";

var distances = [];

function getRotation(destination, origin){
  var dLon = destination[1]-origin[1];
  var dLat = destination[0]-origin[0];
  var angle = -((Math.atan2(dLon, dLat) * 180 / Math.PI));
  return angle;
}

function getVehicleData(vid){
  var data = {
    'type': 'FeatureCollection',
    'features': [
      {
        // feature for Mapbox DC
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': trucks[vid].pos
        },
        'properties': {
          'id': vid,
          'registration':'abc123',
          'origin': trucks[vid].origText,
          'destination': trucks[vid].destText,
          'distToDest': '0' + 'remainingroute',
          'rotate': trucks[vid].rotation
        }
      }
    ]
  };
  return data;
}

function updateVehicleMap(vid, mapname){
  var data = getVehicleData(vid);
  if (eval(mapname).getSource('greentrucks')){
    eval(mapname).getSource('greentrucks').setData(data);
  }
  if (eval(mapname).getSource('yellowtrucks')){
    eval(mapname).getSource('yellowtrucks').setData(data);
  }
  if (eval(mapname).getSource('redtrucks')){
    eval(mapname).getSource('redtrucks').setData(data);
  }
  if (mapname == "mapspecific"){
    mapspecific.flyTo({
      center: trucks[0].pos
    });
  }
}

function showTruckDetails(e, mapname){
  var coordinates = e.features[0].geometry.coordinates.slice();
  var id = e.features[0].properties.id;
  var distToDest = e.features[0].properties.distToDest;
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  /*
  if (truckpopup){
    truckpopup.remove();
  }
  */
  truckpopup = new mapboxgl.Popup()
  .setLngLat(coordinates)
  //.setHTML(htmlcode)
  .setMaxWidth("800px")
  .addTo(eval(mapname));
  loadPopup(id, mapname);

  truckpopup.on('close', function(e) {
    for (i=0; i<trucks.length; i++){
      hideDetails(trucks[i], mapname);
    }
  });
  showRoute(trucks[id], mapname);
}

function showTruckDetailsSpec(vid, mapname){
  getRoute(trucks[vid].orig, trucks[vid].pos, vid, 'driven', '#3887be', "mapspecific").then(() => {
    getRoute(trucks[vid].pos, trucks[vid].dest, vid, 'remaining', '#f30', "mapspecific").then(() => {
      getWSDist(vid).then(() => {
        loadPopup(vid, "mapspecific");
        showRoute(trucks[vid], mapname);
      });
    });
  });
  showPopup(vid, mapname);
  /*
  var coordinates = trucks[vid].pos;
  truckpopup = new mapboxgl.Popup()
  .setLngLat(coordinates)
  //.setHTML(htmlcode)
  .setMaxWidth("800px")
  .addTo(eval(mapname));
  //loadPopup(vid);

  truckpopup.on('close', function(e) {
    for (i=0; i<trucks.length; i++){
      hideDetails(trucks[i], mapname);
    }
  });
  */
}

function showPopup(vid, mapname){
  var coordinates = trucks[vid].pos;
  if (mapname == "mapspecific"){
    if (truckpopup){
      truckpopup.remove();
    }
  }
  truckpopup = new mapboxgl.Popup()
  .setLngLat(coordinates)
  //.setHTML(htmlcode)
  .setMaxWidth("800px")
  .addTo(eval(mapname));
  //loadPopup(vid);

  truckpopup.on('close', function(e) {
    for (i=0; i<trucks.length; i++){
      hideDetails(trucks[i], mapname);
    }
  });
}

function showRoute(truck, mapname) {
  if (eval(mapname).getSource(truck.id + 'start')){
    eval(mapname).setLayoutProperty(
      truck.id + 'driven' + 'route',
      'visibility',
      'visible'
    );
    eval(mapname).setLayoutProperty(
      truck.id + 'remaining' + 'route',
      'visibility',
      'visible'
    );
    eval(mapname).setLayoutProperty(
      truck.id + 'start',
      'visibility',
      'visible'
    );
    eval(mapname).setLayoutProperty(
      truck.id + 'end',
      'visibility',
      'visible'
    );
  }
}

function hideDetails(truck, mapname){
  eval(mapname).setLayoutProperty(
    truck.id + 'driven' + 'route',
    'visibility',
    'none'
  );
  eval(mapname).setLayoutProperty(
    truck.id + 'remaining' + 'route',
    'visibility',
    'none'
  );
  eval(mapname).setLayoutProperty(
    truck.id + 'start',
    'visibility',
    'none'
  );
  eval(mapname).setLayoutProperty(
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

function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

async function getWSDist(vid){
  if (trucks[vid]){
    var pos = trucks[vid].pos;
    for(i = 0; i < workshops.length; i++){
      let ws = workshops[i].coordinates;
      let url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + pos[0] + ',' + pos[1] + ';' + ws[0] + ',' + ws[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
      let result = await makeRequest("GET", url);
      let json = JSON.parse(result);
      let data = json.routes[0];
      if (data.distance < trucks[vid].distanceWS || trucks[vid].newPos == true){
        trucks[vid].newPos = false;
        trucks[vid].distanceWS = data.distance;
        distances[i] = data.distance;
      }
    }
  }
}

async function getRouteDist(start, end, vid, partofroute){
  var url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
  let result = await makeRequest('GET', url);
  var json = JSON.parse(result);
  var data = json.routes[0];
  if (partofroute == 'driven'){
    trucks[vid].distanceDriven = data.distance;
  }
  else{
    trucks[vid].distanceLeft = data.distance;
  }
  var route = data.geometry.coordinates;
  return route;
}

async function getRoute(start, end, vid, partofroute, col, mapname) {
  var url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
  let result = await makeRequest('GET', url);
  var json = JSON.parse(result);
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
  if (eval(mapname).getSource(vid + partofroute + 'route')) {
    eval(mapname).getSource(vid + partofroute + 'route').setData(geojson);
  } else { // otherwise, make a new request
    eval(mapname).addLayer({
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
}

function showTruckCol(num, mapname){
  for (i=0; i<truckColors.length;i++) {
    var vis = 'none'
    if (i == num){
      vis = 'visible'
    }
    eval(mapname).setLayoutProperty(
      truckColors[i],
      'visibility',
      vis
    );
  }
}

function updateSymptomsList(id){
  var tempList = [];
  var sympList = [];
  var wheelalerts = getWheelAlerts(id);
  tempList.push(wheelalerts[0]);
  tempList.push(wheelalerts[1]);
  tempList.push(getOilPressAlert(id));
  tempList.push(getAirPressAlert(id));
  tempList.push(getBrakeEngAlert(id));
  for (i = 0; i < tempList.length; i++){
    if (tempList[i] != ""){
      sympList.push(tempList[i]);
    }
  }
  trucks[id].symptomList = sympList;
}

function dispSympModal(vid){
  var symplst = document.getElementById('sympList');
  if (sympListCreated != true){
    var header = document.createElement("p");
    header.innerHTML = "Detected Symptoms";
    header.classList.add("header3");
    symplst.appendChild(header);
    for (i = 0; i < trucks[vid].symptomList.length; i++){
      var listItem = document.createElement("a");
      listItem.classList.add("my-list-item");
      listItem.innerHTML = trucks[vid].symptomList[i];
      if (i == trucks[vid].symptomList.length - 1){
        listItem.style.borderBottomLeftRadius = "8px";
        listItem.style.borderBottomRightRadius = "8px";
      }
      listItem.style.borderTop = "1px solid #DFE0EB";
      listItem.href = "#symptom" + (i+1).toString();
      listItem.id = "symptom" + (i+1).toString();
      listItem.style.padding = "16px";
      listItem.addEventListener('click', function(){
      });
      symplst.appendChild(listItem);
    }
    sympListCreated = true;
  }
  document.getElementById('firstModal').style.display='block';
}

function dispInfoModal(vid){
  document.getElementById('infoModal').style.display='block';
  mapspecific.resize();
  mapspecific.flyTo({
    center: trucks[0].pos
  });
  getTruckColSpec();
  showTruckDetailsSpec(vid, "mapspecific");
  showRoute(trucks[vid], "mapspecific");
}

function getTruckColSpec(){
  if (mapspecific != undefined){
    if (mapspecific.getLayer("greentrucks") && mapspecific.getLayer("redtrucks") && mapspecific.getLayer("yellowtrucks")) {
      for (i=0; i<trucks.length;i++){
        if (trucks[i].gsh <= 50 && trucks[i].gsh > 20){
          showTruckCol(1, "mapspecific");
        }
        else if (trucks[i].gsh <= 20){
          showTruckCol(2, "mapspecific");
        }
        else{
          showTruckCol(0, "mapspecific");
        }
      }
    }
  }
}

function getTruckCol(vCountCallback){
  if (map != undefined){
    if (map.getLayer("greentrucks") && map.getLayer("redtrucks") && map.getLayer("yellowtrucks")) {
      upCount = 0;
      downCount = 0;
      alertedCount = 0;
      onholdCount = 0;
      for (i=0; i<trucks.length;i++){
        onholdCount += 1;
        if (trucks[i].gsh <= 50 && trucks[i].gsh > 20){
          alertedCount += 1;
          if (mapalerted == true){
            showTruckCol(1, "map");
          }
          else{
            showTruckCol(-1, "map");
          }
        }
        else if (trucks[i].gsh <= 20){
          alertedCount += 1;
          downCount += 1;
          if (mapalerted == true || mapdown == true){
            showTruckCol(2, "map");
          }
          else{
            showTruckCol(-1, "map");
          }
        }
        else{
          upCount += 1;
          if (mapup == true){
            showTruckCol(0, "map");
          }
          else{
            showTruckCol(-1, "map");
          }
        }
      }
      vCountCallback();
    }
  }
}

function setVehicleCounts(){
  document.getElementById("vhcls-up-val").innerHTML = upCount;
  document.getElementById("vhcls-down-val").innerHTML = downCount;
  document.getElementById("vhcls-alerted-val").innerHTML= alertedCount;
  document.getElementById("vhcls-onhold-val").innerHTML = onholdCount;
}

var upVhcls = document.getElementById("vehicles-up");
upVhcls.addEventListener('click', function(){
  mapup = true;
  mapdown = false;
  mapalerted = false;
  maponhold = false;
  getTruckCol(setVehicleCounts);
});

var downVhcls = document.getElementById("vehicles-down");
downVhcls.addEventListener('click', function(){
  mapup = false;
  mapdown = true;
  mapalerted = false;
  maponhold = false;
  getTruckCol(setVehicleCounts);
});

var alertedVhcls = document.getElementById("vehicles-alerted");
alertedVhcls.addEventListener('click', function(){
  mapup = false;
  mapdown = false;
  mapalerted = true;
  maponhold = false;
  getTruckCol(setVehicleCounts);
});

var onholdVhcls = document.getElementById("vehicles-onhold");
onholdVhcls.addEventListener('click', function(){
  mapup = true;
  mapdown = true;
  mapalerted = true;
  maponhold = true;
  getTruckCol(setVehicleCounts);
});

function getWheelAlerts(vid){
  var heatWheelsDisp = "";
  var vibrationWheelsDisp = "";
  var firstAddedHeat = false;
  var firstAddedVib = false;
  for (i = 0; i < trucks[vid].symptoms.wheels.heat.length; i++){
    if (trucks[vid].symptoms.wheels.heat[i] == true){
      if (firstAddedHeat == false) {
        heatWheelsDisp += "HEAT (WHEEL " + (i+1).toString();
        firstAddedHeat = true;
      }
      else {
        heatWheelsDisp += ", " + (i+1).toString();
      }
    }
    if (trucks[vid].symptoms.wheels.vibration[i] == true){
      if (firstAddedVib == false) {
        vibrationWheelsDisp += "VIBRATION (WHEEL " + (i+1).toString();
        firstAddedVib = true;
      }
      else {
        vibrationWheelsDisp += ", " + (i+1).toString();
      }
    }
  }
  if (firstAddedHeat == true){
    heatWheelsDisp += ")";
  }
  if (firstAddedVib == true){
    vibrationWheelsDisp += ")";
  }
  return [heatWheelsDisp, vibrationWheelsDisp];
}

function getOilPressAlert(vid){
  var returnstr = "";
  if (trucks[vid].symptoms.oillevel == true){
    returnstr = 'OIL PRESSURE';
  }
  return returnstr
}

function getAirPressAlert(vid){
  var returnstr = "";
  if (trucks[vid].symptoms.airpressure == true){
    returnstr = 'AIR PRESSURE';
  }
  return returnstr
}

function getBrakeEngAlert(vid){
  var returnstr = "";
  if (trucks[vid].symptoms.brakeeng == true){
    returnstr = 'P-BRAKE ENGAGED';
  }
  return returnstr
}

function loadDetails(element, vid) {
  element.querySelector("#vVal").innerHTML = Math.round(trucks[vid].speed * 100);
  var wheelAlerts = getWheelAlerts(vid);
  var heatWheelsDisp = wheelAlerts[0];
  var vibrationWheelsDisp = wheelAlerts[1];
  element.querySelector("#heatWheels").innerHTML = heatWheelsDisp;
  element.querySelector("#vibrationWheels").innerHTML = vibrationWheelsDisp;
  element.querySelector("#airPress").innerHTML = getAirPressAlert(vid);
  element.querySelector("#oilPress").innerHTML = getOilPressAlert(vid);
  element.querySelector("#coolantTemp").innerHTML = "";
  element.querySelector("#p-brake-engage").innerHTML = getBrakeEngAlert(vid);
}

function loadLog(id){
  var logList = document.getElementById("vLog");
  while (logList.firstChild) {
    logList.removeChild(logList.lastChild);
  }
  var header = document.createElement("p");
  header.innerHTML = "Log";
  header.classList.add("header3");
  logList.appendChild(header);
  for (i = 0; i < trucks[id].log.length; i++){
    var listItem = document.createElement("a");
    listItem.classList.add("my-list-item");
    var type = document.createElement("div");
    type.style.borderRight = "1px solid #DFE0EB";
    type.classList.add("item-section-short");
    var content = document.createElement("div");
    content.style.borderRight = "1px solid #DFE0EB";
    content.classList.add("item-section-long");
    var time = document.createElement("div");
    time.classList.add("item-section-short");
    type.innerHTML = "<p>" + trucks[id].log[i].type + "</p>";
    content.innerHTML = "<p>" + trucks[id].log[i].content + "</p>";
    time.innerHTML = "<p>" + trucks[id].log[i].occ_time + "</p>";
    listItem.appendChild(type);
    listItem.appendChild(content);
    listItem.appendChild(time);
    if (i == trucks[id].log.length - 1){
      if (trucks[id].log.length <= 6){
        listItem.style.borderBottom = "1px solid #DFE0EB";
      }
      else{
        listItem.style.borderBottomLeftRadius = "8px";
        listItem.style.borderBottomRightRadius = "8px";
      }
    }
    listItem.style.borderTop = "1px solid #DFE0EB";
    listItem.href = "#logitem" + (i+1).toString();
    listItem.id = "logitem" + (i+1).toString();
    logList.appendChild(listItem);
  }
}

function sendComment(comment){
  if (comment != ""){
    var time = new Date().toLocaleString();
    write_comment(comment, "Jesper Englund", time);
  }
  else {
    console.log("Write some text to add a comment");
  }
}

function loadComments(id){
  var commList = document.getElementById("comments");
  while (commList.firstChild) {
    commList.removeChild(commList.lastChild);
  }
  var header = document.createElement("p");
  header.innerHTML = "Comments";
  header.classList.add("header3");
  commList.appendChild(header);

  var newCommrow = document.createElement("div");
  newCommrow.classList.add("w3-row");
  commList.appendChild(newCommrow)
  var newCommCol1 = document.createElement("div");
  newCommCol1.classList.add("my-col-xlong");
  var newCommCol2 = document.createElement("div");
  newCommCol2.classList.add("my-col-xshort");
  newCommCol2.classList.add("w3-display-container");
  newCommrow.appendChild(newCommCol1);
  newCommrow.appendChild(newCommCol2);

  var commentField = document.createElement("textarea");
  commentField.classList.add("comm-field");
  commentField.placeholder = "New comment...";
  commentField.style.resize = "none";
  newCommCol1.appendChild(commentField);

  var sendBtn = document.createElement("img");
  sendBtn.classList.add("send-btn");
  sendBtn.classList.add("w3-display-bottommiddle");
  sendBtn.src = "images/sendBtn.png";
  sendBtn.addEventListener('click', () => sendComment(commentField.value), false);
  newCommCol2.appendChild(sendBtn);

  for (i = 0; i < trucks[id].comments.length; i++){
    var listItem = document.createElement("a");
    listItem.classList.add("my-list-item");
    var type = document.createElement("div");
    type.style.borderRight = "1px solid #DFE0EB";
    type.classList.add("item-section-short");
    var content = document.createElement("div");
    content.style.borderRight = "1px solid #DFE0EB";
    content.classList.add("item-section-long");
    var time = document.createElement("div");
    time.classList.add("item-section-short");
    type.innerHTML = "<p>" + trucks[id].comments[i].sender + "</p>";
    content.innerHTML = "<p>" + trucks[id].comments[i].comment + "</p>";
    time.innerHTML = "<p>" + trucks[id].comments[i].time + "</p>";
    listItem.appendChild(type);
    listItem.appendChild(content);
    listItem.appendChild(time);
    if (i == trucks[id].comments.length - 1){
      if (trucks[id].comments.length <= 6){
        listItem.style.borderBottom = "1px solid #DFE0EB";
      }
      else{
        listItem.style.borderBottomLeftRadius = "8px";
        listItem.style.borderBottomRightRadius = "8px";
      }
    }
    listItem.style.borderTop = "1px solid #DFE0EB";
    listItem.href = "#commentitem" + (i+1).toString();
    listItem.id = "commentitem" + (i+1).toString();
    commList.appendChild(listItem);
  }
}

function loadDiagnose(vid){
  var diagnosisElem = document.getElementById("diagnosis");
  while (diagnosisElem.firstChild) {
    diagnosisElem.removeChild(diagnosisElem.lastChild);
  }
  for (i = 0; i < trucks[vid].diagnoses.length; i++){
    var diagnosistext = "unrecognized";
    var prognosistext;
    if (trucks[vid].diagnoses[i].diagnose == "nofault"){
      diagnosistext = "No fault";
    }
    else if (trucks[vid].diagnoses[i].diagnose == "air_leak_Y" || trucks[vid].diagnoses[i].diagnose == "air_leak_R"){
      diagnosistext = "Air leakage";
    }
    else if (trucks[vid].diagnoses[i].diagnose == "bearing_fault"){
      diagnosistext = "Worn bearings";
    }
    else if (trucks[vid].diagnoses[i].diagnose == "appl_breaks"){
      diagnosistext = "Engaged brakes";
    }
    var row1 = document.createElement("div");
    row1.classList.add("w3-row");
    var diagnose = document.createElement("div");
    diagnose.innerHTML = diagnosistext;
    if (trucks[vid].diagnoses[i].severity == "SAFE"){
      diagnose.classList.add("greentag");
    }
    else if (trucks[vid].diagnoses[i].severity == "NOTSEVERE"){
      diagnose.classList.add("yellowtag");
    }
    else {
      diagnose.classList.add("redtag");
    }
    diagnose.classList.add("tooltip");
    diagnose.classList.add("info-item");
    diagnose.classList.add("diagnosis-elem");
    var diagnosett = document.createElement("span");
    diagnosett.innerHTML = "Proposed Diagnose";
    diagnosett.classList.add("tooltiptext");
    diagnose.appendChild(diagnosett);
    row1.appendChild(diagnose);
    diagnosisElem.appendChild(row1);

    var likelihood = document.createElement("div");
    likelihood.innerHTML = Math.round(trucks[0].diagnoses[i].likelihood * 100).toString() + " %";
    likelihood.classList.add("tooltip");
    likelihood.classList.add("info-item");
    likelihood.style.marginLeft = "20px";
    var likelihoodtt = document.createElement("span");
    likelihoodtt.innerHTML = "likelihood";
    likelihoodtt.classList.add("tooltiptext");
    likelihood.appendChild(likelihoodtt);
    row1.appendChild(likelihood);

    if (trucks[vid].diagnoses[0].prognoses.length > 0) {
      for (j = 0; j < trucks[vid].diagnoses[0].prognoses.length; j++){
        var row3 = document.createElement("div");
        row3.classList.add("w3-row");
        var prognosis = document.createElement("div");
        prognosis.innerHTML = trucks[vid].diagnoses[0].prognoses[j].prognosis;
        prognosis.classList.add("tooltip");
        prognosis.classList.add("info-item");
        var prognosistt = document.createElement("span");
        prognosistt.innerHTML = "Prognosis";
        prognosistt.classList.add("tooltiptext");
        prognosis.appendChild(prognosistt);

        var avgLife = document.createElement("div");
        avgLife.innerHTML = trucks[0].diagnoses[0].prognoses[j].AvgLife + " u";
        avgLife.classList.add("tooltip");
        avgLife.classList.add("info-item");
        avgLife.style.marginLeft = "20px";
        var avgLifett = document.createElement("span");
        avgLifett.innerHTML = "Avg. life";
        avgLifett.classList.add("tooltiptext");
        avgLife.appendChild(avgLifett);

        row3.appendChild(prognosis);
        row3.appendChild(avgLife);
        diagnosisElem.appendChild(row3);
      }
    }
  }
}

function openVehicle(vid){
  //Open Specific vehicle by clicking More-btn in popup
  var sections = document.getElementsByClassName("mySection");
  activePage = 'vehicleDetails';
  var vDetails;
  for (i = 0; i < sections.length; i++) {
    if (sections[i].id == 'vehicleDetails'){
      vDetails = sections[i];
      sections[i].style.display = "block";
    }
    else {
      sections[i].style.display = "none";
    }
  }
  loadDetails(vDetails, vid);
  loadLog(vid);
  loadComments(vid);
  loadInfo(vid);
  loadDiagnose(vid);
  loadActions(vid);
  loadTests(vid, 'tests');
}

var truckpopup;

function loadInfo(vid){
  var infoElem = document.getElementById("infoComp");
  while (infoElem.firstChild) {
    infoElem.removeChild(infoElem.lastChild);
  }
  var rows = 3;
  var cols = 3;
  var infoObj = {
    "Registration": trucks[vid].reg,
    "Chassi number": trucks[vid].chassi,
    "Model": trucks[vid].model,
    "Route": trucks[vid].origText + " - " + trucks[vid].destText,
    "Route distance": Math.round((trucks[vid].distanceDriven + trucks[vid].distanceLeft)/1000).toString() + " km",
    "Distance to destination": Math.round((trucks[vid].distanceLeft)/1000).toString() + " km",
    "Distance to Workshop": Math.round((trucks[vid].distanceWS)/1000).toString() + " km",
    "Downtime": trucks[vid].downtime + " h",
    "General State of Health": trucks[vid].gsh + " %"
  };
  for (i = 0; i < rows; i++){
    var row = document.createElement("div");
    row.classList.add("w3-row");
    for (j = 0; j < cols; j++){
      var col = document.createElement("div");
      col.classList.add("w3-col");
      col.classList.add("s4");
      row.appendChild(col);
      var infoval = document.createElement("div");
      infoval.innerHTML = Object.values(infoObj)[i*cols+j];
      infoval.classList.add("tooltip");
      infoval.classList.add("info-item");
      var infott = document.createElement("span");
      infott.innerHTML = Object.keys(infoObj)[i*cols+j];
      infott.classList.add("tooltiptext");
      infoval.appendChild(infott);
      col.appendChild(infoval);
    }
    infoElem.appendChild(row);
  }
}

var myActions = [
  {
    text: "Finish route, full speed",
    action: {
      route: "mgoal",
      speed: "Vnormal"
    },
    takeControl: true,
    verifyDiagnose: true
  },
  {
    text: "Finish route, reduced speed",
    action: {
      route: "mgoal",
      speed: "Vred"
    },
    takeControl: true,
    verifyDiagnose: true
  },
  {
    text: "Go to workshop 1, full speed",
    action: {
      route: "W1",
      speed: "Vnormal"
    },
    takeControl: true,
    verifyDiagnose: true
  },
  {
    text: "Go to workshop 1, reduced speed",
    action: {
      route: "Skavsta workshop",
      speed: "Vred"
    },
    takeControl: true,
    verifyDiagnose: true
  },
  {
    text: "Go to workshop 2, full speed",
    action: {
      route: "W2",
      speed: "Vnormal"
    },
    takeControl: true,
    verifyDiagnose: true
  },
  {
    text: "Go to workshop 2, reduced speed",
    action: {
      route: "W2",
      speed: "Vred"
    },
    takeControl: true,
    verifyDiagnose: true
  },
  {
    text: "Verify and release",
    action: {
      route: null,
      speed: null
    },
    takeControl: false,
    verifyDiagnose: true
  }
];

function setActDB(myaction, takeCont, verify){
  write_rec_action(myaction, takeCont, verify);
}

function loadActions(vid){
  var actionsElem = document.getElementById("actions");
  while (actionsElem.firstChild) {
    actionsElem.removeChild(actionsElem.lastChild);
  }
  var header = document.createElement("p");
  header.innerHTML = "Actions";
  header.classList.add("header3");
  actionsElem.appendChild(header);
  for (i = 0; i < myActions.length; i++){
    var listItem = document.createElement("a");
    listItem.classList.add("my-list-item");
    listItem.innerHTML = myActions[i].text;
    if (i == myActions.length - 1){
      if (myActions.length < 8){
        listItem.style.borderBottom = "1px solid #DFE0EB";
      }
      else{
        listItem.style.borderBottomLeftRadius = "8px";
        listItem.style.borderBottomRightRadius = "8px";
      }
    }
    listItem.style.borderTop = "1px solid #DFE0EB";
    listItem.href = "#action" + (i+1).toString();
    listItem.id = "action" + (i+1).toString();
    listItem.style.padding = "16px";
    if (i < 2){
      myActions[i].action.route = trucks[vid].destText;
    }
    let myaction = myActions[i].action;
    let takeCont = myActions[i].takeControl;
    let verify =  myActions[i].verifyDiagnose;
    listItem.addEventListener('click', () => setActDB(myaction, takeCont, verify), false);
    actionsElem.appendChild(listItem);
  }
}

function dispTestsModal(vid, test){
  let testsModal = document.getElementById('testsModal');
  loadTests(vid, 'testLists');
  dispTest(test);
  testsModal.style.display='block';
}

function dispTest(test){
  let img1Elem = document.getElementById("testImg1");
  while (img1Elem.firstChild) {
    img1Elem.removeChild(img1Elem.lastChild);
  }
  let img2Elem = document.getElementById("testImg2");
  while (img2Elem.firstChild) {
    img2Elem.removeChild(img2Elem.lastChild);
  }
  var img1 = document.createElement("img");
  img1.style.width = "100%";
  var img2 = document.createElement("img");
  img2.style.width = "100%";
  if (test == "restart"){
    img1.src = "images/restartEng1.png";
    img2.src = "images/restartEng2.png";
  }
  else if (test == "brake"){
    img1.src = "images/brakeTest1.png";
    img2.src = "images/brakeTest2.png";
  }
  else {
    img1.src = "images/genTest1.png";
    img2.src = "images/genTest2.png";
  }
  img1Elem.appendChild(img1);
  img2Elem.appendChild(img2);
}

let myTests = [
  {id: "restart", text: "Restart enginge", time: "Just now"},
  {id: "brake", text: "Brake test", time: "Sep 14, 2020"},
  {id: "other", text: "Test Placeholder", time:"N/A"},
  {id: "other", text: "Test Placeholder", time:"N/A"},
  {id: "other", text: "Test Placeholder", time:"N/A"},
  {id: "other", text: "Test Placeholder", time:"N/A"},
  {id: "other", text: "Test Placeholder", time:"N/A"},
  {id: "other", text: "Test Placeholder", time:"N/A"},
  {id: "other", text: "Test Placeholder", time:"N/A"}
];

function loadTests(vid, eid){
  var testsElem = document.getElementById(eid);
  while (testsElem.firstChild) {
    testsElem.removeChild(testsElem.lastChild);
  }
  var header = document.createElement("p");
  header.innerHTML = "Tests";
  header.classList.add("header3");
  testsElem.appendChild(header);

  for (i = 0; i < myTests.length; i++){
    let listItem = document.createElement("a");
    listItem.classList.add("my-list-item");

    let listItemdiv = document.createElement("div");
    listItemdiv.classList.add("w3-half");
    listItemdiv.style.textAlign = "left";
    if (myTests[i].id == "other"){
      listItemdiv.innerHTML = myTests[i].text + (i-1);
    }
    else{
      listItemdiv.innerHTML = myTests[i].text;
    }
    listItem.appendChild(listItemdiv);

    if (i == myTests.length - 1){
      if (myTests.length < 8){
        listItem.style.borderBottom = "1px solid #DFE0EB";
      }
      else{
        listItem.style.borderBottomLeftRadius = "8px";
        listItem.style.borderBottomRightRadius = "8px";
      }
    }
    listItem.style.borderTop = "1px solid #DFE0EB";
    listItem.href = "#test" + (i+3).toString();
    listItem.id = "test" + (i+3).toString();
    listItem.style.padding = "16px";
    let testid = myTests[i].id;
    if (eid == "tests"){
      listItem.addEventListener('click', () => dispTestsModal(vid, testid), false);
      listItem.href = "#test" + (i+3).toString() + "modal";
      listItem.id = "test" + (i+3).toString();

      let listItemtime = document.createElement("div");
      listItemtime.classList.add("w3-half");
      listItemtime.style.textAlign = "right";
      listItemtime.style.color = "#DFE0EB";
      listItemtime.innerHTML = "Most recent: " + myTests[i].time;
      listItem.appendChild(listItemtime);
    }
    else {
      listItem.addEventListener('click', () => dispTest(testid), false);
      listItem.href = "#test" + (i+3).toString() + "modal";
      listItem.id = "test" + (i+3).toString() + "modal";
    }
    testsElem.appendChild(listItem);
  }
}

function loadPopup(id, mapname){
  if (truckpopup != undefined){
    var wheelsAlerts = getWheelAlerts(id);
    var oilPressAlert = getOilPressAlert(id);
    var airPressAlert = getAirPressAlert(id);
    var brakeEngAlert = getBrakeEngAlert(id);
    var htmlcode =
    '<div class="my-row" style="width:300px">' +
      '<div class="my-col-short" style="color: #9FA2B4; text-align:right">' +
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
      '<div class="my-col-long" style="text-align:left">' +
        trucks[id].reg + '<br>' +
        trucks[id].origText + '<br>' +
        trucks[id].destText + '<br>' +
        Math.round((trucks[id].distanceDriven + trucks[id].distanceLeft)/1000).toString() + ' km<br>' +
        Math.round(trucks[id].distanceLeft/1000).toString() + ' km<br>' +
        Math.round(trucks[id].distanceWS/1000).toString() + ' km<br>' +
        Math.round(trucks[id].speed * 100).toString() + ' km/h<br>' +
        trucks[id].gsh.toString() + ' %<br>';
    if (wheelsAlerts[0] != ""){
      htmlcode += '<span class="popupalert"> ' + wheelsAlerts[0] + ' </span>' + '<br>';
    }
    if (wheelsAlerts[1] != ""){
      htmlcode += '<span class="popupalert"> ' + wheelsAlerts[1] + ' </span>' + '<br>';
    }
    if (airPressAlert != ""){
      htmlcode += '<span class="popupalert"> ' + airPressAlert + ' </span>' + '<br>';
    }
    if (oilPressAlert != ""){
      htmlcode += '<span class="popupalert"> ' + oilPressAlert + ' </span>' + '<br>';
    }
    if (brakeEngAlert != ""){
      htmlcode += '<span class="popupalert"> ' + brakeEngAlert + ' </span>' + '<br>';
    }
    htmlcode +=  '</div>' +
    '</div>';

    if (activePage == "vehicles"){
    htmlcode +=  '<div class="my-row" style="width:300px">' +
        '<button class="moreBtn" onclick="openVehicle(' + id + ')">More</button>' +
      '</div>';
    }
    var coordinates = trucks[id].pos;
    truckpopup.setLngLat(coordinates)
    truckpopup.setHTML(htmlcode);
  }
}

//REGULAR STUFF

var myIndex = 0;
//carousel();

var slideIndex = 1;
//showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showContent(n){
  var sections = document.getElementsByClassName("mySection");
  for (i = 0; i < sections.length; i++) {
    if (i == n){
      activePage = pages[i];
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

function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}

function toggle3dMap(){
  let unity = document.getElementById("unityStuff");
  unity.style.display = "block";
}
