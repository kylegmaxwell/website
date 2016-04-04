'use strict';

var BALL_INDEX = 0;

/**
 * Create a ball object from given data.
 */
function Ball() {
    this.index = BALL_INDEX++;
    this.colorStr = this.proceduralColor(this.index);
}

/**
 * Draw the ball.
 *
 * Assumes that ctx.beginPath() and ctx.fill() are called externally.
 * See http://www.html5rocks.com/en/tutorials/canvas/performance/#toc-batch
 *
 * @param  {ctx} The 2d context on which to draw
 * @param  {Number} x The horizontal draw position
 * @param  {Number} y The vertical draw position
 */
Ball.prototype.draw = function (ctx, x, y) {
    var radius = 10;
    ctx.fillStyle = this.colorStr;

    // Call moveTo to update the cursor so a polygon is not created across circles
    ctx.moveTo(x,y);

    // Specify the arc to draw (it will actually be visible when fill is called)
    ctx.arc(x, y, radius, 0, 2*Math.PI);

};

/**
 * Generate a color using a random hash
 * @param  {Number} i Seed
 * @return {String}   r, g, b, a color
 */
Ball.prototype.proceduralColor = function(i) {
    var color = [i%200+30, ((i+234567)%7)*24+24, (i%57)+75];
    var alpha = 1.0;
    return "rgba("+color[0]+","+color[1]+","+color[2]+","+alpha+")";
};