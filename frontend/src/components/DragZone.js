import { Component, createRef } from "react";
import styles from "./DragZone.module.css"
import { DropTarget } from 'react-dnd'
import { Types } from './Types.js'

const CLOSE_DISTANCE = 10;

const dragZoneTarget = {
    drop(props, monitor, component) {
        return {
            position: monitor.getSourceClientOffset(),
            parentString: "drag_zone"
        };
    }
}

function orientation(p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y);
  
    if (val == 0) return 0; // collinear
  
    return (val > 0)? 1: 2; // clock or counterclock wise
}

function linesIntersect(a, b, c, d) {
    // Checks, if lines ab and cd intersect
    let o1 = orientation(a, b, c);
    let o2 = orientation(a, b, d);
    let o3 = orientation(c, d, a);
    let o4 = orientation(c, d, b);
  
    // General case
    if (o1 != o2 && o3 != o4) {
        return true;
    }
    return false;
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
    }
}

class DragZone extends Component {
    constructor(props) {
        super(props);
        this.mainCanvas = createRef();
        this.divRef = createRef();
    }

    componentDidMount() {
        this.zoneVertices = [];
        this.drawingActive = false;
        this.mainCanvas.current.width = this.divRef.current.clientWidth;
        this.mainCanvas.current.height = this.divRef.current.clientHeight;
        this.mainCanvas.current.style.position = "absolute";
    }

    setWall = (wallJSON) => {
        this.wallJSON = wallJSON;
        // clear canvas & redraw wall and zone
        this.clearCanvas();
        if (this.wallJSON != undefined) {
            this.drawWall(this.wallJSON);
        }
        if (this.zoneVertices.length > 0) {
            this.drawZone(this.zoneVertices);
        }
    }

    getWall = () => {
        return this.wallJSON;
    }

    activateDrawing = () => {
        this.zoneVertices = [];
        this.drawingActive = true;
    }

    intersects = (newPoint) => {
        if (this.zoneVertices.length <= 2) {
            return false;
        }
        const lastPoint = this.zoneVertices[this.zoneVertices.length - 1];
        for (let i = 1; i < this.zoneVertices.length-1; i += 1) {
            if (linesIntersect(this.zoneVertices[i-1], this.zoneVertices[i], lastPoint, newPoint)) {
                return true;
            }
        }
        return false;
    }

    handleCanvasClick = (event) => {
        if (this.drawingActive) {
            const currentCoord = { x: event.clientX,
                                   y: event.clientY - this.offsetHeight };
            if (this.zoneVertices.length > 0 &&
                Math.abs(currentCoord.x - this.zoneVertices[0].x) <= CLOSE_DISTANCE &&
                Math.abs(currentCoord.y - this.zoneVertices[0].y) <= CLOSE_DISTANCE) {
                if (!this.intersects(this.zoneVertices[this.zoneVertices.length-1])) {
                    this.drawingActive = false
                }
            }
            else {
                if (!this.intersects(currentCoord)) {
                    this.zoneVertices = [...this.zoneVertices, currentCoord];
                }
            }
            // clear canvas & redraw wall and zone
            this.clearCanvas();
            if (this.wallJSON != undefined) {
                this.drawWall(this.wallJSON);
            }
            if (this.zoneVertices.length > 0) {
                this.drawZone(this.zoneVertices);
            }
        }
    }

    clearCanvas = () => {
        var ctx = this.mainCanvas.current.getContext("2d");
        ctx.clearRect(0, 0, this.mainCanvas.current.width, this.mainCanvas.current.height);
    }

    drawWall = (specs) => {
        var vertices = specs.vertices;
        var ctx = this.mainCanvas.current.getContext("2d");
        ctx.strokeStyle = '#000000';
        ctx.beginPath();

        var prevKey;
        for (var key in vertices) {
            ctx.moveTo(vertices[key]['x'], vertices[key]['y']);
            if (prevKey != null) {
                ctx.lineTo(vertices[prevKey]['x'], vertices[prevKey]['y']);
            }
            ctx.stroke();
            prevKey = key;
        }
        ctx.moveTo(vertices[0]['x'], vertices[0]['y']);
        ctx.lineTo(vertices[prevKey]['x'], vertices[prevKey]['y']);
        ctx.stroke();
    }

    drawZone = (vertices) => {
        var ctx = this.mainCanvas.current.getContext("2d");
        ctx.strokeStyle = '#ff0000';
        ctx.beginPath();

        var prevKey;
        for (var key in vertices) {
            ctx.moveTo(vertices[key]['x'], vertices[key]['y']);
            if (prevKey != null) {
                ctx.lineTo(vertices[prevKey]['x'], vertices[prevKey]['y']);
            }
            ctx.stroke();
            prevKey = key;
        }
        if (!this.drawingActive) {
            ctx.moveTo(vertices[0]['x'], vertices[0]['y']);
            ctx.lineTo(vertices[prevKey]['x'], vertices[prevKey]['y']);
        }
        ctx.stroke();
    }

    getZone = () => {
        return { vertices: this.zoneVertices };
    }

    render() {
        return this.props.connectDropTarget(
            <div className={styles.dragZone} ref={this.divRef}>
                <canvas ref={this.mainCanvas} onClick={this.handleCanvasClick}></canvas>
            </div>
        )
    }
}

export default DropTarget(
    Types.RECTANGLE,
    dragZoneTarget,
    collect
)(DragZone)