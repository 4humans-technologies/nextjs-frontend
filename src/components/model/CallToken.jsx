import React, { useEffect, useState } from "react"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

function Callhistory() {
  const authContext = useAuthContext
  return <div></div>
}

function Tokenhistory() {
  const authContext = useAuthContext
  const [tokenData, setTokenData] = useState()
  useEffect(() => {
    fetch("/api/website/profile/get-model-token-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => setTokenData(data.results))
      .catch((err) => console.log(err))
  }, [])
  // tokenData.map((item) => console.log(item))
  return (
    <div className="md:tw-mt-[8.1rem] tw-mt-[7.7rem] tw-bg-dark-background tw-text-white">
      <h1 className="tw-pt-4">Token History</h1>
      <div className="tw-grid md:tw-grid-cols-4 tw-grid-rows-1  tw-bg-second-color tw-text-xl tw-font-bold  tw-mt-4 md:tw-mx-16 tw-text-center token_grid">
        <div>Date</div>
        <div>User</div>
        <div>Type</div>
        <div>Tokens</div>
      </div>
      {tokenData?.map((item, index) => (
        <div
          className="tw-grid md:tw-grid-cols-4 tw-grid-rows-1  tw-bg-second-color tw-text-xl tw-font-bold  tw-mt-2 md:tw-mx-16 tw-text-center token_grid"
          key={index}
        >
          <div>{item.time}</div>
          <div>{item.by.name}</div>
          <div>Type</div>
          <div>{item.tokenAmount}</div>
        </div>
      ))}
    </div>
  )
}

export { Callhistory, Tokenhistory }
