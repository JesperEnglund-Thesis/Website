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

let recActionDisp = document.getElementById("recActionDisp");
let rec_action_doc = document.createElement("p");
recActionDisp.appendChild(rec_action_doc);

var ct_data = {
  rec_action: "No Action",
  ct_release: false,
  ct_control: false,
  fault: "No fault",
  ct_ver: false
}

var vehicle1 = {
  symptoms: {

  },
  vehicleInfo: {
    vehicleHealth: {
      gsh: 0
    },
    generalInfo: {
      model: "Model",
      registration: "reg"
    },
    vehicleInfoCurrent: {
      distance: 0,
      distanceDriven: 0,
      route: ["Orig", "Dest"],
      speed: 0,
      totalDowntimeApprox: 0
    }
  }
}

//Read db data
var db = firebase.firestore();

db.collection("Vehicle").doc("CT_data")
    .onSnapshot(function(doc) {
        setCTdata(doc.data());
});

db.collection("VehiclesTest").doc("Vehicle1").collection("vehicleinfo").doc("vehicleInfoCurrent")
    .onSnapshot(function(doc) {
        setVehicle1CurrentData(doc.data());
});

function setVehicle1CurrentData(fbData){
  trucks[0].speed = fbData.speed;
  trucks[0].origText = fbData.route[0];
  trucks[0].destText = fbData.route[1];
}

db.collection("VehiclesTest").doc("Vehicle1").collection("vehicleinfo").doc("vehicleHealth")
    .onSnapshot(function(doc) {
        setVehicle1HealthData(doc.data());
});

function setVehicle1HealthData(fbData){
  trucks[0].gsh = fbData.gsh;
}

function setCTdata(fbData){
  ct_data.rec_action = fbData.action_rec;
  let action = ct_data.rec_action.toString();
  rec_action_doc.innerHTML = 'Recommended action: ' + action;
}

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
