var glContext = null;
var c_width = 0;
var c_height = 0;
var prg = null;
var refreshTimer;

function degToRad(degrees) {
    return (degrees * Math.PI / 180.0);
}

/**
 * Allow to initialize Shaders.
 */
function initShader(id) {
    var shader, str, script, shaderChild;
    script = document.getElementById(id);
    if (!script) throw new BadInitShaderException("can't find shader with id " + id);

    str = "";
    shaderChild = script.firstChild;
    while (shaderChild) {
        if (shaderChild.nodeType == 3) str += shaderChild.textContent;
        shaderChild = shaderChild.nextSibling;
    }

    if (script.type == "x-shader/x-fragment") shader = glContext.createShader(glContext.FRAGMENT_SHADER);
    else if (script.type == "x-shader/x-vertex") shader = glContext.createShader(glContext.VERTEX_SHADER);
    else throw new BadInitShaderException("Error initShader - shader type is neither vertex or shader, therefore incompatible");

    glContext.shaderSource(shader, str);
    glContext.compileShader(shader);

    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        throw new BadInitShaderException("Error initShader - shader doesn't compile. " + glContext.getShaderInfoLog(shader));
    }
    return shader;
}

/**
 * The program contains a series of instructions that tell the Graphic Processing Unit (GPU)
 * what to do with every vertex and fragment that we transmit.
 * The vertex shader and the fragment shaders together are called through that program.
 */
function initProgram() {
    var fgShader = initShader("shader-fs");
    var vxShader = initShader("shader-vs");

    prg = glContext.createProgram();
    glContext.attachShader(prg, vxShader);
    glContext.attachShader(prg, fgShader);
    glContext.linkProgram(prg);

    if (!glContext.getProgramParameter(prg, glContext.LINK_STATUS)) throw("Error initProgram - couldn't initialize shaders")
    glContext.useProgram(prg);

    initShaderParameters(prg);
}

function renderLoop() {
    drawScene();
    refreshTimer = requestAnimationFrame(renderLoop);
}

function stopRenderLoop() {
    cancelAnimationFrame(refreshTimer);
}

/**
 * Verify that WebGL is supported by your machine
 */
function getGLContext(canvasName) {
    var canvas, gl = null;
    var names = ["webgl",
        "experimental-webgl",
        "webkit-3d",
        "moz-webgl"
    ];

    canvas = document.getElementById(canvasName);
    if (!canvas) throw new NoGlContextException("No canvas found on the page with name " + canvasName);
    else {
        c_width = canvas.width;
        c_height = canvas.height;
    }

    var index = 0;
    while (!gl && index < names.length) {
        try {
            gl = canvas.getContext(names[index], {preserveDrawingBuffer: true}); // Modified to save as image
            gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, logAndValidate);
            /*** for transparency (Blending) ***
             gl = canvas.getContext(names[i], {premultipliedAlpha: false});
             gl.enable(gl.BLEND);
             gl.blendEquation(gl.FUNC_ADD);
             gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
             */
        } catch (e) {
            console.log(e);
        }
        finally{
            index++;
        }
    }

    if (!gl) throw new NoGlContextException("No context found on the page with canvas " + canvasName);
    return gl;
}

/**
 * The following code snippet creates a vertex buffer and binds the vertices to it.
 */
function getVertexBufferWithVertices(vertices) {
    var vBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);

    return vBuffer;
}

/**
 * The following code snippet creates a vertex buffer and binds the indices to it.
 */
function getIndexBufferWithIndices(indices) {
    var iBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, iBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);

    return iBuffer;
}

function getArrayBufferWithArray(values) {
    //The following code snippet creates an array buffer and binds the array values to it
    var vBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(values), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);

    return vBuffer;
}

function rnd(range) {
    return Math.floor(Math.random() * range);
}

/**
 * make it throw an exception.
 * @param sFilename
 * @param texture
 */

function initTextureWithImage(sFilename, texture) {
    var anz = texture.length;
    texture[anz] = glContext.createTexture();

    texture[anz].image = new Image();
    texture[anz].image.onload = function () {
        glContext.bindTexture(glContext.TEXTURE_2D, texture[anz]);
        glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, texture[anz].image);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);

        glContext.generateMipmap(glContext.TEXTURE_2D);

        glContext.bindTexture(glContext.TEXTURE_2D, null);
    };

    texture[anz].image.src = sFilename;

    // let's use a canvas to make textures, with by default a random color (red, green, blue)
    var c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    var ctx = c.getContext("2d");
    var red = rnd(256);
    var green = rnd(256);
    var blue = rnd(256);
    ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";

    ctx.fillRect(0, 0, 64, 64);

    glContext.bindTexture(glContext.TEXTURE_2D, texture[anz]);
    glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, c);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
}
