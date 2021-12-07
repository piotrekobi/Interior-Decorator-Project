from django.db import models


class Wall(models.Model):
    pass


class Vertex(models.Model):
    x = models.IntegerField()
    y = models.IntegerField()
    wall = models.ForeignKey(Wall, on_delete=models.CASCADE)
