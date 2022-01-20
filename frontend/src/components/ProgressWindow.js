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