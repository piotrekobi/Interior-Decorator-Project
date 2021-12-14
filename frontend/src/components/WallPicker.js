import { Component } from 'react';
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'

export default class WallPicker extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false
        }
    }

    toggleModal = () => {
        this.setState({isModalOpen : !this.state.isModalOpen});
    }

    render() {
        return(
            <Modal open={this.state.isModalOpen} onClose={this.toggleModal}>
                <div>My modal dialog</div>
            </Modal>
        )
    }
}