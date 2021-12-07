from django.shortcuts import render
from django.http import HttpResponse


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
    walls = [[[[400, 50], [1200, 50], [1200, 500], [400, 500], ],
              [[400, 50], [800, 50], [1200, 275], [1200, 500], [400, 500], ],
              [[400, 50], [1200, 50], [1200, 500], [400, 500], ]],
             [[[400, 50], [1200, 50], [1200, 500], [400, 500], ],
              [[400, 50], [1200, 50], [1200, 500], [400, 500], ],
              [[400, 50], [1200, 50], [1200, 500], [400, 500], ]]]

    context = {'walls': walls}
    return render(request, 'app/wall_picker.html', context)
