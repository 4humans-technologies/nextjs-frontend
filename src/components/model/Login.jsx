import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { validPassword, validEmail, validatePhone } from "../UI/Regex";
import {
  useViewerContext,
  useViewerUpdateContext,
} from "../../app/Viewercontext";

//Validation is still left in this

function Login() {
  const [formsubmit, SetFormsubmit] = useState(false);

  const [username, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const ctx = useViewerContext();
  const updatectx = useViewerUpdateContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(password, username);
    fetch("http://localhost:8080/api/website/login", {
      method: "POST",
      cors: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        username,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.actionStatus === "success") {
          console.log("Data", data);
          localStorage.setItem("token", data.token);
          updatectx.updateViewer({
            rootUserId: data.userId,
            relatedUserId: data.relatedUserId,
            token: data.token,
            isLoggedIn: true,
            user: {
              userType: data.user.userType,
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="tw-bg-dark-black  tw-h-screen tw-w-screen tw-text-center">
      <h2 className="tw-text-white tw-pt-32 ">Model Login Form</h2>

      <form
        onSubmit={handleSubmit}
        className="tw-flex tw-flex-col tw-bg-yellow-200 tw-absolute tw-top-1/4 sm:tw-left-[38%]   tw-shadow-xl tw-text-lg tw-font-sans"
      >
        <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
          <label htmlFor="Username">Username</label>
          <input
            type="text"
            name="Username"
            id="Username"
            value={username}
            onChange={(e) => setuserName(e.target.value)}
            className="tw-ml-2 tw-rounded-full tw-border-none tw-outline-none tw-pl-2"
          />
        </div>

        <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
          <label htmlFor="Password">Password</label>
          <input
            type="Password"
            name="Password"
            id="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="tw-ml-4 tw-rounded-full tw-border-none tw-outline-none tw-pl-2"
          />
        </div>

        <Button variant="success" className="tw-mt-4 tw-mx-8" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Login;
