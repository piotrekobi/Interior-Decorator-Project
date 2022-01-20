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
import IncorrectOrderAlert from "./components/IncorrectOrderAlert";

/**
 * The main class.
 */
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
    this.incorrectOrderAlert = createRef();
    this.dofileDownload = createRef();
    this.fileDownloadUrl = createRef();
    this.uploadInput = createRef();

    this.connector = new Connector([
      "http://127.0.0.1:8000/",
      "https://api-wnetrza.azurewebsites.net/",
    ]);
  }

  /**
   * Executes after app is mounted.
   */
  componentDidMount() {
    this.dragZone.current.getDecoratedComponentInstance().offsetHeight =
      this.menuZone.current.getHeight();
  }

  /**
   * Handles wall selection event.
   * @param {*} specs
   */
  handleWallSelection = (specs) => {
    this.dragZone.current.getDecoratedComponentInstance().setWall(specs);
  };

  /**
   * Handles wall button click event.
   */
  handleWallsClick = () => {
    this.wallPicker.current.toggleModal();
  };

  /**
   * Handles "save project" button click event.
   */
  handleSaveClick = () => {
    const offsetHeight = this.menuZone.current.getHeight();
    var rectangle_json = this.spawnZone.current
      .getDecoratedComponentInstance()
      .getRectangles(offsetHeight);
    var wallJSON = this.dragZone.current
      .getDecoratedComponentInstance()
      .getWall();
    rectangle_json.push(wallJSON);
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

  /**
   * Handles "load project" button click event.
   */
  handleLoadClick = () => {
    this.uploadInput.current.value = null;
    this.uploadInput.current.click();
  };

  /**
   * Loads project from file.
   * @param {*} callback
   */
  loadProject = (callback) => {
    var fileread = new FileReader();
    const offsetHeight = this.menuZone.current.getHeight();

    callback = (content) => {
      content = JSON.parse(content);

      let renctangleData = content.slice(0, content.length - 1);
      let wallData = content[content.length - 1];

      this.spawnZone.current
        .getDecoratedComponentInstance()
        .setRectangles(renctangleData, offsetHeight);
      this.dragZone.current.getDecoratedComponentInstance().setWall(wallData);
    };

    fileread.onload = function (e) {
      var content = e.target.result;
      callback(content);
    };
    fileread.readAsText(this.uploadInput.current.files[0]);
  };

  /**
   * Handles "Rectangles" button click event.
   */
  handleRectanglesClick = () => {
    this.rectangleMenu.current.toggleModal();
  };

  /**
   * Handles add rectangle click event.
   */
  handleAddRectangleClick = (width, height, color, imageURL) => {
    this.spawnZone.current
      .getDecoratedComponentInstance()
      .addChild(width, height, color, imageURL);
  };

  /**
   * Handles "Order" button click event.
   */
  handleOrderClick = () => {
    this.arrangementMenu.current.toggleModal();
  };

  /**
   * Handles order with given distance between rectangles click event.
   */
  handleOrderWithOptionsClick = (preferred_spacing) => {
    const offsetHeight = this.menuZone.current.getHeight();
    const rectangle_json = this.spawnZone.current
      .getDecoratedComponentInstance()
      .getRectangles(offsetHeight);
    const wall_json = this.dragZone.current
      .getDecoratedComponentInstance()
      .getWall();
    const fill_zone = this.dragZone.current
      .getDecoratedComponentInstance()
      .getZone();

    this.optimizeRectangles(
      offsetHeight,
      rectangle_json,
      wall_json,
      preferred_spacing,
      fill_zone
    );
  };

  /**
   * Handles "draw area" button click event.
   */
  handleDrawClick = () => {
    this.dragZone.current.getDecoratedComponentInstance().activateDrawing();
  };

  /**
   * Sends information about project to backend API so as to optimize.
   * Receives optimized data.
   * @param {*} offsetHeight
   * @param {*} rectangle_json
   * @param {*} wall_json
   * @param {*} preferred_spacing
   * @param {*} fill_zone
   */
  optimizeRectangles = (
    offsetHeight,
    rectangle_json,
    wall_json,
    preferred_spacing,
    fill_zone
  ) => {
    if (rectangle_json.length > 0) {
      this.connector.createTask().then((id) => {
        this.progressWindow.current.openModal();
        this.connector
          .optimizeRectangles(
            rectangle_json,
            wall_json,
            preferred_spacing,
            fill_zone,
            id
          )
          .then((result) => {
            this.progressWindow.current.closeModal();
            if (result[1]["is_valid"]) {
              this.spawnZone.current
                .getDecoratedComponentInstance()
                .setRectangles(result[0], offsetHeight);
            } else {
              this.incorrectOrderAlert.current.toggleModal(result);
            }
          });
        this.updateOrderProgress(id);
      });
    } else {
      this.progressWindow.current.openModal();
      this.progressWindow.current.setProgress(100);
      setTimeout(() => {
        this.progressWindow.current.closeModal();
      }, 500);
    }
  };

  /**
   * Handles update order progress event.
   * @param {*} task_id
   */
  updateOrderProgress = (task_id) => {
    setTimeout(() => {
      this.connector.getProgress(task_id).then((res) => {
        this.progressWindow.current.setProgress(res);
        if (res < 100) {
          this.updateOrderProgress(task_id);
        } else {
          this.connector.removeTask(task_id);
        }
      });
    }, 500);
  };

  /**
   * Loads walls collection from the frontend static server
   */
  loadWallsCollection = async () => {
    return this.connector.getWalls().then((wallsJson) => {
      return wallsJson;
    });
  };

  /**
   * Renders app.
   * @returns {HTML}
   */
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
            onDrawClick={this.handleDrawClick}
          />
          <DragZone ref={this.dragZone} />
          <SpawnZone ref={this.spawnZone} />

          <WallPicker
            ref={this.wallPicker}
            onWallSelection={this.handleWallSelection}
            loadWallsCollection={this.loadWallsCollection}
          />
          <RectangleMenu
            ref={this.rectangleMenu}
            onAddRectangleClick={this.handleAddRectangleClick}
          />

          <ArrangementMenu
            ref={this.arrangementMenu}
            onOrderWithOptionsClick={this.handleOrderWithOptionsClick}
          />

          <ProgressWindow ref={this.progressWindow} />

          <IncorrectOrderAlert ref={this.incorrectOrderAlert} />

          <input
            type="file"
            accept="application/JSON"
            ref={this.uploadInput}
            style={{ display: "none" }}
            onChange={this.loadProject}
          />
        </body>
      </DndProvider>
    );
  }
}

export default App;
