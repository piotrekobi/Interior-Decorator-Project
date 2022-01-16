import { Component } from 'react'
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "./ProgressWindow.module.css"

export default class ProgressWindow extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false,
            progress : 0,
        }
    }

    toggleModal = () => {
        this.setProgress(0);
        this.setState({isModalOpen : !this.state.isModalOpen});
    }

    setProgress = (progress) => {
        this.setState({progress : progress});
    }

    render() {
        return(
            <Modal open={this.state.isModalOpen} onClose={this.toggleModal} classNames={{modal: styles.progressWindowModal,}}>
                <p>Twoje zdjęcia są właśnie rozkładane!!!</p>
                <ProgressBar completed={this.state.progress} />
            </Modal>
        )
    }
}