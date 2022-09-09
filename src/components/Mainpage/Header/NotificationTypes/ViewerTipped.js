import React from "react"
const ViewerTipped = (props) => {
  return (
    <div className="tw-bg-second-color/80 tw-rounded tw-mb-2 tw-px-2 tw-py-2 tw-flex tw-items-center tw-justify-start">
      <img
        src="/coins.png"
        alt=""
        className="tw-w-10 tw-h-10 tw-object-contain"
      />
      <div className="tw-ml-2 tw-flex-grow">
        <p className="tw-text-left">{props.message}</p>
        <div className="tw-flex tw-items-center">
          <span className="tw-flex-grow tw-text-xs tw-text-left">
            added {props.modelGot} coins
          </span>
          <span className="tw-text-text-black tw-text-xs">
            {props.dateTime}
          </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ViewerTipped)
