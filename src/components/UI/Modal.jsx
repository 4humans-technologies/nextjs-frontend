import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

function Mainmodal({ children, modalStatus, closeModal }) {
  return (
    <div>
      <Modal
        isOpen={modalStatus}
        onRequestClose={closeModal}
        className="fixed w-screen h-full bg-opacity-40 bg-purple-500 cursor-pointer flex items-center justify-center z-10"
      >
        {children}
      </Modal>
    </div>
  );
}

export default Mainmodal;
