function addRectangle(width, height, color, spawn_zone_id) {
    var div = document.createElement("div");
    var spawn_zone = document.getElementById(spawn_zone_id);
    div.className = "draggable rectangle-style ";
    var number_of_rectangles = document.querySelectorAll('[id^="rectangle"]').length;
    
    div.id = "rectangle"+number_of_rectangles;
    div.style.width = width;    
    div.style.height = height;
    div.style.background = color;
    spawn_zone.appendChild(div);
};