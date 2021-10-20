import React from "react"
import Coverpage from "./Coverpage"
import Offline from "./Offline"
import Pricing from "./Pricing"

function Details() {
  return (
    <div className="tw-bg-second-color tw-pb-8 ">
      <div className="tw-grid tw-grid-cols-3">
        <div>
          {/* My show */}
          <Offline />
        </div>
        <div>
          {/* Pricing */}
          <Pricing />
        </div>
        <div>
          {/* Cover Page */}
          <Coverpage />
        </div>
      </div>
    </div>
  )
}

export default Details
