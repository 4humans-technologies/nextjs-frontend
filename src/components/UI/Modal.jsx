import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

function Mainmodal({ children, modalStatus, closeModal }) {
  return (
    <div>
      <Modal
        isOpen={modalStatus}
        onRequestClose={closeModal}
        className="tw-fixed  tw-w-screen tw-h-full tw-bg-opacity-40 tw-bg-purple-500 tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-z-[500]"
      >
        {children}
      </Modal>
    </div>
  )
}

export default Mainmodal;
