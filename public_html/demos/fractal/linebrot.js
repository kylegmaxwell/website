'use strict';

/**
 * Class to draw lines between iterations of the mandelbrot set.
 * @param {Number} height The number of vertical pixels
 * @param {Number} width The number of horizontal pixels
 * @param {Number} iter The maximum number of iterations
 * @param {Boolean} paintMode Whether to use user defined start points
 */
function Linebrot(height, width, iter, paintMode) {

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

    // this.colorBuffer = [];
    this.paintBuffer = [];
}

/**
 * Step through iterations of mandelbrot.
 */
Linebrot.prototype.iterate = function () {

    for (var i=this.prevIter;i<this.iter;i++) {
        var tmp = this.particles;
        this.stepBuffer(this.particles, this.prevParticles);
        this.particles = this.prevParticles;
        this.prevParticles = tmp; // Reuse the array
    }
    this.prevIter = this.iter;
}
/**
 * Initialize a particle buffer
 * Contents are [x position, y position, starting x, starting y]
 * @param  {Array} particleBuffer The buffer to populate
 */
Linebrot.prototype.initBuffer = function(particleBuffer) {
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
Linebrot.prototype.stepBuffer = function(inBuffer, outBuffer) {
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
Linebrot.prototype.color = function(i) {
    return [i%200+30, ((i+234567)%7)*24+24, (i%57)+75];
};

/**
 * Draw the curves between the current and previous set.
 * {CanvasRenderingContext2D} ctx The canvas drawing context
 */
Linebrot.prototype.draw = function (ctx) {
    this.checkIter();
    var h4 = (this.height-1)/4.0, w4 = (this.width-1)/4.0, h2 = this.height/2.0, w2 = this.width/2.0;
    var a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    var r,c,i,j,rr1,cc1,rr2,cc2;
    var index=0, countIndex=0;
    var count=[];
    var cx, cy, px, py, mx, my;
    countIndex=0;

    for (countIndex=0;countIndex<this.particles.length;countIndex++) {
        //initialize positions
        var pos = this.particles[countIndex];
        cx = pos[0];
        cy = pos[1];
        var ppos = this.prevParticles[countIndex];
        px = ppos[0];
        py = ppos[1];
        mx = 0.5 * cx + 0.5 * px;
        my = 0.5 * cy + 0.5 * py;
        if (cx*cx+cy*cy<4 || px*px+py*py<4) {

            var color = this.color(countIndex);
            rr1 = Math.floor(py*(h4)+(h2));
            cc1 = Math.floor(px*(w4)+(w2));
            rr2 = Math.floor(cy*(h4)+(h2));
            cc2 = Math.floor(cx*(w4)+(w2));

            var dy = (rr2-rr1);
            var dx = (cc2-cc1);
            var len2 = dx*dx+dy*dy;
            var alpha = (10000 - len2)*0.0001;
            alpha *= 1.0-((mx*mx+my*my)*0.25);
            var colorStr = "rgba("+color[0]+","+color[1]+","+color[2]+","+alpha+")"
            ctx.strokeStyle = colorStr;
            ctx.beginPath();
            ctx.moveTo(cc1,rr1);
            ctx.lineTo(cc2,rr2);
            ctx.stroke();
        }
    }
};

/**
 * Determine how to handle iterations when the iter value has changed.
 *
 * Simulates up to the appropriate frame based on the delta.
 */
Linebrot.prototype.checkIter = function () {
    if (this.iter < this.prevIter) {
        this.prevIter = 0;
        this.initBuffer(this.particles);
        this.iterate();
    } else if (this.iter > this.prevIter) {
        this.iterate();
    }
}