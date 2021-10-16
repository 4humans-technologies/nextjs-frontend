import React, { useEffect, useState } from "react"
import Mainbox from "./Mainbox"

function Boxgroup(props) {
  const [streams, setStreams] = useState([])
  useEffect(() => {
    // fetch("http://localhost:8080/api/website/compose-ui/get-streaming-models")
    //   .then((res) => res.json)
    //   .then((data) => {
    //     setStreams(data.resultDoc);
    //   });
  }, [])

  return (
    <div className="tw-bg-first-color tw-px-3 tw-py-4 tw-border-b tw-border-second-color box-group">
      <h1 className="tw-text-lg tw-font-medium tw-text-white tw-mb-4 tw-mt-4">
        {props.groupTitle}
      </h1>
      <div className="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-7 tw-gap-x-3 tw-gap-y-2 tw-justify-items-center">
        {props.data.map((model, index) => {
          return (
            <Mainbox
              key={`${model.rootUserId}_${index}`}
              modelId={model._id}
              name={model.name}
              age={model.age}
              gender={model.gender}
              languages={model.languages}
              rating={model.rating}
              photo={model.profileImage}
              onCall={model.onCall}
              userName={model.userName}
              isStreaming={model.isStreaming}
            />
          )
        })}
        {/* show more wala button,then this will */}
      </div>
    </div>
  )
}

export default Boxgroup
