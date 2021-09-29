import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { validPassword, validEmail, validatePhone } from "../UI/Regex";
import {
  useAuthContext,
  useAuthUpdateContext,
} from "../../app/AuthContext";

//Validation is still left in this

function Login() {
  const [formsubmit, SetFormsubmit] = useState(false);

  const [username, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const ctx = useAuthContext();
  const updatectx = useAuthUpdateContext();

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
          localStorage.setItem("jwtToken", data.token);
          updatectx.updateViewer({
            rootUserId: data.userId,
            relatedUserId: data.relatedUserId,
            token: data.token,
            isLoggedIn: true,
            user: {
              userType: data.userType,
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="tw-bg-dark-black  tw-h-screen tw-w-screen tw-text-center">
      <h2 className="tw-text-white tw-pt-32 ">Model Login Form</h2>

      <div className="tw-flex tw-flex-col tw-bg-black tw-absolute tw-top-1/4 sm:tw-left-[38%]  tw-shadow-xl tw-text-lg tw-font-sans tw-text-white  tw-rounded-l-lg tw-rounded-r-lg tw-px-8 tw-py-8">
        <form onSubmit={handleSubmit} className="tw-text-center">
          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
            <input
              type="text"
              name="Username"
              id="Username"
              placeholder="UserName"
              value={username}
              onChange={(e) => setuserName(e.target.value)}
              className=" tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black"
            />
          </div>

          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
            <input
              type="Password"
              name="Password"
              id="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black"
            />
          </div>

          <Button
            variant="success"
            className="tw-mt-4 tw-rounded-full"
            type="submit"
          >
            Submit
          </Button>
        </form>
        <h1 className="tw-my-2">Register </h1>
        <Button className="tw-rounded-full">Register</Button>
      </div>
    </div>
  );
}

export default Login;
