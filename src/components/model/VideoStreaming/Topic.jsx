import React, { useState, useEffect } from "react"
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
import { Button } from "react-bootstrap"
import { SaveRounded } from "@material-ui/icons"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"

function Topic(props) {
  const authContext = useAuthContext()
  const [childState, setChildState] = useState([
    ...authContext.user.user?.relatedUser?.topic.split(","),
  ])
  const updateAuthcontext = useAuthUpdateContext()
  //  Topic set while streaming
  const topicSetter = async () => {
    const res = await fetch("/api/website/profile/update-info-fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          field: "topic",
          value: childState,
        },
      ]),
    })
    const lcUser = JSON.parse(localStorage.getItem("user"))
    lcUser["relatedUser"]["topic"] = childState
    localStorage.setItem("user", json.stringify("user"))

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
          <VolumeUpIcon /> <span className="tw-pl-1">Topic</span>
        </div>
        <div className="tw-border-b-[1px] tw-border-white-color tw-py-3">
          <input
            type="text"
            value={childState}
            placeholder="Topic for live streams"
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
            Tell users what's taking place in your chat room and the type of
            performances you put on.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Topic
