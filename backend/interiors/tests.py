from django.test import SimpleTestCase
from copy import deepcopy
from interiors.optimizer.Geometry import *
from interiors.optimizer.Optimizer import *


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

        r2 = Rectangle(5, 15, Point(10, 0))
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

        r3 = Rectangle(5, 15, Point(5, 0))
        self.assertEqual(r1.spacebetween(r3), -2.5)
        self.assertEqual(r3.spacebetween(r1), -2.5)
        self.assertTrue(r1.overlaps(r3))
        self.assertTrue(r3.overlaps(r1))

    def test_wall(self):
        data = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 1050, "y": 50},
            ],
            "top": 50,
            "bottom": 500,
            "left": 50,
            "right": 1050,
            "topleft": [],
            "topright": [{"x": 400, "y": 275}, {"x": 800, "y": 50}],
            "holes": [{"centerx": 675, "centery": 350, "width": 150, "height": 300}],
        }
        wall = Wall()
        wall.parseJSON(data)
        self.assertEqual(wall.top, 50)
        self.assertEqual(wall.left, 50)
        self.assertEqual(wall.right, 1050)
        self.assertEqual(wall.bottom, 500)

        self.assertTrue(wall.topright)
        self.assertFalse(wall.topleft)
        l = [0.5625, 1, -500]
        a2b2 = sqrt(l[0] ** 2 + l[1] ** 2)
        l = [i / a2b2 for i in l]
        for i, j in zip(wall.toprightparams, l):
            self.assertAlmostEqual(i, j)

        self.assertEqual(len(wall.holes), 1)
        self.assertEqual(type(wall.holes[0]), type(Rectangle(0, 0, Point(0, 0))))
        self.assertEqual(wall.holes[0].center.x, 675)
        self.assertEqual(wall.holes[0].center.y, 350)
        self.assertEqual(wall.holes[0].width, 150)
        self.assertEqual(wall.holes[0].height, 300)


class OptimizerTestCase(SimpleTestCase):
    def test_parser(self):
        rectangle_json = [
            [
                {
                    "parent": "drag_zone",
                    "width": 100,
                    "height": 100,
                    "color": "#000000",
                    "offset": {"left": 100, "top": 100},
                },
                {
                    "parent": "spawn_zone",
                    "width": 100,
                    "height": 100,
                    "color": "#000000",
                    "offset": {"left": 0, "top": -52},
                },
            ]
        ]
        wall_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 1050, "y": 50},
                {"x": 1050, "y": 500},
                {"x": 750, "y": 500},
                {"x": 750, "y": 200},
                {"x": 600, "y": 200},
                {"x": 600, "y": 500},
                {"x": 50, "y": 500},
            ],
            "top": 50,
            "bottom": 500,
            "left": 50,
            "right": 1050,
            "topleft": [],
            "topright": [{"x": 400, "y": 275}, {"x": 800, "y": 50}],
            "holes": [{"centerx": 675, "centery": 350, "width": 150, "height": 300}],
        }
        preferred_spacing = 30
        poly_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 300, "y": 50},
                {"x": 300, "y": 500},
                {"x": 50, "y": 500},
            ]
        }

        opt = Optimizer(rectangle_json, wall_json, preferred_spacing, poly_json, 0)

        self.assertEqual(len(opt.fixed), 1)
        rect1 = opt.fixed[0]
        self.assertEqual(rect1.width, 100)
        self.assertEqual(rect1.height, 100)
        self.assertEqual(rect1.center.x, 150)
        self.assertEqual(rect1.center.y, 150)

        self.assertEqual(len(opt.optimized), 1)
        rect2 = opt.optimized[0]
        self.assertEqual(rect2.width, 100)
        self.assertEqual(rect2.height, 100)

        vertices = np.array([[50, 50], [300, 50], [300, 500], [50, 500]])

        self.assertTrue(np.all(opt.poly.vertices == vertices))
        self.assertEqual(opt.polycentroid.x, 175)
        self.assertEqual(opt.polycentroid.y, 275)

        self.assertEqual(opt.topleft, False)
        self.assertEqual(opt.topright, True)
        l1 = opt.toprightparams
        l2 = [0.5625, 1, -500]
        a2b2 = sqrt(l2[0] ** 2 + l2[1] ** 2)
        l2 = [i / a2b2 for i in l2]
        for i, j in zip(l1, l2):
            self.assertAlmostEqual(i, j)

        self.assertEqual(opt.spacing, 30)

        self.assertEqual(opt.min_y, 50)
        self.assertEqual(opt.min_x, 50)
        self.assertEqual(opt.max_y, 500)
        self.assertEqual(opt.max_x, 1050)

        self.assertEqual(opt.scale, 1000 / 30)
        self.assertEqual(opt.poly_scale, opt.scale)
        self.assertEqual(opt.overlap_punishment_factor, opt.scale * 4)

    def test_update(self):
        rectangle_json = [
            [
                {
                    "parent": "drag_zone",
                    "width": 100,
                    "height": 100,
                    "color": "#000000",
                    "offset": {"left": 100, "top": 100},
                },
                {
                    "parent": "spawn_zone",
                    "width": 50,
                    "height": 60,
                    "color": "#000000",
                    "offset": {"left": 0, "top": -52},
                },
            ]
        ]
        res = [100, 20]
        copy = deepcopy(rectangle_json)

        updateJSON(rectangle_json, res)

        copy[0][1]["offset"]["left"] = 100 - 50 / 2
        copy[0][1]["offset"]["top"] = 20 - 60 / 2
        copy[0][1]["parent"] = "drag_zone"

        self.assertEqual(rectangle_json, copy)

    def test_iter_counter(self):
        rectangle_json = [
            [
                {
                    "parent": "spawn_zone",
                    "width": 100,
                    "height": 100,
                    "color": "#000000",
                    "offset": {"left": 0, "top": 0},
                },
            ]
        ]
        wall_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 1050, "y": 50},
                {"x": 1050, "y": 500},
                {"x": 750, "y": 500},
                {"x": 750, "y": 200},
                {"x": 600, "y": 200},
                {"x": 600, "y": 500},
                {"x": 50, "y": 500},
            ],
            "top": 50,
            "bottom": 500,
            "left": 50,
            "right": 1050,
            "topleft": [],
            "topright": [{"x": 800, "y": 50}, {"x": 1050, "y": 300}],
            "holes": [{"centerx": 675, "centery": 350, "width": 150, "height": 300}],
        }
        preferred_spacing = 30
        poly_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 300, "y": 50},
                {"x": 300, "y": 500},
                {"x": 50, "y": 500},
            ]
        }
        opt = Optimizer(rectangle_json, wall_json, preferred_spacing, poly_json, 0)
        self.assertEqual(opt.counter, 0)
        for i in range(1, 10):
            opt.iter_counter(None, None)
            self.assertEqual(opt.counter, i)

    def test_rect2rect(self):
        rectangle_json = [
            [
                {
                    "parent": "drag_zone",
                    "width": 100,
                    "height": 100,
                    "color": "#000000",
                    "offset": {"left": 100, "top": 100},
                },
                {
                    "parent": "spawn_zone",
                    "width": 100,
                    "height": 100,
                    "color": "#000000",
                    "offset": {"left": 0, "top": 0},
                },
            ]
        ]
        wall_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 1050, "y": 50},
                {"x": 1050, "y": 500},
                {"x": 750, "y": 500},
                {"x": 750, "y": 200},
                {"x": 600, "y": 200},
                {"x": 600, "y": 500},
                {"x": 50, "y": 500},
            ],
            "top": 50,
            "bottom": 500,
            "left": 50,
            "right": 1050,
            "topleft": [],
            "topright": [{"x": 400, "y": 275}, {"x": 800, "y": 50}],
            "holes": [{"centerx": 675, "centery": 350, "width": 150, "height": 300}],
        }
        preferred_spacing = 30
        poly_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 300, "y": 50},
                {"x": 300, "y": 500},
                {"x": 50, "y": 500},
            ]
        }

        opt = Optimizer(rectangle_json, wall_json, preferred_spacing, poly_json, 0)

        x = [350, 150]
        for i, rect in enumerate(opt.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        self.assertEqual(opt.optimized[0].spacebetween(opt.fixed[0]), 100)

        error = opt.rect2rect()
        self.assertEqual(error, 100 - opt.spacing)

        x = [230, 20]
        for i, rect in enumerate(opt.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        self.assertEqual(opt.optimized[0].spacebetween(opt.fixed[0]), 30)

        error = opt.rect2rect()
        self.assertEqual(error, 0)

        x = [150, 100]
        for i, rect in enumerate(opt.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        error = opt.rect2rect()
        self.assertEqual(error, (1 + 50) * opt.overlap_punishment_factor)

    def test_rect2wall(self):
        rectangle_json = [
            [
                {
                    "parent": "spawn_zone",
                    "width": 100,
                    "height": 100,
                    "color": "#000000",
                    "offset": {"left": 0, "top": 0},
                },
            ]
        ]
        wall_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 1050, "y": 50},
                {"x": 1050, "y": 500},
                {"x": 750, "y": 500},
                {"x": 750, "y": 200},
                {"x": 600, "y": 200},
                {"x": 600, "y": 500},
                {"x": 50, "y": 500},
            ],
            "top": 50,
            "bottom": 500,
            "left": 50,
            "right": 1050,
            "topleft": [],
            "topright": [{"x": 800, "y": 50}, {"x": 1050, "y": 300}],
            "holes": [{"centerx": 675, "centery": 350, "width": 150, "height": 300}],
        }
        preferred_spacing = 30
        poly_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 300, "y": 50},
                {"x": 300, "y": 500},
                {"x": 50, "y": 500},
            ]
        }

        opt = Optimizer(rectangle_json, wall_json, preferred_spacing, poly_json, 0)

        x = [150, 400]
        for i, rect in enumerate(opt.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        error = opt.rect2wall()
        self.assertEqual(error, 0)

        x = [110, 150]
        for i, rect in enumerate(opt.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        error = opt.rect2wall()
        self.assertEqual(error, (opt.spacing - 10) * opt.scale)

        x = [580, 300]
        for i, rect in enumerate(opt.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        error = opt.rect2wall()
        self.assertEqual(error, (30 + 1) * opt.overlap_punishment_factor)

        x = [840, 200]
        for i, rect in enumerate(opt.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        self.assertEqual(rect.center.x + rect.halfwidth, 890)
        self.assertEqual(rect.center.y - rect.halfheight, 150)

        error = opt.rect2wall()
        self.assertAlmostEqual(error, (opt.spacing - 7.0710678118655) * opt.scale)

    def test_rect2poly(self):
        rectangle_json = [
            [
                {
                    "parent": "spawn_zone",
                    "width": 100,
                    "height": 100,
                    "color": "#000000",
                    "offset": {"left": 0, "top": 0},
                },
            ]
        ]
        wall_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 1050, "y": 50},
                {"x": 1050, "y": 500},
                {"x": 750, "y": 500},
                {"x": 750, "y": 200},
                {"x": 600, "y": 200},
                {"x": 600, "y": 500},
                {"x": 50, "y": 500},
            ],
            "top": 50,
            "bottom": 500,
            "left": 50,
            "right": 1050,
            "topleft": [],
            "topright": [{"x": 800, "y": 50}, {"x": 1050, "y": 300}],
            "holes": [{"centerx": 675, "centery": 350, "width": 150, "height": 300}],
        }
        preferred_spacing = 30
        poly_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 300, "y": 50},
                {"x": 300, "y": 500},
                {"x": 50, "y": 500},
            ]
        }

        opt = Optimizer(rectangle_json, wall_json, preferred_spacing, poly_json, 0)

        x = [100, 100]
        for i, rect in enumerate(opt.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        error = opt.rect2poly()
        self.assertEqual(error, 0)

        x = [500, 275]
        for i, rect in enumerate(opt.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        error = opt.rect2poly()
        self.assertEqual(error, (500 - 175) * opt.poly_scale)

    def test_isvalid(self):
        rectangle_json = [
            [
                {
                    "parent": "drag_zone",
                    "width": 100,
                    "height": 100,
                    "color": "#000000",
                    "offset": {"left": 100, "top": 100},
                },
                {
                    "parent": "spawn_zone",
                    "width": 100,
                    "height": 100,
                    "color": "#000000",
                    "offset": {"left": 0, "top": 0},
                },
            ]
        ]
        wall_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 1050, "y": 50},
                {"x": 1050, "y": 500},
                {"x": 750, "y": 500},
                {"x": 750, "y": 200},
                {"x": 600, "y": 200},
                {"x": 600, "y": 500},
                {"x": 50, "y": 500},
            ],
            "top": 50,
            "bottom": 500,
            "left": 50,
            "right": 1050,
            "topleft": [],
            "topright": [{"x": 400, "y": 50}, {"x": 1050, "y": 300}],
            "holes": [{"centerx": 675, "centery": 350, "width": 150, "height": 300}],
        }
        preferred_spacing = 30
        poly_json = {
            "vertices": [
                {"x": 50, "y": 50},
                {"x": 300, "y": 50},
                {"x": 300, "y": 500},
                {"x": 50, "y": 500},
            ]
        }

        opt = Optimizer(rectangle_json, wall_json, preferred_spacing, poly_json, 0)

        x = [350, 150]
        isvalid = opt.isvalid(x)
        self.assertTrue(isvalid)

        x = [800, 150]
        isvalid = opt.isvalid(x)
        self.assertFalse(isvalid)

        x = [675, 350]
        isvalid = opt.isvalid(x)
        self.assertFalse(isvalid)

        x = [110, 110]
        isvalid = opt.isvalid(x)
        self.assertFalse(isvalid)

    def test_place_rectangles(self):
        rectangle_json = [
            [
                {
                    "parent": "spawn_zone",
                    "width": 390,
                    "height": 290,
                    "color": "#000000",
                    "offset": {"left": 0, "top": 0},
                },
            ]
        ]
        wall_json = {
            "vertices": [],
            "top": 50,
            "bottom": 500,
            "left": 50,
            "right": 500,
            "topleft": [],
            "topright": [],
            "holes": [{"centerx": 250, "centery": 100, "width": 400, "height": 100}],
        }
        preferred_spacing = 30
        poly_json = {
            "vertices": [
                {"x": 50, "y": 500},
                {"x": 500, "y": 500},
                {"x": 500, "y": 50},
                {"x": 50, "y": 50},
            ]
        }

        place_rectangles(rectangle_json, wall_json, preferred_spacing, poly_json, 0)

        self.assertAlmostEqual(rectangle_json[0][0]["offset"]["left"], 80)
        self.assertAlmostEqual(rectangle_json[0][0]["offset"]["top"], 180)
