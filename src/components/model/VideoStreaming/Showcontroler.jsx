import React, { useCallback, useState } from "react"
import Tip from "./Tip"
import Topic from "./Topic"

function Showcontroler() {
  const [topic, setTopic] = useState([])

  const topicSet = useCallback(
    (val) => {
      setTopic(val)
    },
    [topic]
  )

  return (
    <div className="tw-bg-second-color">
      <div className="tw-grid md:tw-grid-cols-2 tw-pb-8  tw-grid-cols-1">
        <div>
          <Topic topicSetter={topicSet} />
        </div>
        <div>
          <Tip />
        </div>
      </div>
    </div>
  )
}

export default Showcontroler
