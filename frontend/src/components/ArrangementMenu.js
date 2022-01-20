import { Component } from "react";
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'

/**
 * Component for setting preferred spacing bertween rectangles.
 */
class ArrangementMenu extends Component{
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false,
        }
        this.preferred_spacing = 30;
    }

    /**
     * Makes a component invisible (when visible) and vice versa.
     */
    toggleModal = () => {
        this.setState({isModalOpen : !this.state.isModalOpen});
    }

    /**
     * Handles order button click event.
     */
    handleOrderWithOptions = () => {
        this.toggleModal();
        this.props.onOrderWithOptionsClick(this.preferred_spacing);
    }

    /**
     * Renders HTML component code.
     * @returns {HTML}
     */
    render() {
        return(
            <Modal open={this.state.isModalOpen} onClose={this.toggleModal}>
                <p>Preferowana odległość między prostokątami:</p>
                <input 
                    type='number' 
                    onChange={pref_space => {this.preferred_spacing = parseInt(pref_space.target.value)}}
                    placeholder={this.preferred_spacing}
                />
                <button onClick={this.handleOrderWithOptions} >Rozmieść</button>
            </Modal>
        )
    }
}

export default ArrangementMenu;