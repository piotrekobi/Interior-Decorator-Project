import { Component, createRef } from "react";
import styles from "./DragZone.module.css"

export default class DragZone extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.props.mainCanvas.current.width = window.innerWidth;
        this.props.mainCanvas.current.height = window.innerHeight - 175;
        this.props.mainCanvas.current.style.position = "absolute";
    }

    render() {
        return (
            <div className={styles.dragZone}>
                <canvas ref={this.props.mainCanvas}></canvas>
            </div>
        )
    }
}