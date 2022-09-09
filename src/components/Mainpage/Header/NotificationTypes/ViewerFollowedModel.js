import React from "react"
const ViewerFollow = (props) => {
  return (
    <div className="tw-bg-second-color/80 tw-rounded tw-mb-2 tw-px-2 tw-py-2 tw-flex tw-items-center tw-justify-start">
      <span className="tw-uppercase tw-w-10 tw-h-10 tw-rounded-full tw-text-white-color tw-font-semibold tw-text-xl tw-bg-dreamgirl-red tw-grid tw-place-content-center tw-ring-2 tw-ring-text-black">
        {props?.profileImage ? (
          <img
            /* src="/male-model.jpeg" */
            src={props.profileImage}
            alt=""
            className="tw-w-10 tw-h-10 tw-rounded-full tw-ring-2 tw-ring-text-black"
          />
        ) : (
          props.name[0]
        )}
      </span>
      <div className="tw-ml-2 tw-flex-grow">
        <p className="tw-text-left">{props.message}</p>
        <p className="tw-text-text-black tw-text-xs tw-text-right">
          {props.dateTime}
        </p>
      </div>
    </div>
  )
}

export default React.memo(ViewerFollow)
