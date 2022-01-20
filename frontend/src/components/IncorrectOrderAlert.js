import { Component } from "react";
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'

/**
 * Component showing the information that the rectangles
 * ordering data from the optimizer is incorrect
 */
class IncorrectOrderAlert extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false,
        }
    }

    /**
     * Makes a component invisible (when visible) and vice versa.
     */
    toggleModal = (arrangement) => {
        this.setState({isModalOpen : !this.state.isModalOpen});
        this.hardArrangement = arrangement;
    }

    /**
     * Renders HTML component code.
     * @returns {HTML}
     */
    render() {
        return(
            <Modal open={this.state.isModalOpen} onClose={this.toggleModal}>
                <p>Nie udało się rozmieścić prostokątów z uwzględnieniem zadanych ograniczeń.</p>
                <button onClick={this.toggleModal}>Zrezygnuj z rozmieszczenia</button>
            </Modal>
        )
    }
}

export default IncorrectOrderAlert;