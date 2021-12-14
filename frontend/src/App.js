import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import MenuZone from './components/MenuZone';
import DragZone from './components/DragZone';
import SpawnZone from './components/SpawnZone';
import WallPicker from './components/WallPicker';

class App extends Component {
  render() {
    return (
      <body>
        <MenuZone/>
        <DragZone/>
        <SpawnZone/>

        <WallPicker />
      </body>
    );
  }
}

export default App;
