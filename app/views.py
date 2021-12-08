from django.shortcuts import render
from django.http import HttpResponse
from app.optimizer.Optimizer import place_rectangles
import json

from app.local_data.walls import get_walls_batched


def index(request):
    rectangle_data = ""
    if request.method == 'POST':
        data = json.loads(request.body)
        rectangle_data = place_rectangles(data)
        rectangle_data = json.dumps(rectangle_data)
        return HttpResponse(rectangle_data)
    return render(request, 'app/index.html')


def get_walls(request):
    walls = get_walls_batched(3)
    context = {"walls": walls}
    return render(request, 'app/wall_picker.html', context)
