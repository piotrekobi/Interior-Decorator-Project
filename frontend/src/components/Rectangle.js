import { Component, createRef } from "react";
import styles from  "./Rectangle.module.css"

export default class Rectangle extends Component{
    constructor(props) {
        super(props);
        this.divRef = createRef();
    }

    componentDidMount() {
        this.state = {
            left: this.divRef.current.getBoundingClientRect().left,
            top: this.divRef.current.getBoundingClientRect().top 
        };
    }

    render() {
        return(
            <div ref={this.divRef} className={styles.rectangle} style={this.props.style}>
            </div>
        )
    }
}