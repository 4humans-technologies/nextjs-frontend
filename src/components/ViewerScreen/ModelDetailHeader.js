import React from "react"
import { useWidth } from "../../app/Context"

function ModelDetailHeader(props) {
  const { profileImage, username, isStreaming, onCall } = props.data
  return (
    <div className="tw-flex tw-justify-start tw-items-center tw-py-1.5 tw-px-4 tw-overflow-x-auto tw-flex-nowrap tw-bg-first-color tw-text-white-color tw-shadow-md tw-sticky">
      <a href="#model-profile-area">
        <span className="tw-w-10 tw-h-10 tw-ring-2 tw-ring-dreamgirl-red tw-mr-4 tw-rounded-full tw-overflow-hidden tw-flex-shrink-0">
          <img
            src={profileImage}
            alt=""
            className="tw-w-full tw-h-full tw-object-cover"
          />
        </span>
      </a>
      {isStreaming && (
        <a href="#model-profile-area">
          <span className="sm:tw-mr-4 tw-mr-2.5 sm:tw-text-base tw-text-sm tw-py-1 tw-rounded tw-font-semibold tw-text-green-color">
            Live
          </span>
        </a>
      )}
      {onCall && !isStreaming && (
        <a href="#model-profile-area">
          <span className="sm:tw-mr-4 tw-mr-2.5 sm:tw-text-base tw-text-sm tw-py-1 tw-rounded tw-font-semibold tw-text-purple-600">
            On Call
          </span>
        </a>
      )}
      {!isStreaming && !onCall && (
        <a
          href="#model-profile-area"
          className="sm:tw-mr-4 tw-mr-2.5 sm:tw-text-base tw-text-sm tw-py-1 tw-rounded tw-font-semibold tw-text-red-600 hover:tw-text-red-600"
        >
          Offline
        </a>
      )}
      <a href="#model-profile-area">
        <span className="sm:tw-mr-4 tw-mr-2.5 sm:tw-text-base tw-text-sm tw-capitalize tw-cursor-pointer">
          {username}
        </span>
      </a>
      <a
        href="#model-profile-area"
        className="sm:tw-mr-4 tw-mr-2.5 sm:tw-text-base tw-text-sm hover:tw-text-white-color"
      >
        Profile
      </a>
      <a
        href="#model-profile-area"
        className="sm:tw-mr-4 tw-mr-2.5 sm:tw-text-base tw-text-sm hover:tw-text-white-color"
      >
        Image
      </a>
      <a
        href="#model-profile-area"
        className="sm:tw-mr-4 tw-mr-2.5 sm:tw-text-base tw-text-sm hover:tw-text-white-color"
      >
        Videos
      </a>
    </div>
  )
}

export default ModelDetailHeader
