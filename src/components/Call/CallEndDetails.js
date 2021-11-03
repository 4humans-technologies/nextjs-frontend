import React from "react"

function CallEndDetails(props) {
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
                <img
                  src="/original.jpg"
                  alt=""
                  className="tw-w-20 tw-h-20 tw-border-2 tw-border-white-color tw-object-cover tw-rounded-full"
                />
              </div>
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-start tw-flex-shrink-0 tw-flex-grow">
                {/* model details */}
                <p className="tw-my-2 tw-text-left tw-text-white-color">
                  Model name
                </p>
                <p className="tw-my-2 tw-text-left tw-text-white-color">
                  @username
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
                04:45
              </p>
              <p className="tw-my-2 tw-text-left tw-text-text-black tw-self-start">
                <span className="tw-pr-2 tw-font-semibold tw-text-white-color">
                  Charges :
                </span>
                150 coins
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
            500 coins
          </div>
          <div className="">
            <span className="tw-pr-2 tw-font-semibold tw-text-white-color">
              Call Date :
            </span>
            26 july 2021
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallEndDetails
