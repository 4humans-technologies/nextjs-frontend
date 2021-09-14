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
      <h2 className="tw-text-white tw-pt-32 ">Model Registraion Form</h2>

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
          <label htmlFor="Name">Name</label>
          <input
            type="text"
            name="Name"
            id="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="tw-ml-8 tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-w-5/6 sm:tw-w-max"
          />
        </div>

        <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
          <label htmlFor="Age">Age</label>
          <input
            type="number"
            name="Age"
            id="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="tw-ml-12 tw-rounded-full tw-border-none tw-outline-none tw-pl-2"
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

        <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            name="Email"
            id="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="tw-ml-8 tw-rounded-full tw-border-none tw-outline-none tw-pl-2"
          />
        </div>

        <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
          <label htmlFor="Phone">Phone</label>
          <input
            type="tel"
            name="Phone"
            id="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="tw-ml-8 tw-rounded-full tw-border-none tw-outline-none tw-pl-2"
          />
        </div>

        <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
          <label htmlFor="gender">Gender</label>
          <select
            type=""
            name="gender"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="tw-ml-8 tw-rounded-full tw-border-none tw-outline-none tw-pl-2 tw-w-9/12"
          >
            <option value="Male">Male </option>
            <option value="Female">Female</option>
          </select>
        </div>

        <Button variant="success" className="tw-mt-4 tw-mx-8" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Registration;
