// Copyright (c) 2022, Piotr Paturej, Miłosz Kasak, Kamil Szydłowski, Jakub Polak
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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

/**
 * Component representing rectangle.
 */
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

  /**
   * Executes after component is mounted.
   */
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

  /**
    * Renders HTML component code.
    * @returns {HTML}
    */
  render() {
    if (
      typeof this.state.left !== "undefined" &&
      typeof this.state.top !== "undefined" &&
      this.state.parentString !== "spawn_zone"
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
