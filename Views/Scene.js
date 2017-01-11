/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the location of the scene (mvMatrix) and for the projection (pMatrix)
var pMatrix = mat4.create();
var fullTimeMilliseconds;

//Initialisation of the scene
function Scene_initScene() {
	fullTimeMilliseconds = 0;

	glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
	glContext.enable(glContext.DEPTH_TEST);
	//glContext.clearColor(0.8, 0.8, 0.8, 1.0);

	mat4.perspective(pMatrix, GLTools_degToRad(45), c_width / c_height, 0.1, 10000);
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);

	var updater = new SphereInterface();
	var toDraw = Controller_getDrawables();
	for(var i = 0; i < toDraw.length; i++) {
		updater.create(toDraw[i]);
		updater.update(toDraw[i]);
	}
}

function Scene_drawScene() {
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	var absoluteMatrix = mainCamera.update();

	var toDraw = Controller_getDrawables();
	for(var i = 0; i < toDraw.length; i++) {
		toDraw[i].draw(absoluteMatrix);
	}
}

function Scene_updateScene(deltaTime) {
	fullTimeMilliseconds += deltaTime;
	var fullTimeSeconds = fullTimeMilliseconds / 1000;
	glContext.uniform1f(prg.uDeltaTime, deltaTime);
	glContext.uniform1f(prg.uFullTime, fullTimeSeconds);

	var updater = new SphereInterface();
	var toDraw = Controller_getDrawables();
	for(var i = 0; i < toDraw.length; i++) {
		//updater.create(toDraw[i]); //If need update on vertices
		updater.update(toDraw[i]);
	}
}



// Fonction d'update d'une valeur
function updateValue(value, index, field){
	allDrawables[index][field] = value; // On update la planète (index 0 et sa propriété)
	console.log("Update planete valeur " + allDrawables[index][field]);

	var updater = new SphereInterface();
	var toDraw = Controller_getDrawables();
	updater.create(toDraw[index])
}

// Enregistrement des interactions
document.getElementById("poly-precision").addEventListener("change", function(){updateValue(this.value, 0, "divisions")})
document.getElementById("general-radius").addEventListener("change", function(){updateValue(this.value, 0, "radius")})
document.getElementById("water-radius").addEventListener("change", function(){updateValue(this.value, 1, "radius")})
document.getElementById("atmosphere-radius").addEventListener("change", function(){updateValue(this.value, 2, "radius")})
