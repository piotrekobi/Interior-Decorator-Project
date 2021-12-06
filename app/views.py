from django.shortcuts import render
from django.http import HttpResponse
from app.optimizer.Optimizer import place_rectangles
import json


def index(request):
    rectangle_data = ""
    if request.method == 'POST':
        data = json.loads(request.body)
        rectangle_data = place_rectangles(data)
    print(rectangle_data)
    return render(request, 'app/index.html', {'data': rectangle_data})
