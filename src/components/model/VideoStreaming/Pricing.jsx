import React, { useState } from "react"
// import Notification from "../../Notifications/Notification"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"

function Pricing() {
  const authContext = useAuthContext()
  const [priceEdit, setPriceEdited] = useState(false)

  const [audioVideoPrice, setAudioVideoPrice] = useState({
    audio: authContext.user.user.relatedUser.charges.audioCall,
    video: authContext.user.user.relatedUser.charges.videoCall,
  })

  const callChangeHandler = (e) => {
    const { name, value } = e.target
    setAudioVideoPrice({ ...audioVideoPrice, [name]: value })
    setPriceEdited(true)
  }

  // onAudio video set to post the data
  const priceSetting = async () => {
    const res = await fetch("/model.json", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio: audioVideoPrice.audio,
        video: audioVideoPrice.video,
      }),
    })
    const data = await res.json()
    console.log(data)
  }

  // now to fetch the data to make to show the data

  return (
    <div>
      <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-grid-cols-3 tw-grid tw-leading-9 tw-mt-6 tw-text-white">
        <div className="tw-col-span-1">
          <p>Private Audio Call</p>
          <p className="md:tw-my-2">Private video Call</p>
        </div>
        <div className="tw-col-span-2">
          <div className="tw-flex ">
            <input
              type="number"
              name="audio"
              onChange={(e) => callChangeHandler(e)}
              id=""
              max="100"
              min="20"
              className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-outline-none"
              value={audioVideoPrice.audio}
            />
          </div>
          {/*  */}

          <div className="tw-flex  md:tw-my-2 tw-my-10">
            <input
              type="number"
              name="video"
              onChange={(e) => callChangeHandler(e)}
              id=""
              max="100"
              min="20"
              className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-outline-none"
              value={audioVideoPrice.video}
            />
          </div>
          {priceEdit && (
            <button
              className="tw-bg-green-color tw-text-white tw-px-4  tw-my-2 tw-rounded-full"
              onClick={priceSetting}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Pricing
