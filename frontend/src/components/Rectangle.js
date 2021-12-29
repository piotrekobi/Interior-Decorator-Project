import { Component, createRef } from "react";
import styles from  "./Rectangle.module.css"
import { DragSource} from "react-dnd"

const Types = {
    RECTANGLE: 'rectangle'
}

const rectSource = {
    beginDrag(props, monitor, component) {
        const item = { id: props.id }
        return item
    },

    endDrag(props, monitor, component) {
        if(!monitor.didDrop())
        {
            var position = monitor.getSourceClientOffset();
            component.setState({left: position.x, top: position.y});
            return
        }
    }
}
  
/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
    }
}


class Rectangle extends Component{
    constructor(props) {
        super(props);
        this.divRef = createRef();
        this.state = {};
    }

    componentDidMount() {
        this.setState({
            left: this.divRef.current.getBoundingClientRect().left,
            top: this.divRef.current.getBoundingClientRect().top 
        });
    }

    render() {
        if((typeof this.state.left != "undefined") && (typeof this.state.top != "undefined"))
        {
            return(
                this.props.connectDragSource(
                    <div ref={this.divRef} className={styles.rectangle} style={{
                     ...this.props.style,
                     position: "absolute",
                     left: this.state.left+"px",
                     top: this.state.top+"px"}
                     }/>
                )
            )
        }
        else
        {
            return(
                this.props.connectDragSource(
                    <div ref={this.divRef} className={styles.rectangle} style={this.props.style}/>
                )
            )
        }
    }
}

export default DragSource(Types.RECTANGLE, rectSource, collect)(Rectangle)