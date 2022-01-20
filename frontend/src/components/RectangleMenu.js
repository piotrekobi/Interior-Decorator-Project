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
    else this.props.onAddRectangleClick(width, height, color);

    callback = (imageURL) => {
      this.props.onAddRectangleClick(width, height, color, imageURL);
    };

    reader.onloadend = function () {
      image.src = reader.result;
    };

    image.onload = function () {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");

      if (!width) width = image.width;
      if (!height) height = image.height;
      canvas.width = width;
      canvas.height = height;

      context.drawImage(image, 0, 0, width, height);
      let dataURL = canvas.toDataURL();
      dataURL = "url(" + dataURL + ")";
      callback(dataURL);
    };
  };

  inputChange = () => {
    if (this.imageUploadInput.current.files[0])
      this.uploadButton.current.innerHTML = "Zmień / Usuń zdjęcie";
    else this.uploadButton.current.innerHTML = "Prześlij zdjęcie";
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

              <input ref={this.widthBox} className={styles.textBox}></input>
            </th>
            <th>
              <label className={styles.heightLabel}>Wysokość:</label>
              <input ref={this.heightBox} className={styles.textBox}></input>
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