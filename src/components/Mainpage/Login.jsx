import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import CloseIcon from "@material-ui/icons/Close";
import { useRouter } from "next/router";
import {
  useViewerContext,
  useViewerUpdateContext,
} from "../../app/Viewercontext";

Modal.setAppElement("#__next");

function Login({ modalStatus, closeModal }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const ctx = useViewerContext();
  const updatectx = useViewerUpdateContext();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("username: ", username);
    console.log("password: ", password);
    fetch("http://localhost:8080/api/website/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.actionStatus === "success") {
          console.log("data: ", data);
          localStorage.setItem("token", data.token);
          updatectx.updateViewer(
            {
              rootUserId: data.userId,
              relatedUserId: data.relatedUserId,
              token: data.token,
              isLoggedIn: true,
              // hour : data.hour, has been left out
            },
            () => {
              router.push("/ravi");
            }
          );
        }
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };
  return (
    <Modal
      isOpen={modalStatus}
      onRequestClose={closeModal}
      className="tw-fixed tw-w-screen tw-h-full tw-bg-opacity-40 tw-bg-gray-700 tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-z-10"
    >
      <div className="tw-bg-black tw-text-white sm:tw-p-8 tw-p-4 tw-rounded-l-lg tw-rounded-r-lg">
        <CloseIcon
          className="tw-ml-0 tw-p-0 tw-text-white"
          onClick={closeModal}
        />
        <div className="tw-text-center">
          <h1 className="tw-text-white tw-my-4">Login</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="tw-rounded-full tw-py-3 tw-px-6 tw-ml-3 tw-outline-none tw-text-black"
            />
          </label>
          <br />
          <br />
          <label>
            Password:
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="tw-rounded-full tw-py-3 tw-px-6 tw-ml-4 tw-outline-none tw-text-black"
            />
          </label>
          <br />
          <div className="tw-text-center tw-mt-4">
            <button className="tw-bg-green-500 tw-rounded-full tw-py-2 tw-px-8">
              Login
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default Login;
