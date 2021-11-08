import React from "react"

function CallEndDetails(props) {
  if (props.userType === "Model") {
    const {
      callDuration,
      callType,
      currentAmount,
      amountAdded,
      username,
      viewerName,
      dateTime,
      totalCharges,
    } = props
  } else {
    const {
      callDuration,
      callType,
      currentAmount,
      amountDeducted,
      modelName,
      modelUsername,
      dateTime,
      totalCharges,
    } = props
  }
  return (
    <div className="">
      <div className="tw-px-4 tw-py-6 tw-bg-first-color tw-w-6/12 tw-mx-auto">
        <h3 className="tw-text-white-color tw-mx-0 tw-text-center tw-text-xl">
          Call Details
        </h3>
        <div className="tw-w-8/12 tw-border-text-black tw-border-t tw-mx-auto tw-my-4"></div>
        <div className="tw-grid tw-grid-cols-2 tw-gap-x-3 tw-gap-y-3 tw-mb-3">
          <div className="tw-col-span-2 md:tw-col-span-1">
            <div className="tw-flex tw-items-center">
              <div className="tw-flex-grow-0 tw-flex-shrink">
                {/* model image */}
                {userType === "Model" ? (
                  <img
                    src="/original.jpg"
                    alt=""
                    className="tw-w-20 tw-h-20 tw-border-2 tw-border-white-color tw-object-cover tw-rounded-full"
                  />
                ) : (
                  <div className="tw-grid tw-bg-dreamgirl-red tw-border-2 tw-border-white-color tw-w-20 tw-h-20 tw-rounded-full">
                    <span className="tw-text-xs tw-text-white-color">
                      Viewer
                    </span>
                  </div>
                )}
              </div>
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-start tw-flex-shrink-0 tw-flex-grow">
                {/* model details */}
                <p className="tw-my-2 tw-text-left tw-text-white-color">
                  {userType === "Model" ? modelName : viewerName}
                </p>
                <p className="tw-my-2 tw-text-left tw-text-white-color">
                  @{userType === "Model" ? modelUsername : username}
                </p>
              </div>
            </div>
          </div>
          <div className="tw-col-span-2 md:tw-col-span-1">
            <div className="tw-flex tw-flex-col tw-w-full tw-items-center tw-justify-start">
              <p className="tw-my-2 tw-text-left tw-text-text-black tw-self-start">
                <span className="tw-pr-2 tw-font-semibold tw-text-white-color">
                  Call Duration :
                </span>
                {callDuration}
              </p>
              <p className="tw-my-2 tw-text-left tw-text-text-black tw-self-start">
                <span className="tw-pr-2 tw-font-semibold tw-text-white-color">
                  Total Charges :
                </span>
                {totalCharges} coins
              </p>
            </div>
          </div>
        </div>
        <div className="tw-w-8/12 tw-border-text-black tw-border-t tw-mx-auto tw-my-4"></div>
        <div className="tw-flex tw-justify-around tw-items-center tw-rounded tw-text-text-black tw-bg-second-color tw-py-3">
          <div className="">
            <span className="tw-pr-2 tw-font-semibold tw-text-white-color">
              Coins In Wallet :
            </span>
            {currentAmount} coins
          </div>
          <div className="">
            <span className="tw-pr-2 tw-font-semibold tw-text-white-color">
              Call Date :
            </span>
            {dateTime}
          </div>
        </div>
        {userType === "Model" && (
          <div className="">
            <p className="">{amountAdded} Coins</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CallEndDetails
