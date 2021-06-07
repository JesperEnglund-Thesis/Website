var firebaseConfig = {
  apiKey: "AIzaSyC0oAIOkG2k9YJhLe72ts5pN6jraN43nzI",
  authDomain: "pytest-6b7a8.firebaseapp.com",
  databaseURL: "https://pytest-6b7a8-default-rtdb.firebaseio.com",
  projectId: "pytest-6b7a8",
  storageBucket: "pytest-6b7a8.appspot.com",
  messagingSenderId: "388418484066",
  appId: "1:388418484066:web:3717527ad1638eb3b89e3b",
  measurementId: "G-NEY7MFW2YP"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Read db data
var db = firebase.firestore();

db.collection("VehiclesTest").doc("Vehicle1").collection("vehicleinfo").doc("vehicleInfoCurrent")
    .onSnapshot(function(doc) {
        setVehicle1CurrentData(doc.data());
});

function getCurrLegCoords(place){
  if (place == "Stockholm"){
    return [18.03126, 59.29206];
  }
  else if (place == "Sodertalje"){
    return [17.64809, 59.16777];
  }
  else if (place == "Linkoping"){
    return [15.66582, 58.42696];
  }
  else if (place == "Jonkoping"){
    return [14.19974, 57.76585];
  }
  else if (place == "Nykoping"){
    return [16.99747, 58.76082];
  }
  else if (place == "Norrkoping"){
    return [16.17880, 58.60902];
  }
  else if (place == "Skavsta workshop"){
    return [16.92770, 58.78340];
  }
  else if (place == "inbetween"){
    return [16.42250, 58.73597];
  }
  else {
    return [17.0, 59.0];
  }
}

async function setVehicle1CurrentData(fbData){
  trucks[0].speed = fbData.speed;
  trucks[0].origText = fbData.route[0];
  trucks[0].destText = fbData.route[1];
  trucks[0].currLegText = fbData.localroute;
  if (fbData.mission_finished){
    trucks[0].currLeg[0] = getCurrLegCoords(fbData.localroute[1]);
    trucks[0].currLeg[1] = getCurrLegCoords(fbData.localroute[1])
  }
  else{
    trucks[0].currLeg[0] = getCurrLegCoords(fbData.localroute[0]);
    trucks[0].currLeg[1] = getCurrLegCoords(fbData.localroute[1]);
  }
  trucks[0].downtime = fbData.totalDowntimeApprox;
  trucks[0].pos = trucks[0].currLeg[0];
  trucks[0].newPos = true;
  trucks[0].rotation = getRotation(trucks[0].currLeg[1], trucks[0].currLeg[0])
  var element = document.getElementById("vehicleDetails");
  loadDetails(element, 0);
  changePosition(fbData.speed);
  getRoute(trucks[0].orig, trucks[0].pos, 0, 'driven', '#3887be', "map").then(() => {
    getRoute(trucks[0].pos, trucks[0].dest, 0, 'remaining', '#f30', "map").then(() => {
      getWSDist(0).then(() => {
        loadPopup(0, "map");
        if (activePage == 'vehicleDetails'){
          loadPopup(0, "mapspecific");
          loadInfo(0);
          showRoute(trucks[0], "mapspecific");
        }
      });
    });
  });
  updateVehicleMap(0, "map");
  updateVehicleMap(0, "mapspecific");
  /*
  if (activePage == 'vehicleDetails'){
    showPopup(0, "mapspecific");
  }
  */
  getRoute(trucks[0].orig, trucks[0].pos, 0, 'driven', '#3887be', "map");
  getRoute(trucks[0].pos, trucks[0].dest, 0, 'remaining', '#f30', "map");
  getRoute(trucks[0].orig, trucks[0].pos, 0, 'driven', '#3887be', "mapspecific");
  getRoute(trucks[0].pos, trucks[0].dest, 0, 'remaining', '#f30', "mapspecific");

}

db.collection("VehiclesTest").doc("Vehicle1").collection("vehicleinfo").doc("vehicleHealth")
    .onSnapshot(function(doc) {
        setVehicle1HealthData(doc.data());
});

function setVehicle1HealthData(fbData){
  trucks[0].gsh = fbData.gsh;
  trucks[0].symptoms.wheels.heat = fbData.symptoms.hotnave;
  trucks[0].symptoms.wheels.vibration = fbData.symptoms.vibration;
  trucks[0].symptoms.airpressure = fbData.symptoms.high_air_cons;
  trucks[0].symptoms.oillevel = fbData.symptoms.oil_low_y;
  trucks[0].symptoms.brakeeng = fbData.symptoms.p_brake_eng;
  getTruckCol(setVehicleCounts);
  getTruckColSpec();
  updateSymptomsList(0);
  if (activePage == 'vehicleDetails'){
    var element = document.getElementById("vehicleDetails");
    loadDetails(element, 0);
    loadPopup(0, "mapspecific");
  }
  else if (activePage == 'vehicles') {
      loadPopup(0, "map");
  }
}

db.collection("VehiclesTest").doc("Vehicle1").collection("vehicleinfo").doc("VehicleLogs")
    .onSnapshot(function(doc) {
      setVehicle1LogData(doc.data());
});

function setVehicle1LogData(fbData){
  trucks[0].log = fbData.Logs;
  if (activePage == 'vehicleDetails'){
    loadLog(0);
  }
}

db.collection("VehiclesTest").doc("Vehicle1").collection("vehicleinfo").doc("comments")
    .onSnapshot(function(doc) {
        setVehicle1CommData(doc.data());
});

function setVehicle1CommData(fbData){
  trucks[0].comments = fbData.comments;
  if (activePage == 'vehicleDetails'){
    loadComments(0);
  }
}

db.collection("VehiclesTest").doc("Vehicle1").collection("diagnosis").doc("diagnoses")
    .onSnapshot(function(doc) {
        setVehicle1DiagData(doc.data());
});

function setVehicle1DiagData(fbData){
  for (i = 0; i < fbData.dia.length; i++){
    var diagnosecode = fbData.dia[i].diagnose;
    var diag = diagnosecode.split(",");
    var elem = {
      diagnose: diag[0],
      severity: diag[1],
      likelihood: fbData.dia[i].likelyhood,
      prognoses: fbData.dia[i].prognoses
    }
    trucks[0].diagnoses[i] = elem;
  }
  if (activePage == 'vehicleDetails'){
    loadDiagnose(0);
  }
}

function write_rec_action(action, takeCont, ver){
  db.collection("VehiclesTest").doc("Vehicle1").collection("commands").doc("command").set({
    action: action,
    takeControl: takeCont,
    verifyDiagnose: ver
  })
  .then(() => {
      console.log("Document successfully written!");
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  });
}

function write_comment(comment, sender, time){
  db.collection("VehiclesTest").doc("Vehicle1").collection("vehicleinfo").doc("comments").update({
    comments: firebase.firestore.FieldValue.arrayUnion({
      comment: comment,
      sender: sender,
      time: time
    })
  })
  .then(() => {
      console.log("Document successfully written!");
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  });
}
