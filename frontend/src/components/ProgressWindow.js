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

import { Component } from 'react'
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "./ProgressWindow.module.css"

/**
 * Component showing the information about optimizing progress status
 */
class ProgressWindow extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false,
            progress : 0,
        }
    }

    /**
     * Makes the component visible.
     */
    openModal = () => {
        this.setProgress(0);
        this.setState({isModalOpen : true});
    }

    /**
     * Makes the component invisible.
     */
    closeModal = () => {
        this.setProgress(0);
        this.setState({isModalOpen : false});
    }

    /**
     * Sets information about the progress status on the progress bar.
     * @param {number} progress 
     */
    setProgress = (progress) => {
        this.setState({progress : progress});
    }

    /**
     * Renders HTML component code.
     * @returns {HTML}
     */
    render() {
        return(
            <Modal 
                open={this.state.isModalOpen} 
                onClose={() => {}} 
                classNames={{
                    modal: styles.progressWindowModal,
                }}
                >
                <p>Trwa rozmieszczanie...</p>
                <ProgressBar 
                    completed={this.state.progress} 
                    transitionDuration='0.5s'
                />
            </Modal>
        )
    }
}

export default ProgressWindow;