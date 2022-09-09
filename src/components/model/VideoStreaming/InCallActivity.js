import React, { useState, useEffect } from "react"
import VideoCallOutlinedIcon from "@material-ui/icons/VideoCallOutlined"
import { Button } from "react-bootstrap"
import { SaveRounded } from "@material-ui/icons"
import AddOutlinedIcon from "@material-ui/icons/AddOutlined"
import ClearIcon from "@material-ui/icons/Clear"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"
import { toast } from "react-toastify"

function InCallActivities(props) {
  const updateAuthCotntext = useAuthUpdateContext()
  const authContext = useAuthContext()

  const [audioCallActivities, setAudioCallActivities] = useState([
    ...authContext.user.user.relatedUser.callActivity?.audioCall,
  ])
  const [videoCallActivities, setVideoCallActivities] = useState([
    ...authContext.user.user.relatedUser.callActivity?.videoCall,
  ])

  const updateCallActivities = () => {
    fetch("/api/website/profile/update-info-fields", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify([
        {
          field: "callActivity",
          value: {
            audioCall: audioCallActivities,
            videoCall: videoCallActivities,
          },
        },
      ]),
    })
      .then((resp) => resp.json())
      .then(() => {
        const store = JSON.parse(localStorage.getItem("user"))
        store["relatedUser"]["callActivity"]["audioCall"] = audioCallActivities
        store["relatedUser"]["callActivity"]["videoCall"] = videoCallActivities
        localStorage.setItem("user", JSON.stringify(store))

        updateAuthCotntext.setAuthState((prev) => {
          return {
            ...prev,
            user: {
              ...prev.user,
              user: {
                ...store,
              },
            },
          }
        })
      })
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
          <VideoCallOutlinedIcon fontSize="medium" />{" "}
          <span className="tw-pl-1">What You Will Do...</span>
        </div>
        <div className="tw-border-b-[1px] tw-border-white-color tw-py-3">
          <div className="tw-mb-4">
            <p className="tw-mb-3">In Audio Calls</p>
            <div className="tw-max-h-36 tw-overflow-y-auto">
              {audioCallActivities.map((activity, index) => (
                <div className="tw-flex tw-items-center tw-justify-between">
                  <input
                    type="text"
                    value={activity}
                    placeholder="Enter offline status"
                    className="tw-rounded-full tw-flex-grow-0 tw-bg-dark-black tw-border-none tw-outline-none tw-px-4 tw-py-2 tw-w-full tw-mb-2"
                    onChange={(e) =>
                      setAudioCallActivities((prev) => {
                        prev[index] = e.target.value
                        return [...prev]
                      })
                    }
                  />
                  <span className="tw-flex-shrink tw-flex-grow-0 tw-pl-3 tw-cursor-pointer">
                    <ClearIcon
                      className="tw-text-text-black hover:tw-text-white-color tw-transition-colors"
                      onClick={() =>
                        setAudioCallActivities((prev) => {
                          prev.splice(index, 1)
                          return [...prev]
                        })
                      }
                    />
                  </span>
                </div>
              ))}
            </div>
            <div className="tw-flex tw-my-4">
              <Button
                className="tw-rounded-full tw-flex tw-text-sm tw-mr-4"
                variant="outline-secondary"
                onClick={() =>
                  setAudioCallActivities((prev) => {
                    prev.push("")
                    return [...prev]
                  })
                }
              >
                <AddOutlinedIcon fontSize="small" />
                <span className="tw-pl-1 tw-tracking-tight">Add Activity</span>
              </Button>
              <Button
                className="tw-rounded-full tw-flex tw-text-sm"
                variant="success"
                onClick={updateCallActivities}
              >
                <SaveRounded fontSize="small" />
                <span className="tw-pl-1 tw-tracking-tight">Save</span>
              </Button>
            </div>
          </div>
          <div className="tw-mb-4">
            <p className="tw-mb-3">In Video Calls</p>
            <div className="tw-max-h-36 tw-overflow-y-auto">
              {videoCallActivities.map((activity, index) => {
                return (
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <input
                      type="text"
                      value={activity}
                      placeholder="Enter offline status"
                      className="tw-rounded-full tw-bg-dark-black tw-border-none tw-outline-none tw-px-4 tw-py-2 tw-w-full tw-mb-2"
                      onChange={(e) =>
                        setVideoCallActivities((prev) => {
                          prev[index] = e.target.value
                          return [...prev]
                        })
                      }
                    />
                    <span className="tw-flex-shrink tw-flex-grow-0 tw-pl-3 tw-cursor-pointer">
                      <ClearIcon
                        className="tw-text-text-black hover:tw-text-white-color tw-transition-colors"
                        onClick={() =>
                          setVideoCallActivities((prev) => {
                            prev.splice(index, 1)
                            return [...prev]
                          })
                        }
                      />
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="tw-flex tw-my-4">
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-z-[110] tw-mr-4"
                variant="outline-secondary"
                onClick={() =>
                  setVideoCallActivities((prev) => {
                    prev.push("")
                    return [...prev]
                  })
                }
              >
                <AddOutlinedIcon fontSize="small" />
                <span className="tw-pl-1 tw-tracking-tight">Add Activity</span>
              </Button>
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-z-[110]"
                variant="success"
                onClick={updateCallActivities}
              >
                <SaveRounded fontSize="small" />
                <span className="tw-pl-1 tw-tracking-tight">Save</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="tw-mb-4 tw-py-4">
          <p>This status will be shown to when you are Offline</p>
        </div>
      </div>
    </div>
  )
}

export default InCallActivities
