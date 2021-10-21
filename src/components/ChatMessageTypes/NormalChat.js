import React from 'react'

function NormalChat(props) {
    return (
        <div className="tw-flex tw-items-center tw-justify-between tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 tw-bg-first-color tw-text-white-color tw-flex-grow tw-flex-shrink-0 tw-w-full">
            <div className="tw-flex-grow tw-pr-2">
                <span className="display-name tw-font-semibold tw-capitalize tw-inline-block tw-pr-3">
                    {props.displayName}:
                </span>
                <span className="user-message tw-text-sm tw-font-normal">
                    {props.message}
                </span>
            </div>
            <div className="tw-flex-shrink-0 tw-flex-grow-0 tw-pl-2">
                {props.walletCoins}
            </div>
        </div>
    )
}

export default NormalChat
