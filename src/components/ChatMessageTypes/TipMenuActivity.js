import React from "react"

function TipMenuActivityRequest(props) {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-between tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 tipmenu-superchat-bg tw-text-white-color tw-flex-grow tw-flex-shrink-0 tw-w-full">
      <div className="tw-flex tw-px-2 tw-justify-between tw-w-full tw-flex-grow">
        <div className="tw-flex-grow tw-pr-2">
          <span
            className="user-message tw-text-sm tw-capitalize tw-font-semibold tw-cursor-pointer"
            onClick={props.addAtTheRate}
          >
            {props.message}
          </span>
        </div>
        {props.showWallet && (
          <p className="tw-flex-shrink tw-flex-grow-0 tw-pl-2 tw-text-yellow-400">
            {props.walletCoins}
          </p>
        )}
      </div>
      <div className="tw-flex-grow tw-flex-shrink-0 tw-w-full tw-flex tw-items-center tw-justify-between tw-my-2 tw-border tw-border-white tw-py-1 tw-px-3">
        <span className="tw-text-white-color tw-font-medium tw-flex-grow">
          {props.activityName}
        </span>
        <span className="tw-text-white-color tw-font-medium tw-flex-shrink">
          {props.activityPrice} coins
        </span>
      </div>
    </div>
  )
}

export default React.memo(TipMenuActivityRequest)
