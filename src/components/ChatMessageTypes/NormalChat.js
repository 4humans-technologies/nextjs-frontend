import React from "react"

function NormalChat(props) {
  const content = (
    <div className="tw-flex-grow tw-pr-2">
      <button
        onClick={props.addAtTheRate}
        className="display-name tw-capitalize tw-inline-block tw-pr-3 hover:tw-underline tw-tracking-tight"
      >
        {props.displayName}:
      </button>
      <span className="user-message tw-text-sm tw-font-normal tw-w-full">
        {props.message}
      </span>
    </div>
  )
  return props.highlight ? (
    <div
      className={
        "tw-flex tw-items-center tw-justify-between tw-px-3 tw-py-1.5 tw-ml-2 tw-bg-first-color tw-text-white-color tw-flex-grow tw-flex-shrink-0 tw-w-full tw-border-dreamgirl-darkred tw-border tw-my-1"
      }
    >
      {content}
      {props.walletCoins && (
        <div className="tw-flex-shrink-0 tw-flex-grow-0 tw-pl-2 tw-text-sm tw-tracking-tighter">
          {props.walletCoins}
        </div>
      )}
    </div>
  ) : (
    <div
      className={
        "tw-flex tw-items-center tw-justify-between tw-px-3 tw-py-1.5 tw-ml-2 tw-bg-first-color tw-text-white-color tw-flex-grow tw-flex-shrink-0 tw-w-full tw-my-0.5"
      }
    >
      {content}
      {props.walletCoins && (
        <div className="tw-flex-shrink-0 tw-flex-grow-0 tw-pl-2 tw-text-sm tw-tracking-tighter">
          {props.walletCoins}
        </div>
      )}
    </div>
  )
}

export default React.memo(NormalChat)
