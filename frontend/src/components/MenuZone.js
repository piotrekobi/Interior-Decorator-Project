// Copyright (c) 2022, Piotr Paturej, Miłosz Kasak, Kamil Szydłowski, Jakub Polak
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
