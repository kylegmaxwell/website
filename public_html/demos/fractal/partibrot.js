'use strict';

/**
 * Class to track points moving through space driven by the mandelbrot iteration.
 * @param {Number} height The number of vertical pixels
 * @param {Number} width The number of horizontal pixels
 * @param {Number} iter The maximum number of iterations
 * @param {Boolean} paintMode Whether to use user defined start points
 */
function Partibrot(height, width, iter, paintMode) {

    this.steps = 10;
    this.height = height;
    this.width = width;
    this.iter = iter;
    this.paintMode = paintMode;

    this.rstep = 4.0/(this.height-1);
    this.cstep = 4.0/(this.width-1);

    this.particles = [];
    this.prevParticles = [];
    this.prevIter = 0;
    this.initBuffer(this.particles);
    this.checkIter();

    this.paintBuffer = [];
}


/**
 * Ease in out animation retiming
 *
 * Source http://gizma.com/easing/
 *
 * @param  {Number} t The time
 * @param  {Number} b Start value
 * @param  {Number} c Change in value
 * @param  {Number} d Duration
 * @return {Number}   The new time
 */
Partibrot.prototype.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

/**
 * Step through iterations and/or interpolations.
 *
 * Uses this.steps to determine whether the next frame
 * is an interpolation or an iteration.
 * Every step frames we do an iteration.
 * Otherwise we just update t
 */
Partibrot.prototype.iterate = function () {
    // Determine the iteration number
    var iterTmp = Math.floor(this.iter/this.steps);
    var prevIterTmp = Math.floor(this.prevIter/this.steps);

    // Iterate and store previous result
    for (var i=prevIterTmp;i<iterTmp;i++) {
        var tmp = this.particles;
        this.stepBuffer(this.particles, this.prevParticles);
        this.particles = this.prevParticles;
        this.prevParticles = tmp; // Reuse the array
    }

    // Calculate iteration t
    this.t = Math.max(Math.min((this.iter%this.steps)*(1/this.steps),1),0);
    this.t = this.easeInOutQuad(this.t, 0, 1, 1);

    this.prevIter = this.iter;
}
/**
 * Initialize a particle buffer
 * Contents are [x position, y position, starting x, starting y]
 * @param  {Array} particleBuffer The buffer to populate
 */
Partibrot.prototype.initBuffer = function(particleBuffer) {
    var r, c;
    var index=0;
    var a=-2, b=-2;
    for (r=0;r<this.height;r++)
    {
        a=-2;
        for (c=0;c<this.width;c++)
        {
            particleBuffer[index] = [a, b, a, b];
            index++;
            a+=this.cstep;
        }
        b+=this.rstep;
    }
};

/**
 * Iterate the particles with one mandelbrot step
 * @param {Array} particleBuffer Particle array (see initBuffer)
  */
Partibrot.prototype.stepBuffer = function(inBuffer, outBuffer) {
    var r, c;
    var index=0;
    for (r=0;r<this.height;r++)
    {
        for (c=0;c<this.width;c++)
        {
            var point = inBuffer[index];
            var x = point[0];
            var y = point[1];
            var a = point[2];
            var b = point[3];
            var x2 = x*x;
            var y2 = y*y;
            // only update points that are bounded
            if (x2+y2<4) {
                y=2*x*y+b;
                x=x2-y2+a;
            }
            outBuffer[index] = [x, y, a, b];
            index++;
        }
    }
};

/**
 * Hacky hash function to get a quasi random color.
 * @param  {Number} i Seed
 * @return {Array.<Number>}   Color r, g, b 0-255
 */
Partibrot.prototype.color = function(i) {
    return [i%200+30, ((i+234567)%7)*24+24, (i%57)+75];
};

/**
 * Calculate the mandlebrot set with n iterations
 * {Uvar8ClampedArray} pixels The r, g, b, a pixel data (0 to 255)
 */
Partibrot.prototype.render = function (pixels) {
    this.checkIter();
    var h4 = (this.height-1)/4.0, w4 = (this.width-1)/4.0, h2 = this.height/2.0, w2 = this.width/2.0;
    var a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    var r,c,i,j,rr,cc;
    var index=0, countIndex=0;
    var count=[];
    var cx, cy, px, py;
    countIndex=0;
    // Sample / render each particle into a sparse array
    for (countIndex=0;countIndex<this.particles.length;countIndex++) {
        //initialize positions
        var pos = this.particles[countIndex];
        cx = pos[0];
        cy = pos[1];
        var ppos = this.prevParticles[countIndex]||pos;
        px = ppos[0];
        py = ppos[1];
        var t = this.t;
        var tm = 1.0-t;
        x = tm * px + t * cx;
        y = tm * py + t * cy;
        if (x*x+y*y<4) {
            //compute location in count array
            rr = Math.floor(y*(h4)+(h2));
            cc = Math.floor(x*(w4)+(w2));
            //ignore first iteration
            index = rr*this.width+cc;
            var color = this.color(countIndex);
            if (count[index]) {
                count[index][0] += color[0];
                count[index][1] += color[1];
                count[index][2] += color[2];
            } else {
                count[index]=color;
            }
        }
    }
    index=0;
    countIndex=0;
    for (r=0;r<this.height;r++)
    {
        for (c=0;c<this.width;c++)
        {
            var j = count[countIndex]||[0,0,0];
            pixels[index+0] += j[0];
            pixels[index+1] += j[1];
            pixels[index+2] += j[2];
            pixels[index+3] += toFixed(1);
            countIndex++;
            index+=4;
        }
    }
};

/**
 * Determine how to handle iterations when the iter value has changed.
 *
 * Simulates up to the appropriate frame based on the delta.
 */
Partibrot.prototype.checkIter = function () {

    if (this.iter < this.prevIter) {
        this.prevIter = 0;
        this.initBuffer(this.particles);
        this.iterate();
    } else if (this.iter > this.prevIter) {
        this.iterate();
    }
}
