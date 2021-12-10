import React from "react"

function SingleViewerBlock(props) {
  const { username, name, walletCoins, profileImage, isChatPlanActive } =
    props.viewer
  return (
    <div className="tw-py-1 tw-px-2 lg:tw-px-4 tw-bg-third-color tw-text-white-color tw-my-2 tw-mx-2 tw-rounded">
      <div className="tw-flex tw-items-center tw-justify-between">
        <div className="tw-flex-shrink-0 tw-mr-6">
          {profileImage ? (
            <>
              <span className="tw-w-10 tw-h-10 tw-rounded-full tw-border-dreamgirl-red tw-border-2 tw-inline-block tw-relative tw-my-auto">
                <img
                  src={profileImage ? profileImage : "/male-model.jpeg"}
                  alt=""
                  className="tw-w-full tw-h-full tw-rounded-full tw-object-cover"
                />
                <span className="tw-inline-block tw-w-1 tw-h-1 tw-bg-green-color tw-absolute tw-top-[78%] tw-left-[78%] tw-rounded-full tw-translate-x-[-50%] tw-translate-y-[50%]"></span>
              </span>
            </>
          ) : (
            <div className="tw-bg-dreamgirl-red tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-ring-2 tw-ring-white-color">
              <span className="tw-text-lg tw-text-white-color tw-font-light">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="tw-flex-grow tw-flex-shrink-0 tw-text-sm">
          <p className="">
            <span className="tw-font-medium tw-pr-2">Username :</span>{" "}
            <span
              className="hover:tw-underline tw-cursor-pointer"
              onClick={() => props.addAtTheRate(username)}
            >
              {username}
            </span>
          </p>
          <p className="">
            <span className="tw-font-medium tw-pr-2">Wallet :</span>{" "}
            {walletCoins} coins{" "}
            <span className="tw-pl-4">
              {isChatPlanActive && (
                <span className="tw-font-light tw-text-white-color tw-px-1 tw-rounded tw-bg-dreamgirl-red tw-text-[10px]">
                  PRO
                </span>
              )}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SingleViewerBlock)
