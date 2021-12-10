import React, { useCallback, useState } from "react"
import Tip from "./Tip"
import Topic from "./Topic"
import InCallActivities from "./InCallActivity"

function Showcontroler() {
  const [topic, setTopic] = useState([])

  const topicSet = useCallback(
    (val) => {
      setTopic(val)
    },
    [topic]
  )

  return (
    <div className="tw-bg-first-color tw-px-4">
      <div className="tw-grid md:tw-grid-cols-3 tw-grid-cols-1 tw-pb-8  tw-py-4 tw-gap-4">
        <div className="">
          <Topic topicSetter={topicSet} />
        </div>
        <div>
          <Tip />
        </div>
        <div>
          <InCallActivities />
        </div>
      </div>
    </div>
  )
}

export default Showcontroler
