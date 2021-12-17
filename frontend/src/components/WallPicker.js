import { Component, createRef } from 'react';
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import {Responsive, WidthProvider} from 'react-grid-layout'
import GridLayout from 'react-grid-layout';
import cloneDeep from 'lodash.clonedeep'

export default class WallPicker extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false,
            wallsJson : [],
        }
        this.miniWallsRefs = [];
    }

    toggleModal = () => {
        this.setState({isModalOpen : !this.state.isModalOpen});
    }

    async componentDidMount() {
        fetch("./walls.json",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json())
            .then(json => this.setState({wallsJson: json}));
    }

    renderWallsGrid = () => {
        return this.state.wallsJson.map((data, index) => {
            var miniWallRef = createRef();
            this.miniWallsRefs.push(miniWallRef);
            return(
                <tr>
                    <th onClick={this.changeWall(data.vertices)}>
                        <MiniWall specs={data} ref={miniWallRef}/>
                    </th>
                </tr>
                
            )
        })
    }

    changeWall = (vertices) => {
        var ctx = this.props.mainCanvas.current.getContext("2d");
        ctx.clearRect(0, 0, this.props.mainCanvas.width, this.props.mainCanvas.height);
        ctx.beginPath();

        var prevKey;
        for (var key in vertices){
            ctx.moveTo(vertices[key]['x'], vertices[key]['y']);
            if (prevKey != null){
                ctx.lineTo(vertices[prevKey]['x'], vertices[prevKey]['y']);
            }
            ctx.stroke();
            prevKey = key;
        }
        ctx.moveTo(vertices[0]['x'], vertices[0]['y']);
        ctx.lineTo(vertices[prevKey]['x'], vertices[prevKey]['y']);
        ctx.stroke();
    }

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

class MiniWall extends Component{
    constructor(params){
        super(params);
        this.specs = params.specs;
        this.canvas = createRef();
    }

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

    render() {
        return(
            <canvas ref={this.canvas}></canvas>
        )
    }
}