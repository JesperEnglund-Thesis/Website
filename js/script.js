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

var myIndex = 0;
//carousel();

var slideIndex = 1;
//showDivs(slideIndex);

var $ = function( id ) { return document.getElementById( id ); };

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showContent(n){
  var sections = document.getElementsByClassName("mySection");
  for (i = 0; i < sections.length; i++) {
    if (i == n){
      sections[i].style.display = "block";
    }
    else{
      sections[i].style.display = "none";
    }
  }
}

function loadDetails(element, vid) {
  element.querySelector("#vVal").innerHTML = trucks[i].speed;
}

function openVehicle(vid){
  var sections = document.getElementsByClassName("mySection");
  for (i = 0; i < sections.length; i++) {
      if (sections[i].id == 'vehicleDetails'){
        var vDetails = sections[i];
        loadDetails(vDetails, vid);
        vDetails.style.display = "block";
      }
      else {
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
