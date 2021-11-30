import React from "react"

function OtherSideChatMessage(props) {
  return (
    <div className="tw-ml-2 tw-max-w-[70%] tw-my-2 tw-rounded-t-lg tw-rounded-br-lg tw-bg-dreamgirl-red tw-flex tw-flex-col tw-items-center tw-pl-4 tw-pr-2 tw-py-2">
      <span className="text-white tw-font-semibold tw-underline tw-text-left tw-mr-auto tw-capitalize tw-text-sm tw-flex-shrink tw-flex-grow-0">
        {props.username}
      </span>
      <span className="tw-font-normal tw-text-white-color tw-text-left tw-text-sm tw-flex-shrink tw-flex-grow-0 tw-mr-auto">
        {props.msg}
      </span>
    </div>
  )
}

export default OtherSideChatMessage
