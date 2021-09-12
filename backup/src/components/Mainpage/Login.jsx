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
      className="fixed w-screen h-full bg-opacity-40 bg-gray-700 cursor-pointer flex items-center justify-center z-10"
    >
      <div className="bg-black text-white sm:p-8 p-4 rounded-l-lg rounded-r-lg ">
        <CloseIcon className="ml-0 p-0 text-white" onClick={closeModal} />
        <div className="text-center">
          <h1 className="text-white my-4">Login</h1>
        </div>
        <form>
          <label>
            Username:
            <input
              type="text"
              className="rounded-full py-3 px-6 ml-3 outline-none text-black"
            />
          </label>
          <br />
          <br />
          <label>
            Password:
            <input
              type="password"
              className="rounded-full py-3 px-6 ml-4 outline-none text-black"
            />
          </label>
          <br />
          <div className="text-center mt-4">
            <button className="bg-green-500 rounded-full py-2 px-8">
              Login
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default Login;