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
  else {
    return [17.0, 59.0];
  }
}

function setVehicle1CurrentData(fbData){
  trucks[0].speed = fbData.speed;
  trucks[0].origText = fbData.route[0];
  trucks[0].destText = fbData.route[1];
  trucks[0].currLegText = fbData.localroute;
  trucks[0].currLeg[0] = getCurrLegCoords(fbData.localroute[0]);
  trucks[0].currLeg[1] = getCurrLegCoords(fbData.localroute[1]);
  trucks[0].downtime = fbData.totalDowntimeApprox;
  trucks[0].pos = trucks[0].currLeg[0];
  trucks[0].rotation = getRotation(trucks[0].currLeg[1], trucks[0].currLeg[0])
  if (activePage == 'vehicleDetails'){
    var element = document.getElementById("vehicleDetails");
    loadDetails(element, 0);
    loadInfo(0);
  }
  else if (activePage == 'vehicles') {
      loadPopup(0);
      updateVehicleMap(0);
  }
  //changePosition(fbData.speed);
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
  updateSymptomsList(0);
  if (activePage == 'vehicleDetails'){
    var element = document.getElementById("vehicleDetails");
    loadDetails(element, 0);
  }
  else if (activePage == 'vehicles') {
      loadPopup(0);
  }
}

db.collection("VehiclesTest").doc("Vehicle1").collection("vehicleLog").get()
  .then(querySnapshot => {
    querySnapshot.docs.map(doc => {
      setVehicle1LogData(doc.data());
    });
  });

function setVehicle1LogData(fbData){
  trucks[0].log.push(fbData);
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
  trucks[0].diagnosis.diagnose = fbData.dia[0].diagnose;
  trucks[0].diagnosis.likelihood = fbData.dia[0].likelyhood;
  trucks[0].diagnosis.prognoses = fbData.dia[0].prognoses;
  if (activePage == 'vehicleDetails'){
    loadDiagnose(0);
  }
}

function write_rec_action(action, giveCont, takeCont, ver){
  db.collection("VehiclesTest").doc("Vehicle1").collection("commands").doc("command").set({
    action: action,
    giveBackControl: giveCont,
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

/*

function write_rec_action(action){
  db.collection("Vehicle").doc("CT_data").set({
    action_rec: action,
    ct_release_from_stand_down: false,
    ct_req_control: false,
    fault_correction: "No fault",
    ct_ver: false
  })
  .then(() => {
      console.log("Document successfully written!");
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  });
}
*/
