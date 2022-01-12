from itertools import combinations
import json
from math import sqrt
import numpy as np
import scipy.optimize as opt
import matplotlib.path as mpltPath
from interiors.optimizer.Geometry import Wall
from interiors.optimizer.Geometry import Point, Rectangle
from interiors.optimizer.Constants import *


class Optimizer:
    def __init__(self):
        pass

    def rect2rect(self):
        overlap_error = 0
        gap_small_error = 0
        gap_big_error = 0

        rectangles = self.fixed + self.optimized
        for rect1, rect2 in combinations(rectangles, 2):
            d = rect1.spacebetween(rect2)
            if d > self.spacing:
                gap_big_error += d - self.spacing
            elif d >= 0:
                gap_small_error += self.spacing - d
            else:
                overlap_error += 1 - d

        return (
            overlap_error * self.overlap_punishment_factor
            + gap_small_error * self.scale
            + gap_big_error
        )

    def rect2wall(self):
        overlap_error = 0
        gap_small_error = 0
        for rect in self.optimized:
            # Punishment for being too close to vertical/horizontal wall boundaries
            left = rect.center.x - rect.halfwidth
            right = rect.center.x + rect.halfwidth
            top = rect.center.y - rect.halfheight
            bottom = rect.center.y + rect.halfheight

            dleft = left - self.min_x
            dright = self.max_x - right
            dbottom = self.max_y - bottom
            dtop = top - self.min_y

            d = min(dleft, dright, dbottom, dtop)
            if d < self.spacing:
                gap_small_error += self.spacing - d

            # Punishment for being too close to diagonal wall boundaries
            dtopleft = self.spacing if not self.topleft else self.topleftparams[0]*left + self.topleftparams[1]*top + self.topleftparams[2]
            dtopright = self.spacing if not self.topright else self.toprightparams[0]*right + self.toprightparams[1]*top + self.toprightparams[2]
            d = min(dtopleft, dtopright)
            if d < 0:
                overlap_error += 1 - d
            elif d < self.spacing:
                gap_small_error += self.spacing - d

            # Punishment for being too close to wall holes or overlapping them
            for hole in self.wall:
                d = rect.spacebetween(hole)
                if d < 0:
                    overlap_error += 1 - d
                elif d < self.spacing:
                    gap_small_error += self.spacing - d

        return (
            gap_small_error * self.scale
            + overlap_error * self.overlap_punishment_factor
        )

    def rect2poly(self):
        error = 0
        for rect in self.optimized:
            if not self.poly.contains_point((rect.center.x, rect.center.y)):
                error += rect.center.dist(self.polycentroid)
        return error*self.poly_scale

    def obj_func(self, x):
        error = 0

        for i, rect in enumerate(self.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        error += self.rect2rect()
        error += self.rect2wall()
        error += self.rect2poly()

        return error

    def optimize(self):
        my_bounds = opt.Bounds(
            [
                b
                for r in self.optimized
                for b in [self.min_x + r.halfwidth, self.min_y + r.halfheight]
            ],
            [
                b
                for r in self.optimized
                for b in [self.max_x - r.halfwidth, self.max_y - r.halfheight]
            ],
        )

        res = opt.differential_evolution(
            self.obj_func,
            maxiter=MAXITER,
            bounds=my_bounds,
            seed=SEED,
            popsize=POPSIZE,
            recombination=RECOMBINATION,
            strategy=STRATEGY,
            mutation=MUTATION,
            disp=True,
            workers=4,
            updating="deferred"
        )

        for i, rect in enumerate(self.optimized):
            rect.center = Point(res.x[2 * i], res.x[2 * i + 1])

        print(self.rect2rect(), self.rect2wall(), self.rect2poly())

        return res.x

    def parseJSON(self, rectangle_json, wall_json, preferred_spacing, poly_json):
        rectangles = []
        fixed_rectangles = []
        
        # parse rectangles
        for rect_data in rectangle_json[0]:
            rect = Rectangle(
                float(rect_data["width"]),
                float(rect_data["height"]),
                Point(
                    float(rect_data["offset"]["left"]),
                    float(rect_data["offset"]["top"]),
                ),
            )
            rect.center.x += rect.width / 2
            rect.center.y += rect.height / 2

            if rect_data["parent"] == "spawn_zone":
                rectangles.append(rect)
            else:
                fixed_rectangles.append(rect)

        # parse polygon
        self.poly = mpltPath.Path(np.array([[i["x"], i["y"]] for i in poly_json["vertices"]]))
        self.polycentroid = np.mean(self.poly.vertices, axis=0)
        self.polycentroid = Point(self.polycentroid[0], self.polycentroid[1])

        # parse wall
        wall = Wall()
        wall.parseJSON(wall_json)

        if len(wall.topleft) == 2:
            xa, xb, ya, yb = wall.topleft[0].x, wall.topleft[1].x, wall.topleft[0].y, wall.topleft[1].y
            a = ya - yb
            b = xb - xa
            c = xa*yb - xb*ya
            a2b2 = sqrt(a*a + b*b)
            a /= a2b2
            b /= a2b2
            c /= a2b2

            self.topleft = True
            self.topleftparams = [a, b, c]
        else:
            self.topleft = False
        
        if len(wall.topright) == 2:
            xa, xb, ya, yb = wall.topright[0].x, wall.topright[1].x, wall.topright[0].y, wall.topright[1].y
            a = ya - yb
            b = xb - xa
            c = xa*yb - xb*ya
            a2b2 = sqrt(a*a + b*b)
            a /= a2b2
            b /= a2b2
            c /= a2b2
            
            self.topright = True
            self.toprightparams = [a, b, c]
        else:
            self.topright = False

        self.wall = wall.holes

        # set attributes
        self.fixed = fixed_rectangles
        self.optimized = rectangles

        self.spacing = abs(preferred_spacing)

        self.min_y = wall.top
        self.min_x = wall.left
        self.max_y = wall.bottom
        self.max_x = wall.right

        width = self.max_x - self.min_x
        height = self.max_y - self.min_y
        self.scale = max(width, height)/self.spacing

        self.poly_scale = self.scale
        self.overlap_punishment_factor = (
            len(self.fixed + self.optimized) ** 2 * self.scale
        )


def updateJSON(rectangle_json, res):
    i = 0
    for rect_data in rectangle_json[0]:
        if rect_data["parent"] == "spawn_zone":
            x, y = res[2 * i], res[2 * i + 1]
            rect_data["offset"]["left"] = x - float(rect_data["width"]) / 2
            rect_data["offset"]["top"] = y - float(rect_data["height"]) / 2
            rect_data["parent"] = "drag_zone"
            i = i + 1


def place_rectangles(rectangle_json, wall_json, preferred_spacing, poly_json):
    opt = Optimizer()
    opt.parseJSON(rectangle_json, wall_json, preferred_spacing, poly_json)

    if len(opt.optimized) == 0:
        return rectangle_json

    res = opt.optimize()

    updateJSON(rectangle_json, res)

    return rectangle_json
