from app.models import Wall
from app.models import Vertex


def get_walls_batched(number):
    all_walls = Wall.objects.all()
    walls_batched = []
    walls_batch = []
    for wall, i in zip(all_walls, range(len(all_walls))):
        vertices = Vertex.objects.all().filter(wall_id=wall.id)
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
        x = vertex.x
        y = vertex.y
        one_wall.append([x, y])
    return one_wall
