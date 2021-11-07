import React, { useState, useRef, useEffect } from "react"
import Profile from "../model/Profile"

function ProfileHeader() {
  const profileRef = useRef(true)
  const settingsRef = useRef(false)
  const imageRef = useRef(false)
  const videoRef = useRef(false)

  let clickedElement = "Profile"

  const changeHandler = (e) => {
    // console.log(e.target.value)
    clickedElement = e.target.id
    console.log(clickedElement)
    console.log(profileRef.current)
    switch (clickedElement) {
      case "Profile":
        settingsRef.current = false
        imageRef.current = false
        videoRef.current = false
        profileRef.current = true
        console.log("profile clicked")
        break
      case "Settings":
        profileRef.current = false
        imageRef.current = false
        videoRef.current = false
        settingsRef.current = true

        console.log("setting clicked")
        break
      case "Images":
        profileRef.current = false
        settingsRef.current = false
        videoRef.current = false
        imageRef.current = true

        console.log("image clicked")
        break
      case "Videos":
        profileRef.current = false
        settingsRef.current = false
        imageRef.current = false
        videoRef.current = true
        console.log("video clicked")
        break
      default:
        console.log("default")
        break
    }
  }

  console.log(profileRef.current)

  useEffect(() => {
    console.log("profile header mounted")
    return () => {
      console.log("profile header unmounted")
    }
  }, [changeHandler])

  return (
    <div>
      {/* <h1 className="tw-text-black">Hello</h1> */}
      <div className="tw-flex tw-text-white tw-bg-first-color tw-pt-6  md:tw-pt-2  tw-text-lg tw-top-14 md:tw-top-20  tw-left-0 tw-right-0  tw-z-[400] md:tw-justify-between tw-items-center  tw-fixed">
        <div className="tw-flex tw-my-auto">
          <div
            className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
            id="Profile"
            onClick={(e) => changeHandler(e)}
          >
            Profile
          </div>
          <div
            className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
            id="Settings"
            onClick={(e) => changeHandler(e)}
          >
            Settings
          </div>
          <div
            className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
            id="Images"
            onClick={(e) => changeHandler(e)}
          >
            Images
          </div>
          <div
            className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
            id="Videos"
            onClick={(e) => changeHandler(e)}
          >
            Videos
          </div>
        </div>
      </div>
      {/* Here all the case will go */}
      <div className="tw-bg-dark-black tw-w-screen">
        <div className={`${profileRef.current ? "tw-block" : "tw-hidden"}`}>
          <Profile />
        </div>
        <div
          className={`tw-text-green-color ${
            settingsRef.current ? "tw-block" : "tw-hidden"
          }`}
        >
          <h1>Setting</h1>
        </div>
        <div
          className={`tw-text-green-color ${
            imageRef.current ? "tw-block" : "tw-hidden"
          }`}
        >
          <h1>Images</h1>
        </div>
        <div
          className={` tw-text-green-color ${
            videoRef.current ? "tw-block" : "tw-hidden"
          }`}
        >
          <h1>Videos</h1>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
