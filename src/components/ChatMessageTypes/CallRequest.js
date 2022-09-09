import React from "react"
function CallRequestChat(props) {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-between tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 gift-superchat-bg tw-text-white-color tw-flex-grow tw-flex-shrink-0 tw-w-full">
      <span className="tw-font-semibold tw-px-1 py-1 tw-rounded tw-bg-second-color">
        @{props.username}
      </span>
      Requested {props.callType}
    </div>
  )
}

export default React.memo(CallRequestChat)
