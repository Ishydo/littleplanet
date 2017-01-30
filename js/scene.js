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


//Change division slider handler, allows for more vertical slices
function changeSubdivision(elem){
	sceneObjects[0].subdivision = elem.value;

}

function changeRadiusEarth(elem){
	sceneObjects[0].radius = elem.value;
}

function changeRadiusMoon(elem){
	sceneObjects[1].radius = elem.value;
}


//Projection type handling, the projection variable defines whether the projection should use perspective or be orthogonal
var projection = 1;
function changeProjection(){
	if(projection)
	{
		//setting the projection in perspective
		mat4.perspective(pMatrix, degToRad(45.0), document.getElementById("gl-container").offsetWidth / document.getElementById("gl-container").offsetHeight, 0.1, 1000.0);
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
	//Linking of the attribute "textureCoord"
	prg.textureCoordsAttribute  = glContext.getAttribLocation(prg, "aTextureCoord");
	glContext.enableVertexAttribArray(prg.textureCoordsAttribute);
	//Linking a pointer for the color texture
	prg.colorTextureUniform     = glContext.getUniformLocation(prg, "uColorTexture");
	//Linking of the uniform [mat4] for the projection matrix
	prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	//Linking of the uniform [mat4] for the movement matrix
	prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');
	//Linking of the uniform [mat4] for the normal matrix
	prg.nMatrixUniform          = glContext.getUniformLocation(prg, 'uNMatrix');
	//Used to define the radius of the planet on the render
	prg.radius                  = glContext.getUniformLocation(prg, 'radius');
	//Used to rotate the model on itself
	prg.rotation                = glContext.getUniformLocation(prg, 'rotation');
	//Used to inclinate the earth (slightly move the y axis of the model)
	prg.inclination             = glContext.getUniformLocation(prg, 'inclination');
	//Boolean to enable the light rendering

	prg.normal                = glContext.getUniformLocation(prg, 'uBoolNormal');
	prg.uPerlinNoise          = glContext.getUniformLocation(prg, 'uPerlinNoise');
	prg.uGenerated            = glContext.getUniformLocation(prg, 'uGenerated');

	// Perlin 2 params
	prg.uHighFrequencyTurbulence  = glContext.getUniformLocation(prg, 'uHighFrequencyTurbulence');
	prg.uLowFrequencyTurbulence   = glContext.getUniformLocation(prg, 'uLowFrequencyTurbulence');
}



//Initialisation of the scene
function initScene()
{
	//Loading of textures
	var earthTextureTab = [];
	var waterTextureTab = [];
	var cloudTextureTab = [];

	///Please open the WebglTools.js to see what initTextureWithImage does ! It is a basic procedure to load texture on the GPU
	initTextureWithImage("ressources/green1.jpg", earthTextureTab); //Loads the colorTexture [0]
	initTextureWithImage("ressources/blue1.jpg", waterTextureTab); //Loads the colorTexture [0]
	initTextureWithImage("ressources/asteroid.jpg", cloudTextureTab); //Loads the colorTexture [0]

	// Récupération des données
	var mainRadius = $("#main-sphere-radius").val()
	var mainSub = $("#main-sphere-subdivision").val()

	// Récupération des données
	var secRadius = $("#second-sphere-radius").val()
	var secSub = $("#second-sphere-subdivision").val()

	//Creation of the earth instance
	var mainSphere = new Planet("Earth", mainRadius, mainSub, 1.0, 0.0,0.0,-8.0, earthTextureTab[0], 0);
	var secondarySphere = new Planet("Water", secRadius, secSub, 0.0, 0.0,0.0,-8.0, waterTextureTab[0], 0);

	var satellite1 = new Planet("Cloud", 0.2, 2, 1.0, 0.0,0.0,-8.0, cloudTextureTab[0], 0);
	var satellite2 = new Planet("Cloud", 0.2, 2, 1.0, 0.0,0.0,-8.0, cloudTextureTab[0], 0);
	var satellite3 = new Planet("Cloud", 0.2, 2, 1.0, 0.0,0.0,-8.0, cloudTextureTab[0], 0);

	sceneObjects.push(mainSphere);
	sceneObjects.push(secondarySphere);
	sceneObjects.push(satellite1);
	sceneObjects.push(satellite2);
	sceneObjects.push(satellite3);


	//Creation of the earth-moon orbit with earth as the anchor
	var satelliteOrbit1 = new Orbit(mainSphere, satellite1, mainRadius*1.1 + 2.0, 0.996, 2);
	var satelliteOrbit2 = new Orbit(mainSphere, satellite2, mainRadius*1.1 + 2.0, 0.997, +.2);
	var satelliteOrbit3 = new Orbit(mainSphere, satellite3, mainRadius*1.1 + 2.0, 0.998, -2.3);

	orbits.push(satelliteOrbit1);
	orbits.push(satelliteOrbit2);
	orbits.push(satelliteOrbit3);

	// TODO: Clean way to get universal canvas
	glContext.canvas.width = document.getElementById("gl-container").offsetWidth;
	glContext.canvas.height = document.getElementById("gl-container").offsetHeight;

	//Enabling the depth test
	glContext.enable(glContext.DEPTH_TEST);

	//Setting the projection matrix as an identity matrix
	mat4.identity(pMatrix);

	//Defining the viewport as the size of the canvas
	glContext.viewport(0.0, 0.0, glContext.canvas.width, glContext.canvas.height);

	//Calling the projection change method and setting it as orthogonal by default
	changeProjection();

	//Starts the renderloop
	renderLoop();
}

function drawScene()
{
	//Clearing the previous render based on co
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

	//Making the orbit "tick" to make it move
	for(var i = 0;i<orbits.length; i++)
	{
		orbits[i].tick();
	}

	var looplength = 1;

	if(document.getElementById("satellites_mode").classList.contains("active")){
		looplength = 4;
	}

	//Calling draw for each object in our scene
	for(var i= 0;i<=looplength;i++)
	{
		//Calling draw on the object with the model view matrix as parameter
		sceneObjects[i].draw(mvMatrix);
	}

	//Reseting the mvMatrix
	mat4.identity(mvMatrix);

	//Handling the mouse rotation on the scene
	rotateModelViewMatrixUsingQuaternion();

}

//Initialisation of the webgl context
function initWebGL()
{
	//Initilisation on the canvas "webgl-canvas"
	glContext = getGLContext('webgl-canvas');
	//Initialisation of the programme
	initProgram();
	//Initialisation of the scene
	initScene();

}

// Fonction d'update d'une valeur
function updateValue(value, index, field){
	sceneObjects[index][field] = value;
}

function updateTexture(value, index){
	var newTextureTab = [];
	///Please open the WebglTools.js to see what initTextureWithImage does ! It is a basic procedure to load texture on the GPU
	initTextureWithImage("ressources/" + value + ".jpg", newTextureTab); //Loads the colorTexture [0]

	if(index < 2){
		sceneObjects[index].colorTexture = newTextureTab[0];
	}else{
		for(var i = index; i <= 4; i++){
			sceneObjects[i].colorTexture = newTextureTab[0];
		}

	}

}

/**
* Fonction de sauvegarde de l'état de la planète dans le localstorage
*/
function saveState(){

	// On clear le localstorage
	localStorage.clear();

	// On stocke toute la config
	localStorage.bg = $("#universe").val()
	localStorage.pn_hf = $("#perlin-hf-turb").val()
	localStorage.pn_lf = $("#perlin-lf-turb").val()
	localStorage.sat_mode = $("#satellites_mode").hasClass("active");
	localStorage.sat_tex = $("#sat-tex").val()
	localStorage.wire_mode = $("#wireframe_mode").hasClass("active");
	localStorage.s1_tex = $("#main-texture").val();
	localStorage.s1_sub = $("#main-sphere-subdivision").val();
	localStorage.s1_rad = $("#main-sphere-radius").val();
	localStorage.s1_x_off = $("#main-sphere-x-offset").val();
	localStorage.s1_y_off = $("#main-sphere-y-offset").val();

	localStorage.s2_tex = $("#second-texture").val();;
	localStorage.s2_sub = $("#second-sphere-subdivision").val();
	localStorage.s2_rad = $("#second-sphere-radius").val();
	localStorage.s2_x_off = $("#second-sphere-x-offset").val();
	localStorage.s2_y_off = $("#second-sphere-y-offset").val();
}
