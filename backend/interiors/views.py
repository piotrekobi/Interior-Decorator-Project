from django.shortcuts import render
from django.http import HttpResponse
from interiors.optimizer.Optimizer import place_rectangles
import json
from django.views.decorators.csrf import csrf_exempt


class NoRectangleData(Exception):
    pass

def index(request):
    return HttpResponse("Wnętrza API")


@csrf_exempt 
def optimizer(request):
    try:
        if request.method == 'POST':
            rectangle_data = ""
            data = json.loads(request.body)
            rectangle_data = place_rectangles([data[0]['rectangle_json']], data[0]['wall_json'], data[0]['preferred_spacing'])
            rectangle_data = json.dumps(rectangle_data)
            return HttpResponse(rectangle_data)
        else:
            raise NoRectangleData
    except NoRectangleData:
        return HttpResponse("No rectangle data exception")
