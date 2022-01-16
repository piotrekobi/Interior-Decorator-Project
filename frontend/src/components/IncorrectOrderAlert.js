import { Component } from "react";
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'

export default class IncorrectOrderAlert extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false,
        }
    }

    toggleModal = (arrangement) => {
        this.setState({isModalOpen : !this.state.isModalOpen});
        this.hardArrangement = arrangement;
    }

    render() {
        return(
            <Modal open={this.state.isModalOpen} onClose={this.toggleModal}>
                <p>Nie udało się rozmieścić prostokątów z uwzględnieniem zadanych ograniczeń.</p>
                <button onClick={this.toggleModal}>Zrezygnuj z rozmieszczenia</button>
            </Modal>
        )
    }
}