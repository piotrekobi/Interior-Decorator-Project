"""Defines classes representing data for use in Optimizer module

Classes:
    Point
    Rectangle
    Wall
"""


from math import sqrt
from itertools import combinations


class Point:
    """Represents a point on a 2d cartesian plane.

        Attributes:
            x : float
                first point coordinate
            y: float
                second point coordinate

        Methods:
            dist(other):
                Calculates and returns a distance to another point

    """
    def __init__(self, x, y):
        """Constructs a point
        
        Parameters:
            x : float
                first point coordinate
            y: float
                second point coordinate
        """
        self.x = x
        self.y = y

    def dist(self, other):
        """Calculates and returns a euclidian distance to another point

        Parameters:
            other: Point
                the other point
        """
        return sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2)


class Rectangle:
    """Represents a rectangle. For better performance data integrity is not checked.

        Attributes:
            width : float
                width of the rectangle
            height: float
                height of the rectangle
            halfwidth: float
                half of width, used to decrease the ammount of divisions when arranging rectangles
            halfheight: float
                half of height, used to decrease the ammount of divisions when arranging rectangles
            center: Point
                center of the rectangle

        Methods:
            overlaps(other):
                Calculates whether it overlaps another rectangle and returns the result.
            spacebetween(other):
                Calculates and returns the smallest distance between edges of self and other, in either the x or y direction.

        """
    def __init__(self, width, height, center):
        """Constructs a rectangle
        
        Parameters:
            width : float
                width of the rectangle
            height: float
                height of the rectangle
            center: Point
                center of the rectangle
        """
        self.halfwidth = width / 2
        self.halfheight = height / 2
        self.width = width
        self.height = height
        self.center = center

    def overlaps(self, other):
        """Calculates whether it overlaps another rectangle and returns the result.
        Return is the same as self.spacebetween(other) < 0"""
        return self.spacebetween(other) < 0

    def spacebetween(self, other):
        """Calculates and returns the smallest distance between edges of self and other, in either the x or y direction.
        The distance is calculated as euclidian distance between lines going through the edges of rectangles.
        If self and other overlap, distance returned is negative.
        
        Parameters:
            other : Rectangle
                the other rectangle
        """
        d1 = abs(self.center.x - other.center.x) - self.halfwidth - other.halfwidth
        d2 = abs(self.center.y - other.center.y) - self.halfheight - other.halfheight
        return max(d1, d2)


class Wall:
    """Represents a wall.

    Attributes:
        top : float
            Minimum y coordinate of the bounding rectangle of the wall. 
        bottom: float
            Maximum y coordinate of the bounding rectangle of the wall. 
        left: float
            Minimum x coordinate of the bounding rectangle of the wall. 
        right: float
            Maximum x coordinate of the bounding rectangle of the wall. 
        topleft: boolean
            Whether wall has the topleft segment
        topright: boolean
            Whether wall has the topright segment
        (optional)
            topleftparams: [float, float, float]
                If topleft == true, contains a list of parameters [a, b, c] representing a line equation a*x + b*y + c = 0.
                Represented line goes through the top-left, diagonal segment of the wall.
            toprightparams: [Point, Point]
                If topright == true, contains a list of parameters [a, b, c] representing a line equation a*x + b*y + c = 0.
                Represented line goes through the top-right, diagonal segment of the wall.
            holes: list(Rectangle)
                List of rectangular holes in the wall, given as instances of class Rectangle.

    Methods:
        parseJSON(data):
            Calculates object attributes based on a JSON object 'data'.

    """
    def __init__(self):
        pass

    def parseJSON(self, data):
        """Calculates object attributes based on a JSON object 'data'.

        Parameters:
            data: object
                object representing wall data. Should contain following entries:
                {
                    "top": float
                    "bottom": float
                    "left": float
                    "rigth": float
                    "topleft": [] or [Point p1, Point p2], where p1.x < p2.x and p1.y > p2.y
                    "topleft": [] or [Point p1, Point p2], where p1.x < p2.x and p1.y < p2.y
                    "holes": [] or list(Rectangle)
                }
        """
        self.bottom = data["bottom"]
        self.left = data["left"]
        self.right = data["right"]

        self.topleft = [Point(i["x"], i["y"]) for i in data["topleft"]]
        self.topright = [Point(i["x"], i["y"]) for i in data["topright"]]

        self.holes = [
            Rectangle(i["width"], i["height"], Point(i["centerx"], i["centery"]))
            for i in data["holes"]
        ]

        # calculate line equations
        if len(self.topleft) == 2:
            xa, xb, ya, yb = (
                self.topleft[0].x,
                self.topleft[1].x,
                self.topleft[0].y,
                self.topleft[1].y,
            )
            a = ya - yb
            b = xb - xa
            c = xa * yb - xb * ya
            a2b2 = sqrt(a * a + b * b)
            a /= a2b2
            b /= a2b2
            c /= a2b2

            self.topleft = True
            self.topleftparams = [a, b, c]
        else:
            self.topleft = False

        if len(self.topright) == 2:
            xa, xb, ya, yb = (
                self.topright[0].x,
                self.topright[1].x,
                self.topright[0].y,
                self.topright[1].y,
            )
            a = ya - yb
            b = xb - xa
            c = xa * yb - xb * ya
            a2b2 = sqrt(a * a + b * b)
            a /= a2b2
            b /= a2b2
            c /= a2b2

            self.topright = True
            self.toprightparams = [a, b, c]
        else:
            self.topright = False