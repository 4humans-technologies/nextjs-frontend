import React, { memo } from "react"
import Image from "next/image"
import coinsImage from "../../../public/coins.png"

function CoinSuperChat(props) {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-between tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 coin-superchat-bg tw-text-white-color tw-flex-grow tw-flex-shrink-0 tw-w-full">
      <div className="tw-flex-grow-0 tw-flex-shrink tw-mb-2 tw-px-1.5 tw-pt-1.5 tw-rounded tw-mr-auto tw-flex tw-items-center tw-justify-start">
        <Image
          src={coinsImage}
          width={25}
          height={25}
          objectFit="contain"
          objectPosition="center"
          className="tw-rounded tw-mr-auto"
        />
        <span className="tw-pl-3 tw-text-lg tw-font-semibold tw-text-yellow-500">
          {props.amountGiven} coins
        </span>
        {/* <p className="tw-mt-1 tw-font-semibold tw-text-yellow-400">
            <span className="display-name tw-font-semibold tw-capitalize tw-inline-block tw-pr-3">
              {props.displayName}:
            </span>
            {props.amountGiven}
          </p> */}
      </div>
      <div className="tw-flex tw-px-2 tw-justify-between tw-w-full tw-flex-grow">
        <div className="tw-flex-grow tw-pr-2">
          <span
            className="user-message tw-text-sm tw-font-normal hover:tw-underline tw-cursor-pointer"
            onClick={props.addAtTheRate}
          >
            {props.message}
          </span>
        </div>
        {props.showWallet && (
          <p className="tw-flex-shrink-0 tw-flex-grow-0 tw-pl-2 tw-text-yellow-400">
            {props.walletCoins}
          </p>
        )}
      </div>
    </div>
  )
}

export default React.memo(CoinSuperChat)
