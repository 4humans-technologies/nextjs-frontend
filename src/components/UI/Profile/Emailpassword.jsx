import React, { useState } from "react"
import useModalContext from "../../../app/ModalContext"
import CancelIcon from "@material-ui/icons/Cancel"

const EmailChange = (props) => {
  const [email, setEmail] = useState({
    oldEmail: "",
    newEmail: "",
  })
  const changeHandler = (e) => {
    setEmail({ ...email, [e.target.name]: e.target.value })
  }
  return (
    <div className="tw-flex tw-flex-col">
      <h2 className="tw-text-white-color tw-mx-auto">Email Change</h2>
      <br />
      <input
        type="email"
        name="oldEmail"
        id=""
        placeholder="Last Email Id"
        onChange={changeHandler}
        className="tw-my-2 tw-mx-4 tw-px-4 tw-h-8 tw-rounded-full tw-outline-none"
      />
      <input
        type="email"
        name="newEmail"
        id=""
        placeholder="New Email Id"
        onChange={changeHandler}
        className="tw-my-2 tw-mx-4 tw-px-4 tw-h-8 tw-rounded-full tw-outline-none"
      />
      <br />
      <button className="tw-bg-dreamgirl-red  tw-border-none tw-rounded-full tw-mx-auto tw-px-4 tw-py-2">
        Change
      </button>
    </div>
  )
}

const PasswordChange = (props) => {
  const [password, setPassword] = useState({
    oldPasswod: null,
    newPasswod: null,
  })

  // This change handler can handle change in of all type in the form this helps to make code clean and smooth
  const changeHandler = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value })
  }

  return (
    <div className="tw-flex tw-flex-col">
      <h2 className="tw-text-white-color tw-mx-auto">Password Change</h2>
      <br />
      <input
        type="password"
        name=""
        id=""
        // value={oldPasswod}
        onChange={changeHandler}
        placeholder="Enter your old Password"
        className="tw-my-2 tw-mx-4 tw-px-4 tw-h-8 tw-rounded-full tw-outline-none"
      />

      <input
        type="password"
        name=""
        id=""
        // value={newPasswod}
        onChange={changeHandler}
        placeholder="Eneter your new Password"
        className="tw-my-2 tw-mx-4 tw-px-4 tw-h-8 tw-rounded-full tw-outline-none"
      />
      <br />
      <button className="tw-bg-dreamgirl-red  tw-border-none tw-rounded-full tw-mx-auto tw-px-4 tw-py-2">
        Change
      </button>
    </div>
  )
}

// We do not use defult wen we export two function
// Cover update and Profile update

const CoverUpdate = () => {
  const [coverImage, setCoverImage] = useState("")
  const modelCtx = useModalContext()
  const changeCover = (e) => {
    setCoverImage(URL.createObjectURL(e.target.files[0]))
  }
  return (
    <div className="tw-bg-first-color ">
      <CancelIcon
        className="tw-text-white-color tw-ml-[90%]"
        fontSize="medium"
        onClick={modelCtx.hideModal}
      />
      <div className="tw-mx-auto">
        <img src={coverImage} className="tw-w-96 tw-h-48 tw-my-4" />
        <label className="tw-bg-dreamgirl-red tw-rounded-full tw-px-4 tw-py-2 tw-ml-24">
          <input
            type="file"
            onChange={changeCover}
            className=" tw-opacity-0 tw-absolute tw-hidden tw-z-[10]"
          />
          Update Cover Page
        </label>
      </div>
    </div>
  )
}

const ProfileUpdate = () => {
  const [coverImage, setCoverImage] = useState("")
  const modelCtx = useModalContext()
  const changeCover = (e) => {
    setCoverImage(URL.createObjectURL(e.target.files[0]))
  }
  return (
    <div className="tw-bg-first-color ">
      <CancelIcon
        className="tw-text-white-color tw-ml-[90%]"
        fontSize="medium"
        onClick={modelCtx.hideModal}
      />
      n
      <div className="tw-mx-auto">
        <img src={coverImage} className="tw-w-96 tw-h-48 tw-my-4" />
        <label className="tw-bg-dreamgirl-red tw-rounded-full tw-px-4 tw-py-2 tw-ml-24">
          <input
            type="file"
            onChange={changeCover}
            className=" tw-opacity-0 tw-absolute tw-hidden tw-z-[10]"
          />
          Update Profile Image
        </label>
      </div>
    </div>
  )
}
// Cover update and Profile update

export { EmailChange, PasswordChange, CoverUpdate, ProfileUpdate }
