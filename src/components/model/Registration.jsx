import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { validPassword, validEmail, validatePhone } from "../UI/Regex";

//Validation is still left in this

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
    <div className="tw-bg-dark-black  tw-h-screen tw-w-screen tw-text-center">
      <h1 className="tw-text-white tw-pt-32 tw-font-bold tw-text-lg">
        Model Registraion Form
      </h1>

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
              type="text"
              name="Name"
              id="Name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-w-5/6 sm:tw-w-max tw-text-black"
            />
          </div>

          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
            <input
              type="number"
              name="Age"
              id="Age"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black"
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

          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
            <input
              type="email"
              name="Email"
              id="Email"
              placeholder="Your email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black"
            />
          </div>

          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
            <input
              type="tel"
              name="Phone"
              id="Phone"
              placeholder="Your Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className=" tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-text-black"
            />
          </div>

          <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
            <select
              type=""
              name="gender"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className=" tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-w-full tw-text-black"
            >
              <option value="Male" selected>Male </option>
              <option value="Female">Female</option>
            </select>
          </div>

          <Button
            variant="success"
            className="tw-mt-4 tw-rounded-full"
            type="submit"
          >
            Submit
          </Button>
        </form>
        <h1 className="tw-my-2">Already Register </h1>
        <Button className="tw-rounded-full">Login</Button>
      </div>
    </div>
  );
}

export default Registration;
