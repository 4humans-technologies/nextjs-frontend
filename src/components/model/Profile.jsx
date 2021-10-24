import React, { useState, useEffect } from "react";
import CreateIcon from "@material-ui/icons/Create"
import { Button } from "react-bootstrap"
import Card from "../UI/Card"
import HelpOutlineIcon from "@material-ui/icons/HelpOutline"
import Callhistory from "./CallHistory"
import modalContext from "../../app/ModalContext"

const EmailChange = (props) => {
  const [email, setEmail] = useState({
    oldEmail: "",
    newEmail: "",
  })
  const changeHandler = (e) => {
    setEmail({ ...email, [e.target.name]: e.target.value })
  }
  return (
    <div>
      <input
        type="email"
        name="oldEmail"
        id=""
        placeholder="Last Email Id"
        onChange={changeHandler}
      />
      <input
        type="email"
        name="newEmail"
        id=""
        placeholder="New Email Id"
        onChange={changeHandler}
      />
    </div>
  )
}

const PasswordChange = (props) => {
  const [password, setPassword] = useState({
    oldPasswod: "",
    newPasswod: "",
  })

  // This change handler can handle change in of all type in the form this helps to make code clean and smooth
  const changeHandler = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <input
        type="password"
        name=""
        id=""
        value={oldPasswod}
        onChange={changeHandler}
      />
      <input
        type="password"
        name=""
        id=""
        value={newPasswod}
        onChange={changeHandler}
      />
    </div>
  )
}

function Profile() {
  const [checked, setChecked] = useState(false)
  const [infoedited, setInfoedited] = useState(false)
  const [dynamicData, setDynamicData] = useState([2])
  const [modelData, setModelData] = useState()
  const [callData, setCallData] = useState()
  const modalCtx = modalContext()

  useEffect(() => {
    fetch("/model.json")
      .then((res) => res.json())
      .then((data) => {
        setModelData(data.Personal), setCallData(data.Charges)
      })
      return{
        
      }
  }, [])

  // useEffect to make  button appear when change in information takes place
  let audio = []
  let video = []

  useEffect(() => {
    if (callData) {
      for (let index = 1; index < 5; index++) {
        audio.push(callData.Audio * index)
        video.push(callData.Video * index)
      }
    }
  }, [callData])

  console.log(audio)
  console.log(video)
  const toggleChecked = () => {
    setChecked((prev) => !prev)
  }

  const saveData = () => {
    const allInputs = document.querySelectorAll("#action-form input")
    const actionArray = []
    for (let index = 0; index < allInputs.length; index += 2) {
      const action = allInputs[index].value
      const actionValue = allInputs[index + 1].value
      actionArray.push({ [action]: actionValue })
    }
  }

  // Data fetching which make things possible
  return (
    <div>
      {/* Cover page */}
      <div className="tw-w-screen tw-relative  ">
        <img
          src="/swami_ji.jpg"
          className="tw-w-full md:tw-h-80 tw-object-cover tw-object-center"
        />
        <p className=" tw-absolute tw-z-10 tw-bottom-4 tw-bg-dark-background tw-text-white-color tw-right-8 tw-py-2 tw-px-4 tw-rounded-full ">
          <CreateIcon className="tw-mr-2" />
          Background
        </p>
      </div>
      {/* corcle for profile picture */}
      <div className="tw-w-screen tw-bg-first-color tw-h-28 tw-flex tw-pl-8">
        <img
          className="tw-rounded-full tw-w-32 tw-h-32 flex tw-items-center tw-justify-center tw-absolute tw-z-10 tw-mt-[-3%]  hover:tw-shadow-lg "
          src="/pp.jpg"
        ></img>
        <div className="tw-font-extrabold tw-text-2xl tw-text-white tw-ml-44  ">
          Neeraj Rai
        </div>
      </div>
      {/* horizontal bar */}
      {/* Profile compy from grid */}
      <div className="tw-grid md:tw-grid-cols-7 tw-grid-cols-1 md:tw-gap-4 tw-bg-dark-background">
        <div className="md:tw-col-span-4 tw-col-span-1">
          <div className="  tw-px-4 tw-py-4 tw-text-white tw-leading-8">
            <h1 className="tw-ml-4">My Information</h1>
            <div className="tw-grid tw-grid-cols-6 tw-gap-4 tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl">
              <div className=" md:tw-col-span-1 tw-col-span-2 ">
                <p>Intrested in</p>
                <p>From</p>
                <p>Language</p>
                <p>Age</p>
                <p>Body type</p>
                <p>Specifiv</p>
                <p>Hair</p>
                <p>Eye color</p>
                <p>SubCulture</p>
              </div>

              {modelData
                ? modelData.map((item) => (
                    <div
                      className="md:tw-col-span-5 tw-col-span-4 "
                      onChange={console.log("changed")}
                    >
                      <p
                        onInput={(e) => e.currentTarget.textContent}
                        contentEditable="true"
                      >
                        {item.Interest}
                      </p>
                      <p
                        onInput={(e) => e.currentTarget.textContent}
                        contentEditable="true"
                      >
                        {item.From}
                      </p>
                      <p
                        onInput={(e) => e.currentTarget.textContent}
                        contentEditable="true"
                      >
                        {item.Language}
                      </p>
                      <p
                        onInput={(e) => e.currentTarget.textContent}
                        contentEditable="true"
                      >
                        {item.Age}
                      </p>
                      <p
                        onInput={(e) => e.currentTarget.textContent}
                        contentEditable="true"
                      >
                        {item.Body}
                      </p>
                      <p
                        onInput={(e) => e.currentTarget.textContent}
                        contentEditable="true"
                      >
                        {item.Hair}
                      </p>
                      <p
                        onInput={(e) => e.currentTarget.textContent}
                        contentEditable="true"
                      >
                        {item.Eye}
                      </p>
                      <p
                        onInput={(e) => e.currentTarget.textContent}
                        contentEditable="true"
                      >
                        {item.Call}
                      </p>
                      <p
                        onInput={(e) => e.currentTarget.textContent}
                        contentEditable="true"
                      >
                        {item.Call}
                      </p>
                    </div>
                  ))
                : null}

              <br />
              {infoedited && (
                <Button type="submit" onClick={() => setInfoedited(false)}>
                  Save
                </Button>
              )}
            </div>
            {/* removed epic goal and Broadcast shedule */}

            {/* setting */}
            <div className="  tw-rounded-t-2xl tw-rounded-b-lg tw-mt-4">
              <div className="tw-bg-first-color tw-flex tw-flex-col tw-py-4">
                <p className="tw-px-4">My Email</p>
                <div className="tw-mx-auto tw-px-4 tw-pt-2 ">
                  <button
                    className="tw-rounded-full tw-bg-second-color tw-px-2"
                    onClick={modalCtx.showModalWithContent(<EmailChange />)}
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </div>

            <div className="tw-my-4  hover:tw-shadow-lg tw-rounded-t-2xl tw-rounded-b-2xl ">
              <div className="tw-bg-first-color tw-flex tw-flex-col tw-py-4 ">
                <p className="tw-mx-4">My Password</p>
                <div className=" tw-mx-auto tw-pt-2">
                  <button className="tw-rounded-full tw-bg-second-color  tw-px-2 ">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
            {/* setting */}
            {/* Pricing */}
            <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-grid-cols-3 tw-grid tw-leading-9 tw-mt-6">
              <div className="tw-col-span-1">
                <p>Private Audio Call</p>
                <p className="tw-my-2">Private video Call</p>
              </div>
              <div className="tw-col-span-2">
                <div className="tw-flex ">
                  <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center  tw-py-2">
                    {audio.length > 0
                      ? audio.map((item) => (
                          <option value={item}>
                            {item} <span>tk</span>
                          </option>
                        ))
                      : null}
                  </select>
                  {/* <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center  tw-py-2">
                    <option value="200tk">200tk </option>
                    <option value="300tk">300tk </option>
                    <option value="400tk">400tk </option>
                    <option value="500tk">500tk </option>
                  </select> */}

                  <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-ml-4">
                    <option value="1"> 1 minute </option>
                    <option value="2"> 2 minute </option>
                    <option value="3"> 3 minute </option>
                    <option value="4"> 4 minute </option>
                  </select>
                </div>
                {/*  */}

                <div className="tw-flex  tw-my-2">
                  <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center  tw-py-2">
                    {video.length > 0 &&
                      video.map((item) => (
                        <option value={item}>
                          {item} <span>tk</span>
                        </option>
                      ))}
                  </select>
                  {/* <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-py-2 ">
                    <option value="200tk">200tk </option>
                    <option value="300tk">300tk </option>
                    <option value="400tk">400tk </option>
                    <option value="500tk">500tk </option>
                  </select> */}

                  <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-ml-4 tw-py-2">
                    <option value="1"> 1 minute </option>
                    <option value="2"> 2 minute </option>
                    <option value="3"> 3 minute </option>
                    <option value="4"> 4 minute </option>
                  </select>
                </div>
              </div>
            </div>
            {/* scroll*/}
            <div className=" tw-text-white tw-flex  tw-overflow-x-auto tw-mt-6 tw-bg-first-color ">
              <Card>
                <div className="tw-flex tw-justify-between ">
                  <h2>Earning</h2>
                  <div className="help_1">
                    <HelpOutlineIcon />
                    <p className="help_text_1 tw-hidden">Hello bro</p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">123</h1>
                  <span className="tw-self-center">Token</span>
                </div>
              </Card>
              <Card>
                <div className="tw-flex tw-justify-between">
                  <h2>Followers</h2>
                  <div className="help_1">
                    <HelpOutlineIcon />
                    <p className="help_text_1 tw-hidden">Hello bro</p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">123</h1>
                </div>
              </Card>
              <Card>
                <div className="tw-flex tw-justify-between">
                  <h2>Rating</h2>
                  <div className="help_1">
                    <HelpOutlineIcon />
                    <p className="help_text_1 tw-hidden">Hello bro</p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">123</h1>
                  <span className="tw-self-center">Stars</span>
                </div>
              </Card>
              <Card>
                <div className="tw-flex tw-justify-between">
                  <h2>Earning</h2>
                  <div className="help_1">
                    <HelpOutlineIcon />
                    <p className="help_text_1 tw-hidden">Hello bro</p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">123</h1>
                  <span className="tw-self-center">Token</span>
                </div>
              </Card>
            </div>
            {/* Call History */}
            {/* give width and apply scroll-y this is still not implimented */}
            <table className="tw-border-solid  tw-border-4 tw-text-center tw-mt-8 tw-w-full tw-bg-first-color">
              <tr className="tw-border-solid tw-bg-dark-black tw-border-4 tw-px-2">
                <th className="tw-border-solid tw-bg-dark-black tw-border-4  ">
                  No
                </th>
                <th className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  Date Joined
                </th>
                <th className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  Call Type
                </th>
                <th className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  Duration
                </th>
                <th className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  Rate
                </th>
                <th className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  Viewer
                </th>
              </tr>
              <tr className="tw-border-solid tw-bg-dark-black tw-border-4">
                <td className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  1
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  2
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  3
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  4
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  5
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4 ">
                  6
                </td>
              </tr>
              <tr className="tw-border-solid tw-bg-dark-black tw-border-4 tw-text-center">
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  1
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  2
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  3
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  4
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  5
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  6
                </td>
              </tr>
              <tr className="tw-border-solid tw-bg-dark-black tw-border-4">
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  1
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  2
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  3
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  4
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  5
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  6
                </td>
              </tr>
              <tr className="tw-border-solid tw-bg-dark-black tw-border-4">
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  1
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  2
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  3
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  4
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  5
                </td>
                <td className="tw-border-solid tw-bg-dark-black tw-border-4">
                  6
                </td>
              </tr>
            </table>
            {/* Call History */}
          </div>
          {/* Scroll */}
        </div>
        <div className="md:tw-col-span-3 tw-col-span-1 tw-bg-dark-background  tw-text-white tw-py-8">
          <div className="tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl">
            <div className="tw-flex tw-justify-between">
              <h1>My Photos</h1>
              <CreateIcon className="tw-mr-2 tw-underline tw-text-white" />
            </div>
            {/* Make Model Clickeble in model */}
            <div className="md:tw-grid md:tw-grid-cols-3 md:tw-col-span-1  tw-flex tw-flex-wrap tw-justify-around tw-py-4">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4 ">
                {/* file */}
                <div className="file-input tw-mt-10 tw-ml-2">
                  <input
                    type="file"
                    name="file-input"
                    id="file-input"
                    className="file-input__input"
                  />
                  <label className="file-input__label" htmlFor="file-input">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="upload"
                      className="svg-inline--fa fa-upload fa-w-16"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                      ></path>
                    </svg>
                    <span>Upload file</span>
                  </label>
                </div>

                {/* file */}
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
            </div>
          </div>
          <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
            <div className="tw-flex tw-justify-between">
              <h1>My videos</h1>
              <CreateIcon className="tw-mr-2 tw-underline tw-text-white" />
            </div>
            {/* Make Model Clickeble in model */}
            <div className="md:tw-grid md:tw-grid-cols-3 md:tw-col-span-1  tw-flex tw-flex-wrap tw-justify-around tw-py-4">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4">
                {/* input */}
                <div className="file-input tw-mt-10 tw-ml-2 tw-grid">
                  <label
                    className="file-input__label tw-place-items-center"
                    htmlFor="file-input"
                  >
                    <input
                      type="file"
                      name="file-input"
                      id="file-input"
                      className="file-input__input"
                    />
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="upload"
                      className="svg-inline--fa fa-upload fa-w-16"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                      ></path>
                    </svg>
                    <span>Upload file</span>
                  </label>
                </div>

                {/* input */}
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
            </div>
          </div>
          <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
            <h1 className="tw-mb-3 tw-font-semibold tw-text-lg">Set Actions</h1>
            <form
              id="action-form"
              className="tw-grid tw-grid-rows-4 tw-max-h-64 tw-overflow-y-auto tw-mb-3 tw-bg-second-color tw-rounded-lg tw-p-2"
            >
              {dynamicData.map((item, index) => {
                return (
                  <div
                    className="tw-grid tw-grid-cols-2 tw-my-4 tw-text-white-color"
                    key={index}
                  >
                    <input
                      className="tw-col-span-1 tw-py-2 tw-mx-1 tw-px-2 tw-bg-dark-black tw-rounded-md"
                      placeholder="ravi"
                    />
                    <input
                      className="tw-col-span-1 tw-py-2 tw-mx-1 tw-px-2 tw-bg-dark-black tw-rounded-md"
                      placeholder="name"
                    />
                  </div>
                )
              })}
            </form>
            <Button
              className="tw-bg-dreamgirl-red hover:tw-bg-dreamgirl-red tw-border-none tw-rounded-full"
              onClick={() => setDynamicData((prev) => [...prev, 1])}
            >
              add new action
            </Button>
            <Button
              onClick={saveData}
              className="tw-ml-4 tw-bg-green-color tw-border-none hover:tw-bg-green-color tw-rounded-full"
            >
              Save
            </Button>
          </div>
          <div>
            <Callhistory />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;
