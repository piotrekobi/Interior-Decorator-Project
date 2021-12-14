import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import MenuZone from './components/MenuZone';
import DragZone from './components/DragZone';
import SpawnZone from './components/SpawnZone';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <main>
        <MenuZone/>
        <DragZone/>
        <SpawnZone/>
      </main>
    );
  }
}

export default App;
