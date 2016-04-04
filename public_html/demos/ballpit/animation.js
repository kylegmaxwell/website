'use strict';

function Animation(callback, fps) {
    this.frameRequest = null;
    this.lastFrameTime = performance.now();
    // Rendering is throttled to this frame rate
    this.FPS = fps != null ? fps : 30;
    this.callback = callback;
}

Animation.prototype.renderLoop = function () {
    var currentTime = performance.now();
    var dt = currentTime - this.lastFrameTime;
    // Throttle it to specified FPS
    if (dt > 1000/this.FPS) {
        this.callback(dt);
        this.lastFrameTime = currentTime;
    }
    this.frameRequest = requestAnimationFrame(this.renderLoop.bind(this));
};

Animation.prototype.start = function () {
    if (this.frameRequest == null) {
        this.lastFrameTime = performance.now();
        this.frameRequest = requestAnimationFrame(this.renderLoop.bind(this));
    }
};

Animation.prototype.stop = function () {
    if (this.frameRequest != null) {
        cancelAnimationFrame(this.frameRequest);
    }
    this.frameRequest = null;
};
