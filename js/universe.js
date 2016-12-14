
// Les deux matrices pour le model view et la projection
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

// Le tableau qui contient les objets de la scène
var sceneObjects = [];

//Creation of a global array to store the orbits between planets
//var orbits = [];


// Fonction d'update d'une valeur
function updateValue(value, index, field){
	sceneObjects[index][field] = value; // On update la planète (index 0 et sa propriété)
}

// On bind les changements de formulaire avec la fonction d'update
// TODO: is it possible to force update each step?
document.getElementById("poly-precision").addEventListener("change", function(){updateValue(this.value, 0, "subdivision")})
document.getElementById("general-radius").addEventListener("change", function(){updateValue(this.value, 0, "radius")})
document.getElementById("water-radius").addEventListener("change", function(){updateValue(this.value, 1, "radius")})
document.getElementById("atmosphere-radius").addEventListener("change", function(){updateValue(this.value, 2, "radius")})


//Projection type handling, the projection variable defines whether the projection should use perspective or be orthogonal
/*
var projection = 1;
function changeProjection(){
	if(projection)
	{
		//setting the projection in perspective
		mat4.perspective(pMatrix, degToRad(40), c_width / c_height, 1, 1000.0);
		projection = 0;
	}
	else
	{
		//setting the projection in orthogonal
		mat4.ortho(pMatrix, -1.2, 1.2, -1.2, 1.2, 1, 10);
		projection = 1;
	}

	// Miss line

}
*/

//Initialisation of the shader parameters, this very important method creates the links between the javascript and the shader.
function initShaderParameters(prg)
{

	// Lien pour l'attribut des position de vertices aVertexPosition
  prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

	// Lien pour l'attribut des couleurs
	prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
	glContext.enableVertexAttribArray(prg.colorAttribute);

	// Lien pour la matrice de projection uniforme
	prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');

	// Lien pour la matrice de mouvement uniforme
	prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');

	// Lien pour la matrice normale uniforme
	prg.nMatrixUniform = glContext.getUniformLocation(prg, 'uNMatrix');

	// Lien pour le radius
	//prg.radius = glContext.getUniformLocation(prg, 'radius');


	// Utilisé pour la rotation
  //prg.rotation = glContext.getUniformLocation(prg, 'rotation');

	// Utilisé pour l'inclinaison de la terre (slightly move the y axis of the model)
  //prg.inclination = glContext.getUniformLocation(prg, 'inclination');

	// Utilisé pour le rendu de normale Boolean to enable the normal rendering
	//prg.normal = glContext.getUniformLocation(prg, 'uBoolNormal');

}


//Initialisation of the scene
function initScene()
{
	// Création des objets de la scène
  var earth = new Planet("Earth", 0.4, {r:0.1,g:1.0,b:0.0}, document.getElementById("poly-precision").value , 0.0, 0.0, -1.5);
	var water = new Planet("Water", 0.3, {r:0.1,g:0.1,b:1.0}, 2, 0.0, 0.0, -1.5);
	var atmosphere = new Planet("Atmoshpere", 0.6, {r:1.0,g:1.0,b:1.0}, 2, 0.0, 0.0, -1.5)

	// Ajout des éléments dans les objets de scène
	sceneObjects.push(earth);				// La terre
	sceneObjects.push(water);				// L'eau
	sceneObjects.push(atmosphere);	// L'atmosphère

	//Enabling the depth test
	glContext.enable(glContext.DEPTH_TEST);

	// Color of the canvas background
	glContext.clearColor(0.9, 0.9, 0.9, 1.0);

	//Setting the projection matrix as an identity matrix
	mat4.identity(pMatrix);

	// Mise à jour automatique de la taille du canvas
	resize(glContext.canvas)

	// Définition du viewport selon la taille du canvas
	glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);

	// Mise à jour de la projection
	//changeProjection();

	// Envoi de la matrice de projection aux shaders
	mat4.perspective(pMatrix, degToRad(40), c_width / c_height, 1, 1000.0);
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);

	//Starts the renderloop
	renderLoop();
}

function drawScene()
{

	// Mise à jour de la taille du canvas
  resize(glContext.canvas);

	// Nettoyage du dernier rendu
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

	// Clear la matrice
	mat4.identity(mvMatrix);

	//Handling the mouse rotation on the scene
	//rotateModelViewMatrixUsingQuaternion();

	// Dessin de chaque objet de la scène
	for(var i= 0;i<sceneObjects.length;i++)
	{
		sceneObjects[i].draw(mvMatrix);
	}
}

//Initialisation of the webgl context
function initWebGL()
{
    //Initilisation on the canvas "webgl-canvas"
    glContext = getGLContext('canvas-universe');

		// Initialisation du programme
    initProgram();

		// Initialisation de la scène
    initScene();
}
