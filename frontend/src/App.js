import './App.css';
import { Component, createRef } from 'react';
import MenuZone from './components/MenuZone';
import DragZone from './components/DragZone';
import SpawnZone from './components/SpawnZone';

class App extends Component {
  constructor(props){
    super(props);
    this.mainCanvas = createRef();
  }
  render() {
    return (
      <body>
        <MenuZone mainCanvas={this.mainCanvas}/>
        <DragZone mainCanvas={this.mainCanvas}/>
        <SpawnZone/>
      </body>
    );
  }
}

export default App;
