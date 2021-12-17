import './App.css';
import { Component, createRef } from 'react';
import MenuZone from './components/MenuZone';
import DragZone from './components/DragZone';
import SpawnZone from './components/SpawnZone';
import WallPicker from './components/WallPicker';

class App extends Component {
  constructor(props){
    super(props);
    this.dragZone = createRef();
    this.wallPicker = createRef();
  }

  handleWallSelection = (specs) => {
    this.dragZone.current.drawWall(specs);
  }

  handleWallsClick = () => {
    this.wallPicker.current.toggleModal();
  }

  render() {
    return (
      <body>
        <MenuZone onWallsClick={this.handleWallsClick}/>
        <DragZone ref={this.dragZone}/>
        <SpawnZone/>

        <WallPicker ref={this.wallPicker} onWallSelection={this.handleWallSelection}/>
      </body>
    );
  }
}

export default App;
