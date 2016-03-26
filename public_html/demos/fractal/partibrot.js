'use strict';

/**
 * Class to track points moving through space driven by the mandelbrot iteration.
 * @param {Number} height The number of vertical pixels
 * @param {Number} width The number of horizontal pixels
 * @param {Number} iter The maximum number of iterations
 * @param {Boolean} paintMode Whether to use user defined start points
 */
function Partibrot(height, width, iter, paintMode) {

    this.height = height;
    this.width = width;
    this.iter = iter;
    this.paintMode = paintMode;

    this.rstep = 4.0/(this.height-1);
    this.cstep = 4.0/(this.width-1);

    this.particles = [];

    this.paintBuffer = [];

}

/**
 * Initialize a particle buffer
 * Contents are [x position, y position, starting x, starting y]
 * @param  {Array} particleBuffer The buffer to populate
 */
Partibrot.prototype.setup = function(particleBuffer) {
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
 * @param {Array} particleBuffer Particle array (see setup)
  */
Partibrot.prototype.step = function(particleBuffer) {
    var r, c;
    var index=0;
    for (r=0;r<this.height;r++)
    {
        for (c=0;c<this.width;c++)
        {
            var point = particleBuffer[index];
            var x = point[0];
            var y = point[1];
            var a = point[2];
            var b = point[3];
            var x2 = x*x;
            var y2 = y*y;
            y=2*x*y+b;
            x=x2-y2+a;
            particleBuffer[index] = [x, y, a, b];
            index++;
        }
    }
};

/**
 * Calculate the mandlebrot set with n iterations
 * {Uvar8ClampedArray} pixels The r, g, b, a pixel data (0 to 255)
 */
Partibrot.prototype.render = function (pixels) {

    this.setup(this.particles);

    for (var i=0;i<this.iter;i++) {
        this.step(this.particles);
    }

    var h4 = (this.height-1)/4.0, w4 = (this.width-1)/4.0, h2 = this.height/2.0, w2 = this.width/2.0;
    var a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    var r,c,i,j,rr,cc;
    var index=0, countIndex=0;
    var count=[];
    var count=[];

    countIndex=0;
    for (countIndex=0;countIndex<this.particles.length;countIndex++) {
        // //initialize positions
        var pos = this.particles[countIndex];
        x = pos[0];
        y = pos[1];
        //compute location in count array
        rr = Math.floor(y*(h4)+(h2));
        cc = Math.floor(x*(w4)+(w2));
        //ignore first iteration
        index = rr*this.width+cc;
        if (count[index]) {
            count[index]+=1;
        } else {
            count[index]=1;
        }
    }
    index=0;
    countIndex=0;
    for (r=0;r<this.height;r++)
    {
        for (c=0;c<this.width;c++)
        {
            var j = count[countIndex]>0;
            var i = toFixed(j);
            pixels[index+0]=i
            pixels[index+1]=i;
            pixels[index+2]=i;
            pixels[index+3]=toFixed(1);
            countIndex++;
            index+=4;
        }
    }
};
