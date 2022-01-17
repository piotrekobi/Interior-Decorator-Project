import { Component, createRef } from "react";
import styles from "./Rectangle.module.css";
import { DragSource } from "react-dnd";
import { Types } from "./Types";

const rectSource = {
  beginDrag(props, monitor, component) {
    const item = { id: props.id };
    return item;
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    } else {
      var dropresult = monitor.getDropResult();
      var parentString = dropresult.parentString;
      var position = dropresult.position;

      component.setState({
        ...component.state,
        left: position.x,
        top: position.y,
        parentString: parentString,
      });
      return;
    }
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
  };
}

class Rectangle extends Component {
  constructor(props) {
    super(props);
    this.divRef = createRef();
    this.state = {
      parentString: "spawn_zone",
      width: this.props.width,
      height: this.props.height,
      color: this.props.color,
      imageURL: this.props.imageURL,
    };
  }

  componentDidMount() {
    this.margin = {
      left: window
        .getComputedStyle(this.divRef.current)
        .getPropertyValue("margin-left")
        .slice(0, -2),
      top: window
        .getComputedStyle(this.divRef.current)
        .getPropertyValue("margin-left")
        .slice(0, -2),
    };
  }

  render() {
    if (
      typeof this.state.left != "undefined" &&
      typeof this.state.top != "undefined" &&
      this.state.parentString != "spawn_zone"
    ) {
      return this.props.connectDragSource(
        <div
          ref={this.divRef}
          className={styles.rectangle}
          style={{
            ...this.props.style,
            position: "absolute",
            left: this.state.left - this.margin.left + "px",
            top: this.state.top - this.margin.top + "px",
          }}
        />
      );
    } else {
      return this.props.connectDragSource(
        <div
          ref={this.divRef}
          className={styles.rectangle}
          style={this.props.style}
        />
      );
    }
  }
}

export default DragSource(Types.RECTANGLE, rectSource, collect)(Rectangle)
