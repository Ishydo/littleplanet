
// Resizing canvas
function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = document.getElementById("canvas-zone").offsetWidth;
  var displayHeight = document.getElementById("canvas-zone").offsetHeight;

  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

// Display your projection and model view Matrixes
function displayMatrix(matrix){
  console.log("Your Matrix is as following : ");
  var i
  for(i = 0; i <= 4; i++){
    console.log('' + matrix[i].toFixed(2) + '\t' + matrix[i+4].toFixed(2) + '\t' + matrix[i+2*4].toFixed(2) + '\t' + matrix[i+3*4-1].toFixed(2))
  }
  console.log("------------ \nColumn 1 : X Rotation Vector \nColumn 2 : Y Rotation Vector \nColumn 3 : Z Rotation Vector \nColumn 4 : Translation Vector")
}

// Debug infos update for a visuel feedback on some changes
function updateDebugInfos(){

    var universeReference = ["Lightroom", "Galaxy", "All Black", "Blue Sky", "Grandma's Sky"];
    var ambianceReference = ["Earth Like", "Desert", "Oceanic", "Forest", "Random"];

    var universeID = document.getElementById('universe').value;
    var ambianceID = document.getElementById('ambiance').value;

    console.log(universeReference[universeID]);
    console.log(ambianceReference[ambianceID]);

    document.getElementById('debug-infos').innerHTML = "> Universe : " + universeReference[universeID]
}
