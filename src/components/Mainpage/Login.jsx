import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import CloseIcon from "@material-ui/icons/Close";

Modal.setAppElement("#__next");

function Login({ modalStatus, closeModal }) {
  return (
    <Modal
      isOpen={modalStatus}
      onRequestClose={closeModal}
      className = "tw-fixed tw-w-screen tw-h-full tw-bg-opacity-40 tw-bg-gray-700 tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-z-10" >
      <div className = "tw-bg-black tw-text-white sm:tw-p-8 tw-p-4 tw-rounded-l-lg tw-rounded-r-lg" >
        <CloseIcon className = "tw-ml-0 tw-p-0 tw-text-white" onClick={closeModal} />
        <div className = "tw-text-center" >
          <h1 className = "tw-text-white tw-my-4" >Login</h1>
        </div>
        <form>
          <label>
            Username:
            <input
              type="text"
              className = "tw-rounded-full tw-py-3 tw-px-6 tw-ml-3 tw-outline-none tw-text-black" />
          </label>
          <br />
          <br />
          <label>
            Password:
            <input
              type="password"
              className = "tw-rounded-full tw-py-3 tw-px-6 tw-ml-4 tw-outline-none tw-text-black" />
          </label>
          <br />
          <div className = "tw-text-center tw-mt-4" >
            <button className = "tw-bg-green-500 tw-rounded-full tw-py-2 tw-px-8" >
              Login
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default Login;
