import React from "react"

function TipAction(props) {
  return (
    <div
      onClick={props.onClickSendTipMenu}
      className="tw-px-2 tw-py-1 tw-mt-0.5 tw-bg-first-color tw-flex tw-items-center tw-justify-between tw-flex-grow tw-flex-shrink-0 tw-w-full tw-border tw-border-second-color hover:tw-border hover:tw-border-text-black tw-transition"
    >
      <span className="tw-flex-grow tw-flex-shrink-0 tw-mr-1 tw-text-text-black tw-text-sm sm:tw-text-base tw-font-medium">
        {props.action}
      </span>
      <span className="tw-flex-shrink tw-flex-grow-0 tw-ml-1 tw-text-white-color tw-text-sm">
        {props.price} coins
      </span>
    </div>
  )
}

function TipMenuActions(props) {
  const { tipMenuActions, setTipMenuActions, onClickSendTipMenu } = props

  return (
    <div className="chat-box-container tw-overflow-y-scroll">
      <div className="tw-flex tw-flex-col tw-items-center tw-mb-10 tw-h-full tw-ml-1 tw-pb-4 tw-mt-4">
        {tipMenuActions?.length > 0 ? (
          tipMenuActions.map((activity, index) => {
            return (
              <TipAction
                key={`${index}_&*(JK^&)`}
                action={activity.action}
                price={activity.price}
                onClickSendTipMenu={() => onClickSendTipMenu(activity)}
              />
            )
          })
        ) : (
          <TipAction action={"Not activity added by the model"} price={0} />
        )}
      </div>
    </div>
  )
}

export default React.memo(TipMenuActions)
