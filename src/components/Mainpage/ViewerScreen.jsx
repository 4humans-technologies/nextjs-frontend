import React, { useState, useEffect, useRef } from "react"
import AgoraRTC from "agora-rtc-sdk-ng"
import { Button } from "react-bootstrap"
import MediaPlayer from "../UI/MediaPlayer"
import VideoPlayer from "../UI/VideoPlayer"
import FavoriteIcon from "@material-ui/icons/Favorite"
import useAgora from "../../hooks/useAgora"
import { useRouter } from "next/router"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import { useSocketContext } from "../../app/socket/SocketContext"
import Slider from "@material-ui/core/Slider"
import VolumeUpIcon from "@material-ui/icons/VolumeUp"

// Slide to show the things
function valuetext(value) {
  return `${value}°C`
}

/**
 * If this screen is being mounted then it is understood by default that,
 * role will of be viewer.
 */
const clientOptions = { codec: "h264", mode: "live" }
let client = AgoraRTC.createClient(clientOptions)
client.setClientRole("audience")

/**
 * APPID can in feature be dynamic also
 */
let token
let tokenRequestDoneOnce = false
function Videocall(props) {
  const [value, setValue] = React.useState(30)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const container = useRef()
  const ctx = useAuthContext()
  const socketCtx = useSocketContext()
  const updateCtx = useAuthUpdateContext()
  const { joinState, leave, join, remoteUsers } = useAgora(
    client,
    "audience",
    props.callType || ""
  )

  useEffect(() => {
    debugger
    if (ctx.loadedFromLocalStorage) {
      return () => {
        tokenRequestDoneOnce = false
        localStorage.removeItem("rtcToken")
        localStorage.removeItem("rtcTokenExpireIn")
        leave()
      }
    }
  }, [])

  useEffect(() => {
    debugger
    if (socketCtx.isConnected && !tokenRequestDoneOnce) {
      tokenRequestDoneOnce = true
      if (ctx.isLoggedIn === true) {
        /**
         * if logged in then fetch RTC token as loggedIn user
         */
        if (
          !localStorage.getItem("rtcToken") &&
          +localStorage.getItem("rtcTokenExpireIn") < Date.now()
        ) {
          /* make new request as their is no token or expired token */
          fetch("/api/website/token-builder/authed-viewer-join-stream", {
            method: "POST",
            cors: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              modelId: window.location.pathname.split("/").reverse()[0],
            }),
          })
            .then((resp) => resp.json())
            .then((data) => {
              token = data.rtcToken
              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)
              const channel = window.location.pathname.split("/").reverse()[0]
              join(channel, data.rtcToken, ctx.relatedUserId)
              updateCtx.updateViewer({
                rtcToken: data.rtcToken,
                streamRoom: data.streamRoom,
              })
            })
        } else {
          /* get token  from local storage */
          const channel = window.location.pathname.split("/").reverse()[0]
          join(channel, localStorage.getItem("rtcToken"), ctx.relatedUserId)
        }
      } else {
        if (
          !localStorage.getItem("rtcToken") &&
          localStorage.getItem("rtcTokenExpireIn") < Date.now()
        ) {
          /**
           * fetch RTC token as a un-authenticated user
           */
          const payload = {
            /* which models's stream to join */
            modelId: window.location.pathname.split("/").reverse()[0],
          }
          fetch("/api/website/token-builder/unauthed-viewer-join-stream", {
            method: "POST",
            cors: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
            .then((resp) => resp.json())
            .then((data) => {
              debugger
              /* 🤩🤩🔥🔥 join stream */
              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)
              const channel = window.location.pathname.split("/").reverse()[0]
              join(channel, data.rtcToken, data.unAuthedUserId)
              if (data.newUnAuthedUserCreated) {
                /* if new viewer was created save the _id in localstorage */
                localStorage.setItem("unAuthedUserId", data.unAuthedUserId)
                updateCtx.updateViewer({
                  unAuthedUserId: data.unAuthedUserId,
                  rtcToken: data.rtcToken,
                  streamRoom: data.streamRoom,
                })
              } else {
                updateCtx.updateViewer({
                  rtcToken: data.rtcToken,
                  streamRoom: data.streamRoom,
                })
              }
            })
            .catch((err) => alert(err.message))
        } else {
          const channel = window.location.pathname.split("/").reverse()[0]
          join(
            channel,
            localStorage.getItem("rtcToken"),
            localStorage.getItem("unAuthedUserId")
          )
        }
      }
    }
  }, [
    ctx.isLoggedIn,
    ctx.relatedUserId,
    window.location.pathname,
    socketCtx.isConnected,
    tokenRequestDoneOnce,
  ])

  return (
    <div className="sm:tw-h-[82vh] " ref={container}>
      {token && (
        <div className="tw-flex tw-py-2 tw-justify-between tw-items-center">
          <Button variant="primary" onClick={join}>
            Join
          </Button>
          <Button variant="danger" onClick={leave}>
            Leave
          </Button>
        </div>
      )}
      {remoteUsers.length > 0 &&
        remoteUsers.map((user) => {
          return (
            <div>
              <VideoPlayer
                className="tw-w-[50vh]"
                key={user.uid}
                videoTrack={user.videoTrack}
                audioTrack={user.audioTrack} //error of seesion storage is going
                playAudio={true}
              />
              {/* volume increase decrease */}
              <div className="tw-w-32 tw-absolute tw-z-20 tw-flex tw-mt-[-32px]">
                <VolumeUpIcon className="tw-text-white" fontSize="large" />
                <Slider
                  defaultValue={30}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={10}
                  max={100}
                  className="tw-self-center tw-ml-2"
                />
              </div>
              {/*  */}
            </div>
          )
        })}
    </div>
  )
}

export default Videocall
