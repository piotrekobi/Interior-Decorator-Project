import "./App.css";
import { Component, createRef } from "react";
import MenuZone from "./components/MenuZone";
import DragZone from "./components/DragZone";
import SpawnZone from "./components/SpawnZone";
import WallPicker from "./components/WallPicker";
import RectangleMenu from "./components/RectangleMenu";

class App extends Component {
  constructor(props) {
    super(props);
    this.dragZone = createRef();
    this.spawnZone = createRef();
    this.wallPicker = createRef();
    this.rectangleMenu = createRef();
  }

  handleWallSelection = (specs) => {
    this.dragZone.current.drawWall(specs);
  };

  handleWallsClick = () => {
    this.wallPicker.current.toggleModal();
  };

  handleRectanglesClick = () => {
    this.rectangleMenu.current.toggleModal();
  };

  handleAddRectangleClick = (width, height, color) => {
    this.spawnZone.current.addRectangle(width, height, color);
  };

  render() {
    return (
      <body>
        <MenuZone
          onWallsClick={this.handleWallsClick}
          onRectanglesClick={this.handleRectanglesClick}
        />
        <DragZone ref={this.dragZone} />
        <SpawnZone ref={this.spawnZone} />

        <WallPicker
          ref={this.wallPicker}
          onWallSelection={this.handleWallSelection}
        />
            <RectangleMenu ref={this.rectangleMenu}
          onAddRectangleClick={this.handleAddRectangleClick}
          />
      </body>
    );
  }
}

export default App;
