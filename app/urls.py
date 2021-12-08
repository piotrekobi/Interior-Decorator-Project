from django.conf.urls import url
from . import views

app_name = 'app'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^get_walls/', views.get_walls, name="get_walls")
]
