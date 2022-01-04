from django.shortcuts import render
from django.http import HttpResponse
from interiors.optimizer.Optimizer import place_rectangles
import json
from django.views.decorators.csrf import csrf_exempt
import logging


class NoRectangleData(Exception):
    pass

def index(request):
    return HttpResponse("Wnętrza API")


@csrf_exempt 
def optimizer(request):
    logger = logging.getLogger("requests")
    try:
        if request.method == 'POST':
            logger.info(f"Rectangle placement request")
            rectangle_data = ""
            data = json.loads(request.body)
            logger.info(f"Incoming rectangle request:\n\t{data}")
            rectangle_data = place_rectangles([data[0]['rectangle_json']], data[0]['wall_json'], data[0]['preferred_spacing'])
            rectangle_data = json.dumps(rectangle_data)
            logger.info(f"Outgoing rectangle placement:\n\t{rectangle_data}")
            return HttpResponse(rectangle_data)
        else:
            raise NoRectangleData
    except NoRectangleData:
        return HttpResponse("No rectangle data exception")
