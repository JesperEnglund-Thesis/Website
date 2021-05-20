var defaultProperty = {
  myVal               : 20,
  maxVal              : 180,         /**Max value of the meter*/
  divFact             : 10,          /**Division value of the meter*/
  dangerLevel         : 120,         /**more than this level, color will be red*/
  initDeg             : -45,         /**reading begins angle*/
  maxDeg              : 270,         /**total angle of the meter reading*/
  edgeRadius          : 150,         /**radius of the meter circle*/
  speedNobeH          : 3,           /**speed nobe height*/
  speedoNobeW         : 90,          /**speed nobe width*/
  speedoNobeL         : 12,          /**speed nobe left position*/
  speedPositionTxtWH  : 80,          /**speedo-meter current value cont*/
  noOfSmallDiv        : 2,           /**no of small div between main div*/
}

var speedInDeg,
noOfDev            = defaultProperty.maxVal/defaultProperty.divFact,
noPointsOnC        = defaultProperty.maxVal,
divDeg             = defaultProperty.maxDeg/noOfDev,
speedBgPosY,
speedoWH           = defaultProperty.edgeRadius*2,
speedNobeTop       = defaultProperty.edgeRadius - defaultProperty.speedNobeH/2,
speedNobeAngle     = defaultProperty.initDeg,
tempDiv       = '';

function setCssProperty(){
  var tempStyleVar = [
    '<style>',
      '#' + 'mySpeedNobe' + ' .envelope{',
        'width  :'+ speedoWH + 'px;',
        'height :'+ speedoWH + 'px;',
      '}',
      '#' + 'mySpeedNobe' + ' .speedNobe{',
        'height            :'+ defaultProperty.speedNobeH + 'px;',
        'top               :'+ speedNobeTop + 'px;',
        'transform         :rotate('+speedNobeAngle+'deg);',
        '-webkit-transform :rotate('+speedNobeAngle+'deg);',
        '-moz-transform    :rotate('+speedNobeAngle+'deg);',
        '-o-transform      :rotate('+speedNobeAngle+'deg);',
      '}',
      '#' + 'mySpeedNobe' + ' .speedNobe div{',
        'width  :'+ defaultProperty.speedoNobeW + 'px;',
        'left :'+ defaultProperty.speedoNobeL + 'px;',
      '}',
    '</style>',
  ].join('');
  document.getElementById("mySpeedNobe").insertAdjacentHTML('beforeend', tempStyleVar);
  //document.getElementById("mySpeedNobe").append(tempStyleVar);
}

function createHtmlElements(){
  setCssProperty();
  createNobe();
}

function createNobe(){
  //document.getElementById("mySpeedNobe").append('<div class="envelope">');

  var speedNobe = [
    '<div class="speedNobe">',
      '<div></div>',
    '</div>'
  ].join('');

  document.getElementsByClassName("envelope")[0].insertAdjacentHTML('beforeend', speedNobe);
}

function changePosition(speed){
  if(speed > defaultProperty.maxVal){
    speed = defaultProperty.maxVal;
  }
  if(speed < 0 || isNaN(speed)){
    speed = 0;
  }
  speedInDeg = (defaultProperty.maxDeg/defaultProperty.maxVal)*speed + defaultProperty.initDeg;

  $(document).ready(function(){
    $('.envelope').find(".speedNobe").css({
      "-webkit-transform" :'rotate('+speedInDeg+'deg)',
      "-webkit-transform" :'rotate('+speedInDeg+'deg)',
      "-moz-transform"    :'rotate('+speedInDeg+'deg)',
      "-o-transform"      :'rotate('+speedInDeg+'deg)'
    });
  });
}


this.createHtmlElements();
