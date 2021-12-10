import React, { useState, useEffect } from "react"
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
import { Button } from "react-bootstrap"
import { SaveRounded } from "@material-ui/icons"

function Topic(props) {
  const [childState, setChildState] = useState([])
  //  Topic set while streaming

  const topicSetter = async () => {
    const res = await fetch("url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: childState,
      }),
    })
    const data = await res.json()
    console.log(data)
  }

  useEffect(() => {}, [])

  return (
    <div className="tw-bg-second-color tw-text-white tw-px-4 tw-rounded">
      <div>
        <div className="tw-border-b-[1px] tw-border-white-color tw-mb-4 tw-py-4 tw-flex tw-items-center">
          <VolumeUpIcon /> <span className="tw-pl-1">Topic</span>
        </div>
        <div className="tw-border-b-[1px] tw-border-white-color tw-py-3">
          <input
            type="text"
            value={childState}
            placeholder="Topic for live streams"
            className="tw-rounded-full tw-w-full md:tw-w-1/2 tw-bg-dark-black tw-border-none tw-outline-none tw-px-4 tw-py-2"
            onChange={(e) => setChildState(e.target.value)}
          />
          <div className="tw-flex tw-my-4">
            <Button
              className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-z-[110]"
              variant="success"
              onClick={topicSetter}
            >
              <SaveRounded fontSize="small" />
              <span className="tw-pl-1 tw-tracking-tight">Save</span>
            </Button>
          </div>
        </div>
        <div className="tw-mb-4 tw-py-4">
          <p className="tw-capitalize">Topic for live Stream</p>
        </div>
      </div>
    </div>
  )
}

export default Topic
