var canvasName = 'webgl-canvas';
var myCanvas;
var mainCamera = new Camera({pos: vec3.fromValues(.1, 0, 3), front: vec3.fromValues(0.1, 0, -1)});
var glContext = null;
var prg = null;
var allShaderNames = [
  "shader-fs",
  "shader-vs"
];

var allDrawables = [];
function Controller_getDrawables() {return allDrawables}

$(function () {
  try {
    m_initProgram();
    m_initDrawables();
    Scene_initScene();
    m_initEventHandling();

    GLTools_logicLoop();
    GLTools_renderLoop();
  }
  catch (e) {
    console.error(e);
  }
});


function m_initDrawables() {
  //allDrawables.push(new Quad({width: 1, height: 1, r: 0.0, g: 0.5, b: 1.0}));
  allDrawables.push(new Sphere({r: 0.0, g: 0.5, b: 0.1}));  // Earth
  //allDrawables.push(new Sphere({r: 0.0, g: 0.0, b: 1.0}));  // Water
  //allDrawables.push(new Sphere({r: 1.0, g: 1.0, b: 1.0, radius: 10}));  // Atmosphere
}

function m_initEventHandling() {
  myCanvas.on("mousedown", MouseHandling_handleMouseDown);
  $(window).on("mouseup",  MouseHandling_handleMouseUp);
  $(window).on("mousemove",  MouseHandling_handleMouseMove);
}

/**
* The program contains a series of instructions that tell the Graphic Processing Unit (GPU)
* what to do with every vertex and fragment that we transmit.
* The vertex shader and the fragment shaders together are called through that program.
*/
function m_initProgram() {
  myCanvas = $('#' + canvasName);

  glContext = GLTools_getGLContext(canvasName);

  glContext.canvas.width = window.innerWidth;
  glContext.canvas.height = window.innerHeight;

  prg = glContext.createProgram();

  for(var i = 0; i < allShaderNames.length; i++) {
    glContext.attachShader(prg, GLTools_initShader(allShaderNames[i], glContext));
  }

  glContext.linkProgram(prg);

  if (!glContext.getProgramParameter(prg, glContext.LINK_STATUS)) throw("Error m_initProgram - couldn't initialize shaders");
  glContext.useProgram(prg);

  m_initShaderParameters(prg);
}

/**
* Initialisation of the shader parameters, this very important method creates the link between the javascript and the shader.
*/
function m_initShaderParameters(prg) {
  prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
  glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

  prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
  glContext.enableVertexAttribArray(prg.colorAttribute);

  // 2 lines ftl
  prg.vertexNormalAttribute = glContext.getAttribLocation(prg, "aVertexNormal");
  glContext.enableVertexAttribArray(prg.vertexNormalAttribute);

  prg.pMatrixUniform         = glContext.getUniformLocation(prg, 'uPMatrix');
  prg.mvMatrixUniform        = glContext.getUniformLocation(prg, 'uMVMatrix');
  prg.nMatrixUniform         = glContext.getUniformLocation(prg, 'uNMatrix');

  prg.uDeltaTime              = glContext.getUniformLocation(prg, 'uDeltaTime');
  prg.uFullTime               = glContext.getUniformLocation(prg, 'uFullTime');
  prg.uLightningDirection               = glContext.getUniformLocation(prg, 'uLightningDirection');
  prg.uAmbientColor              = glContext.getUniformLocation(prg, 'uAmbientColor');
  prg.uDirectionalColor            = glContext.getUniformLocation(prg, 'uDirectionalColor');
  prg.uUseLightning              = glContext.getUniformLocation(prg, 'uUseLightning');
  prg.uCameraPosition         = glContext.getUniformLocation(prg, 'uCameraPosition');


  glContext.uniform3f(
        prg.uAmbientColor,
        parseFloat(document.getElementById("ambientR").value),
        parseFloat(document.getElementById("ambientG").value),
        parseFloat(document.getElementById("ambientB").value)
    );
    var lightingDirection = [
        parseFloat(document.getElementById("lightDirectionX").value),
        parseFloat(document.getElementById("lightDirectionY").value),
        parseFloat(document.getElementById("lightDirectionZ").value)
    ];
    /*var adjustedLD = vec3.create();
    vec3.normalize(lightingDirection, adjustedLD);
    vec3.scale(adjustedLD, -1);*/

    var adjustedLD = vec3.create();
    vec3.normalize(adjustedLD, lightingDirection);
    vec3.scale(adjustedLD, adjustedLD, -1);

    glContext.uniform3fv(prg.uLightningDirection, adjustedLD);
    glContext.uniform3f(
        prg.uDirectionalColor,
        parseFloat(document.getElementById("directionalR").value),
        parseFloat(document.getElementById("directionalG").value),
        parseFloat(document.getElementById("directionalB").value)
    );

}
