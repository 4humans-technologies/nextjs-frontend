import React, { useState, useEffect } from "react"
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
import { Button } from "react-bootstrap"
import { SaveRounded } from "@material-ui/icons"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"
import { toast } from "react-toastify"

function WelcomeMessage() {
  const authContext = useAuthContext()
  const [childState, setChildState] = useState([
    ...authContext.user.user?.relatedUser?.welcomeMessage.split(","),
  ])
  const updateAuthcontext = useAuthUpdateContext()
  const topicSetter = async () => {
    if (!childState.includes("__name__")) {
      toast.error(
        "Please include at least one __name__, in you welcome message"
      )
      return
    }
    const res = await fetch("/api/website/profile/update-info-fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          field: "welcomeMessage",
          value: childState,
        },
      ]),
    })
    const lcUser = JSON.parse(localStorage.getItem("user"))
    lcUser.relatedUser.welcomeMessage = childState
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
  }

  return (
    <div className="tw-bg-second-color tw-text-white tw-px-4 tw-rounded">
      <div>
        <div className="tw-border-b-[1px] tw-border-white-color tw-mb-4 tw-py-4 tw-flex tw-items-center">
          <VolumeUpIcon /> <span className="tw-pl-1">Set Welcome Message</span>
        </div>
        <div className="tw-border-b-[1px] tw-border-white-color tw-py-3">
          <input
            type="text"
            value={childState}
            placeholder="Welcome message for viewers"
            className="tw-rounded-full tw-w-full tw-bg-dark-black tw-border-none tw-outline-none tw-px-4 tw-py-2"
            onChange={(e) => setChildState(e.target.value)}
          />
          <div className="tw-flex tw-my-4">
            <Button
              className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-z-[110]"
              variant="success"
              onClick={topicSetter}
            >
              <SaveRounded fontSize="small" />
              <span className="tw-pl-1 tw-tracking-tight">Save</span>
            </Button>
          </div>
        </div>
        <div className="tw-mb-4 tw-py-4">
          <p className="tw-capitalize">
            Set welcome message for viewers, use __name__ as a placeholder for
            viewers name
          </p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeMessage
