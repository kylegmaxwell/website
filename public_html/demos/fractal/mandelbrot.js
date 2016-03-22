'use strict';

/**
 * Convert a number to 8 bit int.
 * @param  {Number} value Number as float
 * @return {Number}       Number as 8 bit int
 */
function toFixed(value) {
    return Math.floor(value*255);
}

/**
 * Calculate the mandlebrot set with n iterations
 * {Uint8ClampedArray} pixels The r, g, b, a pixel data (0 to 255)
 * {Number} height The number of vertical pixels
 * {Number} width The number of horizontal pixels
 * {Number} iter The maximum number of iterations
 */
function mandel(pixels, height, width, iter)
{
    // The mandelbrot viewport is 4 units by 4 units from <-2,-2> to <2,2>
    var rstep = 4.0/height;
    var cstep = 4.0/width;
    // a, b is the starting position for the iteration
    // x, y is the current position during the iteration
    var a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    var r,c,i, j;
    var index=0;
    // Loop over each pixel
    for (r=0;r<height;r++) {
        a=-2;
        for (c=0;c<width;c++) {
            x=0;y=0;x2=0;y2=0;
            for (i=0;i<iter;i++)
            {
                x2=x*x;
                y2=y*y;

                //reached maximum iterations
                if (i==iter-1)
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
                        j=Math.pow((i/iter),0.15);
                        pixels[index+0]=toFixed(j);
                        pixels[index+1]=toFixed(j);
                        pixels[index+2]=toFixed(j);
                        i=iter;
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
}