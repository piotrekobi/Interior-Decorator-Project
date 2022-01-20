import { Component, createRef } from "react";
import styles from "./MenuZone.module.css";

/**
 * Component representing the application menu
 */
class MenuZone extends Component {
  constructor(props) {
    super(props);
    this.divRef = createRef();
  }

  /**
   * Return height in pixels of the menu zone.
   * @returns {number}
   */
  getHeight = () => {
    return this.divRef.current.offsetHeight;
  };

  /**
    * Renders HTML component code.
    * @returns {HTML}
    */
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
          <li className={styles.button} onClick={this.props.onDrawClick}>
            Zakreśl obszar
          </li>
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

export default MenuZone;
