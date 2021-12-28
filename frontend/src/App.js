import './App.css';
import { Component, createRef } from 'react';
import MenuZone from './components/MenuZone';
import DragZone from './components/DragZone';
import SpawnZone from './components/SpawnZone';
import WallPicker from './components/WallPicker';
import Rectangle from './components/Rectangle';

class App extends Component {
  constructor(props){
    super(props);
    this.dragZone = createRef();
    this.spawnZone = createRef();
    this.wallPicker = createRef();
  }

  handleWallSelection = (specs) => {
    this.dragZone.current.drawWall(specs);
  }

  handleWallsClick = () => {
    this.wallPicker.current.toggleModal();
  }

  handleRectanglesClick = () => {
    var rectangle = <Rectangle style={{width:'100px', height:'100px', color:'gray'}}/>
    this.spawnZone.current.addChild(rectangle);
    // this.spawnZone.current.addRectangle('100px', '100px', 'gray');
  }

  render() {
    return (
      <body>
        <MenuZone onWallsClick={this.handleWallsClick}
                  onRectanglesClick={this.handleRectanglesClick}/>
        <DragZone ref={this.dragZone}/>
        <SpawnZone ref={this.spawnZone}/>

        <WallPicker ref={this.wallPicker} onWallSelection={this.handleWallSelection}/>
      </body>
    );
  }
}

export default App;
