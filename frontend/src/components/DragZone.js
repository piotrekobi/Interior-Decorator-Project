import { Component, createRef } from "react";
import styles from "./DragZone.module.css"
import { DropTarget } from 'react-dnd'
import { Types } from './Types.js'

const dragZoneTarget = {
    drop(props, monitor, component) {
        return {
            position: monitor.getSourceClientOffset(),
            parentString: "drag_zone"
        };
    }
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
        if (this.zoneVertices != undefined) {
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

    handleCanvasClick = (event) => {
        if (this.drawingActive) {
            if (this.zoneVertices.length == 0) {
                const currentCoord = { x: event.clientX,
                                       y: event.clientY - this.offsetHeight };
                this.zoneVertices = [currentCoord];
            }
            else {
                const currentCoord = { x: event.clientX,
                                       y: event.clientY - this.offsetHeight };
                const prevCoord = this.zoneVertices[0];
                let betweenCoord = { x: prevCoord.x, y: currentCoord.y };
                this.zoneVertices = [...this.zoneVertices, betweenCoord];
                this.zoneVertices = [...this.zoneVertices, currentCoord];
                betweenCoord = { x: currentCoord.x, y: prevCoord.y };
                this.zoneVertices = [...this.zoneVertices, betweenCoord];
                this.drawingActive = false;
                // clear canvas & redraw wall and zone
                this.clearCanvas();
                if (this.wallJSON != undefined) {
                    this.drawWall(this.wallJSON);
                }
                if (this.zoneVertices != undefined) {
                    this.drawZone(this.zoneVertices);
                }
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
        ctx.moveTo(vertices[0]['x'], vertices[0]['y']);
        ctx.lineTo(vertices[prevKey]['x'], vertices[prevKey]['y']);
        ctx.stroke();
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