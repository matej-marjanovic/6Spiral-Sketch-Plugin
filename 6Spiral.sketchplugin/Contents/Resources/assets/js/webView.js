
// Commented out so that it's possible to Right Click -> Inspect Element.
// Disable the context menu
// document.addEventListener("contextmenu", function(e) {
//   e.preventDefault();
// });

var innerR = document.getElementById('InnerRadius');
var outerR = document.getElementById('OuterRadius');
var degrees = document.getElementById('Degrees');
var revolutions = document.getElementById('Revolutions');
var points = document.getElementById('Points');
var degreeIncrementLabel = document.getElementById('DegreeIncrementLabel');
var spiralGapLabel = document.getElementById('SpiralGapLabel');

innerR.addEventListener('input', function (evt) {
  setSpiralGapLabel();
});

outerR.addEventListener('input', function (evt) {
  setSpiralGapLabel();
});

revolutions.addEventListener('input', function (evt) {
  console.log(this.value);
  degrees.value = this.value*360;
  setDegreeIncrementLabel();
  setSpiralGapLabel();
});

degrees.addEventListener('input', function (evt) {
  console.log(this.value);
  revolutions.value = this.value/360;
  setDegreeIncrementLabel();
});

points.addEventListener('input', function (evt) {
  console.log(this.value);
  setDegreeIncrementLabel();
});

function setDegreeIncrementLabel() {
  var degreeIncrement = degrees.value/(Math.floor(points.value));
  degreeIncrementLabel.innerHTML = "Point every " + degreeIncrement.toFixed(2) + " degrees";
}

function setSpiralGapLabel() {
  var spiralGap = Math.abs(outerR.value - innerR.value) / revolutions.value;
  spiralGapLabel.innerHTML = "Gap of " + spiralGap.toFixed(2) + " after each rotation of the spiral";
}

document.getElementById('spiral-button-1').addEventListener('click',function(){
  console.log('SPIRAL DEBUG // Spiral Button Clicked');
  // Create JSON object with the action we want to trigger and the current UNIX date
  var data = {
    "spiral": "Archimedean Spiral",
    "innerRadius": Math.round(innerR.value),
    "outerRadius": Math.round(outerR.value),
    "degrees": Math.round(degrees.value),
    "points": Math.round(points.value),
    "date": new Date().getTime()
  }
  console.log(data);
  console.log(JSON.stringify(data));
  // Put the JSON as a string in the hash
  window.location.hash = JSON.stringify(data);
  return false;
});
