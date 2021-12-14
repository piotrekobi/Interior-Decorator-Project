import { Component, createRef } from "react";
import ReactDOM from 'react-dom'
import styles from"./MenuZone.module.css";
import WallPicker from "./WallPicker";

export default class MenuZone extends Component {
    constructor(props) {
        super(props);
        this.wallPicker = createRef();
    }

    showWallPicker = () => {
        this.wallPicker.current.toggleModal();
    }
    
    render() {
        return(
            <div className={styles.menu}>
                <ul className={styles.list}>
                    <li className={styles.button} onClick={this.showWallPicker}>Ściany</li>
                    <WallPicker ref={this.wallPicker}/>
                    <li className={styles.button}>Prostokąty</li>
                    <li className={styles.button}>Zakreśl obszar</li>
                    <li className={styles.button}>Rozmieść</li>
                    <li className={styles.button}>Wczytaj projekt</li>
                    <li className={styles.button}>Zapisz projekt</li>
                </ul>
            </div>
        );
    }
}