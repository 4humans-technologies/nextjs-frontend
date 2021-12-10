import React from "react"
import Coverpage from "./Coverpage"
import Offline from "./Offline"
import Pricing from "./Pricing"

function Details() {
  return (
    <div className="tw-bg-first-color tw-px-4">
      <div className="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-grid-cols-1 tw-pb-8  tw-py-4 tw-gap-4">
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
