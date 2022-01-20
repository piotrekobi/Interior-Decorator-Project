import { Component, createRef } from "react";
import styles from "./SpawnZone.module.css";
import { DropTarget } from "react-dnd";
import { Types } from "./Types.js";
import Rectangle from "./Rectangle";
import { v4 as uuidv4 } from "uuid";

const spawnZoneTarget = {
  drop(props, monitor, component) {
    var dropPos = monitor.getSourceClientOffset();
    var pointerPos = monitor.getClientOffset();
    var componentPos = component.spawnZoneDiv.current.getBoundingClientRect();
    if (pointerPos.y < componentPos.y) {
      // Rectangle was dropped on another rectangle in drag_zone, but is handled inside spawn_zone,
      // because the target rectangle is a child of spawn_zone
      return {
        position: dropPos,
        parentString: "drag_zone",
      };
    } else {
      return {
        position: dropPos,
        parentString: "spawn_zone",
      };
    }
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

/**
 * Component representing storage box for rectangles.
 */
class SpawnZone extends Component {
  constructor(props) {
    super(props);
    this.spawnZoneDiv = createRef();
    this.state = {
      children: [],
    };
  }

  /**
   * Adds rectangle to spawn zone.
   * @param {number} width 
   * @param {number} height 
   * @param {*} color 
   * @param {*} imageURL 
   * @returns {*}
   */
  addChild = (width, height, color, imageURL) => {
    var ref = createRef();
    var child = (
      <Rectangle
        id={uuidv4()}
        ref={ref}
        style={{
          width: width,
          height: height,
          background: color,
          backgroundImage: imageURL,
        }}
      />
    );
    this.setState({ children: this.state.children.concat([child]) });
    return ref;
  };

  /**
   * Removes rectangle from spawn zone.
   * @param {number} id 
   */
  removeChildByID = (id) => {
    this.setState({
      ...this.state,
      children: this.state.children.filter((child) => {
        return child.props.id !== id;
      }),
    });
  };

  /**
   * Returns rectangles list.
   * @param {number} offsetHeight 
   * @returns {Array}
   */
  getRectangles = (offsetHeight) => {
    var rectangles = this.state.children;
    var rectlist = rectangles.map((rectangle) =>
      this.objectifyRectangle(rectangle, offsetHeight)
    );
    return rectlist;
  };

  /**
   * Sets rectangles on the canvas.
   * @param {*} data 
   * @param {*} offsetHeight 
   */
  setRectangles = (data, offsetHeight) => {
    this.setState({ children: [] });
    data.forEach((rectangle) => {
      var ref = this.addChild(
        rectangle["width"],
        rectangle["height"],
        rectangle["color"],
        rectangle["imageURL"]
      );
      ref.current.getDecoratedComponentInstance().setState({
        left: rectangle["offset"]["left"],
        top: rectangle["offset"]["top"] + offsetHeight,
        parentString: rectangle["parent"],
      });
    });
  };

  /**
   * Objectify rectangle to send it.
   * @param {*} element 
   * @param {number} offsetHeight 
   * @returns {*}
   */
  objectifyRectangle = (element, offsetHeight) => {
    var element_x =
      element.ref.current.getDecoratedComponentInstance().state.left || 0;
    var element_y =
      element.ref.current.getDecoratedComponentInstance().state.top || 0;

    //var element_margin_x = $(element).outerWidth(true) - parseFloat(element.style.width);
    //var element_margin_y = $(element).outerHeight(true) - parseFloat(element.style.height);

    let offset = {
      left: element_x /*+ element_margin_x*/,
      top: element_y - offsetHeight /*+ element_margin_y*/,
    };

    return {
      id: element.id,
      parent:
        element.ref.current.getDecoratedComponentInstance().state.parentString,
      width: element.props.style.width,
      height: element.props.style.height,
      color: element.props.style.background,
      imageURL: element.props.style.backgroundImage,
      offset: offset,
    };
  };

  /**
    * Renders HTML component code.
    * @returns {HTML}
    */
  render() {
    return this.props.connectDropTarget(
      <div ref={this.spawnZoneDiv} className={styles.spawnZone}>
        {this.state.children}
      </div>
    );
  }
}

export default DropTarget(Types.RECTANGLE, spawnZoneTarget, collect)(SpawnZone);
