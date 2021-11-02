function drawRectangles(params) {
  params.forEach((param) => {
    ctx.fillStyle = param[4];
    console.log(param.slice(0, 4));
    ctx.fillRect(...param.slice(0, 4));
  });
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 50;

test_rectangles = [
  [50, 30, 100, 50, "black"],
  [100, 100, 70, 40, "red"],
  [300, 200, 60, 100, "blue"],
  [800, 250, 200, 150, "orange"],
  [400, 120, 40, 80, "green"],
];

drawRectangles(test_rectangles);
