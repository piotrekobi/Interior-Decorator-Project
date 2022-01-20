"""
Maps URLs to API functions.
"""

from django.conf.urls import url
from . import views

app_name = 'interiors'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^createTask/', views.createTask, name="createTask"),
    url(r'^optimizer/', views.optimizer, name="optimizer"),
    url(r'^getProgress/', views.getProgress, name="getProgress"),
    url(r'^removeTask/', views.createTask, name="createTask"),
]
