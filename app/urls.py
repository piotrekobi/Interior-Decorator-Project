from django.conf.urls import url
from . import views

app_name = 'app'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^example_rw/', views.example_rw, name='example_rw'),
    url(r'^example_communication/', views.example_communication, name='example_communication'),
    url(r'^get_walls/', views.get_walls, name="get_walls")
]