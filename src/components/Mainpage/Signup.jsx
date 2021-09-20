import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import { useRouter } from "next/router";
import {
  useViewerUpdateContext,
  useViewerContext,
} from "../../app/Viewercontext";
import useModalContext from "../../app/ModalContext";

function Signup() {
  const modalCtx = useModalContext();

  const [email, setEmail] = useState(
    `ravi_4${Math.floor(Math.random() * 1000000)}@gm.co`
  );
  const [password, setPassword] = useState(
    `ravi_4${Math.floor(Math.random() * 1000000)}`
  );
  const [username, setUsername] = useState(
    `ravi_4${Math.floor(Math.random() * 1000000)}`
  );
  const ctx = useViewerContext();
  const updateCtx = useViewerUpdateContext();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password, username);
    fetch("http://localhost:8080/api/website/register/viewer", {
      method: "POST",
      cors: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        username: username,
        phone: "924564345423",
        gender: "Male",
        name: "ram",
        screenName: "screenName",
      }),
    })
      .then((resp) => resp.json())
      .then(
        (data) =>
          updateCtx.updateViewer(
            {
              rootUserId: data.user._id,
              relatedUserId: data.user.relatedUser._id,
              user: data.user,
            },
            () => {
              router.push("/ravi/live");
            }
          )
        //redirect to home page
      )

      .catch((err) => console.log(err));
  };

  return (
    <div className="tw-bg-black tw-text-white sm:tw-p-8 tw-p-4 tw-rounded-l-lg tw-rounded-r-lg">
      <CloseIcon
        className="tw-ml-0 tw-p-0 tw-text-white"
        onClick={modalCtx.toggleModal}
      />
      <div className="tw-text-center">
        <h1 className="tw-text-white tw-my-4">Registration </h1>
      </div>
      <form onSubmit={handleSubmit}>
        {!ctx.rootUserId ? <p>no id</p> : <p>{ctx.rootUserId}</p>}
        <label>
          Username:
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="Username"
            className="tw-rounded-full tw-py-3 tw-px-6 tw-ml-3 tw-outline-none tw-text-black"
          />
        </label>
        <br />
        <br />
        <label>
          Password:
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="tw-rounded-full tw-py-3 tw-px-6 tw-ml-4 tw-outline-none tw-text-black"
          />
        </label>
        <br />
        <br />
        <label>
          Email:
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email address"
            className="tw-rounded-full tw-py-3 tw-px-6 tw-ml-10 tw-outline-none tw-text-black"
          />
        </label>
        <br />
        <div className="tw-text-center tw-mt-4">
          <button className="tw-bg-green-500 tw-rounded-full tw-py-2 tw-px-8">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
