function ModelChatMessage(props) {
    return (
        <div className="tw-flex tw-flex-grow tw-flex-shrink-0 tw-w-full tw-bg-first-color tw-text-white-color tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 tw-justify-between">
            <div className="tw-flex-grow tw-flex-shrink-0">
                <h2 className="tw-font-semibold tw-text-sm tw-mb-1 tw-bg-second-color tw-px-1.5 tw-rounded tw-inline-block tw-py-1 tw-tracking-wider">
                    Message By Model
                </h2>
                <p className="tw-mt-1">{props.message}</p>
            </div>
        </div>
    )
}

export default ModelChatMessage