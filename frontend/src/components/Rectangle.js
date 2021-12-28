import { Component, createRef } from "react";
import styles from  "./Rectangle.module.css"
import { DragSource} from "react-dnd"

const Types = {
    RECTANGLE: 'rectangle'
}

const rectSource = {
    isDragging(props, monitor) {
        // If your component gets unmounted while dragged
        // (like a card in Kanban board dragged between lists)
        // you can implement something like this to keep its
        // appearance dragged:
        return monitor.getItem().id === props.id
    },
  
    beginDrag(props, monitor, component) {
        // Return the data describing the dragged item
        const item = { id: props.id }
        return item
    },
}
  
/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    }
}


class Rectangle extends Component{
    constructor(props) {
        super(props);
        this.divRef = createRef();
    }

    componentDidMount() {
        this.setState({
            left: this.divRef.current.getBoundingClientRect().left,
            top: this.divRef.current.getBoundingClientRect().top 
        });
    }

    render() {
        return(
            this.props.connectDragSource(
                <div ref={this.divRef} className={styles.rectangle} style={this.props.style}>
                    {this.props.isDragging && ' (I am being dragged now)'}
                </div>
            )
        )
    }
}

export default DragSource(Types.RECTANGLE, rectSource, collect)(Rectangle)