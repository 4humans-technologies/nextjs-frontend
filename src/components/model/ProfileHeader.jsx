import React, { useReducer } from "react"
import Profile from "../model/Profile"

const initState = { val: <Profile /> }
const reducer = (state = initState, action) => {
  switch (action.type) {
    case "PROFILE":
      return { val: <Profile /> }
    case "SETTING":
      return { val: "SETTING" }
    case "IMAGE":
      return { val: "IMAGE" }
    case "VIDEO":
      return { val: "VIDEO" }
    default:
      return state
  }
}
function ProfileHeader() {
  const [state, dispatch] = useReducer(reducer, initState)
  return (
    <div>
      {/* <h1 className="tw-text-black">Hello</h1> */}
      <div className="tw-flex tw-text-white tw-bg-first-color tw-pt-6  md:tw-pt-2  tw-text-lg tw-top-14 md:tw-top-20  tw-left-0 tw-right-0  tw-z-[400] md:tw-justify-between tw-items-center  tw-fixed">
        <div className="tw-flex tw-my-auto">
          <div
            className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
            id="Profile"
            onClick={() => dispatch({ type: "PROFILE" })}
          >
            Profile
          </div>
          <div
            className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
            id="Settings"
            onClick={() => dispatch({ type: "SETTING" })}
          >
            Settings
          </div>
          <div
            className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
            id="Images"
            onClick={() => dispatch({ type: "IMAGE" })}
          >
            Images
          </div>
          <div
            className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
            id="Videos"
            onClick={() => dispatch({ type: "VIDEO" })}
          >
            Videos
          </div>
        </div>
      </div>
      {/* Here all the case will go */}

      <div>{state.val}</div>
    </div>
  )
}

export default ProfileHeader
