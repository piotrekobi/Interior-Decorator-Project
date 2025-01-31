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
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./RectangleMenu.module.css";

/**
 * Component representing menu with setting rectangles options like
 * setting height. width, color or background image.
 */
class RectangleMenu extends Component {
  constructor(props) {
    super(props);
    this.widthBox = createRef();
    this.heightBox = createRef();
    this.colorBox = createRef();
    this.uploadButton = createRef();
    this.imageUploadInput = createRef();
    this.state = {
      isModalOpen: false,
    };
  }

  /**
   * Makes a component invisible (when visible) and vice versa.
   */
  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  /** */
  sendRectangleData = (callback) => {
    let width = parseInt(this.widthBox.current.value);
    let height = parseInt(this.heightBox.current.value);
    let color = this.colorBox.current.value;

    let imageFile = this.imageUploadInput.current.files[0];
    let image = new Image();
    let reader = new FileReader();

    if (imageFile) reader.readAsDataURL(imageFile);
    else {
      if (!width) width = parseInt(this.widthBox.current.placeholder);
      if (!height) height = parseInt(this.heightBox.current.placeholder);
      this.props.onAddRectangleClick(width, height, color);
    }

    callback = (imageURL) => {
      this.props.onAddRectangleClick(width, height, color, imageURL);
    };

    reader.onloadend = function () {
      image.src = reader.result;
    };

    image.onload = function () {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");

      if (!width) {
        width = image.width;
      }
      if (!height) {
        height = image.height;
      }
      canvas.width = width;
      canvas.height = height;

      context.drawImage(image, 0, 0, width, height);
      let dataURL = canvas.toDataURL();
      dataURL = "url(" + dataURL + ")";
      callback(dataURL);
    };
  };

  inputChange = (callback) => {
    let imageFile = this.imageUploadInput.current.files[0];
    callback = (width, height) => {
      this.widthBox.current.placeholder = width;
      this.heightBox.current.placeholder = height;
    };
    if (imageFile) {
      this.uploadButton.current.innerHTML = "Zmień / Usuń zdjęcie";
      let reader = new FileReader();
      let image = new Image();
      reader.readAsDataURL(imageFile);

      reader.onloadend = function () {
        image.src = reader.result;
      };

      image.onload = function () {
        callback(image.width, image.height);
      };
    } else {
      this.uploadButton.current.innerHTML = "Prześlij zdjęcie";
      callback(100, 100);
    }
  };

  /**
   * Renders HTML component code.
   * @returns {HTML}
   */
  render() {
    return (
      <Modal open={this.state.isModalOpen} onClose={this.toggleModal}>
        <table className={styles.table}>
          <tr>
            <th>
              <label className={styles.widthLabel}>Szerokość:</label>

              <input
                ref={this.widthBox}
                className={styles.textBox}
                placeholder={100}
              ></input>
            </th>
            <th>
              <label className={styles.heightLabel}>Wysokość:</label>
              <input
                ref={this.heightBox}
                className={styles.textBox}
                placeholder={100}
              ></input>
            </th>
          </tr>
          <tr>
            <th>
              Kolor:
              <input
                ref={this.colorBox}
                className={styles.colorPicker}
                type="color"
              ></input>
            </th>
            <th>
              <div
                className={styles.uploadButton}
                ref={this.uploadButton}
                onClick={() => {
                  this.imageUploadInput.current.click();
                }}
              >
                Prześlij zdjęcie
              </div>
            </th>
          </tr>
        </table>
        <div className={styles.addButton} onClick={this.sendRectangleData}>
          Dodaj prostokąt
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={this.inputChange}
          ref={this.imageUploadInput}
          style={{ display: "none" }}
        />
      </Modal>
    );
  }
}

export default RectangleMenu;
