import React, { useState } from "react"
import useModalContext from "../../../app/ModalContext"
import CancelIcon from "@material-ui/icons/Cancel"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"

const EmailChange = (props) => {
  const [email, setEmail] = useState({
    oldEmail: "",
    newEmail: "",
  })
  // Check type to change url according to change
  const changeHandler = (e) => {
    setEmail({ ...email, [e.target.name]: e.target.value })
    if (email.oldEmail != email.newMail) {
      fetch("url", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email.newEmail,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => console.log(data))
    }
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
    newPasswod_2: null,
  })
  // Check type of user then change the url of fetch request

  // This change handler can handle change in of all type in the form this helps to make code clean and smooth
  const changeHandler = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value })
    if (password.newPasswod != password.newPasswod_2) {
      return null
    }
    fetch("url", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        Password: password.newPasswod,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data))
  }

  return (
    <div className="tw-flex tw-flex-col">
      <h2 className="tw-text-white-color tw-mx-auto">Password Change</h2>
      <br />
      <input
        type="password"
        name="oldPasswod"
        id=""
        // value={oldPasswod}
        onChange={changeHandler}
        placeholder="Enter your old Password"
        className="tw-my-2 tw-mx-4 tw-px-4 tw-h-8 tw-rounded-full tw-outline-none"
      />

      <input
        type="password"
        name="newPasswod"
        id=""
        // value={newPasswod}
        onChange={changeHandler}
        placeholder="Eneter your new Password"
        className="tw-my-2 tw-mx-4 tw-px-4 tw-h-8 tw-rounded-full tw-outline-none"
      />

      <input
        type="password"
        name="newPasswod_2"
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
  const [coverImage, setCoverImage] = useState(null)
  const authContext = useAuthContext()
  const modelCtx = useModalContext()
  const oldCover = authContext.user.user.relatedUser.profileImage

  const changeCover = async (e) => {
    const image_1 = await e.target.files[0]
    const image_2 = await URL.createObjectURL(e.target.files[0])
    setCoverImage(image_2)
    // To send image to url and the make things possible
    // There I have to send with type of url that we uplode
    const res = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image_1.type
    )
    const data_2 = await res.json()
    const cover_url = await data_2.uploadUrl
    // Now change coverImage to url
    oldCover: image_2

    console.log(`Bro this is cover page url, ${cover_url.split("?")[0]}`) //The place where it needed to be uploded

    // Then this uplode uplode the Image in the S3 bucket
    const resp = await fetch(cover_url, {
      method: "PUT",
      body: image_1,
    })
    console.log(resp)

    // if response is 200 then send the data to your own server
    if (!resp.ok) {
      return alert("What is this Bakloli")
    }
    const coverUrl = cover_url.split("?")[0]
    console.log(coverUrl)
    const re = await fetch("/api/website/profile/update-model-basic-details", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coverImage: coverUrl,
      }),
    })
    const jsonResp = await re.json()
    console.log(jsonResp)
  }

  // Now use this url to uploade to serve using url

  return (
    <div className="tw-bg-first-color ">
      <CancelIcon
        className="tw-text-white-color tw-ml-[90%]"
        fontSize="medium"
        onClick={modelCtx.hideModal}
      />
      <div className="tw-mx-auto">
        <img src={oldCover} className="tw-w-96 tw-h-48 tw-my-4" />
        <label className="tw-bg-dreamgirl-red tw-rounded-full tw-px-4 tw-py-2 tw-ml-24">
          <input
            type="file"
            onChange={(e) => changeCover(e)}
            className=" tw-opacity-0 tw-absolute tw-hidden tw-z-[10]"
          />
          Update Cover Page
        </label>
      </div>
    </div>
  )
}

const ProfileUpdate = () => {
  const [showImage, setshowImage] = useState()
  const modelCtx = useModalContext()
  const authContext = useAuthContext()
  const oldCover = authContext.user.user.relatedUser.profileImage

  const changeCover = async (e) => {
    const image_1 = await e.target.files[0]
    const image_2 = await URL.createObjectURL(e.target.files[0])
    setshowImage(image_2)
    // this is ton get the url for the aws server to image uplode

    console.log(image_1.type)
    const res = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image_1.type
    )
    const data_2 = await res.json()
    const profile_url = await data_2.uploadUrl

    // // this to send the data to aws server and get the url
    const resp = await fetch(profile_url, {
      method: "PUT",
      body: image_1,
    })
    // console.log(`send the data to url ${resp}`)
    if (!resp.ok) {
      return alert("OK BRO")
    }
    // console.log(resp)
    console.log(profile_url)
    const profileUrl = profile_url.split("?")[0]
    console.log(profileUrl)
    // take this url from the aws and send it to your serve to access it in the future
    // console.log(`Profile url ------${profileUrl}`)

    const re = await fetch("/api/website/profile/update-model-basic-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileImage: profileUrl,
      }),
    })
    const jsonRe = await re.json()

    console.log(`This is json response -----${jsonRe}`)
  }
  // Profile pic to aws

  return (
    <div className="tw-bg-first-color ">
      <CancelIcon
        className="tw-text-white-color tw-ml-[90%]"
        fontSize="medium"
        onClick={modelCtx.hideModal}
      />

      <div className="tw-mx-auto">
        <img src={showImage} className="tw-w-96 tw-h-48 tw-my-4" />
        <label className="tw-bg-dreamgirl-red tw-rounded-full tw-px-4 tw-py-2 tw-ml-24">
          <input
            type="file"
            onChange={(e) => changeCover(e)}
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
