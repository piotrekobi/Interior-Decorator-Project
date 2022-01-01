import './App.css';
import { Component, createRef } from 'react';
import MenuZone from './components/MenuZone';
import DragZone from './components/DragZone';
import SpawnZone from './components/SpawnZone';
import WallPicker from './components/WallPicker';
import RectangleMenu from './components/RectangleMenu';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

class App extends Component {
    constructor(props) {
        super(props);
        this.dragZone = createRef();
        this.spawnZone = createRef();
        this.wallPicker = createRef();
        this.rectangleMenu = createRef();
    }

    handleWallSelection = (specs) => {
        this.dragZone.current.getDecoratedComponentInstance().setWall(specs);
    }

    handleWallsClick = () => {
        this.wallPicker.current.toggleModal();
    }

    handleRectanglesClick = () => {

        //var rectangle = (<Rectangle id={uuidv4()} style={{ width: '100px', height: '100px', background: 'gray' }}/>)
        //this.spawnZone.current.getDecoratedComponentInstance().addChild(rectangle);
        this.rectangleMenu.current.toggleModal();
    }

    handleAddRectangleClick = (width, height, color) => {
        this.spawnZone.current.getDecoratedComponentInstance().addChild(width, height, color);
    };

    handleOrderClick = () => {
        var rectangle_json = this.spawnZone.current.getDecoratedComponentInstance().getRectangles();
        var wall_json = this.dragZone.current.getDecoratedComponentInstance().getWall();
        var preferred_spacing = 30; // EXAMPLE - TODO
        
        fetch("http://127.0.0.1:8000/optimizer/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{rectangle_json, wall_json, preferred_spacing}])
        })
            .then(response => response.json())
            .then(data => this.spawnZone.current.getDecoratedComponentInstance().setRectangles(data));
    }
  

    render() {
        return (
            <DndProvider backend={HTML5Backend}>
                <body>
                    <MenuZone onWallsClick={this.handleWallsClick}
                        onRectanglesClick={this.handleRectanglesClick} 
                        onOrderClick={this.handleOrderClick}/>
                    <DragZone ref={this.dragZone} />
                    <SpawnZone ref={this.spawnZone} />

                    <WallPicker ref={this.wallPicker} 
                        onWallSelection={this.handleWallSelection} 
                    />
                    <RectangleMenu ref={this.rectangleMenu}
                        onAddRectangleClick={this.handleAddRectangleClick}
                    />

                </body>
            </DndProvider>
        );
    }
}

export default App;
