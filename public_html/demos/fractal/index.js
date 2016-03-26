'use strict';

var DEFAULT_ITER = 20;
var renderObj = null;
var ctx = null;
var paintMode = false;

/**
 * Main function that runs onLoad for the page
 */
function handleLoad() {
    var mode = localStorage.getItem('fractal.mode');
    if (mode != null) {
        modeSelector.value = mode;
    }
    gameCanvas.width = 500;
    gameCanvas.height = gameCanvas.width;
    ctx = gameCanvas.getContext('2d');
    resetGame();
    render();
    gameCanvas.addEventListener('mousedown', handleMouse, false);
    gameCanvas.addEventListener('mousemove', handleMouse, false);
    gameCanvas.addEventListener('mouseup', handleMouse, false);
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

function getIter() {
    var valueString = iterInput.value;
    var value = DEFAULT_ITER;
    if (!isNaN(valueString)) {
        value = Number(valueString);
    }
    return value;
}

function updateT() {
    var valueString = testInput.value;
    var value = 0;
    if (!isNaN(valueString)) {
        value = Number(valueString);
    }
    if (renderObj)
        renderObj.t = value;
    render();
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

function doClear() {
   ctx.clearRect(0,0,gameCanvas.width, gameCanvas.height);
}

function resetGame() {
    paintMode = !!paintCheck.checked;

    var width = gameCanvas.width;
    var height = gameCanvas.height;
    var iter = getIter();
    /*
    More ideas
        1. Interpolate particles between fixed steps
        2. loft curves along interpolated points with increasing z
        3. Color by delta position, relative to previous frame, or start position
    */
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
        case 3: // Linebrot
            renderObj = new Linebrot(height, width, iter, paintMode);
            break;
    }
    render();
}

function render() {
    var width = gameCanvas.width;
    var height = gameCanvas.height;
    var imageData = ctx.getImageData(0, 0, width, height);
    var data = imageData.data;

    if (renderObj) {
        if (renderObj.render) {
            renderObj.render(data);
            ctx.putImageData(imageData, 0, 0);
        } else {
            renderObj.draw(ctx);
        }
    }
    localStorage.setItem('fractal.mode', parseInt(modeSelector.value));
}