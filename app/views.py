from django.shortcuts import render
from django.http import HttpResponse

from app.local_db.communication import get_walls_batched


def index(request):
    return render(request, 'app/index.html')


def get_walls(request):
    walls = get_walls_batched(3)
    context = {'walls': walls}
    return render(request, 'app/wall_picker.html', context)
