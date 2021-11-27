import React, { useState, useEffect } from "react"
import VolumeMuteIcon from "@material-ui/icons/VolumeMute"

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
    <div className="tw-bg-first-color tw-text-white tw-mt-6 tw-pl-4 tw-mx-4 tw-rounded-t-xl tw-rounded-b-xl">
      <div>
        <div className="tw-border-b-[1px] tw-border-text-black tw-mb-4 tw-py-2">
          <VolumeMuteIcon /> Topic
        </div>
        <div className="tw-border-b-[1px] tw-border-text-black tw-w-[90%]">
          <input
            type="text"
            value={childState}
            placeholder="Your perfomence in Live stream"
            className="tw-rounded-full md:tw-w-1/2 tw-h-8 tw-pl-2 tw-bg-second-color tw-border-none tw-outline-none tw-px-4 "
            onChange={(e) => setChildState(e.target.value)}
          />
          <div className="tw-flex tw-my-4">
            <button
              className="tw-rounded-full tw-px-4 tw-py-2 tw-bg-dreamgirl-red tw-mr-4 tw-outline-none"
              onClick={topicSetter}
            >
              Save
            </button>
            <button className="tw-rounded-full tw-px-4 tw-py-2 tw-bg-green-color">
              Cancel
            </button>
          </div>
        </div>
        <br />
        <p>Topic for live perfomence</p>
      </div>
    </div>
  )
}

export default Topic
