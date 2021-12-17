import { Component } from "react";
import styles from"./MenuZone.module.css";

export default class MenuZone extends Component {
    render() {
        return(
            <div className={styles.menu}>
                <ul className={styles.list}>
                    <li className={styles.button} onClick={this.props.onWallsClick}>Ściany</li>
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