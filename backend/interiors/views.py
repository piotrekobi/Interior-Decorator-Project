"""
Contains API
"""

from django.shortcuts import render
from django.http import HttpResponse
from interiors.optimizer.Optimizer import place_rectangles
import json
from django.views.decorators.csrf import csrf_exempt
import logging
from interiors.tasks.status import taskStatuses


class NoRectangleData(Exception):
    """
    Exception about missing rectangle data in the frontend request.
    """
    pass

def index(request):
    """
    The main view.
    """
    return HttpResponse("Wnętrza API")

@csrf_exempt
def createTask(request):
    """
    Creates a new task using tasks framework in order to informe about the task status
    """
    taskStatus = taskStatuses.createNewTaskStatus()
    return HttpResponse(taskStatus)


@csrf_exempt 
def optimizer(request):
    """
    Receives data about rectangles, walls and selected area from the frontend, optimize and return optimized data.
    """
    logger = logging.getLogger("requests")
    try:
        if request.method == 'POST':
            logger.info(f"Rectangle placement request")
            rectangle_data = ""
            data = json.loads(request.body)
            logger.info(f"Incoming rectangle request:\n\t{data}")
            rectangle_data, is_valid = place_rectangles([data[0]['rectangle_json']], data[0]['wall_json'], data[0]['preferred_spacing'], data[0]['fill_zone'], data[0]['task_id'])
            rectangle_data.append({"is_valid": is_valid})
            rectangle_data = json.dumps(rectangle_data)
            
            logger.info(f"Outgoing rectangle placement:\n\t{rectangle_data}")
            return HttpResponse(rectangle_data)
        else:
            raise NoRectangleData
    except Exception as e:
        invalid_result = json.dumps([{}, False])
        return HttpResponse(invalid_result)

@csrf_exempt
def getProgress(request):
    """
    Returns progress about the given task to frontend.
    """
    task_id = json.loads(request.body)[0]
    progress = taskStatuses.getProgress(task_id)
    return HttpResponse(progress)

@csrf_exempt
def removeTask(request):
    """
    Removes task from tasks framework after optimalization is complete.
    """
    task_id = json.loads(request.body)[0]
    taskStatuses.removeTaskStatus(task_id)
    return HttpResponse(0)