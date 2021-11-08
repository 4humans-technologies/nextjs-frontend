import React from "react"

function SelfChatMessage(props) {
  return (
    <div className="tw-mr-2 tw-max-w-[70%] tw-my-2 tw-rounded-t-lg tw-rounded-bl-lg tw-bg-yellow-600 tw-flex tw-flex-col tw-items-center tw-justify-end tw-pl-4 tw-pr-2 tw-py-2 tw-ml-auto">
      <span className="text-white tw-font-semibold tw-underline tw-flex-grow tw-text-left tw-mr-auto tw-capitalize tw-text-sm">
        You
      </span>
      <span className="tw-font-normal tw-text-white-color tw-text-left tw-text-sm">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam,
        reprehenderit?
      </span>
    </div>
  )
}

export default SelfChatMessage
