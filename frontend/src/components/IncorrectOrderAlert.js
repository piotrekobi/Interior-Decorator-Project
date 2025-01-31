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