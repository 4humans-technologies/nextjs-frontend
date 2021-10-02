import React, { useState } from "react";
import { Button } from "react-bootstrap";
import PhoneCallbackIcon from "@material-ui/icons/PhoneCallback";
import PhoneDisabledIcon from "@material-ui/icons/PhoneDisabled";
import CallEndIcon from "@material-ui/icons/CallEnd";
import Modal from "../UI/Modal";
import useModalContext from "../../app/ModalContext";
function callui() {
  const modalCtx = useModalContext();
  const [callRecived, setCallRecived] = useState(false);
  const [count, setCount] = useState(0);
  console.log(`${modalCtx.loginOpen}`);
  setTimeout(() => {
    setCount((count) => count + 1);
  }, 60 * 60);
  return (
    <div>
      <button onClick={modalCtx.toggleLoginModal}>open</button>
      <br />
      {/* <button onClick={() => modalCtx.registerOpen}>Close</button> */}
      <Modal
        modalStatus={modalCtx.loginOpen}
        closeModal={modalCtx.toggleLoginModal}
      >
        {}
        <div className="tw-text-white  tw-inline-block  tw-bg-gray-500  tw-text-center tw-ml-8 tw-mt-8 tw-py-12 tw-px-12 tw-rounded-t-2xl tw-rounded-b-2xl">
          {/* First div to make the profile  */}
          <div>
            <div className="tw-pl-4 tw-mb-4 ">
              <img
                className="tw-rounded-full tw-w-32 tw-h-32"
                src="/pp.jpg"
              ></img>
            </div>

            <p>Sandeep Maheshwari</p>
          </div>
          {/* Type of call we get from them */}
          <div className="tw-mb-6">
            {callRecived ? <p>{count} seconds</p> : <div>Incoming call</div>}
          </div>
          {/* Call accept and reject button */}

          <div>
            {callRecived ? (
              <div className="tw-flex tw-flex-col tw-w-44 tw-justify-items-center">
                <button
                  className="tw-bg-dreamgirl-red tw-rounded-full tw-m-3"
                  onClick={() => setCallRecived((prev) => !prev)}
                >
                  <CallEndIcon />
                </button>
              </div>
            ) : (
              <div className="tw-flex tw-w-44 tw-justify-between">
                <button
                  className=" accept_call"
                  onClick={() => setCallRecived((prev) => !prev)}
                >
                  <PhoneCallbackIcon />
                </button>
                <button
                  className="reject_call"
                  onClick={() => setCallRecived((prev) => !prev)}
                >
                  <PhoneDisabledIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default callui;
