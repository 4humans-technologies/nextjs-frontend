import React, { useState } from "react"

function TipAction(props) {
  return (
    <div className="tw-px-2 tw-py-1 tw-mt-0.5 tw-bg-first-color tw-flex tw-items-center tw-justify-between tw-flex-grow tw-flex-shrink-0 tw-w-full tw-border tw-border-second-color hover:tw-border hover:tw-border-text-black tw-transition">
      <span className="tw-flex-grow tw-flex-shrink-0 tw-mr-1 tw-text-text-black tw-text-sm sm:tw-text-base tw-font-medium">
        {props.action}
      </span>
      <span className="tw-flex-shrink tw-flex-grow-0 tw-ml-1 tw-text-dreamgirl-red tw-text-sm">
        {props.price} coins
      </span>
    </div>
  )
}

const initialData = [
  {
    action: "Dance",
    price: 100,
  },
  {
    action: "Logo Design",
    price: 100,
  },
  {
    action: "Sing",
    price: 500,
  },
  {
    action: "Smile",
    price: 1000,
  },
]

function TipMenuActions() {
  const [tipMenuActions, setTipMenuActions] = useState([...initialData])
  return (
    <div className="chat-box tw-flex tw-flex-col tw-items-center tw-mb-10 tw-h-full tw-ml-1 tw-pb-4">
      {tipMenuActions.map((activity, index) => {
        return (
          <TipAction
            key={`${index}_&*(JK^&)`}
            action={activity.action}
            price={activity.price}
          />
        )
      })}
    </div>
  )
}

export default TipMenuActions
