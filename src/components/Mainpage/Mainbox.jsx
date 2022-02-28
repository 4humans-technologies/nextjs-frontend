import React, { useState } from "react"
import Image from "next/image"
import { Button } from "react-bootstrap"
import router, { useRouter } from "next/router"
import dynamic from "next/dynamic"
import StarIcon from "@material-ui/icons/Star"
import Link from "next/link"

function Mainbox(props) {
  return (
    <div className="live-model-box tw-mb-2">
      <Link
        // href={props.parent === "index" ? `/view-stream/${props.modelId}` : "/"}
        href={`/view-stream/${props.modelId}`}
      >
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
            <div className="tw-absolute tw-top-2 tw-min-w-[211px]">
              <ul className=" tw-opacity-0 tw-text-white " id="model-status">
                <li>Name:Neeraj Rai</li>
                <li>Hello</li>
                <li>Hello</li>
                <li>Hello</li>
              </ul>
              <p
                id="model-status"
                className="tw-opacity-0 tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-xs tw-tracking-wider tw-bg-green-color tw-py-0.5  tw-relative tw-bottom-0 tw-w-full"
              >
                Streaming
              </p>
            </div>
          ) : props.onCall ? (
            <div className="tw-absolute tw-top-2 tw-min-w-[211px]">
              <ul className=" tw-opacity-0 tw-text-white " id="model-status">
                <li>Name</li>
                <li>Hello</li>
                <li>Hello</li>
                <li>Hello</li>
              </ul>
              <p
                id="model-status"
                className="tw-opacity-0 tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-xs tw-tracking-wider tw-bg-indigo-600 tw-py-0.5  tw-relative tw-bottom-0 tw-w-full"
              >
                On Call
              </p>
            </div>
          ) : (
            <div className="tw-absolute tw-top-2 tw-min-w-[211px]">
              <ul className=" tw-opacity-0 tw-text-white " id="model-status">
                <li>Name:Neeraj Rai</li>
                <li>Age:33</li>
                <li>Audio rate: 32 coins/minute</li>
                <li>Video rate: 32 coins/minute</li>
              </ul>
              <p
                id="model-status"
                className="tw-opacity-0 tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-xs tw-tracking-wider tw-bg-red-600 tw-py-0.5  tw-relative tw-bottom-0 tw-w-full"
              >
                Offline
              </p>
            </div>
          )}
        </a>
      </Link>
    </div>
  )
}

export default Mainbox
