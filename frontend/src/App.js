import './App.css';
import { Component, createRef } from 'react';
import MenuZone from './components/MenuZone';
import DragZone from './components/DragZone';
import SpawnZone from './components/SpawnZone';
import WallPicker from './components/WallPicker';
import Rectangle from './components/Rectangle';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { v4 as uuidv4 } from 'uuid';

class App extends Component {
    constructor(props) {
        super(props);
        this.dragZone = createRef();
        this.spawnZone = createRef();
        this.wallPicker = createRef();
    }

    handleWallSelection = (specs) => {
        this.dragZone.current.decoratedRef.current.drawWall(specs);
    }

    handleWallsClick = () => {
        this.wallPicker.current.toggleModal();
    }

    handleRectanglesClick = () => {

        var rectangle = (<Rectangle id={uuidv4()} style={{ width: '100px', height: '100px', background: 'gray' }}/>)
        this.spawnZone.current.getDecoratedComponentInstance().addChild(rectangle);
    }

    render() {
        return (
            <DndProvider backend={HTML5Backend}>
                <body>
                    <MenuZone onWallsClick={this.handleWallsClick}
                        onRectanglesClick={this.handleRectanglesClick} />
                    <DragZone ref={this.dragZone} />
                    <SpawnZone ref={this.spawnZone} />

                    <WallPicker ref={this.wallPicker} onWallSelection={this.handleWallSelection} />
                </body>
            </DndProvider>
        );
    }
}

export default App;
