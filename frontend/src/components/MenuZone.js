import { Component, createRef } from "react";
import styles from "./MenuZone.module.css";

export default class MenuZone extends Component {
  constructor(props) {
    super(props);
    this.divRef = createRef();
  }
  getHeight = () => {
    return this.divRef.current.offsetHeight;
  };
  render() {
    return (
      <div className={styles.menu} ref={this.divRef}>
        <ul className={styles.list}>
          <li className={styles.button} onClick={this.props.onWallsClick}>
            Ściany
          </li>
          <li className={styles.button} onClick={this.props.onRectanglesClick}>
            Prostokąty
          </li>
          <li className={styles.button}>Zakreśl obszar</li>
          <li className={styles.button} onClick={this.props.onOrderClick}>
            Rozmieść
          </li>
          <li className={styles.button} onClick={this.props.onLoadClick}>
            Wczytaj projekt
          </li>
          <li className={styles.button} onClick={this.props.onSaveClick}>
            Zapisz projekt
          </li>
        </ul>
      </div>
    );
  }
}
