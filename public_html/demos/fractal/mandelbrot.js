'use strict';

/**
 * Calculate and render the Mandelbrot set.
 * @param {Number} height The number of vertical pixels
 * @param {Number} width The number of horizontal pixels
 * @param {Number} iter The maximum number of iterations
 */
function Mandelbrot(height, width, iter) {
    this.height = height;
    this.width = width;
    this.iter = iter;
}

/**
 * Render the mandlebrot set
 * {Uint8ClampedArray} pixels The r, g, b, a pixel data (0 to 255)
 */
Mandelbrot.prototype.render = function (pixels) {
    // The mandelbrot viewport is 4 units by 4 units from <-2,-2> to <2,2>
    var rstep = 4.0/(this.height-1);
    var cstep = 4.0/(this.width-1);
    // a, b is the starting position for the iteration
    // x, y is the current position during the iteration
    var a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    var r,c,i, j;
    var index=0;
    // Loop over each pixel
    for (r=0;r<this.height;r++) {
        a=-2;
        for (c=0;c<this.width;c++) {
            x=0;y=0;x2=0;y2=0;
            for (i=0;i<this.iter;i++)
            {
                x2=x*x;
                y2=y*y;

                //reached maximum iterations
                if (i==this.iter-1)
                {
                    j=0;
                    pixels[index+0]=toFixed(j);
                    pixels[index+1]=toFixed(j);
                    pixels[index+2]=toFixed(j);
                }
                else //iterate
                {
                    //particle will diverge to infinity
                    if (x2+y2>4)
                    {
                        j=Math.pow((i/this.iter),0.15);
                        pixels[index+0]=toFixed(j);
                        pixels[index+1]=toFixed(j);
                        pixels[index+2]=toFixed(j);
                        i=this.iter;
                    }
                    else
                    {
                        y=2*x*y+b;
                        x=x2-y2+a;
                    }
                }
            }
            pixels[index+3]=toFixed(1);
            a+=cstep;
            index+=4;
        }
        b+=rstep;
    }
};
