from math import sqrt
from itertools import combinations


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def dist(self, other):
        return sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2)

    def __sub__(self, other):
        if isinstance(other, Point):
            return Point(self.x - other.x, self.y - other.y)
        else:
            raise Exception(f"{other} is not an instance of class Point.")

    def __add__(self, other):
        if isinstance(other, Point):
            return Point(self.x + other.x, self.y + other.y)
        else:
            raise Exception(f"{other} is not an instance of class Point.")

    def crossProduct(self, other):
        # Cross product of vectors starting at (0,0)
        if isinstance(other, Point):
            return self.x * other.y - self.y * other.x
        else:
            raise Exception(f"{other} is not an instance of class Point.")

    def __neg__(self):
        return Point(-self.x, -self.y)


class Segment:
    def __init__(self, point1, point2):
        self.point1 = point1
        self.point2 = point2

    def intersects(self, other):
        if isinstance(other, Segment):
            AB = self
            CD = other
            AC = Segment(AB.point1, CD.point1)
            BC = Segment(AB.point2, CD.point1)
            BD = Segment(AB.point2, CD.point2)

            ACD = AC.crossProduct(CD)
            BCD = BC.crossProduct(CD)
            ABC = AB.crossProduct(BC)
            ABD = AB.crossProduct(BD)

            return ACD * BCD < 0 and ABC * ABD < 0
        else:
            raise Exception(f"{other} is not an instance of class Segment.")

    def crossProduct(self, other):
        # Cross product of segments
        if isinstance(other, Segment):
            v1 = self.point2 - self.point1
            v2 = other.point2 - other.point1
            return v1.crossProduct(v2)
        else:
            raise Exception(f"{other} is not an instance of class Segment.")


class Polygon:
    def __init__(self, points):
        if isinstance(points, list):
            for point in points:
                if not isinstance(point, Point):
                    raise Exception(f"{points} is not a list of Points.")

            self.points = points

        else:
            raise Exception(f"{points} is not a list of Points.")

    def isconvex(self):
        previous_dir = 0
        current_dir = 0
        n = len(self.points)
        for i in range(n):
            v1 = self.points[(i + 1) % n] - self.points[i % n]
            v2 = self.points[(i + 2) % n] - self.points[(i + 1) % n]
            current_dir = v1.crossProduct(v2)

            if current_dir == 0 or current_dir * previous_dir < 0:
                return False
            previous_dir = current_dir

        return True

    def isintersecting(self):
        n = len(self.points)
        segments = [Segment(self.points[i], self.points[(i + 1) % n]) for i in range(n)]
        for segment1, segment2 in combinations(segments, 2):
            if segment1.intersects(segment2):
                return True
        return False


class Rectangle(Polygon):
    def __init__(self, width, height, center):
        self.__halfwidth = width / 2
        self.__halfheigt = height / 2
        self.center = center

    @property
    def width(self):
        return self.__halfwidth * 2

    @width.setter
    def width(self, width):
        self.__halfwidth = width / 2

    @property
    def height(self):
        return self.__halfheigt * 2

    @height.setter
    def height(self, height):
        self.__halfheigt = height / 2

    @property
    def points(self):
        return [
            Point(self.center.x + self.__halfwidth, self.center.y + self.__halfheigt),
            Point(self.center.x + self.__halfwidth, self.center.y - self.__halfheigt),
            Point(self.center.x - self.__halfwidth, self.center.y - self.__halfheigt),
            Point(self.center.x - self.__halfwidth, self.center.y + self.__halfheigt),
        ]

    def overlaps(self, other):
        return self.spacebetween(other) < 0

    def spacebetween(self, other):
        if isinstance(other, Rectangle):
            d1 = (
                abs(self.center.x - other.center.x)
                - self.__halfwidth
                - other.__halfwidth
            )
            d2 = (
                abs(self.center.y - other.center.y)
                - self.__halfheigt
                - other.__halfheigt
            )

            return max(d1, d2)
        else:
            raise Exception(f"{other} is not an instance of class Rectangle.")
