import React from "react"
import CameraIcon from "@material-ui/icons/Camera"
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled"

const AlbumPurchase = (props) => {
  return (
    <div className="tw-bg-second-color/80 tw-rounded tw-mb-2 tw-px-2 tw-py-2 tw-flex tw-items-center tw-justify-start">
      <div className="tw-h-10 tw-w-10 tw-text-white">
        {props.albumType === "image-album-purchase" ? (
          <CameraIcon fontSize="large" />
        ) : (
          <PlayCircleFilledIcon fontSize="large" />
        )}
      </div>
      <div className="tw-ml-2 tw-flex-grow">
        <p className="tw-text-left">{props.message}</p>
        <div className="tw-flex tw-items-center">
          <span className="tw-flex-grow tw-text-xs tw-text-left">
            added {props.debited} coins
          </span>
          <span className="tw-text-text-black tw-text-xs">
            {props.dateTime}
          </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AlbumPurchase)
