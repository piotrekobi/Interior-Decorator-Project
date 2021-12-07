function showWallPickerZone()
{
    var zone = document.getElementById("wall_picker_zone");
    var content = document.getElementById("wall_picker_content");

    var httpRequest = new XMLHttpRequest();
    httpRequest.onload = function()
    {
        content.innerHTML = this.responseText;
        drawMiniWalls();
        ok_button = document.createElement("button");
        ok_button.innerHTML = "OK";
        ok_button.onclick = function()
        {
          zone.style.display = "none";
        }
        content.append(ok_button);
    }
    httpRequest.open('GET', "/get_walls", true);
    httpRequest.send();

    zone.style.display = "block";
}

function drawMiniWalls()
{
    var miniWalls = document.getElementsByClassName("mini_wall");
    for (var i = 0; i < miniWalls.length; i++)
    {
        var mini_ctx = miniWalls[i].getContext("2d");
        points = eval(miniWalls[i].id);
        points.forEach((point, index, arr) => {
            point[0] = point[0] / 5;
            point[1] = point[1] / 5;
        })
        console.log(points);
        points.forEach((point, index, arr) => {
            mini_ctx.beginPath();
            mini_ctx.lineWidth = 2;
        
            if (arr.length > 1) {
              mini_ctx.beginPath();
              mini_ctx.moveTo(point[0], point[1]);
              if (index == arr.length - 1) {
                mini_ctx.lineTo(arr[0][0], arr[0][1]);
              } else {
                mini_ctx.lineTo(arr[index + 1][0], arr[index + 1][1]);
              }
              mini_ctx.stroke();
            }
          });
    }
}
