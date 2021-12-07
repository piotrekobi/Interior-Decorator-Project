from django.shortcuts import render
from django.http import HttpResponse

from app.models import Wall
from app.models import Vertex


def index(request):
    return render(request, 'app/index.html')


def example_rw(request):
    return render(request, 'app/example_rw.html')


def example_communication(request):
    if request.method == 'POST':
        first_number = int(request.POST.get('first_number'))
        second_number = int(request.POST.get('second_number'))
        if request.POST.get('submit') == '+':
            page = HttpResponse(first_number+second_number)
        if request.POST.get('submit') == '-':
            page = HttpResponse(first_number-second_number)
        if request.POST.get('submit') == '*':
            page = HttpResponse(first_number*second_number)
        if request.POST.get('submit') == '/':
            page = HttpResponse(first_number/second_number)

        return page
    return render(request, 'app/example_communication.html')


def get_walls(request):
    all_walls = Wall.objects.all()
    walls = []
    i = 0
    three_walls = []
    for wall in all_walls:
        vertices = Vertex.objects.all().filter(wall_id=wall.id)
        one_wall = []
        for vertex in vertices:
            x = vertex.x
            y = vertex.y
            one_wall.append([x, y])
        three_walls.append(one_wall)
        i += 1
        if(i == 3):
            walls.append(three_walls)
            three_walls = []
            i = 0
    if len(three_walls) > 0:
        walls.append(three_walls)

    context = {'walls': walls}
    return render(request, 'app/wall_picker.html', context)
