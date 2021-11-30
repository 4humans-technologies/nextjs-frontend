import { memo } from "react"

function ModelChatMessage(props) {
  const content = (
    <div className="tw-flex-shrink tw-flex-grow-0">
      <h2 className="tw-font-semibold tw-text-sm tw-mb-1 tw-bg-second-color tw-px-1.5 tw-rounded tw-inline-block tw-py-1 tw-tracking-wider">
        <button
          className="hover:tw-underline tw-font-semibold tw-cursor-pointer"
          onClick={props.addAtTheRate}
        >
          message by @{props.modelUsername}
        </button>
      </h2>
      <span className={"tw-mt-1 tw-ml-3"}>{props.message}</span>
    </div>
  )
  return props.highlight ? (
    <div className="tw-flex tw-w-full tw-bg-first-color tw-text-white-color tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 tw-justify-between tw-border-dreamgirl-darkred tw-border">
      {content}
    </div>
  ) : (
    <div className="tw-flex tw-w-full tw-bg-first-color tw-text-white-color tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 tw-justify-between">
      {content}
    </div>
  )
}

export default memo(ModelChatMessage)
