import React from "react"

function Package(props) {
  const {
    _id,
    packageUrl,
    coin,
    actualAmountINR,
    discountedAmountINR,
    description,
    initiateBuyPackage,
  } = props

  return (
    <article className="tw-rounded-md tw-p-3 tw-bg-dark-black tw-flex tw-justify-between tw-my-3 tw-mx-2 tw-gap-x-4 tw-font-serif">
      <div className="tw-w-32 tw-h-32">
        <img
          src={packageUrl}
          alt=""
          className="tw-rounded tw-w-full tw-h-full tw-object-cover"
        />
      </div>
      <div className="tw-flex-grow tw-flex tw-flex-col tw-justify-start tw-items-start tw-pt-3">
        <div className="tw-flex tw-justify-start tw-items-center tw-gap-x-3 tw-w-full tw-mb-2">
          <div className="tw-flex tw-items-center tw-flex-grow tw-justify-start tw-gap-x-2">
            <p className="tw-text tw-line-through tw-text-red-900 tw-font-extralight tw-font-serif">
              {`₹ ${actualAmountINR}`}
            </p>
            <p className="tw-text-xl tw-text-green-600 tw-font-serif">{`₹ ${discountedAmountINR}`}</p>
          </div>
          <p className="tw-text tw-text-yellow-500 tw-bg-second-color tw-px-2 tw-py-1 tw-rounded tw-flex-grow-0 tw-font-serif">
            {coin} Coins
          </p>
        </div>
        <div className="tw-flex tw-text-left tw-gap-x-3 tw-w-full tw-text-sm tw-font-light tw-mb-2">
          {description}
        </div>
        <div className="tw-flex tw-justify-start tw-items-center tw-pr-3 tw-w-full">
          <button
            onClick={() => initiateBuyPackage({ _id, discountedAmountINR })}
            className="tw-bg-green-color tw-text-sm tw-rounded-full tw-px-2 tw-py-0.5 tw-my-1  tw-text-white tw-font-serif"
          >
            Buy This
          </button>
        </div>
      </div>
    </article>
  )
}

export default Package
