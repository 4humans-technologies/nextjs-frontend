import React, { useState } from "react"
import Profile from "../model/Profile"

function ProfileHeader() {
  const [display, setdisplay] = useState({
    profileDisplay: true,
    settingDisplay: false,
    imageDisplay: false,
    videoDisplay: false,
  })
  let clickedElement = "Profile"
  const changeHandler = (e) => {
    // console.log(e.target.value)
    clickedElement = e.target.id
    console.log(clickedElement)
    switch (clickedElement) {
      case "Profile":
        setdisplay({
          profileDisplay: true,
          settingDisplay: false,
          imageDisplay: false,
          videoDisplay: false,
        })
        break
      case "Setting":
        setdisplay({
          profileDisplay: false,
          settingDisplay: true,
          imageDisplay: false,
          videoDisplay: false,
        })
        break
      case "Image":
        setdisplay({
          profileDisplay: false,
          settingDisplay: false,
          imageDisplay: true,
          videoDisplay: false,
        })
        break
      case "Video":
        setdisplay({
          profileDisplay: false,
          settingDisplay: false,
          imageDisplay: false,
          videoDisplay: true,
        })

      default:
        setdisplay({
          profileDisplay: true,
          settingDisplay: false,
          imageDisplay: false,
          videoDisplay: false,
        })
        break
    }
  }

  console.log(display)
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
            id="Projects"
            onClick={(e) => changeHandler(e)}
          >
            Projects
          </div>
        </div>
      </div>
      {/* Here all the case will go */}
      <div className="tw-bg-dark-black tw-w-screen">
        <div className={`${display.profileDisplay ? "tw-block" : "tw-hidden"}`}>
          <Profile />
        </div>
        <div className={`${display.settingDisplay ? "tw-block" : "tw-hidden"}`}>
          <h1>Setting</h1>
        </div>
        <div className={`${display.imageDisplay ? "tw-block" : "tw-hidden"}`}>
          <h1>Images</h1>
        </div>
        <div className={`${display.videoDisplay ? "tw-block" : "tw-hidden"}`}>
          <h1>Videos</h1>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
