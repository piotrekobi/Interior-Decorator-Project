function addRectangle(width, height, color) {
    var div = document.createElement("div");
    div.className = "draggable rectangle-style ";
    div.style.width = width;    
    div.style.height = height;
    div.style.background = color;
    document.getElementById("spawn_zone").appendChild(div);
};