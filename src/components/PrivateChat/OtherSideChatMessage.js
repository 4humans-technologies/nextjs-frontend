import React from "react"

function OtherSideChatMessage(props) {
  return (
    <div className="tw-ml-2 tw-max-w-[70%] tw-my-2 tw-rounded-t-lg tw-rounded-br-lg tw-bg-dreamgirl-red tw-flex tw-flex-col tw-items-center tw-justify-end tw-pl-4 tw-pr-2 tw-py-2 tw-mr-auto">
      <span className="text-white tw-font-semibold tw-underline tw-flex-grow tw-text-left tw-mr-auto tw-capitalize tw-text-sm">
        {props.username}
      </span>
      <span className="tw-font-normal tw-text-white-color tw-text-left tw-text-sm tw-break-words tw-w-full">
        {props.msg}
      </span>
    </div>
  )
}
export default OtherSideChatMessage
