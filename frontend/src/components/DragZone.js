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
import styles from "./DragZone.module.css";
import { DropTarget } from "react-dnd";
import { Types } from "./Types.js";

const CLOSE_DISTANCE = 10;

const dragZoneTarget = {
  drop(props, monitor, component) {
    return {
      position: monitor.getSourceClientOffset(),
      parentString: "drag_zone",
    };
  },
};

function orientation(p, q, r) {
  let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (val === 0) return 0; // collinear

  return val > 0 ? 1 : 2; // clock or counterclock wise
}

function linesIntersect(a, b, c, d) {
  // Checks, if lines ab and cd intersect
  let o1 = orientation(a, b, c);
  let o2 = orientation(a, b, d);
  let o3 = orientation(c, d, a);
  let o4 = orientation(c, d, b);

  // General case
  if (o1 !== o2 && o3 !== o4) {
    return true;
  }
  return false;
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

/**
 * Component representing the application workspace
 */
class DragZone extends Component {
  constructor(props) {
    super(props);
    this.mainCanvas = createRef();
    this.divRef = createRef();
  }

  /**
   * Executes after component is mounted.
   */
  componentDidMount() {
    this.zoneVertices = [];
    this.drawingActive = false;
    this.mainCanvas.current.width = this.divRef.current.clientWidth;
    this.mainCanvas.current.height = this.divRef.current.clientHeight;
    this.mainCanvas.current.style.position = "absolute";
  }

  /**
   * Allows to set wall from the outside.
   * @param {*} wallJSON
   */
  setWall = (wallJSON) => {
    this.wallJSON = wallJSON;
    // clear canvas & redraw wall and zone
    this.clearCanvas();
    if (this.wallJSON !== undefined) {
      this.drawWall(this.wallJSON);
    }
    if (this.zoneVertices.length > 0) {
      this.drawZone(this.zoneVertices);
    }
  };

  /**
   * Returns actually set wall.
   * @returns {JSON}
   */
  getWall = () => {
    return this.wallJSON;
  };

  /**
   * Enables drawing the zone, where rectangles are expected to be placed first.
   */
  activateDrawing = () => {
    this.zoneVertices = [];
    this.drawingActive = true;
  };

  /**
   * Intersects a given point.
   * @param {*} newPoint
   * @returns {bool}
   */
  intersects = (newPoint) => {
    if (this.zoneVertices.length <= 2) {
      return false;
    }
    const lastPoint = this.zoneVertices[this.zoneVertices.length - 1];
    for (let i = 1; i < this.zoneVertices.length - 1; i += 1) {
      if (
        linesIntersect(
          this.zoneVertices[i - 1],
          this.zoneVertices[i],
          lastPoint,
          newPoint
        )
      ) {
        return true;
      }
    }
    return false;
  };

  /**
   * Handles canvas click event during drawing the zone,
   * where rectangles are expected to be placed first.
   * @param {*} event
   */
  handleCanvasClick = (event) => {
    if (this.drawingActive) {
      const currentCoord = {
        x: event.clientX,
        y: event.clientY - this.offsetHeight,
      };
      if (
        this.zoneVertices.length > 0 &&
        Math.abs(currentCoord.x - this.zoneVertices[0].x) <= CLOSE_DISTANCE &&
        Math.abs(currentCoord.y - this.zoneVertices[0].y) <= CLOSE_DISTANCE
      ) {
        if (!this.intersects(this.zoneVertices[this.zoneVertices.length - 1])) {
          this.drawingActive = false;
        }
      } else {
        if (!this.intersects(currentCoord)) {
          this.zoneVertices = [...this.zoneVertices, currentCoord];
        }
      }
      // clear canvas & redraw wall and zone
      this.clearCanvas();
      if (this.wallJSON !== undefined) {
        this.drawWall(this.wallJSON);
      }
      if (this.zoneVertices.length > 0) {
        this.drawZone(this.zoneVertices);
      }
    }
  };

  /**
   * Clears canvas.
   */
  clearCanvas = () => {
    var ctx = this.mainCanvas.current.getContext("2d");
    ctx.clearRect(
      0,
      0,
      this.mainCanvas.current.width,
      this.mainCanvas.current.height
    );
  };

  /**
   * Draws wall from the given information.
   * @param {*} specs
   */
  drawWall = (specs) => {
    var vertices = specs.vertices;
    var ctx = this.mainCanvas.current.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.setLineDash([]);
    ctx.beginPath();

    var prevKey;
    for (var key in vertices) {
      ctx.moveTo(vertices[key]["x"], vertices[key]["y"]);
      if (prevKey != null) {
        ctx.lineTo(vertices[prevKey]["x"], vertices[prevKey]["y"]);
      }
      ctx.stroke();
      prevKey = key;
    }
    ctx.moveTo(vertices[0]["x"], vertices[0]["y"]);
    ctx.lineTo(vertices[prevKey]["x"], vertices[prevKey]["y"]);
    ctx.stroke();
  };

  /**
   * Draws the zone, where rectangles are expected to be placed first.
   * @param {*} vertices
   */
  drawZone = (vertices) => {
    var ctx = this.mainCanvas.current.getContext("2d");
    ctx.strokeStyle = "#ff0000";
    ctx.fillStyle = "#ff0000";
    ctx.setLineDash([5, 5]);

    ctx.beginPath();

    var prevKey;
    for (var key in vertices) {
      ctx.moveTo(vertices[key]["x"], vertices[key]["y"]);

      let arcPath = new Path2D();
      arcPath.arc(vertices[key]["x"], vertices[key]["y"], 3, 0, 2 * Math.PI);
      ctx.fill(arcPath);

      if (prevKey != null) {
        ctx.lineTo(vertices[prevKey]["x"], vertices[prevKey]["y"]);
      }
      ctx.stroke();
      prevKey = key;
    }
    if (!this.drawingActive) {
      ctx.moveTo(vertices[0]["x"], vertices[0]["y"]);
      ctx.lineTo(vertices[prevKey]["x"], vertices[prevKey]["y"]);
    }
    ctx.stroke();
  };

  /**
   * Returns the zone, where rectangles are expected to be placed first.
   * @returns {*}
   */
  getZone = () => {
    return { vertices: this.zoneVertices };
  };

  /**
   * Renders HTML component code.
   * @returns {HTML}
   */
  render() {
    return this.props.connectDropTarget(
      <div className={styles.dragZone} ref={this.divRef}>
        <canvas ref={this.mainCanvas} onClick={this.handleCanvasClick}></canvas>
      </div>
    );
  }
}

export default DropTarget(Types.RECTANGLE, dragZoneTarget, collect)(DragZone);
