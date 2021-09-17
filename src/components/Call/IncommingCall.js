import React, { useState } from 'react'
import Modal from "react-modal"


function IncommingCall() {
    const [isOpen, setIsOpen] = useState(false)
    const modalStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                style={modalStyles}
            >
                <div className="modal-content">
                    <h1>this is Modal</h1>
                </div>
            </Modal>
        </>
    )
}

export default IncommingCall
