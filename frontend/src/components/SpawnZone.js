import { Component, createRef } from "react";
import styles from  "./SpawnZone.module.css"

export default class SpawnZone extends Component{
    constructor(props) {
        super(props);
        this.spawnZoneDiv = createRef();
        this.state = {
            children: []
        }
    }

    addChild = (child) => {
        this.setState({children: this.state.children.concat([child])});
    }

    render() {
        return(
            <div ref={this.spawnZoneDiv} className={styles.spawnZone}>
                {this.state.children}
            </div>
        )
    }
}