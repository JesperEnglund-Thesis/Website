//Actions list
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

//List of tests
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


//Display general information about vehicle (top left element of dashboard)
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

//Display symptoms on specific vehicle
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

//Add actions to the actions component
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
    listItem.addEventListener('click', () => write_rec_action(myaction, takeCont, verify), false);
    actionsElem.appendChild(listItem);
  }
}

//display tests modal when a test is clicked
function dispTestsModal(vid, test){
  let testsModal = document.getElementById('testsModal');
  loadTests(vid, 'testLists');
  dispTest(test);
  testsModal.style.display='block';
}

//Display the image corresponding to the clicked test
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

//Fill tests component with tests
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

//Translate and display diagnose information about a specific vehicle.
//Only the diagnoses No fault, Air leakage, Worn bearings & Engaged brakes are considered.
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

//Display log of specific vehicle
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

//Send comment (write to dattabase), sender Jesper Englund is hardcoded
function sendComment(comment){
  if (comment != ""){
    var time = new Date().toLocaleString();
    write_comment(comment, "Jesper Englund", time);
  }
  else {
    console.log("Write some text to add a comment");
  }
}

//Display comments on specific vehicle
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

//Display the symptoms modal of a specific vehicle.
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

//Display general info modal on specific vehicle. Show popup and route immediately.
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
