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
    var width = localStorage.getItem('fractal.width');
    if (width != null) {
        gameCanvas.width = width;
        resInput.value = width;
    }
    var iter = localStorage.getItem('fractal.iter');
    if (iter != null) {
        // It could be very slow to calculate more than this
        iterInput.value = Math.min(iter,1000);
    }
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
        render();
    }
}

/**
 * Get the value of a text input box as a number
 * @param  {dom input} inputBox     The html input
 * @param  {Number} defaultValue Value to use if input is not a number
 * @return {Number}              The parsed value
 */
function getValue(inputBox, defaultValue) {
    var valueString = inputBox.value;
    var value = defaultValue;
    if (!isNaN(valueString)) {
        value = Number(valueString);
    }
    return value;
}

function updateIter() {
    if (renderObj)
        renderObj.iter = getValue(iterInput, DEFAULT_ITER);
    iterInput.value = renderObj.iter;
    render();
}

function updateRes() {
    gameCanvas.width = getValue(resInput, gameCanvas.width);
    gameCanvas.height = gameCanvas.width;
    resetGame();
}

var renderRequest = null;
function renderLoop() {
    if (renderObj)
        renderObj.iter++;
    iterInput.value = renderObj.iter;
    render();
    renderRequest = requestAnimationFrame(renderLoop);
}

function playIter() {
    renderRequest =requestAnimationFrame(renderLoop);
}

function stopIter() {
    cancelAnimationFrame(renderRequest);
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
    var iter = getValue(iterInput, DEFAULT_ITER);
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
    localStorage.setItem('fractal.width', gameCanvas.width);
    localStorage.setItem('fractal.iter', renderObj.iter);
}