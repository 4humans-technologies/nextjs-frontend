import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { validPassword, validEmail, validatePhone } from "../UI/Regex";

//Validation is still left in this
// I did blunder using multiple state ,rather than using single to create it
function Registration() {
  const [formsubmit, SetFormsubmit] = useState(false);
  const [name, setName] = useState("");
  const [username, setuserName] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password, username);
    fetch("http://localhost:8080/api/website/register/model/create", {
      method: "POST",
      cors: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        age,
        email,
        password,
        username,
        phone,
        gender,
        profileImage: "/path-to-img",
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.message);
        console.log(data);
        console.log(name, age, email, password, username, phone, gender),
          SetFormsubmit(true),
          console.log(formsubmit);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="tw-bg-dark-black  tw-h-screen tw-w-screen tw-text-center tw-min-h-screen">
      <div
        className="  tw-bg-no-repeat tw-bg-cover   tw-absolute tw-shadow-xl tw-text-lg tw-font-sans tw-text-white  tw-rounded-l-lg tw-rounded-r-lg tw-top-0  tw-right-auto tw-bottom-auto md:tw-translate-x-1/2 tw-translate-x-[10%] md:tw-translate-y-[15%] tw-translate-y-[10%]  md:tw-w-[50vw] tw-w-[80vw]   tw-h-[85vh] tw-py-8"
        style={{ backgroundImage: `url("/login.jpg")` }}
      >
        <h1 className="tw-text-white  tw-font-bold tw-text-lg">
          Model Registraion Form
        </h1>
        <form onSubmit={handleSubmit} className="tw-text-center">
          <div className="tw-inline-block tw-py-2 tw-px-2 tw-self-center">
            <input
              type="text"
              name="Username"
              id="Username"
              placeholder="UserName"
              value={username}
              onChange={(e) => setuserName(e.target.value)}
              className=" tw-w-80 tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black tw-py-2"
            />
          </div>
          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-center">
            <input
              type="text"
              name="Name"
              id="Name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="tw-w-80 tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black tw-py-2"
            />
          </div>

          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-center">
            <input
              type="number"
              name="Age"
              id="Age"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="tw-w-80 tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black tw-py-2"
            />
          </div>

          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-center">
            <input
              type="Password"
              name="Password"
              id="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" tw-w-80 tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black tw-py-2"
            />
          </div>

          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-center">
            <input
              type="email"
              name="Email"
              id="Email"
              placeholder="Your email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="tw-w-80  tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black tw-py-2"
            />
          </div>

          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-center">
            <input
              type="tel"
              name="Phone"
              id="Phone"
              placeholder="Your Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className=" tw-w-80 tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black tw-py-2"
            />
          </div>

          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-center">
            <select
              type=""
              name="gender"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="tw-w-80  tw-rounded-full tw-border-none tw-outline-none tw-pl-2  tw-text-black tw-py-2"
            >
              <option value="Female" selected>
                Female
              </option>
              <option value="Male">Male </option>
            </select>
          </div>

          <Button
            variant="success"
            className="tw-mt-4 tw-rounded-full  tw-w-44"
            type="submit"
          >
            Submit
          </Button>
        </form>
        <h1 className="tw-my-2 ">Already Register </h1>
        <Button className="tw-rounded-full tw-w-44">Login</Button>
      </div>
    </div>
  );
}

export default Registration;
