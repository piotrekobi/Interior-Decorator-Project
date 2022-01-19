"""Calculates the best arrangement of given rectangles by using differential evolution.

Classes:
    Optimizer

Functions:
    place_rectangles(object, object, float, object, str) -> np.array
    updateJSON(in-out object, np.array)
"""


from itertools import combinations
from math import sqrt
import numpy as np
import scipy.optimize as opt
import matplotlib.path as mpltPath
from interiors.optimizer.Geometry import Wall
from interiors.optimizer.Geometry import Point, Rectangle
from interiors.optimizer.Constants import *
from interiors.tasks.status import taskStatuses


class Optimizer:
    """Contains data representing the whole arrangement problem, and calculates a good solution by means of differential evolution (DE).

    Attributes:
        counter : int
            Number of completed DE iterations (starts at 0).
        task_id: str
            Task id used when reporting progress.

        fixed: list(Rectangle)
            List of rectangles whose position is fixed (i.e. not changed by the optimizer)
        optimized: list(Rectangle)
            List of rectangle whose position is solved for.

        min_x, min_y, max_x, max_y: float
            Respectively the minimum and maximum x and y coordinates of the wall bounding rectangle.
        width: float
            Width of the bounding rectangle of the wall
        height: float
            Height of the bounding rectangle of the wall
        wall: list(Rectangle)
            List of rectangular holes in the wall.
        hastopleft, hastopright: boolean
            Whether wall contains diagonal segments
        topleftparams, toprightparams: [float, float, float]
            Corresponding attributes of the given wall, as in Wall class.

        poly: matplotlib.path.Path
            Preferred polygon represented as a matplotlib Path.
        hasPoly: boolean
            Whether preferred polygon in given.

        areas: np.array(float)
            Contains areas of optimized rectangles. For ease of use in the algorithm each area is repeated 4 times (size(areas) = 4*size(optimized))
        minArea: float
            Smallest area in `areas`

        spacing: float
            Preferred space between neighbouring rectangles.
        scale: float
            Scaling factor of punishment for space too small between rectangles.
        poly_scale: float
            Scaling factor of punishment for rectangle vertices outside preferred polygon.
        overlap_punishment_factor: float
            Scaling factor of punishment for overlapping rectangles.


    Methods:
        parseRectangles(rectange_json):
            Calculates attributes based on json object.
        parseWall(rectange_json):
            Calculates attributes based on json object.
        parsePoly(rectange_json):
            Calculates attributes based on json object.
        rect2rect():
            Calculates punishment for distances between rectangles.
        rect2wall():
            Calculates punishment for distances between rectangles and wall segments/holes.
        rect2poly():
            Calculates punishment for rectangle vertices outside preferred polygon.
        obj_func(x):
            Minimized objective function.
        isvalid(x):
            Checks whether given solution is valid (i.e. rectangles don't overlap each other or are outside the wall)
        iter_counter():
            Increases counter attribute by one
        optimize():
            Finds best solution of the given problem by means of DE.
    """

    def __init__(
        self, rectangle_json, wall_json, preferred_spacing, poly_json, task_id
    ):
        self.counter = 0
        self.task_id = task_id
        self.parseRectangles(rectangle_json)
        self.parseWall(wall_json)
        self.parsePoly(poly_json)

        self.areas = np.array(
            [rect.width * rect.height for rect in self.optimized for i in range(4)]
        )
        self.minArea = np.min(self.areas)

        self.spacing = preferred_spacing
        width = self.max_x - self.min_x
        height = self.max_y - self.min_y
        self.scale = max(width, height) / self.spacing
        self.poly_scale = self.scale / self.minArea
        self.areaerror = self.poly_scale * self.areas
        self.overlap_punishment_factor = (
            len(self.fixed + self.optimized) ** 2 * self.scale
        )

    def parseRectangles(self, rectangle_json):
        self.optimized = []
        self.fixed = []

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
                self.optimized.append(rect)
            else:
                self.fixed.append(rect)

    def parseWall(self, wall_json):
        wall = Wall()
        wall.parseJSON(wall_json)
        self.hastopleft = wall.topleft
        if self.hastopleft:
            self.topleftparams = wall.topleftparams
        self.hastopright = wall.topright
        if self.hastopright:
            self.toprightparams = wall.toprightparams
        self.min_y = wall.top
        self.min_x = wall.left
        self.max_y = wall.bottom
        self.max_x = wall.right
        self.wall = wall.holes

    def parsePoly(self, poly_json):
        if len(poly_json["vertices"]) == 0:
            self.hasPoly = False
            return

        self.poly = mpltPath.Path(
            np.array([[i["x"], i["y"]] for i in poly_json["vertices"]])
        )
        self.hasPoly = True

    def rect2rect(self):
        # Punishment for distances between rectangles
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
            dtopleft = (
                self.spacing
                if not self.hastopleft
                else self.topleftparams[0] * left
                + self.topleftparams[1] * top
                + self.topleftparams[2]
            )
            dtopright = (
                self.spacing
                if not self.hastopright
                else self.toprightparams[0] * right
                + self.toprightparams[1] * top
                + self.toprightparams[2]
            )
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
        # Punishment for rectangle vertices outside preferred polygon
        vertices = np.array(
            [
                [rect.center.x - i, rect.center.y - j]
                for rect in self.optimized
                for i in [rect.halfwidth, -rect.halfwidth]
                for j in [rect.halfheight, -rect.halfheight]
            ]
        )
        error = np.sum(self.areaerror[~self.poly.contains_points(vertices)])
        return error

    def obj_func(self, x):
        error = 0

        for i, rect in enumerate(self.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        error += self.rect2rect()
        error += self.rect2wall()
        if self.hasPoly:
            error += self.rect2poly()

        return error

    def isvalid(self, x):
        for i, rect in enumerate(self.optimized):
            rect.center = Point(x[2 * i], x[2 * i + 1])

        # Overlapping rectangles
        rectangles = self.fixed + self.optimized
        for rect1, rect2 in combinations(rectangles, 2):
            d = rect1.spacebetween(rect2)
            if d < 0:
                return False

        for rect in self.optimized:
            # Outside diagonal wall boundaries
            left = rect.center.x - rect.halfwidth
            right = rect.center.x + rect.halfwidth
            top = rect.center.y - rect.halfheight

            dtopleft = (
                self.spacing
                if not self.hastopleft
                else self.topleftparams[0] * left
                + self.topleftparams[1] * top
                + self.topleftparams[2]
            )
            dtopright = (
                self.spacing
                if not self.hastopright
                else self.toprightparams[0] * right
                + self.toprightparams[1] * top
                + self.toprightparams[2]
            )
            if dtopleft < 0 or dtopright < 0:
                return False

            # Overlapping rectangular hole
            for hole in self.wall:
                d = rect.spacebetween(hole)
                if d < 0:
                    return False
        # No overlapping
        return True

    def iter_counter(self, xk=None, convergence=None):
        self.counter += 1
        progress = round((self.counter / MAXITER) * 100)
        taskStatuses.setProgress(self.task_id, progress)

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
            callback=self.iter_counter,
            tol=TOL,
            workers=WORKERS,
            updating="deferred",
        )

        return res.x


def updateJSON(rectangle_json, res):
    i = 0
    for rect_data in rectangle_json[0]:
        if rect_data["parent"] == "spawn_zone":
            x, y = res[2 * i], res[2 * i + 1]
            rect_data["offset"]["left"] = x - float(rect_data["width"]) / 2
            rect_data["offset"]["top"] = y - float(rect_data["height"]) / 2
            rect_data["parent"] = "drag_zone"
            i = i + 1


def place_rectangles(rectangle_json, wall_json, preferred_spacing, poly_json, task_id):
    opt = Optimizer(rectangle_json, wall_json, preferred_spacing, poly_json, task_id)

    res = opt.optimize()
    is_valid = opt.isvalid(res)
    updateJSON(rectangle_json, res)

    return rectangle_json, is_valid
