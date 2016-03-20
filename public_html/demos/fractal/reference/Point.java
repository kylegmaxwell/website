
public class Point
{
	public double x,y;
	
	public Point(Point p)
	{
		x=p.x;
		y=p.y;
	}
	public Point(double x, double y)
	{
		this.x=x;
		this.y=y;
	}
	
	public int intX()
	{ return (int)x; }
	
	public int intY()
	{ return (int)y; }
	public Point scale(double d)
	{ x*=d;
	y*=d;
	return this;
	}
	public static Point add(Point a, Point b)
	{ return new Point(a.x+b.x,a.y+b.y); }
	
	public static Point sub(Point a, Point b)
	{ return new Point(a.x-b.x,a.y-b.y); }
	public boolean equals(Object o)
	{
	    Point p = (Point)o;
	    return p.x==x && p.y==y;
	}
	public String toString()
	{ return "("+x+","+y+")"; }
}
