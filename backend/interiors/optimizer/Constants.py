from interiors.optimizer.Geometry import Rectangle, Point


WALL = {
    'min_x':50,
    'max_x': 1050,
    'min_y': 50,
    'max_y': 500}
WALL_RECTANGLES = [Rectangle(150, 300, Point(675, 350))]
PREFERRED_SPACING = 30
MAXITER=180
SEED=1
POPSIZE=24
RECOMBINATION=0.05
STRATEGY="best1bin"
MUTATION=(0.5, 1)