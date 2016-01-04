/**
 * @param  {DomElement} The div into which the canvas goes
 */
function setup(container, data) {
    var ctx = setupCanvas(container);
    var node = setupTree(data);
    draw(ctx, node);
}

/**
 * @param  {DomElement} The div into which the canvas goes
 */
function setupCanvas(container) {
    var canvas = document.createElement('canvas');
    container.appendChild(canvas);
    canvas.width = 400;
    canvas.height = 400;
    var ctx = canvas.getContext('2d');
    return ctx;
}

function setupTree(data) {
    var node = new Node(data);
    testNode(node);
    return node;
}

/**
 * @param  {Node} Node type object to test with stringification
 * TODO: move this into a test suite
 */
function testNode(node) {
    var str = JSON.stringify(node);
    var obj = JSON.parse(str);
    var node2 = new Node(obj);
    var str2 = JSON.stringify(node2);
    if (str === str2) {
        console.info('stringify reflexivity test passed.');
    } else {
        console.error('stringify reflexivity test failed.');
    }
}

/**
 * @param  {Object} ctx The 2D drawing context
 */
function draw(ctx, node) {
    // draw color
    ctx.fillStyle = "#90D4AC";

    // Set up the draw buffer
    ctx.beginPath();

    // Recursively add circles
    node.draw(ctx, 150, 30, 20);

    // Render all the circles that were added to the buffer
    ctx.fill();

}









