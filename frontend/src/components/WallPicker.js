// Copyright (c) 2022, Piotr Paturej, Miłosz Kasak, Kamil Szydłowski, Jakub Polak
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Component, createRef } from 'react';
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import cloneDeep from 'lodash.clonedeep'


/**
 * Component representing wall picking submenu.
 */
class WallPicker extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false,
        }
        this.wallsJson = [];
    }

    /**
     * Makes a component invisible (when visible) and vice versa.
     */
    toggleModal = () => {
        this.setState({isModalOpen : !this.state.isModalOpen});
    }

    /**
     * Loads walls collection from the frontend static server
     * and sets the dafault wall.
     */
    async componentDidMount() {
        this.props.loadWallsCollection()
            .then(wallsJson => this.wallsJson = wallsJson)
            .then(() => {this.props.onWallSelection(this.wallsJson[0])});
    }

    /**
     * Renders mini walls grid to enable user to pick one of them
     * @returns {HTML}
     */
    renderWallsGrid = () => {
        var items = this.wallsJson.map((data, index) => {
            return(
                    <th onClick={() => this.handleWallSelection(data)}>
                        <MiniWall specs={data}/>
                    </th>
            )
        });

        if(items.length !== 0)
        {
            var table = items.reduce((prev, curr, index) => {
                if(index === 1)
                {
                    return [prev, curr];
                }
                else if(index%4 === 3)
                {
                    return [...prev.slice(0, -3),(
                        <tr>
                            {[...prev.slice(-3), curr]}
                        </tr>
                    )]
                }
                else
                {
                    return [...prev, curr];
                }
            });     
            return table
        };
    }

    /**
     * Handles mini-wall click event.
     */
    handleWallSelection = (specs) => {
        this.props.onWallSelection(specs);
        this.toggleModal();
    }

    /**
     * Renders HTML component code.
     * @returns {HTML}
     */
    render() {
        return(
            <Modal open={this.state.isModalOpen} onClose={this.toggleModal}>
                <table>
                    <tbody>
                        {this.renderWallsGrid()}
                    </tbody>
                </table>
            </Modal>
        )
    }
}

export default WallPicker;

/**
 * Component representing mini-wall on the wall picking submenu grid.
 */
class MiniWall extends Component{
    constructor(params){
        super(params);
        this.specs = params.specs;
        this.canvas = createRef();
    }

    /**
     * Draws mini-wall after component is mounted.
     */
    componentDidMount = () => {
        var miniCtx = this.canvas.current.getContext("2d");
        var points = cloneDeep(this.specs.vertices)

        var prev_key = null;
        miniCtx.beginPath();
        miniCtx.lineWidth = 2;
        for (var key in points){
            points[key]['x'] = points[key]['x'] / 5;
            points[key]['y'] = points[key]['y'] / 5;

            miniCtx.moveTo(points[key]['x'], points[key]['y']);
            if (prev_key != null){
                miniCtx.lineTo(points[prev_key]['x'], points[prev_key]['y']);
            }
            miniCtx.stroke();
            prev_key = key;
        }
        miniCtx.moveTo(points[0]['x'], points[0]['y']);
        miniCtx.lineTo(points[prev_key]['x'], points[prev_key]['y']);
        miniCtx.stroke();
    }

    /**
     * Renders HTML component code.
     * @returns {HTML}
     */
    render() {
        return(
            <canvas ref={this.canvas}></canvas>
        )
    }
}