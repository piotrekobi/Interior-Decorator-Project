import { Component } from "react";
import styles from "./DragZone.module.css"

export default class DragZone extends Component{
    render() {
        return (
            <div className={styles.dragZone}></div>
        )
    }
}