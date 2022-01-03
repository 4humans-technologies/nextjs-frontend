import React, { useState, useEffect } from "react"
import VolumeMuteIcon from "@material-ui/icons/VolumeMute"
import OfflineBoltOutlinedIcon from "@material-ui/icons/OfflineBoltOutlined"
import { Button } from "react-bootstrap"
import { SaveRounded } from "@material-ui/icons"
import { useAuthContext } from "../../../app/AuthContext"
import { toast } from "react-toastify"

function Topic(props) {
  const authContext = useAuthContext()
  const [childState, setChildState] = useState(
    authContext.user.user.relatedUser.offlineStatus
  )

  const offlineStatusHandler = async () => {
    const offlineStatusPromise = fetch(
      "/api/website/profile/update-info-fields",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify([
          {
            field: "offlineStatus",
            value: childState,
          },
        ]),
      }
    )
      .then((resp) => resp.json())
      .then(() => {
        toast.success("updated successfully!")
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  return (
    <div className="tw-bg-second-color tw-text-white tw-px-4 tw-rounded">
      <div>
        <div className="tw-border-b-[1px] tw-border-white-color tw-mb-4 tw-py-4 tw-flex tw-items-center">
          <OfflineBoltOutlinedIcon fontSize="medium" />{" "}
          <span className="tw-pl-1">Offline Status</span>
        </div>
        <div className="tw-border-b-[1px] tw-border-white-color tw-py-3">
          <input
            type="text"
            value={childState}
            placeholder="Enter offline status"
            className="tw-rounded-full tw-bg-dark-black tw-border-none tw-outline-none tw-px-4 tw-py-2 tw-w-full"
            onChange={(e) => setChildState(e.target.value)}
          />
          <div className="tw-flex tw-my-4">
            <Button
              className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-z-[110]"
              variant="success"
              onClick={offlineStatusHandler}
            >
              <SaveRounded fontSize="small" />
              <span className="tw-pl-1 tw-tracking-tight">Save</span>
            </Button>
          </div>
        </div>
        <div className="tw-mb-4 tw-py-4">
          <p>This status will be shown to when you are Offline</p>
        </div>
      </div>
    </div>
  )
}

export default Topic
