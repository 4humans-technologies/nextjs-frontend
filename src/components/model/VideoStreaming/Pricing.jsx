import React, { useState } from "react"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"
import { SaveRounded } from "@material-ui/icons"
import AttachMoneyRoundedIcon from "@material-ui/icons/AttachMoneyRounded"
import { Button } from "react-bootstrap"
import { toast } from "react-toastify"
function Pricing() {
  const authContext = useAuthContext()
  const updateAuthcontext = useAuthUpdateContext()
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

  const priceSetting = () => {
    fetch("/api/website/profile/update-info-fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          field: "charges.audioCall",
          value: audioVideoPrice.audio,
        },
        {
          field: "charges.videoCall",
          value: audioVideoPrice.video,
        },
      ]),
    })
      .then((res) => res.json())
      .then(() => {
        const lcUser = JSON.parse(localStorage.getItem("user"))
        lcUser.relatedUser.charges = {
          audioCall: audioVideoPrice.audio,
          videoCall: audioVideoPrice.video,
        }
        localStorage.setItem("user", JSON.stringify(lcUser))

        updateAuthcontext.setAuthState((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            user: {
              ...lcUser,
            },
          },
        }))
        setPriceEdited(false)
      })
      .then(() => {
        toast.success("updated successfully!")
      })
      .catch((err) => {
        toast.error(err.message)
      })
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
          className="tw-flex-shrink tw-flex-grow-0 tw-rounded-full tw-bg-dark-black tw-border-none tw-outline-none tw-px-2 tw-py-1 tw-w-full sm:tw-w-1/2 tw-ml-2"
          onChange={(e) => callChangeHandler(e)}
        />
        <p className="tw-ml-1">(min/sec)</p>
      </div>
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
        <p className="tw-flex-shrink-0 tw-flex-grow">Private Audio Call</p>
        <input
          type="number"
          name="video"
          value={audioVideoPrice.video}
          placeholder="Coins"
          className="tw-flex-shrink tw-flex-grow-0 tw-rounded-full tw-bg-dark-black tw-border-none tw-outline-none tw-px-2 tw-py-1 tw-w-full sm:tw-w-1/2 tw-ml-2"
          onChange={(e) => callChangeHandler(e)}
        />
        <p className="tw-ml-1">(min/sec)</p>
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
