var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var drag_zone = document.getElementById("drag_zone");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 175;
canvas.style.position = "absolute";
drag_zone.appendChild(canvas);