import React from "react"

function ViewerTile(props) {
  const { name, username, hasNewMessages, newMessagesCount } = props
  return (
    <div
      className="tw-my-2 tw-py-2 tw-px-6 tw-rounded tw-flex tw-items-center tw-cursor-pointer tw-bg-first-color tw-ml-2"
      onClick={props.onClickHandler}
    >
      <div className="tw-flex-shrink tw-flex-grow-0 tw-pr-2">
        {props.profileImage ? (
          <img
            src="/original.jpg"
            alt=""
            className="tw-w-12 tw-h-12 tw-rounded-full tw-border-2 tw-border-dreamgirl-red tw-object-cover"
          />
        ) : (
          <div className="tw-bg-dreamgirl-red tw-rounded-full tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-ring-2 tw-ring-white-color">
            <span className="tw-text-4xl tw-text-white-color tw-font-light">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="tw-flex tw-flex-col tw-text-white-color tw-flex-grow tw-ml-2">
        <p className="tw-font-semibold">{name}</p>
        <p className="">@{username}</p>
      </div>
      {hasNewMessages && (
        <div className="tw-flex-grow-0 tw-flex-shrink tw-pl-2 tw-flex tw-items-center">
          <span className="tw-text-sm tw-text-white-color tw-pr-2">
            New Messages!
          </span>
          <span className="tw-bg-[#0cfc0ce0] tw-p-2 tw-text-white-color tw-rounded-full tw-font-semibold">
            {newMessagesCount}
          </span>
        </div>
      )}
    </div>
  )
}

export default ViewerTile
