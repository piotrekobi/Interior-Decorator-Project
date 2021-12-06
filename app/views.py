from django.shortcuts import render
from django.http import HttpResponse
from app.optimizer.Optimizer import place_rectangles
import json


def index(request):
    rectangle_data = ""
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        print()
        # rectangle_data = place_rectangles(data)
    return render(request, 'app/index.html',  {'data': rectangle_data})
