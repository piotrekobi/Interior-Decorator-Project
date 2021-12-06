from itertools import combinations
import scipy.optimize as opt
import numpy as np
from Geometry import Point, Rectangle, Polygon
import json

from app.optimizer.Constants import *


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

    def obj_func(self, x):
        error = 0

        centers = [Point(x[i], x[i + 1]) for i in range(0, len(x), 2)]
        for rect, center in zip(self.optimized, centers):
            rect.center = center

        rectangles = self.fixed + self.optimized

        for rect1, rect2 in combinations(rectangles, 2):
            d = rect1.spacebetween(rect2)
            if d < 0:
                error += self.overlap_punishment_factor * (1 - d)
            else:
                if d > self.spacing:
                    error += d - self.spacing
                else:
                    error += (self.spacing - d) * self.scale

        return error

    def optimize(self):
        my_bounds = opt.Bounds(
            [b for _ in range(len(self.optimized)) for b in [self.min_x, self.min_y]],
            [b for _ in range(len(self.optimized)) for b in [self.max_x, self.max_y]],
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
        )
        return res.x



def place_rectangles(json_data):
    data = json.loads(json_data)
    rectangles = {}
    fixed_rectangles = {}
    for rect_data in data:
        rect = Rectangle(
            rect_data['width'],
            rect_data['height'],
            Point(
                rect_data['offset']['left'], 
                rect_data['offset']['top'])
        )
        if rect_data['parent'] == 'spawn_zone':
            rectangles[rect_data['id']] = rect
        else:
            fixed_rectangles[rect_data['id']] = rect

    opt = Optimizer(
        list(fixed_rectangles) + WALL_RECTANGLES,
        list(rectangles),
        PREFERRED_SPACING,
        WALL['min_x'],
        WALL['min_y'],
        WALL['max_x'],
        WALL['max_y']
    )

    res = opt.optimize()
    