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