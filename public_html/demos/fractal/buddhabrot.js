'use strict';

/**
 * Calculate the buddhabrot fractal which is a histogram of the mandelbrot.
 * @param {Number} height The number of vertical pixels
 * @param {Number} width The number of horizontal pixels
 * @param {Number} iter The maximum number of iterations
 * @param {Boolean} paintMode Whether to use user defined start points
 */
function Buddhabrot(height, width, iter, paintMode) {

    this.height = height;
    this.width = width;
    this.iter = iter;
    this.paintMode = paintMode;

    // Cache of user paint to preserve sources on subsequent renders
    this.paintBuffer = [];
}

/**
 * Calculate the mandlebrot set with n iterations
 * {Uvar8ClampedArray} pixels The r, g, b, a pixel data (0 to 255)
 */
Buddhabrot.prototype.render = function(pixels) {
    var h4 = (this.height-1)/4.0, w4 = (this.width-1)/4.0, h2 = this.height/2.0, w2 = this.width/2.0;
    var rstep = 4.0/(this.height-1), cstep = 4.0/(this.width-1);
    var a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    var r,c,i,j,rr,cc;
    var index=0, countIndex=0;
    var count=[];
    for (r=0;r<this.height;r++)
    {
        for (c=0;c<this.width;c++)
        {
            count[countIndex]=0;
            this.paintBuffer[countIndex] = this.paintBuffer[countIndex] || pixels[countIndex*4] > 254;
            countIndex++;
        }
    }
    countIndex=0;
    // For each pixel, iterate the samples and accumulate count
    for (r=0;r<this.height;r++)
    {
        a=-2;
        for (c=0;c<this.width;c++)
        {
            //initialize positions
            x=a;
            y=b;
            x2=a*a;
            y2=b*b;

            //only run certain initial conditions
            if (this.paintBuffer[countIndex] || !this.paintMode)
            {
                for (i=0;i<this.iter && x2+y2<4;i++)
                {
                    //compute location in count array
                    rr = Math.floor(y*(h4)+(h2));
                    cc = Math.floor(x*(w4)+(w2));
                    //ignore first iteration
                    count[rr*this.width+cc]++;
                    //compute next location
                    y=2*x*y+b;
                    x=x2-y2+a;
                    x2=x*x;
                    y2=y*y;
                }
            }
            a+=cstep;
            index+=4;
            countIndex++;
        }
        b+=rstep;
    }
    var max=0;
    index=0;
    countIndex=0;
    // Find the highest count on a pixel, so they can be normalize
    for (r=0;r<this.height;r++)
    {
        for (c=0;c<this.width;c++)
        {
            count[countIndex]=Math.log(count[countIndex]+1);
            if (max<count[countIndex])
                max=count[countIndex];
            countIndex++;
        }
    }
    index=0;
    countIndex=0;
    // Write the results to the pixels
    for (r=0;r<this.height;r++)
    {
        for (c=0;c<this.width;c++)
        {
            var j = count[countIndex]/max;
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
