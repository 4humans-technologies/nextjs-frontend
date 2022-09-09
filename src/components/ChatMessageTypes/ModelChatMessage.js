import { memo } from "react"

function ModelChatMessage(props) {
  const content = (
    <div className="tw-flex-shrink tw-flex-grow-0 tw-w-full">
      <p className="tw-font-semibold tw-text-sm tw-mb-1 tw-px-1.5 tw-rounded tw-inline-block tw-py-1 tw-tracking-wider tw-border tw-border-dreamgirl-red">
        <button
          className="hover:tw-underline tw-font-semibold tw-cursor-pointer tw-text-dreamgirl-red"
          onClick={props.addAtTheRate}
        >
          @{props.modelUsername}
        </button>
      </p>
      <span className={"tw-mt-1 tw-ml-3 tw-w-full"}>{props.message}</span>
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
