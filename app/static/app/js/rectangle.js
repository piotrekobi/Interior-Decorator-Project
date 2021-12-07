// maybe testable
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

//testable
function saveRectangles() {
    var rectangles = document.querySelectorAll('[id^="rectangle"]');

    var rectlist = jQuery.map(
        rectangles,
        objectifyRectangle
    );

    var data = JSON.stringify(rectlist);

    var file = new Blob([data], {type: "text/plain"});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "save";
    document.body.appendChild(a);

    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
        }, 0); 
}

//testable
function loadRectangles(file) {
    var fileread = new FileReader();
    fileread.onload = function(e) {
        var content = e.target.result;
        drawRectangles(content)
    };
    fileread.readAsText(file);
}

function drawRectangles(content) {
    if (content == ""){
        return
    }
    var rectangles = document.querySelectorAll('[id^="rectangle"]');
    rectangles.forEach(function(element) {
        element.parentNode.removeChild(element);
    })

    var objectlist = JSON.parse(content); // parse json 

    objectlist.forEach(deobjectifyRectangle)

}   


function sendRectangles() {
    var rectangles = document.querySelectorAll('[id^="rectangle"]');
    
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');
 
    var rectlist = jQuery.map(
        rectangles,
        objectifyRectangle
        );


    var jsondata = JSON.stringify(rectlist);

    $.ajax({
        url:'/',
        type: "POST",
        data: jsondata,
        contentType: 'application/json',
        synch: 'true',
        success: function(data){
            drawRectangles(data);
        },
        headers: {
            'X-CSRFToken': csrftoken
        }
    });
}


function objectifyRectangle(element){
    return {
        id: element.id,
        parent: element.parentElement.id,
        width: element.style.width,
        height: element.style.height,
        color: element.style.background,
        offset: {
            top: ($(element).offset().top - $(element.parentElement).offset().top),
            left: ($(element).offset().left - $(element.parentElement).offset().left)
        }
    }
}

function deobjectifyRectangle(element)
{
    var div = document.createElement("div");
    var parent = document.getElementById(element.parent);

    div.className = "draggable rectangle-style ";
    div.id = element.id;
    parent.appendChild(div);

    div.style.width = element.width;    
    div.style.height = element.height;
    div.style.background = element.color;
    $(div).offset({
        left: element.offset.left + $(parent).offset().left,
        top: element.offset.top + $(parent).offset().top});
}



