function ModelChatMessage(props) {
  return (
    <div className="tw-flex tw-flex-grow tw-flex-shrink-0 tw-bg-first-color tw-text-white-color tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 tw-justify-between">
      <div className="tw-flex-shrink tw-flex-grow-0">
        <h2 className="tw-font-semibold tw-text-sm tw-mb-1 tw-bg-second-color tw-px-1.5 tw-rounded tw-inline-block tw-py-1 tw-tracking-wider">
          <button className="hover:tw-underline tw-font-semibold tw-cursor-pointer" onClick={props.addAtTheRate}>
            Message By @Model
          </button>
        </h2>
        <span className={"tw-mt-1 tw-ml-3"}>{props.message}</span>
      </div>
    </div>
  )
}

export default ModelChatMessage
