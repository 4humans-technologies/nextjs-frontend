import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { validPassword, validEmail, validatePhone } from "../UI/Regex";
import {
  useViewerContext,
  useViewerUpdateContext,
} from "../../app/Viewercontext";

import Link from "next/link";
import { useRouter } from "next/router";

//Validation is still left in this

function Login() {
  const router = useRouter();
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
          localStorage.setItem("jwtTokenModel", data.token);
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
    <div className="tw-bg-dark-black  tw-h-screen tw-w-screen tw-text-center ">
      <div
        className=" tw-bg-no-repeat tw-bg-cover  tw-absolute   tw-shadow-xl tw-text-lg tw-font-sans tw-text-white  tw-rounded-l-lg tw-rounded-r-lg tw-top-1/5  tw-right-auto tw-bottom-auto tw-translate-x-1/2 tw-translate-y-1/2  tw-w-[50vw]  tw-h-[50vh] tw-py-8"
        style={{ backgroundImage: `url("/login.jpg")` }}
      >
        <form onSubmit={handleSubmit} className="tw-text-center ">
          <h2 className="tw-text-black tw-pb-8 tw-text-2xl tw-font-extrabold  ">
            Model Login Form
          </h2>
          <div className="tw-py-2 tw-px-2 tw-justify-items-center ">
            <input
              type="text"
              name="Username"
              id="Username"
              placeholder="UserName"
              value={username}
              onChange={(e) => setuserName(e.target.value)}
              className=" tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-py-2 tw-text-black"
            />
          </div>

          <div className="tw-py-2 tw-px-2 tw-justify-between">
            <input
              type="Password"
              name="Password"
              id="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-py-2 tw-text-black"
            />
          </div>

          <Button
            variant="success"
            className="tw-mt-4 tw-rounded-full tw-w-48"
            type="submit"
          >
            Submit
          </Button>
        </form>
        <div className="tw-absolute tw-bottom-4 tw-inline-block tw-ml-[-15%]  ">
          <p className="tw-flex">
            <h1 className="tw-py-4 tw-text-black  ">You can register here </h1>{" "}
            <p
              onClick={() => router.push("/ravi/registration")}
              className="tw-underline tw-font-bold tw-text-lg tw-self-center tw-pl-4 tw-cursor-pointer"
            >
              {" "}
              Register
            </p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
