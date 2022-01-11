import React, { useEffect, useState } from "react"
import Mainbox from "./Mainbox"

function Boxgroup(props) {
  return (
    <section className="tw-bg-first-color tw-px-3 tw-border-b tw-border-second-color tw-w-full tw-pb-6">
      <h2 className="tw-text-lg tw-font-medium tw-text-white tw-mb-4 tw-mt-4">
        {props.groupTitle}
      </h2>
      <div className="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-7 tw-gap-x-3  tw-justify-items-start tw-w-full">
        {/* show more wala button,then this will */}
        {props.data.length === 0 ? (
          <div className="tw-px-4 tw-py-3 tw-rounded tw-bg-second-color">
            <p className="tw-text-base tw-font-medium tw-text-text-black tw-text-center">
              No Model is Currently Live 🥺!
            </p>
          </div>
        ) : (
          props.data.map((model, index) => {
            return (
              <Mainbox
                parent={props.parent}
                key={`${model.relatedUserId}_${index}`}
                modelId={model.relatedUserId}
                photo={model.profileImage}
                onCall={model.onCall}
                isStreaming={model.isStreaming}
              />
            )
          })
        )}
      </div>
    </section>
  )
}

export default Boxgroup
