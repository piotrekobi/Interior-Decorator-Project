import json


def get_walls_batched(number):
    walls_batched = []
    walls_batch = []
    with open("./app/static/app/json/walls.json") as f:
        walls = json.load(f)
        for wall, i in zip(walls, range(len(walls))):
            vertices = wall['vertices']
            one_wall = get_one_wall(vertices)
            walls_batch.append(one_wall)
            if(i % number == number - 1):
                walls_batched.append(walls_batch)
                walls_batch = []
        if len(walls_batch) > 0:
            walls_batched.append(walls_batch)

    return walls_batched


def get_one_wall(vertices):
    one_wall = []
    for vertex in vertices:
        x = vertex['x']
        y = vertex['y']
        one_wall.append([x, y])
    return one_wall
