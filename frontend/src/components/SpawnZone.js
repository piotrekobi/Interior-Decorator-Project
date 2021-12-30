import { Component, createRef } from "react";
import styles from  "./SpawnZone.module.css"
import { DropTarget } from 'react-dnd'
import { Types } from './Types.js'
import Rectangle from './Rectangle';
import { v4 as uuidv4 } from 'uuid';

const spawnZoneTarget = {
    drop(props, monitor, component) {
        return {
            position: monitor.getSourceClientOffset(),
            parentString: "spawn_zone"
        };
    }
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
    }
}

class SpawnZone extends Component{
    constructor(props) {
        super(props);
        this.spawnZoneDiv = createRef();
        this.state = {
            children: []
        }
    }

    addChild = (width, height, color) => {
        var child = (<Rectangle id={uuidv4()} style={{  width: width, 
                                                            height: height, 
                                                            background: color }}/>)
        this.setState({children: this.state.children.concat([child])});
    }

    removeChildByID = (id) => {
        this.setState({
            ...this.state,
            children: this.state.children.filter(
                (child) => {
                    return child.props.id !== id;
                }
            )
        });
    }

    render() {
        return this.props.connectDropTarget(
            <div ref={this.spawnZoneDiv} className={styles.spawnZone}>
                {this.state.children}
            </div>
        )
    }
}

export default DropTarget(
    Types.RECTANGLE,
    spawnZoneTarget,
    collect
)(SpawnZone)