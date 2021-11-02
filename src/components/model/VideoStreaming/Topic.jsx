import React, { useState, useEffect } from "react"
import VolumeMuteIcon from "@material-ui/icons/VolumeMute"

function Topic(props) {
  const [childState, setChildState] = useState([])
  //  Topic set while streaming

  fetch("url", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      perfomenceAction: childState,
    }),
  })
    .then((resp) => resp.json())
    .then((data) => console.log(data))

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
            <button className="tw-rounded-full tw-px-4 tw-py-2 tw-bg-dreamgirl-red tw-mr-4 tw-outline-none">
              Save
            </button>
            <button className="tw-rounded-full tw-px-4 tw-py-2 tw-bg-green-color">
              Cancel
            </button>
          </div>
        </div>
        <br />
        <p>Bhojpuri singer Neeraj Rai </p>
      </div>
    </div>
  )
}

export default Topic
