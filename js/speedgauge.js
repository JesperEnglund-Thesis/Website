var defaultProperty = {
  myVal               : 20,
  maxVal              : 180,         /**Max value of the meter*/
  divFact             : 10,          /**Division value of the meter*/
  dangerLevel         : 120,         /**more than this level, color will be red*/
  initDeg             : -45,         /**reading begins angle*/
  maxDeg              : 270,         /**total angle of the meter reading*/
  edgeRadius          : 150,         /**radius of the meter circle*/
  speedIndicatorH          : 3,           /**speed Indicator height*/
  speedoIndicatorW         : 90,          /**speed Indicator width*/
  speedoIndicatorL         : 12,          /**speed Indicator left position*/
  speedPositionTxtWH  : 80,          /**speedo-meter current value cont*/
  noOfSmallDiv        : 2,           /**no of small div between main div*/
}

var speedInDeg,
noOfDev            = defaultProperty.maxVal/defaultProperty.divFact,
noPointsOnC        = defaultProperty.maxVal,
divDeg             = defaultProperty.maxDeg/noOfDev,
speedBgPosY,
speedoWH           = defaultProperty.edgeRadius*2,
speedIndicatorTop       = defaultProperty.edgeRadius - defaultProperty.speedIndicatorH/2,
speedIndicatorAngle     = defaultProperty.initDeg,
tempDiv       = '';

function setCssProperty(){
  var tempStyleVar = [
    '<style>',
      '#' + 'mySpeedIndicator' + ' .envelope{',
        'width  :'+ speedoWH + 'px;',
        'height :'+ speedoWH + 'px;',
      '}',
      '#' + 'mySpeedIndicator' + ' .speedIndicator{',
        'height            :'+ defaultProperty.speedIndicatorH + 'px;',
        'top               :'+ speedIndicatorTop + 'px;',
        'transform         :rotate('+speedIndicatorAngle+'deg);',
        '-webkit-transform :rotate('+speedIndicatorAngle+'deg);',
        '-moz-transform    :rotate('+speedIndicatorAngle+'deg);',
        '-o-transform      :rotate('+speedIndicatorAngle+'deg);',
      '}',
      '#' + 'mySpeedIndicator' + ' .speedIndicator div{',
        'width  :'+ defaultProperty.speedoIndicatorW + 'px;',
        'left :'+ defaultProperty.speedoIndicatorL + 'px;',
      '}',
    '</style>',
  ].join('');
  document.getElementById("mySpeedIndicator").insertAdjacentHTML('beforeend', tempStyleVar);
}

function createHtmlElements(){
  setCssProperty();
  createIndicator();
}

function createIndicator(){
  var speedIndicator = [
    '<div class="speedIndicator">',
      '<div></div>',
    '</div>'
  ].join('');

  document.getElementsByClassName("envelope")[0].insertAdjacentHTML('beforeend', speedIndicator);
}

function changePosition(speed){
  speed = speed*100
  if(speed > defaultProperty.maxVal){
    speed = defaultProperty.maxVal;
  }
  if(speed < 0 || isNaN(speed)){
    speed = 0;
  }
  speedInDeg = (defaultProperty.maxDeg/defaultProperty.maxVal)*speed + defaultProperty.initDeg;

  $(document).ready(function(){
    $('.envelope').find(".speedIndicator").css({
      "-webkit-transform" :'rotate('+speedInDeg+'deg)',
      "-webkit-transform" :'rotate('+speedInDeg+'deg)',
      "-moz-transform"    :'rotate('+speedInDeg+'deg)',
      "-o-transform"      :'rotate('+speedInDeg+'deg)'
    });
  });
}


this.createHtmlElements();
