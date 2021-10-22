import React, { useState, useEffect } from "react"
import VolumeMuteIcon from "@material-ui/icons/VolumeMute"

function Topic(props) {
  const [childState, setChildState] = useState([])

  return (
    <div className="tw-bg-first-color tw-text-white tw-mt-6 tw-pl-4 tw-mx-4 tw-rounded-t-xl tw-rounded-b-xl">
      <div>
        <div className="tw-border-b-[1px] tw-border-text-black tw-mb-4 tw-py-2">
          <VolumeMuteIcon /> Offline Status
        </div>
        <div className="tw-border-b-[1px] tw-border-text-black tw-w-[90%]">
          <input
            type="text"
            value={childState}
            className="tw-rounded-full tw-w-1/2 tw-h-8 tw-pl-2 tw-bg-second-color tw-border-none tw-outline-none  "
            onChange={(e) => setChildState(e.target.value)}
          />
          <div className="tw-flex tw-my-4">
            <button className="tw-rounded-full tw-px-4 tw-py-2 tw-bg-green-color tw-mr-4 tw-outline-none">
              Save
            </button>
            <button className="tw-rounded-full tw-px-4 tw-py-2 tw-bg-dreamgirl-red">
              Cancel
            </button>
          </div>
        </div>
        <br />
        <p>Neeraj Rai's ex-girlfreind has 2 children</p>
      </div>
    </div>
  )
}

export default Topic
