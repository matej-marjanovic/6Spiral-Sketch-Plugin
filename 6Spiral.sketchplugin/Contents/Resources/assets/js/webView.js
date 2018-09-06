
// Commented out so that it's possible to Right Click -> Inspect Element.
// Disable the context menu
// document.addEventListener("contextmenu", function(e) {
//   e.preventDefault();
// });

var innerR = document.getElementById('InnerRadius');
var outerR = document.getElementById('OuterRadius');
var degrees = document.getElementById('Degrees');
var rotations = document.getElementById('Rotations');
var points = document.getElementById('Points');
var lineWidth = document.getElementById('lineWidth');
var degreeIncrementLabel = document.getElementById('DegreeIncrementLabel');
var spiralGapLabel = document.getElementById('SpiralGapLabel');

var continouslyUpdateCheckbox = document.getElementById('continouslyUpdateCheckbox');
var updateSpiralButton = document.getElementById('spiral-button-1');

var shouldMakeHelixCheckbox = document.getElementById('helixCheckbox');
var helixOffsetX = document.getElementById('xOffset');
var helixOffsetY = document.getElementById('yOffset');
var helixHWRatio = document.getElementById('helixHWRatio');
var helixIsoAngle = document.getElementById('helixIsoAngle');

window.onload = function() {
  updateSpiral();
};

innerR.addEventListener('input', function (evt) {
  setSpiralGapLabel();
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});

outerR.addEventListener('input', function (evt) {
  setSpiralGapLabel();
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});

rotations.addEventListener('input', function (evt) {
  console.log(this.value);
  degrees.value = this.value*360;
  setDegreeIncrementLabel();
  setSpiralGapLabel();
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});

degrees.addEventListener('input', function (evt) {
  console.log(this.value);
  rotations.value = this.value/360;
  setDegreeIncrementLabel();
  setSpiralGapLabel();
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});

points.addEventListener('input', function (evt) {
  console.log(this.value);
  setDegreeIncrementLabel();
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});

lineWidth.addEventListener('input', function (evt) {
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});

continouslyUpdateCheckbox.addEventListener('click', function (evt) {
  if(continouslyUpdateCheckbox.checked) {
    updateSpiralButton.disabled = true;
    updateSpiralButton.classList.add("disabled");
    console.log("Button disabled");
  } else {
    updateSpiralButton.disabled = false;
    updateSpiralButton.classList.remove("disabled");
    console.log("Button enabled");
  }
});

updateSpiralButton.addEventListener('click',function(){
  console.log('SPIRAL DEBUG // Spiral Button Clicked');
  updateSpiral();
  return false;
});

shouldMakeHelixCheckbox.addEventListener('click', function (evt) {
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});

helixOffsetX.addEventListener('input', function (evt) {
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});

helixOffsetY.addEventListener('input', function (evt) {
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});

helixHWRatio.addEventListener('input', function (evt) {
  console.log(this.value);
  helixIsoAngle.value = ((Math.acos(this.value))*(180 / Math.PI)).toFixed(1);
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});

helixIsoAngle.addEventListener('input', function (evt) {
  console.log(this.value);
  helixHWRatio.value = Math.cos(this.value * (Math.PI / 180)).toFixed(3);
  if(continouslyUpdateCheckbox.checked) {
    updateSpiral();
  }
});


function setDegreeIncrementLabel() {
  var degreeIncrement = degrees.value/(Math.floor(points.value));
  degreeIncrementLabel.innerHTML = "Point every " + degreeIncrement.toFixed(2) + " degrees";
}

function setSpiralGapLabel() {
  var spiralGap = Math.abs(outerR.value - innerR.value) / rotations.value;
  spiralGapLabel.innerHTML = "Gap of " + spiralGap.toFixed(2) + " after each rotation of the spiral";
}

function updateSpiral() {
  // Create JSON object with the action we want to trigger and the current UNIX date
  var data = {
    "spiral": "Archimedean Spiral",
    "innerRadius": Math.round(innerR.value),
    "outerRadius": Math.round(outerR.value),
    "degrees": Math.round(degrees.value),
    "points": Math.round(points.value),
    "lineWidth": lineWidth.value,
    "shouldMakeHelix": shouldMakeHelixCheckbox.checked,
    "helixOffsetX": helixOffsetX.value,
    "helixOffsetY": helixOffsetY.value,
    "helixHWRatio": helixHWRatio.value,
    "date": new Date().getTime()
  }
  console.log(data);
  // Put the JSON as a string in the hash
  window.location.hash = JSON.stringify(data);
}
