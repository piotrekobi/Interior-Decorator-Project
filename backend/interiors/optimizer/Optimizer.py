from itertools import combinations
import scipy.optimize as opt
import numpy as np

from interiors.optimizer.Geometry import Point, Rectangle
from interiors.optimizer.Constants import *


class Optimizer:
    def __init__(
        self, fixed_rect, optimized_rect, preferred_spacing, min_x, min_y, max_x, max_y
    ):
        self.fixed = fixed_rect
        self.optimized = optimized_rect
        self.spacing = abs(preferred_spacing)
        self.min_x = min_x
        self.min_y = min_y
        self.max_x = max_x
        self.max_y = max_y

        width = self.max_x - self.min_x
        height = self.max_y - self.min_y
        self.scale = max(width, height)
        self.overlap_punishment_factor = (
            len(self.fixed + self.optimized) ** 2 * self.scale
        )

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
        error = 0
        for rect in self.optimized:
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
                error += self.spacing - d

        return error * self.scale

    def obj_func(self, x):
        error = 0

        for i, rect in enumerate(self.optimized):
            rect.center = Point(x[2*i], x[2*i+1])

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


def place_rectangles(json_data):
    rectangles = []
    fixed_rectangles = []
    for rect_data in json_data:
        rect = Rectangle(
            float(rect_data["width"][:-2]),
            float(rect_data["height"][:-2]),
            Point(
                float(rect_data["offset"]["left"]), float(rect_data["offset"]["top"])
            ),
        )
        rect.center.x += rect.width / 2
        rect.center.y += rect.height / 2

        if rect_data["parent"] == "spawn_zone":
            rect_data["optimized"] = "true"
            rectangles.append(rect)
        else:
            rect_data["optimized"] = "false"
            fixed_rectangles.append(rect)

    if len(rectangles) == 0:
        return json_data

    opt = Optimizer(
        fixed_rectangles + WALL_RECTANGLES,
        rectangles,
        PREFERRED_SPACING,
        WALL["min_x"],
        WALL["min_y"],
        WALL["max_x"],
        WALL["max_y"],
    )

    res = opt.optimize()

    print(res)

    i = 0

    for rect_data in json_data:
        if rect_data["parent"] == "spawn_zone":
            x, y = res[2 * i], res[2 * i + 1]
            rect_data["offset"]["left"] = x - float(rect_data["width"][:-2]) / 2
            rect_data["offset"]["top"] = y - float(rect_data["height"][:-2]) / 2
            # print(rect_data['offset']['left'])
            # print(rect_data['offset']['top'])
            i = i + 1
            rect_data["parent"] = "drag_zone"
    return json_data
