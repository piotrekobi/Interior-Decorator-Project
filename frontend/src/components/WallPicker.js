import { Component, createRef } from 'react';
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import cloneDeep from 'lodash.clonedeep'
import Connector from '../Connector';


export default class WallPicker extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false,
        }
        this.wallsJson = [];
    }

    toggleModal = () => {
        this.setState({isModalOpen : !this.state.isModalOpen});
    }

    async componentDidMount() {
        var connector = new Connector([])
        connector.getWalls()
            .then(wallsJson => this.wallsJson = wallsJson)
            .then(() => {this.props.onWallSelection(this.wallsJson[0])});
    }

    renderWallsGrid = () => {
        return this.wallsJson.map((data, index) => {
            return(
                <tr>
                    <th onClick={() => this.handleWallSelection(data)}>
                        <MiniWall specs={data}/>
                    </th>
                </tr>
                
            )
        })
    }

    handleWallSelection = (specs) => {
        this.props.onWallSelection(specs);
        this.toggleModal();
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