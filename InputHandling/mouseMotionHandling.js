/*******************************************************************************
 Mouse motion handling
 *******************************************************************************/

// this variable will tell if the mouse is being moved while pressing the button
var rotY = 0; //rotation on the Y-axis (in degrees) 
var rotX = 0; //rotation on the X-axis (in degrees) 
var dragging = false;
var oldMousePos = {x: 0, y: 0};
var rotSpeed = 2.0; //rotation speed
var rotXQuat = quat.create();
var rotYQuat = quat.create();

function m_getMousePos(evt) {
    var rect = myCanvas[0].getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function MouseHandling_handleMouseMove(event) {
    var dX, dY;
    event = event || window.event; // IE-ism
    if (dragging) {
        var {x, y} = m_getMousePos(event);
        dX = x - oldMousePos.x;
        dY = y - oldMousePos.y;

        rotY += dX > 0 ? -rotSpeed : dX < 0 ? rotSpeed : 0;
        rotX += dY > 0 ? -rotSpeed : dY < 0 ? rotSpeed : 0;

        oldMousePos = {x, y};
    }
}

function MouseHandling_handleMouseDown() {
    dragging = true;
    oldMousePos.x = oldMousePos.y = 0;
}

function MouseHandling_handleMouseUp() {
    dragging = false;
}

function rotateModelViewMatrixUsingQuaternion(cam) {

    var rx = GLTools_degToRad(rotX);
    var ry = GLTools_degToRad(rotY);

    quat.setAxisAngle(rotXQuat, cam.right, rx);
    quat.setAxisAngle(rotYQuat, cam.up, ry);

    quat.multiply(cam.orientation, rotYQuat, rotXQuat);

    rotX = rotY = 0;

    return cam.orientation;
}
