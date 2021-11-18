function GiftSuperChat(props) {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-between tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 gift-superchat-bg tw-text-white-color tw-flex-grow tw-flex-shrink-0 tw-w-full">
      <div className="tw-flex-grow-0 tw-mb-2 tw-px-1.5 tw-pt-1.5 tw-rounded tw-bg-second-color tw-mr-auto">
        <Image
          src={props.giftImageUrl}
          width={90}
          height={90}
          objectFit="contain"
          objectPosition="center"
          className="tw-rounded tw-mr-auto"
        />
      </div>
      <div className="tw-flex tw-px-2 tw-justify-between tw-w-full tw-flex-grow">
        <div className="tw-flex-grow tw-pr-2">
          {/* <span className="display-name tw-capitalize tw-inline-block tw-pr-3">
              @{props.displayName}:
            </span> */}
          <span className="user-message tw-font-semibold tw-capitalize">
            {props.message}
          </span>
        </div>
        <p className="tw-flex-shrink-0 tw-flex-grow-0 tw-pl-2 tw-text-yellow-400 tw-font-medium">
          {props.walletCoins}
        </p>
      </div>
    </div>
  )
}
