/*
 * Created on Dec 23, 2005
 */

/**
 * @author Kylu
 */
import javax.swing.*;
import java.awt.*;
/*System.out.println(i);
System.out.println(rstep+","+cstep);
System.out.println(b+","+a);
System.out.println(r+","+c);
System.out.println(y+","+x);*/

public class FractalApp extends JApplet
{
    Color [][] img;
    int rows, cols;
    boolean calculate;
    public FractalApp()
    {
        calculate=true;
        this.setSize(600,600);
        this.setVisible(true);
        rows=600;
        cols=600;
        img = new Color[rows][cols];
        double rstep = 4.0/rows, cstep = 4.0/cols;
        double a=-2, b=-2, x=0, y=0, x2=0, y2=0;
        int iter=100;
        for (int r=0;r<rows;r++)
        {
            a=-2;
            for (int c=0;c<cols;c++)
            {
                x=0;y=0;x2=0;y2=0;
                for (int i=0;i<iter;i++)
                {
                    x2=x*x;
                    y2=y*y;
                    if (i==iter-1)
                        img[r][c]=Color.WHITE;//new Color(0,0,0);
                    else
                    {
                        if (x2+y2>4)
	                    {
                            double j = (((double)i/(double)iter))*10000;
                            if (j>10000)
                                j=.2;
                            else if (j>1000)
                                j=.4;
                            else if (j>100)
                                j=.6;
                            else if (j>10)
                                j=.8;
                            else if (j>1)
                                j=1;
                            int k=(int)(j*255.0);
                            img[r][c]=new Color(k,k,k);
                            i=iter;
	                    }
                        else
                        {	y=2*x*y+a;
		                    x=x2-y2+b;
		                }
                    }
                }
                a+=cstep;
            }
            //repaint();
            b+=rstep;
        }
        calculate=false;
        repaint();
    }
    public void paint(Graphics g)
    {
        g.clearRect(0,0,getWidth(),getHeight());
        if (calculate)
        {
            g.setColor(Color.BLUE);
            g.drawString("calc...",10,10);
        }
        int r2 = rows/2,c2=cols/2;
        for (int r=0;r<rows;r++)
            for (int c=0;c<cols;c++)
            {
                if (r==r2||c==c2)
                   g.setColor(Color.GRAY); 
                else
                    g.setColor(img[r][c]);
            	g.drawRect(r+10,c+10,1,1);
            }
        
    }
}
