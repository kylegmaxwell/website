'use strict';

var DEFAULT_ITER = 5;
var iter = DEFAULT_ITER;

/**
 * Main function that runs onLoad for the page
 */
function handleLoad() {

    gameCanvas.height = gameCanvas.width;
    updateIter();
    render();
}

function render() {
    var width = gameCanvas.width;
    var height = gameCanvas.height;
    var ctx = gameCanvas.getContext('2d');

    var imageData = ctx.getImageData(0, 0, width, height);
    var data = imageData.data;

    mandel(data, height, width, iter);

    ctx.putImageData(imageData, 0, 0);
}

function updateIter() {
    var valueString = iterInput.value;
    var value = DEFAULT_ITER;
    if (!isNaN(valueString)) {
        value = Number(valueString);
    }
    iter = value;
    render();
}

function incIter() {
    iter++;
    render();
}