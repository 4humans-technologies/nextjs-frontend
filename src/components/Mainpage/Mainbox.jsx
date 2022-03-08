import React, { useState } from "react"

import Link from "next/link"

function Mainbox(props) {
  return (
    <div className="live-model-box tw-mb-2">
      <Link href={`/view-stream/${props.modelId}`}>
        <a className="tw-cursor-pointer tw-relative">
          <img
            style={{
              opacity: props.isStreaming ? 1 : props.onCall ? 1 : 0.3,
            }}
            src={props.photo}
            className="tw-object-cover tw-object-center tw-rounded hover:tw-rounded-t tw-w-[211px]  tw-h-[211px]"
            alt={
              props.onCall
                ? "This model is busy on a call"
                : "This model is live streaming"
            }
          />
          {props.isStreaming ? (
            <>
              <p
                id="model-status"
                className="tw-opacity-0 tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-sm tw-capitalize tw-tracking-wider tw-bg-dark-black tw-py-0.5  tw-relative tw-bottom-0 tw-w-full tw-mb-1"
              >
                {props.modelName}
              </p>
              <p
                id="model-status"
                className="tw-opacity-0 tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-xs tw-tracking-wider tw-bg-green-color tw-py-0.5  tw-relative tw-bottom-0 tw-w-full"
              >
                Streaming
              </p>
            </>
          ) : // </div>
          props.onCall ? (
            <>
              <p
                id="model-status"
                className="tw-opacity-0 tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-sm tw-capitalize tw-tracking-wider tw-bg-dark-black tw-py-0.5  tw-relative tw-bottom-0 tw-w-full tw-mb-1"
              >
                {props.modelName}
              </p>
              <p
                id="model-status"
                className="tw-opacity-0 tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-xs tw-tracking-wider tw-bg-indigo-600 tw-py-0.5  tw-relative tw-bottom-0 tw-w-full"
              >
                On Call
              </p>
            </>
          ) : (
            <>
              <p
                id="model-status"
                className="tw-opacity-0 tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-sm tw-capitalize tw-tracking-wider tw-bg-dark-black tw-py-0.5  tw-relative tw-bottom-0 tw-w-full tw-mb-1"
              >
                {props.modelName}
              </p>
              <p
                id="model-status"
                className="tw-opacity-0 tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-xs tw-tracking-wider tw-bg-red-600 tw-py-0.5  tw-relative tw-bottom-0 tw-w-full"
              >
                Offline
              </p>
            </>
          )}
        </a>
      </Link>
    </div>
  )
}

export default Mainbox
