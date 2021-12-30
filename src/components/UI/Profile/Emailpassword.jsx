import React, { useState } from "react"
import useModalContext from "../../../app/ModalContext"
import CancelIcon from "@material-ui/icons/Cancel"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"
import { useRouter } from "next/router"

const EmailChange = () => {
  const authUpdateContext = useAuthUpdateContext()
  const modalCtx = useModalContext()

  const [email, setEmail] = useState({
    oldEmail: "",
    newEmail: "",
  })
  // Check type to change url according to change
  const changeHandler = (e) => {
    if (email.oldEmail != email.newEmail) {
      fetch("/api/website/profile/update-model-basic-details", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          updatedData: {
            email: email.newEmail,
          },
        }),
      })
        .then((resp) => resp.json())
        .then((data) =>
          authUpdateContext.updateNestedPaths((prevState) => ({
            ...prevState,
            user: {
              ...prevState.user,
              user: {
                ...prevState.user.user,
                relatedUser: {
                  ...prevState.user.user.relatedUser,
                  email: email.newEmail,
                },
              },
            },
          }))
        )
      let store = JSON.parse(localStorage.getItem("user"))
      store["relatedUser"]["email"] = email.newEmail
      localStorage.setItem("user", JSON.stringify(store))
      setTimeout(modalCtx.hideModal(), 100)
    }
  }
  return (
    <div className="tw-mx-auto tw-w-full tw-my-6 tw-rounded  tw-py-5 tw-text-center tw-text-white-color tw-border-2 tw-border-white-color">
      <h2 className="tw-text-white-color tw-mx-auto tw-text-lg tw-font-semibold tw-mb-4">
        Enter New Email
      </h2>
      <div className="">
        <input
          type="email"
          name="newEmail"
          id=""
          placeholder="New Email Id"
          onChange={(e) => setEmail({ ...email, newEmail: e.target.value })}
          className="tw-my-2 tw-mx-4 tw-px-8 tw-py-1 tw-h-8 tw-rounded-full tw-outline-none tw-bg-first-color tw-font-medium"
        />
      </div>
      <div className=" tw-my-6">
        <button
          className="tw-rounded-full tw-px-6 tw-py-1 tw-border-2 tw-border-white-color tw-font-medium"
          onClick={changeHandler}
        >
          Change
        </button>
      </div>
    </div>
  )
}

const PasswordChange = (props) => {
  const modalCtx = useModalContext()
  const [password, setPassword] = useState({
    oldPassword: null,
    newPassword: null,
    newPassword_2: null,
  })
  // Check type of user then change the url of fetch request

  // This change handler can handle change in of all type in the form this helps to make code clean and smooth
  const changeHandler = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value })
  }

  const submitHandler = () => {
    fetch("/api/website/profile/update-password", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
        newPasswordConformation: password.newPassword_2,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTimeout(modalCtx.hideModal(), 100)
      })
      .catch((err) => alert(err))
  }

  return (
    <>
      <div className="tw-mx-auto tw-w-full tw-my-6 tw-rounded  tw-py-5 tw-text-center tw-text-white-color tw-border-2 tw-border-white-color">
        <h2 className="tw-text-white-color tw-mx-auto tw-text-lg tw-font-semibold tw-mb-4">
          Enter New Password
        </h2>
        <div className="">
          <input
            type="password"
            name="oldPassword"
            id=""
            // value={oldPassword}
            onChange={changeHandler}
            placeholder="Enter your old Password"
            className="tw-my-2 tw-mx-4 tw-px-8 tw-py-1 tw-h-8 tw-rounded-full tw-outline-none tw-bg-first-color tw-font-medium"
          />

          <input
            type="password"
            name="newPassword"
            id=""
            // value={newPassword}
            onChange={changeHandler}
            placeholder="Your new Password"
            className="tw-my-2 tw-mx-4 tw-px-8 tw-py-1 tw-h-8 tw-rounded-full tw-outline-none tw-bg-first-color tw-font-medium"
          />

          <input
            type="password"
            name="newPassword_2"
            id=""
            // value={newPassword}
            onChange={changeHandler}
            placeholder="Eneter your new Password"
            className="tw-my-2 tw-mx-4 tw-px-8 tw-py-1 tw-h-8 tw-rounded-full tw-outline-none tw-bg-first-color tw-font-medium"
          />
        </div>
        <div className="tw-my-6 tw-text-center">
          <button
            className="tw-rounded-full tw-px-6 tw-py-1 tw-border-2 tw-border-white-color tw-font-medium tw-inline-block"
            onClick={submitHandler}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  )
}

// We do not use defult wen we export two function
// Cover update and Profile update

const CoverUpdate = () => {
  const [coverImage, setCoverImage] = useState(null)
  const authContext = useAuthContext()
  const authUpdateContext = useAuthUpdateContext()
  const modelCtx = useModalContext()

  const changeCover = async (e) => {
    const image_1 = await e.target.files[0]
    const image_2 = await URL.createObjectURL(e.target.files[0])
    setCoverImage(image_2)

    // THis get url for send the image to the aws server
    const res = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image_1.type
    )
    const data_2 = await res.json()
    const cover_url = await data_2.uploadUrl
    // Now change coverImage to url

    // Then this uplode uplode the Image in the S3 bucket
    const resp = await fetch(cover_url, {
      method: "PUT",
      body: image_1,
    })

    // if response is 200 then send the data to your own server
    if (!resp.ok) {
      return alert("What is this Bakloli")
    }

    const coverUrl = cover_url.split("?")[0]

    const re = await fetch("/api/website/profile/update-model-basic-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updatedData: {
          coverImage: coverUrl,
        },
      }),
    })

    // below is context update for coverImage
    authUpdateContext.updateNestedPaths((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        user: {
          ...prevState.user.user,
          relatedUser: {
            ...prevState.user.user.relatedUser,
            coverImage: coverUrl,
          },
        },
      },
    }))

    // Below is local storage update for covwerImage
    let store = JSON.parse(localStorage.getItem("user"))
    store["relatedUser"]["coverImage"] = coverUrl
    localStorage.setItem("user", JSON.stringify(store))

    // const jsonResp = await re.json()
  }

  // Now use this url to uploade to serve using url

  return (
    <div className="tw-mx-auto tw-w-full tw-my-6 tw-rounded  tw-py-5 tw-text-center tw-text-white-color tw-border-2 tw-border-white-color">
      <CancelIcon
        className="tw-text-white-color tw-ml-[90%]"
        fontSize="medium"
        onClick={modelCtx.hideModal}
      />
      <div className="">
        <h2 className="tw-text-white-color tw-mx-auto tw-text-lg tw-font-semibold tw-mb-4">
          Update cover Image
        </h2>
        <img
          src={authContext.user.user.relatedUser.coverImage}
          className="tw-w-96 tw-h-48 tw-my-4"
        />
        <label className="tw-bg-dreamgirl-red tw-rounded-full tw-px-4 tw-py-2">
          <input
            type="file"
            onChange={(e) => changeCover(e)}
            className=" tw-opacity-0 tw-absolute tw-hidden tw-z-[10] tw-outline-none tw-bg-first-color"
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
  const authUpdateContext = useAuthUpdateContext()

  const changeCover = async (e) => {
    const image_1 = await e.target.files[0]
    const image_2 = await URL.createObjectURL(e.target.files[0])
    setshowImage(image_2)
    // this is ton get the url for the aws server to image uplode

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
    if (!resp.ok) {
      return alert("OK BRO")
    }
    const profileUrl = profile_url.split("?")[0]
    // take this url from the aws and send it to your serve to access it in the future
    const re = await fetch("/api/website/profile/update-model-basic-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updatedData: {
          profileImage: profileUrl,
        },
      }),
    })

    authUpdateContext.updateNestedPaths((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        user: {
          ...prevState.user.user,
          relatedUser: {
            ...prevState.user.user.relatedUser,
            profileImage: profileUrl,
          },
        },
      },
    }))

    // Local storage to update the image
    let store = JSON.parse(localStorage.getItem("user"))
    store["relatedUser"]["profileImage"] = profileUrl
    localStorage.setItem("user", JSON.stringify(store))

    const jsonRe = await re.json()
  }
  // Profile pic to aws

  return (
    <div className="tw-mx-auto tw-w-full tw-my-6 tw-rounded  tw-py-5 tw-text-center tw-text-white-color tw-border-2 tw-border-white-color">
      <CancelIcon
        className="tw-text-white-color tw-ml-[90%]"
        fontSize="medium"
        onClick={modelCtx.hideModal}
      />

      <div className="">
        <h2 className="tw-text-white-color tw-mx-auto tw-text-lg tw-font-semibold tw-mb-4">
          Update profile Image
        </h2>
        <img
          src={authContext.user.user.relatedUser.profileImage}
          className="tw-w-96 tw-h-48 tw-my-4"
        />
        <label className="tw-bg-dreamgirl-red tw-rounded-full tw-px-4 tw-py-2 ">
          <input
            type="file"
            onChange={(e) => changeCover(e)}
            className=" tw-opacity-0 tw-absolute tw-hidden tw-z-[10] tw-outline-none tw-bg-first-color "
          />
          Update Profile Image
        </label>
      </div>
    </div>
  )
}
// Cover update and Profile update

export { EmailChange, PasswordChange, CoverUpdate, ProfileUpdate }
