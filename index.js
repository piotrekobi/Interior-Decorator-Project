import interact from 'https://cdn.interactjs.io/v1.10.11/interactjs/index.js'

// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // disable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'body',
        endOnly: true
      })
    ],
    // disable autoScroll
    autoScroll: false,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      /*end (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
      }*/
    }
  })

interact('.drop_target')
.dropzone({
  ondrop: function (event) {
    /*
    alert(event.relatedTarget.id
          + ' was dropped into '
          + event.target.id)
    */
    
    var rect = event.relatedTarget.getBoundingClientRect();
    if (event.target.id == "drag_zone" && event.target.id != event.relatedTarget.parentNode.id)
    {
      // TO DO: find how to get height of the element, and subtract from y
      console.log(event.relatedTarget.style.height)
      event.relatedTarget.style.transform = 'translate('+ rect.left +'px, '+ rect.top +'px)'
      event.relatedTarget.setAttribute('data-x', rect.left)
      event.relatedTarget.setAttribute('data-y', rect.top - event.relatedTarget.style.height)
      event.relatedTarget.style.transform = 'translate('+ rect.left +'px, '+ rect.top +'px)'
      $('#' + event.relatedTarget.id).appendTo($('#' + event.target.id))
    }
    if (event.target.id != "drag_zone" && event.target.id != event.relatedTarget.parentNode.id)
    {
      event.relatedTarget.setAttribute('data-x', 0)
      event.relatedTarget.setAttribute('data-y', 0)
      event.relatedTarget.style.transform = 'translate(0px, 0px)'
      $('#' + event.relatedTarget.id).prependTo($('#' + event.target.id))
    }
  }
})
.on('dropactivate', function (event) {
  event.target.classList.add('drop-activated')
})

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}
