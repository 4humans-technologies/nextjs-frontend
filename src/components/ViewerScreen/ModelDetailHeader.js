import React from "react"
import { useWidth } from "../../app/Context"

function ModelDetailHeader(props) {
  let screenWidth = useWidth()
  const { profileImage, username, isStreaming, onCall } = props.data
  return (
    <div className="tw-flex tw-justify-start tw-items-center tw-py-1.5 tw-px-4 tw-overflow-x-auto tw-flex-nowrap tw-bg-first-color tw-text-white-color tw-shadow-md tw-sticky">
      <span className="tw-w-10 tw-h-10 tw-ring-2 tw-ring-dreamgirl-red tw-mr-4 tw-rounded-full">
        <img src={profileImage} alt="" />
      </span>
      {isStreaming && (
        <span className="tw-mr-4 tw-py-1 tw-rounded tw-font-semibold tw-text-green-color">
          Live
        </span>
      )}
      {onCall && (
        <span className="tw-mr-4 tw-py-1 tw-rounded tw-font-semibold tw-text-purple-600">
          On Call
        </span>
      )}
      {!isStreaming && !onCall && (
        <span className="tw-mr-4 tw-py-1 tw-rounded tw-font-semibold tw-text-red-600">
          Offline
        </span>
      )}
      <span className="tw-mr-4 tw-capitalize tw-cursor-pointer">
        {username}
      </span>
      <span className="tw-mr-4 tw-cursor-pointer">Profile</span>
      <span className="tw-mr-4 tw-cursor-pointer">Image</span>
      <span className="tw-mr-4 tw-cursor-pointer">Videos</span>
      <span className="tw-mr-4 tw-cursor-pointer"> {screenWidth}</span>
    </div>
  )
}

export default ModelDetailHeader
