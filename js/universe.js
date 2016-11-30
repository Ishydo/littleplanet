/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the model view (mvMatrix) and for the projection (pMatrix)
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

//Creation of a global array to store the objectfs drawn in the scene
var sceneObjects = [];
//Creation of a global array to store the orbits between planets
var orbits = [];

// Fonction de changement de subdivisions
function changeSubdivision(value){
	// Ici on change pour tous les objets, on pourrait ne changer que pour la terra
	for(var i = 0;i<sceneObjects.length;i++)
	{
		sceneObjects[i].subdivision = value;
	}
}

document.getElementById("poly-precision").addEventListener("change", function(){changeSubdivision(this.value)})

//Projection type handling, the projection variable defines whether the projection should use perspective or be orthogonal
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

	//Sending the new projection matrix to the shaders
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
}

//Initialisation of the shader parameters, this very important method creates the links between the javascript and the shader.
function initShaderParameters(prg)
{
	//Linking of the attribute "vertex position"
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
	//Linking of the attribute "color"
	prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
	glContext.enableVertexAttribArray(prg.colorAttribute);
	//Linking of the uniform [mat4] for the projection matrix
	prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	//Linking of the uniform [mat4] for the movement matrix
	prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');
}


//Initialisation of the scene
function initScene()
{
	//Creation of the earth instance
  var planet = new Planet("Earth", 0.4, {r:0.1,g:1.0,b:0.0}, document.getElementById("poly-precision").value , 0.0, 0.0, -1.5);

	// Ajout de la terre dans les objets de scène
	sceneObjects.push(planet);

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
	changeProjection();

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
	//Initialisation of the programme
    initProgram();
	//Initialisation of the scene
    initScene();
}
