import { Component, createRef } from "react";
import styles from "./DragZone.module.css"

export default class DragZone extends Component{
    constructor(props){
        super(props);
        this.mainCanvas = createRef();
        this.divRef = createRef();
    }

    componentDidMount() {
        this.mainCanvas.current.width = this.divRef.current.clientWidth;
        this.mainCanvas.current.height = this.divRef.current.clientHeight;
        this.mainCanvas.current.style.position = "absolute";
    }

    drawWall = (specs) => {
        var vertices = specs.vertices;
        var ctx = this.mainCanvas.current.getContext("2d");
        ctx.clearRect(0, 0, this.mainCanvas.current.width, this.mainCanvas.current.height);
        ctx.beginPath();

        var prevKey;
        for (var key in vertices){
            ctx.moveTo(vertices[key]['x'], vertices[key]['y']);
            if (prevKey != null){
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
        return (
            <div className={styles.dragZone} ref={this.divRef}>
                <canvas ref={this.mainCanvas}></canvas>
            </div>
        )
    }
}