from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return render(request, 'app/index.html')


def example_rw(request):
    return render(request, 'app/example_rw.html')


def example_communication(request):
    return HttpResponse("Example communication")
