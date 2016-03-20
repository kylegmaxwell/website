#ifndef LOCATION
#define LOCATION

#include <stdlib.h>

typedef struct
{
	double x;
	double y;
	double a;
	double b;
	bool valid;
	float red;
	float green;
	float blue;
} Location;

void toNext(Location *loc);

#endif