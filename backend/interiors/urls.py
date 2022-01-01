from django.conf.urls import url
from . import views

app_name = 'interiors'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^optimizer/', views.optimizer, name="optimizer")
]
