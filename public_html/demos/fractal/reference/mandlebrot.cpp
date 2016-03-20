/*******************************************************
 *  Comp175 Fundamentals of Computer Graphics
 *  Name: Kyle Maxwell
 *  ID: 8373
 *  HW: 1
 ********************************************************/


/*******************************************************
 *  Require files for this implementation
 *******************************************************/
#include <GL/glut.h>
#include <stdlib.h>
#include <stdio.h>  
#include <math.h>
#include <windows.h>
#include <io.h>
#include <fcntl.h>
#include <sys/stat.h>
#include "Location.h"

#define MIN(a, b) ((a<b)?(a):(b))
#define MAX(a, b) ((a>b)?(a):(b))

//----define size of header and info header for a bitmap file
#define SZ_BMFILEHEADER 14
#define SZ_BMINFO 40


#define MANDEL 0
#define BUDDHA 1
#define PATCH  2

/*******************************************************
 *  global variables: 
 *             window width and height
 *             array storing image pixel values
 *******************************************************/
float * pixels;
float * count;
Location * points;
int width, height;
double dark=1;
double maxItr=1;
int disp=0;



int rtWriteImage (float *image, char *fileName)
{
	FILE *fp;
 
	//----fill bmp structures
	//----I assume the width of the image is a multiple of 4
	//----if it isn't the rgbdata (below) needs padding.
	BITMAPFILEHEADER bmFileHeader;

	//----set the bitmap info header structure
	bmFileHeader.bfType = 19778; 
	bmFileHeader.bfSize = (width * height * 4 * sizeof(unsigned char)) 
		+ SZ_BMFILEHEADER + SZ_BMINFO;
	bmFileHeader.bfReserved1 = 0;
	bmFileHeader.bfReserved2 = 0;
	bmFileHeader.bfOffBits = SZ_BMFILEHEADER + SZ_BMINFO;

	BITMAPINFO bmInfo;
	bmInfo.bmiHeader.biSize = SZ_BMINFO;
	bmInfo.bmiHeader.biWidth = width;
	bmInfo.bmiHeader.biHeight = height;
	bmInfo.bmiHeader.biPlanes = 1;
	bmInfo.bmiHeader.biBitCount = 24;
	bmInfo.bmiHeader.biCompression = 0;
	bmInfo.bmiHeader.biSizeImage = 0;
	bmInfo.bmiHeader.biXPelsPerMeter = 0;
	bmInfo.bmiHeader.biYPelsPerMeter = 0;
	bmInfo.bmiHeader.biClrUsed = 0;
	bmInfo.bmiHeader.biClrImportant = 0;

	//----create bitmap colors array
	//----the forth byte is reserved and set to 0  
	unsigned char *rgbdata = (unsigned char*)malloc(width * height * 4);

	//----set bitmap array 
	for(int j = 0; j < height; j++){
		for(int i = 0; i < width; i++){
			//----the range of each color component is from 0 to 255 (0.0 to 1.0)
			//----the specification of color in bmt starts with blue
			rgbdata[3*(i+j*width)]   = (unsigned char)(image[3*(i+j*width)+2] * 255.0);
			rgbdata[3*(i+j*width)+1] = (unsigned char)(image[3*(i+j*width)+1] * 255.0);
			rgbdata[3*(i+j*width)+2] = (unsigned char)(image[3*(i+j*width)] * 255.0);
			rgbdata[3*(i+j*width)+3] = 0;
		}
	}

	//----open fileName for writing
    fp = fopen(fileName, "wb");
    if(!fp) 
		return 0;

	//----write bmp file
	fwrite(&bmFileHeader, SZ_BMFILEHEADER, 1, fp);
	fwrite(&bmInfo, SZ_BMINFO, 1, fp);
	fwrite(rgbdata, 4*width*height*sizeof(unsigned char), 1, fp);

	fclose(fp);
	free(rgbdata);

	return 1;

}
/*******************************************************
 *  void display(void)
 *
 *  GLUT window-repainting callback. Put all code in here
 *  that you need to paint your image.  
 *******************************************************/
void display (void)
{
	//----Tell openGL that the pixels are sequential (ie 
	//----they were not aligned on certain boundaries when
	//----written to memory)
	glPixelStorei(GL_UNPACK_ALIGNMENT, 1);
    
	//-----Clear the background
	glClear(GL_COLOR_BUFFER_BIT);

	//----Draw the pixels to our window, startin at location
	//----(0,0). 
	glRasterPos2i(0, 0);

	/*******************************************************
    * call glDrawPixels here
    *******************************************************/
	glDrawPixels(width, height, GL_RGB, GL_FLOAT, pixels ) ;


	//----Draw any information left in the buffer
	glFlush();
}

/********************************************************************
 *  Calculate
 *
 * Calculate the mandlebrot set with n iterations 
 *******************************************************/ 
void mandel()
{
	//N IS NOT USED YET
	double rstep = 4.0/height, cstep = 4.0/width;
    double a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    int iter=5*maxItr;//20 is cute
	int r,c,i;
	int index=0;
    for (r=0;r<height;r++)
	{
		a=-2;
		for (c=0;c<width;c++)
		{
            x=0;y=0;x2=0;y2=0;
            for (i=0;i<iter;i++)
            {
                x2=x*x;
                y2=y*y;

				//reached maximum iterations
                if (i==iter-1)
				{
					double j=0;
					pixels[index+0]=j;
					pixels[index+1]=j;
					pixels[index+2]=j;
				}
                else //iterate
                {
					//particle will diverge to infinity
                    if (x2+y2>4)
	                {
						double j=pow(((double)i/(double)iter),0.15);
                        pixels[index+0]=j;
						pixels[index+1]=j;
						pixels[index+2]=j;
                        i=iter;
					}
                    else
                    {
						y=2*x*y+b;
						x=x2-y2+a;
					}
				}
            }
			a+=cstep;
			index+=3;
        }
        b+=rstep;
	}
}
bool test(float a, float b, int r, int c)
{
	//return (a*a+8*b*b)>1;
	//return (c%10==0||r%10==0);
	//return abs(a)<.5&&abs(b)<.5;
	return true;
}
void buddha()
{

	//N IS NOT USED YET
	double h4 = height/4.0, w4 = width/4.0, h2 = height/2.0, w2 = width/2.0;
	double rstep = 4.0/height, cstep = 4.0/width;
    double a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    int iter=4*maxItr;//20
	int r,c,i,rr,cc;
    int index=0, countIndex=0;
	for (r=0;r<height;r++)
	{
		for (c=0;c<width;c++)
		{
			count[countIndex]=0;
			countIndex++;
		}
	}
	countIndex=0;
	for (r=0;r<height;r++)
	{
		a=-2;
		for (c=0;c<width;c++)
		{
			
			//initialize positions
            x=a;
			y=b;
			x2=a*a;
			y2=b*b;

			//only run certain points (initial conditions)
			if (test(a,b,r,c))
			{
				for (i=1;i<iter && x2+y2<4;i++)
				{
					//compute location in count array
					rr = y*(h4)+(h2);
					cc = x*(w4)+(w2);
					//ignore first iteration
					count[rr*width+cc]++;
					//compute next location
					y=2*x*y+b;
					x=x2-y2+a;
					x2=x*x;
					y2=y*y;
				}
			}
			a+=cstep;
			index+=3;
        }
        b+=rstep;
	}
	double max=0;
	index=0;
	countIndex=0;
	for (r=0;r<height;r++)
	{
		for (c=0;c<width;c++)
		{
			count[countIndex]=log(count[countIndex]+1);
			if (max<count[countIndex])
				max=count[countIndex];
			countIndex++;
		}
	}
	max*=dark;
	index=0;
	countIndex=0;
	for (r=0;r<height;r++)
	{
		for (c=0;c<width;c++)
		{
			double j = count[countIndex]/max;
			pixels[index+0]=j;
			pixels[index+1]=j;
			pixels[index+2]=j;
			countIndex++;
			index+=3;
		}
	}
	
}

void makePatch()
{
	double h4 = height/4.0, w4 = width/4.0, h2 = height/2.0, w2 = width/2.0;
	double rstep = 4.0/height, cstep = 4.0/width;
    double a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    int iter=maxItr;
	int len = height*width;
	int i,j,r,c,rr,cc;

	i=0;
	for (r=0;r<height;r++)
	{
		a=-2;
		for (c=0;c<width;c++)
		{
			points[i].a=a;
			points[i].b=b;

			points[i].x=0;
			points[i].y=0;
			//if (250 < i%width && i%width < 280)
			//if (c%20==0)
			points[i].red=r%height/(double)height;
			points[i].green=c%width/(double)width;
			points[i].blue=1;
			if (test(a,b,r,c))
				points[i].valid=true;
			else
				points[i].valid=false;
			i++;
			a+=cstep;
		}
		b+=rstep;
	}
}
void stepPatch()
{
	double h4 = height/4.0, w4 = width/4.0, h2 = height/2.0, w2 = width/2.0;
	double rstep = 4.0/height, cstep = 4.0/width;
    double a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    int iter=maxItr;
	int len = height*width;
	int i,j,r,c,rr,cc;

	i=0;
	for (r=0;r<height;r++)
	{
		for (c=0;c<width;c++)
		{
			if (points[i].valid)
			{
				y=points[i].y;
				x=points[i].x;
				
				x2 = x*x;
				y2 = y*y;
				if (x2+y2>4)
					points[i].valid=false;
				
				y=2*x*y+points[i].b;
				x=x2-y2+points[i].a;
				
				if ( (x-points[i].x)*(x-points[i].x)+(y-points[i].y)*(y-points[i].y) < .01 )
					points[i].valid=false;
				
				//x=points[i].y+1-x2;
				//y=points[i].x;

				points[i].x=x;
				points[i].y=y;
				
			}
			i++;
		}
	}
}
//display patch
void patch()
{
	double h4 = height/4.0, w4 = width/4.0, h2 = height/2.0, w2 = width/2.0;
	double rstep = 4.0/height, cstep = 4.0/width;
    double a=-2, b=-2, x=0, y=0, x2=0, y2=0;
    int iter=maxItr;
	int len = height*width;
	int i,j,r,c,rr,cc;

	i=0;
	j=0;
	for (r=0;r<height;r++)
	{
		for (c=0;c<width;c++)
		{
			//if (points[i].x*points[i].x+points[i].y*points[i].y>4)
			//{
				pixels[j]=0;
				pixels[j+1]=0;
				pixels[j+2]=0;
			/*}
			else
			{
				pixels[j]=1;
				pixels[j+1]=1;
				pixels[j+2]=1;
			}*/
				j+=3;
		}
	}
	i=0;
	j=0;
	for (r=0;r<height;r++)
	{
		for (c=0;c<width;c++)
		{
			if (points[i].valid)
			{
				//compute location in count array
				rr = points[i].y*(h4)+(h2);
				cc = points[i].x*(w4)+(w2);
				//ignore first iteration
				j=(rr*3*width+cc*3);
				if (j>=0 && j<len*3)
				{
					pixels[j]=points[i].red;
					pixels[j+1]=points[i].green;
					pixels[j+2]=points[i].blue;
				}
			}
			i++;
		}
	}
}

/********************************************************************
 *  keyboard 
 *
 * Callback function called by GLUT when a key is pressed.
 * 
 *  Parameters:
 *  key - The key pressed.
 *  x, y - Mouse position when the key is pressed.
 *******************************************************/ 
void keyboard (unsigned char key, int x, int y)
{
	int i=0;
	char *o = "output.bmp";
	
	switch (key)		
    {
	//----Close the window
	case 'q':
	case 'Q':
	case 'x':
	case 'X':
		exit(0);

	//----increase budhabrot scale
	case '+':
		if (disp==BUDDHA)
			dark*=2;
		break;

	case '*':
		maxItr*=2;
		break;

	case '/':
		maxItr/=2;
		break;

	//----Fill the image with a single color
    case '1':     
		disp = MANDEL;
		break;


	//----Fill the image with a top-to-bottom color gradient
    case '2':
		disp = BUDDHA;
		break;

	//----create a patch of initial conditions to follow
	case '3':
		stepPatch();
		disp = PATCH;
		break;
	
    //print image to a file
	case 'p':
		rtWriteImage(pixels,o);
		/*CAREFUL THIS WRITES 100 images
		makePatch();
		for (i=0;i<100;i++)
		{
			stepPatch();
			patch();
			itoa(i,c,10);
			strcat(c,o);
			rtWriteImage(pixels,c);
		}
		*/
		break;
	}

	if (disp==MANDEL)
		mandel();
	else if (disp==BUDDHA)
		buddha();
	else if (disp==PATCH)
		patch();

	//automatically call display
	glutPostRedisplay();
}



/*******************************************************
 *  main 
 * 
 *  Main entry point for this program.
 *  main will 
 *   1. Initialize your GLUT window and data
 *   2. Set up callbacks 
 *   3. Enter the main event loop.  
 *******************************************************/ 
int main (int argc, char* argv[])
{ 

    //----Tell GLUT to use a single buffer with three color channels
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);

	/*******************************************************
     *        set window size, location and open window
     *******************************************************/
	width = 600, height = 600;
	int x = 100, y = 100;
	glutInitWindowSize(width,height);
	glutInitWindowPosition(x,y);
	glutCreateWindow("Kyle Maxwell: Mandlebrot");

    //----Set background color 
    glClearColor(0.0f, 0.0f, 0.0f, 1.f);

   	//----Set viewing window
	glViewport(0, 0, (GLsizei) width, (GLsizei) height);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glOrtho (0.0, width, 0.0, height, -1.0, 1.0);
	glMatrixMode(GL_MODELVIEW);

	pixels = (float*) malloc(3*height*width*sizeof(float));
	count = (float*) malloc(height*width*sizeof(int));
	points = (Location*) malloc(height*width*sizeof(Location));
	if (pixels == NULL || count==NULL || points == NULL)
		exit(0);
   makePatch();
    //----Tell GLUT about the display callback functions --
	//----this let's GLUT know what function to call in order
	//----to redraw (we are passing a pointer to the function 
	//----display().)
    glutDisplayFunc (display);
	glutKeyboardFunc (keyboard);
	
    
    //----Default to first image
	keyboard('3',0,0);
    //----Enter the GLUT event loop.
    glutMainLoop();

    //----Exit
    return 0;
}


