from itertools import combinations
import scipy.optimize as opt
from backend.interiors.optimizer.Geometry import Wall

from backend.interiors.optimizer.Geometry import Point, Rectangle
from backend.interiors.optimizer.Constants import *


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
            left = rect.center.x - rect.width / 2
            right = rect.center.x + rect.width / 2
            top = rect.center.y + rect.height / 2
            bottom = rect.center.y - rect.height / 2

            dleft = left - self.min_x
            dright = self.max_x - right
            dbottom = bottom - self.min_y
            dtop = self.max_y - top

            d = min(dleft, dright, dbottom, dtop, self.spacing)
            if d < self.spacing:
                gap_small_error += self.spacing - d

            # TODO: Add Punishment for being too close to diagonal wall boundaries

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

    def obj_func(self, x):
        error = 0

        for i, rect in enumerate(self.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        error += self.rect2rect()
        error += self.rect2wall()

        return error

    def optimize(self):
        my_bounds = opt.Bounds(
            [
                b
                for r in self.optimized
                for b in [self.min_x + r.width / 2, self.min_y + r.height / 2]
            ],
            [
                b
                for r in self.optimized
                for b in [self.max_x - r.width / 2, self.max_y - r.height / 2]
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
        )
        return res.x

    def parseJSON(self, rectangle_json, wall_json, preferred_spacing):
        rectangles = []
        fixed_rectangles = []
        for rect_data in rectangle_json:
            rect = Rectangle(
                float(rect_data["width"][:-2]),
                float(rect_data["height"][:-2]),
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

        wall = Wall()
        wall.parseJSON(wall_json)

        self.fixed = fixed_rectangles
        self.optimized = rectangles
        self.wall = wall.holes

        self.topleft = wall.topleft
        self.topright = wall.topright

        self.spacing = abs(preferred_spacing)

        self.min_y = wall.top
        self.min_x = wall.left
        self.max_y = wall.bottom
        self.max_x = wall.right

        width = self.max_x - self.min_x
        height = self.max_y - self.min_y
        self.scale = max(width, height)
        self.overlap_punishment_factor = (
            len(self.fixed + self.optimized) ** 2 * self.scale
        )


def updateJSON(rectangle_json, res):
    i = 0
    for rect_data in rectangle_json:
        if rect_data["parent"] == "spawn_zone":
            x, y = res[2 * i], res[2 * i + 1]
            rect_data["offset"]["left"] = x - float(rect_data["width"][:-2]) / 2
            rect_data["offset"]["top"] = y - float(rect_data["height"][:-2]) / 2
            rect_data["parent"] = "drag_zone"
            i = i + 1


def place_rectangles(rectangle_json, wall_json, preferred_spacing):
    opt = Optimizer()
    opt.parseJSON(rectangle_json, wall_json, preferred_spacing)

    if len(opt.optimized) == 0:
        return rectangle_json

    res = opt.optimize()

    updateJSON(rectangle_json, res)

    return rectangle_json
