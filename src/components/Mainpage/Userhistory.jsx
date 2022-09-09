import React, { useEffect, useState } from "react"

function Userhistory() {
  const [tokenData, setTokenData] = useState()
  useEffect(() => {
    fetch("/api/website/profile/viewer/get-coins-spend-history")
      .then((resp) => resp.json())
      .then((data) => setTokenData(data.resultDocs))
      .catch((err) => console.log(err))
  }, [])
  return (
    <div className="tw-bg-dark-black tw-h-screen">
      <div className=""></div>
      <div className="tw-text-white tw-mt-8 ">
        {/* It's token History */}
        <h1 className="tw-pt-4 tw-text-center tw-font-semibold">
          Token History
        </h1>
        <div className="tw-grid md:tw-grid-cols-4 tw-grid-rows-1 tw-text-xl tw-font-bold  tw-mt-4 md:tw-mx-16 tw-text-center token_grid ">
          <div>Date</div>
          <div>Time</div>
          <div>User</div>
          <div>Token</div>
        </div>

        <div className="tw-max-h-72 tw-overflow-y-auto">
          {tokenData?.map((item, index) => (
            <div
              className="tw-grid md:tw-grid-cols-4 tw-grid-rows-1  tw-bg-second-color tw-text-xl tw-font-bold  tw-mt-2 md:tw-mx-16 tw-text-center token_grid "
              key={index}
            >
              <div>
                {
                  (item.time.split("T")[0],
                  item.time.split("T")[1].split(".")[0])
                }
              </div>
              <div>{item.forModel.rootUser.username}</div>
              <div>{item.givenFor}</div>
              <div>{item.tokenAmount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Userhistory
