/**
 * Created by alexandre on 03.10.2016.
 */

var m_allShortcutsBehaviours = {
    65: pressedA,
    67: pressedC,
    68: pressedD,
    69: pressedE,
    81: pressedQ,
    82: pressedR,
    83: pressedS,
    87: pressedW,
    89: pressedY
};

var isShiftDown = false;
document.onkeyup = function(e) {
    if(e.shiftKey){
        isShiftDown = false;
        mainCamera.speed /= 10;
    }
};

document.onkeydown = function (e) {

    if(e.shiftKey){
        if(!isShiftDown) {
            isShiftDown = true;
            mainCamera.speed *= 10;
        }
    }

    e = e || window.event;//Get event
    var c = e.which || e.keyCode;//Get key code
    //console.log(c);
    if(m_allShortcutsBehaviours.hasOwnProperty(c)){
        m_allShortcutsBehaviours[c](e);
    }
};

function pressedA(e) {
    mainCamera.moveLeft();
}

function pressedW(e) {
    mainCamera.moveFront();
}

function pressedS(e) {
    mainCamera.moveBack();
}

function pressedD(e) {
    mainCamera.moveRight();
}

function pressedQ(e) {
    mainCamera.moveDown();
}

function pressedE(e) {
    mainCamera.moveUp();
}

function pressedY(e) {
    mainCamera.rotateLeft();
}

function pressedC(e) {
    mainCamera.rotateRight();
}

function pressedR(e) {
    mainCamera.reset();
}