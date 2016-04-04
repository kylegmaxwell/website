'use strict';

var controller = null;

/**
 * Main function that runs onLoad for the page
 */
function handleLoad() {

    controller = new Controller(gameCanvas);

    // createCircle(g_world, 50, 50);

    // resetGame();
    // render();
    // gameCanvas.addEventListener('mousedown', handleMouse, false);
    // gameCanvas.addEventListener('mousemove', handleMouse, false);
    // gameCanvas.addEventListener('mouseup', handleMouse, false);
}


function Controller(canvas) {

    // this.ball = null;
    this.canvas = canvas;

    this.setupCanvas();

    this.ctx = this.canvas.getContext('2d');

    this.reset();
    this.start();
}

Controller.prototype.setupCanvas = function () {
    this.canvas.height = this.canvas.width;
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;
};


Controller.prototype.clearCanvas = function () {
   this.ctx.clearRect(0, 0, this.width, this.height);
};

Controller.prototype.stop = function () {
    if (this.renderAnimation) {
        this.renderAnimation.stop();
    }
    if (this.createAnimation) {
        this.createAnimation.stop();
    }
}

Controller.prototype.start = function () {
    if (this.renderAnimation) {
        this.renderAnimation.start();
    }
    if (this.createAnimation) {
        this.createAnimation.start();
    }
}

Controller.prototype.create = function () {
    var x = Math.random() * this.width*0.5 + this.width * 0.25;
    this.game.createCircle(x, 50);
}

Controller.prototype.reset = function () {
    this.renderAnimation = new Animation(this.step.bind(this), 30);
    this.createAnimation = new Animation(this.create.bind(this), 1);

    this.game = new Game(this.ctx, this.height, this.width);

    this.clearCanvas();
    this.render();
};

Controller.prototype.step = function (dt) {
    // convert from ms to seconds
    var timeStep = dt != null ? dt*0.001 : 1.0/60;
    var iteration = 1;
    this.game.step(timeStep, iteration);
    this.clearCanvas();
    this.render();
};

Controller.prototype.render = function () {

    // ctx.beginPath();
    // if (ball) {
    //     ball.draw(ctx, 200, 100, width);
    // }
    // ctx.fill();
    // drawWorld(g_world, ctx);
    this.game.draw();
};

function playIter() {
    controller.start();
}

function stopIter() {
    controller.stop();
}

function incIter() {
    controller.step()
}


