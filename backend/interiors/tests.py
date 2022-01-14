from django.test import SimpleTestCase
from interiors.optimizer.Geometry import *

class GeometryTestCase(SimpleTestCase):
    def setUp(self):
        pass

    def test_point(self):
        p1 = Point(0, 0)
        self.assertEqual(p1.x, 0)
        self.assertEqual(p1.y, 0)

        p2 = Point(3, 4)
        self.assertEqual(p2.x, 3)
        self.assertEqual(p2.y, 4)

        self.assertEqual(p1.dist(p2), 5)
        self.assertEqual(p2.dist(p1), 5)

    def test_rectangle(self):
        r1 = Rectangle(10, 10, Point(0, 0))
        self.assertEqual(r1.halfheight, 5)
        self.assertEqual(r1.halfwidth, 5)
        self.assertEqual(r1.width, 10)
        self.assertEqual(r1.height, 10)
        self.assertEqual(r1.center.x, 0)
        self.assertEqual(r1.center.y, 0)

        r2 = Rectangle(5, 15, Point(10 ,0))
        self.assertEqual(r2.halfheight, 7.5)
        self.assertEqual(r2.halfwidth, 2.5)
        self.assertEqual(r2.width, 5)
        self.assertEqual(r2.height, 15)
        self.assertEqual(r2.center.x, 10)
        self.assertEqual(r2.center.y, 0)

        self.assertEqual(r1.spacebetween(r2), 2.5)
        self.assertEqual(r2.spacebetween(r1), 2.5)
        self.assertFalse(r1.overlaps(r2))
        self.assertFalse(r2.overlaps(r1))

        r3 = Rectangle(5, 15, Point(5,0))
        self.assertEqual(r1.spacebetween(r3), -2.5)
        self.assertEqual(r3.spacebetween(r1), -2.5)
        self.assertTrue(r1.overlaps(r3))
        self.assertTrue(r3.overlaps(r1))

    def test_wall(self):
        data = {
            "vertices": [
            {
                "x": 50,
                "y": 50
            },
            {
                "x": 1050,
                "y": 50
            },
            ],
            "top": 50,
            "bottom": 500,
            "left": 50,
            "right": 1050,
            "topleft": [],
            "topright": [
            {
                "x": 400,
                "y": 275
            },
            {
                "x": 800,
                "y": 50
            }
            ],
            "holes": [
            {
                "centerx": 675,
                "centery": 350,
                "width": 150,
                "height": 300
            }
            ]
        }
        wall = Wall()
        wall.parseJSON(data)
        self.assertEqual(wall.top, 50)
        self.assertEqual(wall.left, 50)
        self.assertEqual(wall.right, 1050)
        self.assertEqual(wall.bottom, 500)

        self.assertEqual(len(wall.topleft), 0)

        self.assertEqual(len(wall.topright), 2)
        self.assertEqual(wall.topright[0].x, 400)
        self.assertEqual(wall.topright[0].y, 275)
        self.assertEqual(wall.topright[1].x, 800)
        self.assertEqual(wall.topright[1].y, 50)

        self.assertEqual(len(wall.holes), 1)
        self.assertEqual(type(wall.holes[0]), type(Rectangle(0, 0, Point(0, 0))))
        self.assertEqual(wall.holes[0].center.x, 675)
        self.assertEqual(wall.holes[0].center.y, 350)
        self.assertEqual(wall.holes[0].width, 150)
        self.assertEqual(wall.holes[0].height, 300)


