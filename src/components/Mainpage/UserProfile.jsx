import React, { useState, useEffect } from "react"
import CreateIcon from "@material-ui/icons/Create"
import useModalContext from "../../app/ModalContext"
import Header from "./Header"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext" // <-- AuthContext

import {
  EmailChange,
  PasswordChange,
  CoverUpdate,
  ProfileUpdate,
} from "../UI/Profile/Emailpassword"

function UserProfile() {
  const [followerData, setFollowerData] = useState([])
  const modelCtx = useModalContext()
  const authContext = useAuthContext()

  const [userDetails, setuserDetails] = useState(null)

  useEffect(() => {
    fetch("/model.json")
      .then((resp) => resp.json())
      .then((data) => setFollowerData(data))
  }, [])

  useEffect(() => {
    fetch("/api/website/profile/get-model-profile-data")
      .then((resp) => resp.json())
      .then((data) => setuserDetails(data))
  }, [])

  let profileImage = ""
  let coverImage = ""
  if (authContext.user.user) {
    profileImage = authContext.user.user.relatedUser.profileImage
    coverImage = authContext.user.user.relatedUser.coverImage
  }

  return (
    <div className="tw-bg-dark-background">
      {/* Cover page */}
      <div className="tw-w-screen tw-relative  tw-bg-dark-background md:tw-mt-[8.2rem] tw-mt-28 ">
        <img
          src={coverImage}
          className="tw-w-full md:tw-h-80 tw-object-cover tw-object-center"
        />

        <p
          className=" tw-absolute tw-z-10 tw-bottom-4 tw-bg-dark-background tw-text-white-color tw-right-8 tw-py-2 tw-px-4 tw-rounded-full tw-cursor-pointer"
          onClick={() => modelCtx.showModalWithContent(<CoverUpdate />)}
        >
          <CreateIcon className="tw-mr-2" />
          Background
        </p>
      </div>
      {/* Circular name  */}
      <div className="tw-w-screen tw-bg-first-color tw-h-28 tw-flex tw-pl-8 tw-relative">
        <img
          className="tw-rounded-full tw-w-32 tw-h-32 flex tw-items-center tw-justify-center tw-absolute tw-z-10 tw-mt-[-3%] tw-bg-green-400 tw-shadow-lg"
          src={profileImage}
        ></img>
        <CreateIcon
          className="md:tw-ml-24 md:tw-mt-12 tw-mt-16 tw-ml-28 tw-text-white-color tw-z-10 tw-absolute tw-bg-dark-background tw-rounded-full tw-cursor-pointer"
          fontSize="medium"
          onClick={() => modelCtx.showModalWithContent(<ProfileUpdate />)}
        />

        <div className="tw-font-extrabold tw-text-2xl tw-text-white tw-ml-44 tw-flex  md:tw-mt-4 tw-mt-8">
          {authContext ? authContext.user.user.relatedUser.name : null}
          {authContext.user.user.relatedUser.gender == "Female" ? (
            <img src="/femaleIcon.png" className="tw-w-8 tw-h-8 tw-ml-4" />
          ) : (
            <img src="/maleIcon.png" className="tw-w-8 tw-h-8 md:tw-ml-4 " />
          )}
        </div>
      </div>
      {/* name and profile */}
      <div className="tw-grid md:tw-grid-cols-7 tw-grid-cols-1 md:tw-gap-4   md:tw-py-2 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-text-white tw-w-screen tw-bg-dark-background">
        <div className="md:tw-col-span-4 tw-col-span-1 tw-grid tw-grid-cols-4 tw-bg-first-color tw-pl-4 tw-py-4 md:tw-my-0 tw-mt-4">
          <div className="md:tw-col-span-1 tw-col-span-2   ">
            <p>Intrested in</p>
            <p>UserName</p>
            <p>Hobbies</p>
            <p>Age</p>
          </div>
          <div className="md:tw-col-span-3 tw-col-span-2 ">
            <p>EveryOne</p>
            <p>{authContext.user.user.username}</p>
            <p>
              {authContext.user.user.relatedUser.hobbies.length > 0
                ? authContext.user.user.relatedUser.hobbies.map((item) => {
                    return item
                  })
                : "No Hobbies"}
            </p>
            <p>33</p>
          </div>
        </div>

        <div className="tw-grid  tw-bg-first-color md:tw-col-span-3 tw-col-span-1 md:tw-my-0 tw-my-4 ">
          <h1 className="tw-pl-4 tw-pt-4">Dummy Freinds</h1>
          <br />
          {/* Problem with useEffect and useState is that it is update after all data loaded that you have to remmembember */}
          {followerData?.Follower ? (
            <div className="tw-flex tw-flex-wrap tw-justify-between">
              {followerData.Follower.map((item) => (
                <div className="tw-text-center tw-my-4">
                  <img
                    className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                    src={item.profileImage}
                  />
                  <h2 className="tw-my-2">{item.userName}</h2>
                </div>
              ))}
            </div>
          ) : (
            <h1>No Friends</h1>
          )}
        </div>

        {/* this is for email and password change  */}
        <div className="md:tw-col-span-4 tw-col-span-1 tw-grid tw-grid-cols-4 tw-bg-first-color tw-pl-4 tw-py-4">
          <div className="md:tw-col-span-4 tw-col-span-1   ">
            <div className="  tw-rounded-t-2xl tw-rounded-b-lg tw-mt-4">
              <div className="tw-bg-first-color tw-flex tw-flex-col tw-py-4">
                <p className="tw-px-4">
                  Email
                  <span className="tw-ml-4 tw-font-bold tw-text-xl">
                    {authContext
                      ? authContext.user.user.relatedUser.email
                      : null}
                  </span>
                </p>
                <div className="tw-mx-auto tw-px-4 tw-pt-2 ">
                  <button
                    className="tw-rounded-full tw-bg-second-color tw-px-4 tw-py-2"
                    onClick={() =>
                      modelCtx.showModalWithContent(<EmailChange />)
                    }
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* password change happen here */}
        <div className="md:tw-col-span-4 tw-col-span-1 tw-grid tw-grid-cols-4 tw-bg-first-color tw-pl-4 tw-py-4 md:tw-my-0 tw-my-4 ">
          <div className="md:tw-col-span-4 tw-col-span-1   ">
            <div className="tw-my-4  hover:tw-shadow-lg tw-rounded-t-2xl tw-rounded-b-2xl ">
              <div className="tw-bg-first-color tw-flex tw-flex-col tw-py-4 ">
                <p className="tw-mx-4">My Password</p>
                <div className=" tw-mx-auto tw-pt-2">
                  <button
                    className="tw-rounded-full tw-bg-second-color  tw-px-2 "
                    onClick={() =>
                      modelCtx.showModalWithContent(<PasswordChange />)
                    }
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* password change happen here */}
        {/* this is for email and password change  */}
      </div>
    </div>
  )
}

export default UserProfile
