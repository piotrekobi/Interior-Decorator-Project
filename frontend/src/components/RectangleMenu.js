import { Component, createRef } from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./RectangleMenu.module.css";

export default class RectangleMenu extends Component {
  constructor(props) {
    super(props);
    this.widthBox = createRef();
    this.heightBox = createRef();
    this.colorBox = createRef();
    this.state = {
      isModalOpen: false,
    };
  }

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  sendRectangleData = () => {
    let width = parseInt(this.widthBox.current.value);
    let height = parseInt(this.heightBox.current.value);
    let color = this.colorBox.current.value;
    console.log(color);
    this.props.onAddRectangleClick(width, height, color);
  };

  render() {
    return (
      <Modal open={this.state.isModalOpen} onClose={this.toggleModal}>
        <table className={styles.table}>
          <tr>
            <th>
              Width:
              <input ref={this.widthBox} className={styles.textBox}></input>
            </th>
            <th>
              Height:
              <input ref={this.heightBox} className={styles.textBox}></input>
            </th>
          </tr>
          <tr>
            <th>
              Color:
              <input
                ref={this.colorBox}
                className={styles.colorPicker}
                type="color"
              ></input>
            </th>
            <th>
              <div className={styles.uploadButton}>Upload image</div>
            </th>
          </tr>
        </table>
        <div className={styles.addButton} onClick={this.sendRectangleData}>
          Add rectangle
        </div>
      </Modal>
    );
  }
}
