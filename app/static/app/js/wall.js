function drawWall(points) {
  points.forEach((point, index, arr) => {
    ctx.beginPath();
    ctx.lineWidth = 2;

    if (arr.length > 1) {
      ctx.beginPath();
      ctx.moveTo(point[0], point[1]);
      if (index == arr.length - 1) {
        ctx.lineTo(arr[0][0], arr[0][1]);
      } else {
        ctx.lineTo(arr[index + 1][0], arr[index + 1][1]);
      }
      ctx.stroke();
    }
  });
}
