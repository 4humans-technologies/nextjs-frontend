import React, { useState } from "react"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"
import { SaveRounded } from "@material-ui/icons"
import AttachMoneyRoundedIcon from "@material-ui/icons/AttachMoneyRounded"
import { Button } from "react-bootstrap"

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

  return (
    <div className="tw-bg-second-color px-4 tw-rounded tw-text-white">
      <div className="tw-border-b-[1px] tw-border-white-color tw-mb-4 tw-py-4 tw-flex tw-items-center">
        <AttachMoneyRoundedIcon fontSize="medium" />{" "}
        <span className="">Set Call Pricing</span>
      </div>
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
        <p className="tw-flex-shrink-0 tw-flex-grow">Private Audio Call</p>
        <input
          type="number"
          name="audio"
          value={audioVideoPrice.audio}
          placeholder="Coins"
          className="md:tw-flex-shrink-0 tw-rounded-full tw-bg-dark-black tw-border-none tw-outline-none tw-px-4 tw-py-2 tw-w-full sm:tw-w-1/2 tw-ml-2"
          onChange={(e) => callChangeHandler(e)}
        />
      </div>
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
        <p className="tw-flex-shrink-0 tw-flex-grow">Private Audio Call</p>
        <input
          type="number"
          name="video"
          value={audioVideoPrice.video}
          placeholder="Coins"
          className="md:tw-flex-shrink-0 tw-rounded-full tw-bg-dark-black tw-border-none tw-outline-none tw-px-4 tw-py-2 tw-w-full sm:tw-w-1/2 tw-ml-2"
          onChange={(e) => callChangeHandler(e)}
        />
      </div>
      {priceEdit && (
        <Button
          className="tw-rounded-full tw-flex tw-text-sm tw-mb-4"
          variant="success"
          onClick={priceSetting}
        >
          <SaveRounded fontSize="small" />
          <span className="tw-pl-1 tw-tracking-tight">Save</span>
        </Button>
      )}
      <div className="tw-mb-4 tw-py-4 tw-border-t tw-border-white-color">
        <p>Set the Audio/video call's per minutes charges</p>
      </div>
    </div>
  )
}

export default Pricing
