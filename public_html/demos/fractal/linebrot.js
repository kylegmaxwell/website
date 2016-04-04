'use strict';

/**
 * Class to draw lines between iterations of the mandelbrot set.
 * @param {Number} height The number of vertical pixels
 * @param {Number} width The number of horizontal pixels
 * @param {Number} iter The maximum number of iterations
 * @param {Boolean} paintMode Whether to use user defined start points
 */
function Linebrot(height, width, iter, paintMode) {
    // Only render every skip-th line
    this.skip = 7;
    // Number of iterations per frame
    this.steps = 1;
    // Particles must move this much or they will be ignored
    this.delta = 1;

    this.height = height;
    this.width = width;
    this.h4 = (this.height-1)/4.0;
    this.w4 = (this.width-1)/4.0;
    this.h2 = this.height/2.0;
    this.w2 = this.width/2.0;

    this.iter = iter;
    this.paintMode = paintMode;

    this.rstep = 4.0/(this.height-1);
    this.cstep = 4.0/(this.width-1);

    this.particles = [];
    this.prevParticles = [];
    this.prevPrevParticles = [];
    this.prevPrevPrevParticles = [];
    this.prevIter = 0;
    this.initBuffer(this.particles);
    this.checkIter();

    this.paintBuffer = [];
}

/**
 * Step through iterations of mandelbrot.
 */
Linebrot.prototype.iterate = function () {
    var iterTmp = this.iter*this.steps;
    var prevIterTmp = this.prevIter*this.steps;

    for (var i=prevIterTmp;i<iterTmp;i++) {
        this.cloneBuffer(this.prevPrevParticles, this.prevPrevPrevParticles);
        this.cloneBuffer(this.prevParticles, this.prevPrevParticles);
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
 * Copy the buffer into another one
 * @param  {Array} inBuffer  Source
 * @param  {Array} outBuffer Destination
 */
Linebrot.prototype.cloneBuffer = function(inBuffer, outBuffer) {
    var r, c;
    var index=0;
    for (r=0;r<this.height;r++)
    {
        for (c=0;c<this.width;c++)
        {
            outBuffer[index] = inBuffer[index];
            index++;
        }
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
            if (this.inBounds(x,y)) {
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
    var index=0, countIndex=0;

    countIndex=0;

    // Partially occlude previous frame
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, this.width, this.height);

    var skipI = 0;
    if (!this.skipCache) {
        this.skipCache = [];
        for (countIndex=0;countIndex<this.particles.length;countIndex++) {
            var gotOne = this.checkOne(ctx, countIndex);
            if (gotOne) {
                if (skipI % this.skip === 0) {
                    this.drawOne(ctx, countIndex, this.skipCache.length);
                    this.skipCache.push(countIndex);
                }
                skipI++;
            }
        }
    } else {
        for (index=0;index<this.skipCache.length;index++) {
            this.drawOne(ctx, this.skipCache[index], index);
        }
    }
};

Linebrot.prototype.checkOne = function (ctx, countIndex) {
    var cx, cy;
    //initialize positions
    var pos = this.prevPrevParticles[countIndex]||this.particles[countIndex];
    cx = pos[0];
    cy = pos[1];

    return this.inBounds(cx, cy);
}

Linebrot.prototype.inBounds = function (x, y) {
    return x > -2 && x < 2 && y < 2 && y > -2;
}

/**
 * Convert a x,y pair in mandelbrot space to a vector in screen space.
 *
 * Mandelbrot space is [-2,-2]x[2,2]
 * Scren space is height x width
 * @param  {Number} x position
 * @param  {Number} y position
 * @return {Vector}   Screen position
 */
Linebrot.prototype.toPixel = function (x, y) {
    return Vector.create([
        Math.floor(x*(this.w4)+(this.w2)),
        Math.floor(y*(this.h4)+(this.h2)),
        0]);
}

Linebrot.prototype.drawOne = function (ctx, countIndex, index) {
    var cx, cy, px, py, ppx, ppy, pppx, pppy, mx, my;
    var r,c,i,j,v0,v1,v2,v3;

    //initialize positions
    var pos = this.particles[countIndex];
    cx = pos[0];
    cy = pos[1];
    var ppos = this.prevParticles[countIndex]||pos;
    px = ppos[0];
    py = ppos[1];
    mx = 0.5 * cx + 0.5 * px;
    my = 0.5 * cy + 0.5 * py;
    var pppos = this.prevPrevParticles[countIndex]||ppos;
    ppx = pppos[0];
    ppy = pppos[1];
    var ppppos = this.prevPrevPrevParticles[countIndex]||pppos;
    pppx = ppppos[0];
    pppy = ppppos[1];

    if (this.inBounds(ppx, ppy)) {
            var color = this.color(index);
            v0 = this.toPixel(pppx, pppy);
            v1 = this.toPixel( ppx,  ppy);
            v2 = this.toPixel(  px,   py);
            v3 = this.toPixel(  cx,   cy);

            var len = v1.distanceFrom(v2)
            var maxLen = 1000;
            var alpha = (maxLen-len)*(1/maxLen);
            alpha *= 1.0-((mx*mx+my*my)*0.25);
            alpha = Math.min(Math.max(alpha,0.2),0.75);
            // alpha = 1;
            var colorStr = "rgba("+color[0]+","+color[1]+","+color[2]+","+alpha+")";
            ctx.strokeStyle = colorStr;

            var d12 = v1.distanceFrom(v2);
            var d02 = v0.distanceFrom(v2);
            var d13 = v1.distanceFrom(v3);
            if (v0.distanceFrom(v1) > this.delta && d12 > this.delta && d02 > this.delta && d13 > this.delta) {
                ctx.beginPath();

                var tan02 = v2.subtract(v0).multiply(0.5*d12/d02);
                var tan31 = v1.subtract(v3).multiply(0.5*d12/d13);
                var cv1 = v1.add(tan02);
                var cv2 = v2.add(tan31);
                ctx.moveTo(v1.e(1),v1.e(2));
                ctx.bezierCurveTo(
                                cv1.e(1),cv1.e(2),
                                cv2.e(1),cv2.e(2),
                                v2.e(1),v2.e(2));
                ctx.stroke();
            }

        return true;
    } else {
        return false;
    }

}

function drawPoint(ctx, vec) {
    ctx.fillRect(vec.elements[0], vec.elements[1], 10, 10);
}

/**
 * Compute an arc from three points
 *
 * Not currently used, bezier looks better.
 *
 * @param  {Number} x0  Coordinate
 * @param  {Number} y0  Coordinate
 * @param  {Number} x1  Coordinate
 * @param  {Number} y1  Coordinate
 * @param  {Number} x2  Coordinate
 * @param  {Number} y2  Coordinate
 * {CanvasRenderingContext2D} ctx The canvas drawing context
  * @return {Array}     Arc definition (center, radius, theta1, theta2)
 */
Linebrot.prototype.calculateArc = function (x0, y0, x1, y1, x2, y2, ctx) {
    var v1 = Vector.create([x0, y0,0]);
    var v2 = Vector.create([x1, y1,0]);
    var v3 = Vector.create([x2, y2,0]);
    var m1 = v1.multiply(0.5).add(v2.multiply(0.5));
    var m2 = v2.multiply(0.5).add(v3.multiply(0.5));
    var v12 = v2.subtract(v1);
    var d1 = Vector.create([-v12.elements[1], v12.elements[0],0]).toUnitVector();
    var v23 = v3.subtract(v2);
    var d2 = Vector.create([-v23.elements[1], v23.elements[0],0]).toUnitVector();
    var line1 = Line.create(m1, d1);
    var line2 = Line.create(m2, d2);
    if (line1 && line2) {
        var center = line1.intersectionWith(line2);
        if (center) {
            var radius = center.distanceFrom(v1);
            var cv1 = v1.subtract(center);
            var theta1 = Math.atan2(cv1.elements[1], cv1.elements[0]);
            var cv2 = v3.subtract(center);
            var theta2 = Math.atan2(cv2.elements[1], cv2.elements[0]);
            return [center, radius, theta1, theta2];
        }
    }
    return null;
}


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