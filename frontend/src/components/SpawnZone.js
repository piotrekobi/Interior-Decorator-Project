import { Component, createRef, createElement } from "react";
import styles from  "./SpawnZone.module.css"
import interact from 'interactjs'

export default class SpawnZone extends Component{
    constructor(props) {
        super(props);
        this.spawnZoneDiv = createRef();
        this.state = {
            rectangles: []
        }
    }

    componentDidMount() {
        this.interactDraggable();
    }

    interactDraggable = () => {
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
            move: this.dragMoveListener,

            // call this function on every dragend event
            /*end (event) {
                var textEl = event.target.querySelector('p')

                textEl && (textEl.textContent =
                'moved a distance of ' +
                (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                            Math.pow(event.pageY - event.y0, 2) | 0))
                    .toFixed(2) + 'px')
            }*/
            },
            onstart(event) {
            let target = event.target;
            //let position = target.getBoundingClientRect();
            target.style.position = "fixed";
            if (target.parentNode.id == "drag_zone") {
                var offset = ('#' + event.target.id).outerWidth(true);
                this.compensateLoss(event.target.parentNode.children, event.target.id, offset);
            }
        },
        onend(event) {
            let target = event.target;
            target.style.position = "relative";
            if (target.parentNode.id == "drag_zone") {
            var offset = - ('#' + event.target.id).outerWidth(true);
            this.compensateLoss(event.target.parentNode.children, event.target.id, offset);
            }
        }
        })
    }

    compensateLoss = (collection, removedId, offset) => {
        var after = false
        for (var i = 0; i < collection.length; i++) {
            if (after == true)
            {
                var x = collection[i].getAttribute('data-x') || 0
                var y = collection[i].getAttribute('data-y') || 0
                x = parseFloat(x) + offset
                collection[i].style.transform = 'translate('+ x +'px, '+ y +'px)'
                collection[i].setAttribute('data-y', y)
                collection[i].setAttribute('data-x', x)
                //collection[i].setAttribute('style', 'transform: translate('+ x +'px, '+ y +'px)')
            }
            if (collection[i].id == removedId)
            {
                after = true
            }
        }
    }

    dragMoveListener = (event) => {
        var target = event.target
        // keep the dragged position in the data-x/data-y attributes
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
      
        // translate the element
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
      
        // update the position attributes
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      }

    addRectangle = (width, height, color) => {
        var rectangle = createElement(  "div",
                                        {className: styles.rectangle + " draggable",
                                         style: {width: width, height: height, background: color}});
        this.setState({rectangles: this.state.rectangles.concat([rectangle])});
    }

    render() {
        return(
            <div ref={this.spawnZoneDiv} className={styles.spawnZone}>
                {this.state.rectangles}
            </div>
        )
    }
}