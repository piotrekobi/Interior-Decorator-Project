import "./App.css";
import { Component, createRef } from "react";
import MenuZone from "./components/MenuZone";
import DragZone from "./components/DragZone";
import SpawnZone from "./components/SpawnZone";
import WallPicker from "./components/WallPicker";
import RectangleMenu from "./components/RectangleMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Connector from "./Connector";
import ArrangementMenu from "./components/ArrangementMenu";
import ProgressWindow from "./components/ProgressWindow";

class App extends Component {
  constructor(props) {
    super(props);
    this.menuZone = createRef();
    this.dragZone = createRef();
    this.spawnZone = createRef();
    this.wallPicker = createRef();
    this.rectangleMenu = createRef();
    this.arrangementMenu = createRef();
    this.progressWindow = createRef();
    this.dofileDownload = createRef();
    this.fileDownloadUrl = createRef();
    this.uploadInput = createRef();

    this.connector = new Connector([
      "http://127.0.0.1:8000/",
      "https://api-wnetrza.azurewebsites.net/",
    ]);
  }

  handleWallSelection = (specs) => {
    this.dragZone.current.getDecoratedComponentInstance().setWall(specs);
  };

  handleWallsClick = () => {
    this.wallPicker.current.toggleModal();
  };

  handleSaveClick = () => {
    const offsetHeight = this.menuZone.current.getHeight();
    var rectangle_json = this.spawnZone.current
      .getDecoratedComponentInstance()
      .getRectangles(offsetHeight);
    console.log(rectangle_json);

    var data = JSON.stringify(rectangle_json);

    var file = new Blob([data], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "project";
    document.body.appendChild(a);

    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    }, 0);
  };

  handleLoadClick = () => {
    this.uploadInput.current.value = null;
    this.uploadInput.current.click();
  };

  loadRectangles = (callback) => {
    var fileread = new FileReader();
    const offsetHeight = this.menuZone.current.getHeight();

    callback = (content) => {
      console.log(content);
      this.spawnZone.current
        .getDecoratedComponentInstance()
        .setRectangles(JSON.parse(content), offsetHeight);
    };

    fileread.onload = function (e) {
      var content = e.target.result;
      callback(content);
    };
    fileread.readAsText(this.uploadInput.current.files[0]);
  };

  handleRectanglesClick = () => {
    //var rectangle = (<Rectangle id={uuidv4()} style={{ width: '100px', height: '100px', background: 'gray' }}/>)
    //this.spawnZone.current.getDecoratedComponentInstance().addChild(rectangle);
    this.rectangleMenu.current.toggleModal();
  };

  handleAddRectangleClick = (width, height, color) => {
    this.spawnZone.current
      .getDecoratedComponentInstance()
      .addChild(width, height, color);
  };

  handleOrderClick = () => {
    this.arrangementMenu.current.toggleModal();
  };

  handleOrderWithOptionsClick = (preferred_spacing) => {
    const offsetHeight = this.menuZone.current.getHeight();
    const rectangle_json = this.spawnZone.current.getDecoratedComponentInstance().getRectangles(offsetHeight);
    const wall_json = this.dragZone.current.getDecoratedComponentInstance().getWall();

    this.optimizeRectangles(offsetHeight, rectangle_json, wall_json, preferred_spacing);
  }

  optimizeRectangles = (offsetHeight, rectangle_json, wall_json, preferred_spacing) => {
    this.connector
      .createTask()
      .then(id => {
        this.progressWindow.current.openModal();
        this.connector
        .optimizeRectangles(rectangle_json, wall_json, preferred_spacing, id)
        .then((result) => {
          this.spawnZone.current
          .getDecoratedComponentInstance()
          .setRectangles(result[0], offsetHeight);
          this.progressWindow.current.closeModal();
        }
        );
        this.updateOrderProgress(id);
      }
      );
  }

  updateOrderProgress = (task_id) => {
    setTimeout(() => {
      this.connector.getProgress(task_id)
        .then((res) => {
          this.progressWindow.current.setProgress(res);
          if (res < 100) {
            this.updateOrderProgress(task_id);
          }
          else {
            this.connector.removeTask(task_id);
          }
        });
    }, 500);
  }

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <body>
          <MenuZone
            ref={this.menuZone}
            onWallsClick={this.handleWallsClick}
            onRectanglesClick={this.handleRectanglesClick}
            onOrderClick={this.handleOrderClick}
            onSaveClick={this.handleSaveClick}
            onLoadClick={this.handleLoadClick}
          />
          <DragZone ref={this.dragZone} />
          <SpawnZone ref={this.spawnZone} />

          <WallPicker
            ref={this.wallPicker}
            onWallSelection={this.handleWallSelection}
          />
          <RectangleMenu
            ref={this.rectangleMenu}
            onAddRectangleClick={this.handleAddRectangleClick}
          />

          <ArrangementMenu
            ref={this.arrangementMenu}
            onOrderWithOptionsClick={this.handleOrderWithOptionsClick}
          />

          <ProgressWindow
            ref={this.progressWindow}
          />

          <input
            type="file"
            ref={this.uploadInput}
            style={{ display: "none" }}
            onChange={this.loadRectangles}
          />
        </body>
      </DndProvider>
    );
  }
}

export default App;
