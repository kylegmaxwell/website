'use strict';

var DEFAULT_ITER = 20;
var renderObj = null;
var ctx = null;
var paintMode = false;

/**
 * Main function that runs onLoad for the page
 */
function handleLoad() {
    gameCanvas.height = gameCanvas.width;
    ctx = gameCanvas.getContext('2d');
    resetGame();
    render();
    gameCanvas.addEventListener('mousedown', handleMouse, false);
    gameCanvas.addEventListener('mousemove', handleMouse, false);
    gameCanvas.addEventListener('mouseup', handleMouse, false);
}

function render() {
    var width = gameCanvas.width;
    var height = gameCanvas.height;
    var imageData = ctx.getImageData(0, 0, width, height);
    var data = imageData.data;

    if (renderObj) {
        renderObj.render(data);
    }

    ctx.putImageData(imageData, 0, 0);
}

function getIter() {
    var valueString = iterInput.value;
    var value = DEFAULT_ITER;
    if (!isNaN(valueString)) {
        value = Number(valueString);
    }
    return value;
}

function updateIter() {
    if (renderObj)
        renderObj.iter = getIter();
    iterInput.value = renderObj.iter;
    render();

}

function incIter() {
    if (renderObj)
        renderObj.iter++;
    iterInput.value = renderObj.iter;
    render();
}

function resetGame() {
    paintMode = !!paintCheck.checked;

    var width = gameCanvas.width;
    var height = gameCanvas.height;
    var iter = getIter();
    switch(parseInt(modeSelector.value)) {
        case 0: // Mandelbrot
            renderObj = new Mandelbrot(height, width, iter, paintMode);
            break;
        case 1: // Buddhabrot
            renderObj = new Buddhabrot(height, width, iter, paintMode);
            break;
        case 2: // Partibrot
            renderObj = new Partibrot(height, width, iter, paintMode);
            break;
    }
    render();
}

var inDrag = false;
function handleMouse(e) {
    if (e.type === 'mousedown') {
        inDrag = true;
    } else if (e.type === 'mouseup') {
        inDrag = false;
    }
    if (inDrag) {
        var x = e.offsetX;
        var y = e.offsetY;
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }
    render();
}