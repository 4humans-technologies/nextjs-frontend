import React, { useState, useEffect, useRef, createRef } from "react"
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
import { nanoid } from "nanoid"
import { Speaker, Cancel, VolumeMute } from "@material-ui/icons"
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
import CallEndIcon from "@material-ui/icons/CallEnd"
import MicOffIcon from "@material-ui/icons/MicOff"
import Draggable from "react-draggable"
import io from "../../socket/socket"

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
const unAuthedUserEmojis = [
  "🎈",
  "✨",
  "🎉",
  "🎃",
  "🎁",
  "👓",
  "👔",
  "🎨",
  "⚽",
  "💎",
  "🥇",
  "♥",
  "🎵",
  "🧲",
  "💰",
  "🍺",
  "🥂",
  "🍎",
  "🌼",
  "🚩",
  "🌞",
  "🌈",
  "⚡",
  "🐬",
  "🦄",
]
let modelEndedStreamOnce = false
let streamId
function ViewerScreen(props) {
  const container = useRef()

  const ctx = useAuthContext()
  const socketCtx = useSocketContext()
  const updateCtx = useAuthUpdateContext()
  const [callDuration, setCallDuration] = useState("05:46") /* in seconds */
  const [isModelOffline, setIsModelOffline] = useState(false)

  const {
    callOnGoing,
    callType,
    setCallOnGoing,
    setCallType,
    setPendingCallRequest,
  } = props

  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    changeClientRole,
    leaveDueToPrivateCall,
    switchViewerToHost,
  } = useAgora(client, "audience", props.callType || "")

  useEffect(() => {
    /* rejoin chat channels when model starts streaming */
    // if (modelEndedStreamOnce) {
    //   const socketRooms = JSON.parse(sessionStorage.getItem("socket-rooms"))
    //   if (socketRooms?.length === 0) {
    //     if (joinState && remoteUsers?.length > 0) {
    //       fetch("/api/website/stream/re-join-models-currentstream")
    //         .then((res) => res.json())
    //         .catch((err) => alert(err.message))
    //     }
    //   }
    // }
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (!socket.hasListeners("new-model-started-stream")) {
        socket.on("new-model-started-stream", (data) => {
          if (
            data.modelId !== window.location.pathname.split("/").reverse()[0]
          ) {
            return
          }
          if (!localStorage.getItem("rtcToken")) {
            return window.location.reload()
          }
          let url
          if (ctx.isLoggedIn) {
            url = "/api/website/stream/re-join-models-currentstream-authed"
          } else {
            url = "/api/website/stream/re-join-models-currentstream-unauthed"
          }
          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              modelId: window.location.pathname.split("/").reverse()[0],
            }),
          }).catch((err) => alert(err.message))
        })
      }

      /* __  __ */
      if (socket.hasListeners("new-model-started-stream")) {
        return () => {
          socket.off("new-model-started-stream")
        }
      }
    }
  }, [ctx.isLoggedIn, io.getSocket()])

  useEffect(() => {
    /* listen for stream end events */
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (!socket.hasListeners("delete-stream-room")) {
        socket.on("delete-stream-room", (data) => {
          if (
            data.modelId !== window.location.pathname.split("/").reverse()[0]
          ) {
            return
          }
          setCallOnGoing(false)
          setPendingCallRequest(false)
          const socketRooms =
            JSON.parse(sessionStorage.getItem("socket-rooms")) || []
          sessionStorage.setItem(
            "socket-rooms",
            JSON.stringify(
              socketRooms.filter(
                (room) => room.endsWith("-public") || room.endsWith("-private")
              )
            )
          )
        })
      }
      return () => {
        if (socket.hasListeners("delete-stream-room")) {
          socket.off("delete-stream-room")
        }
      }
    }
  }, [io.getSocket(), setCallOnGoing])

  useEffect(() => {
    //debugger
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
    //debugger
    if (socketCtx.isConnected && !tokenRequestDoneOnce) {
      /* on first load fetch rtcToken and join */
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
              if (data?.message === "model not streaming") {
                return setIsModelOffline(true)
              }
              token = data.rtcToken
              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)
              console.log("model profile 👉👉 ", data.theModel)
              props.setIsChatPlanActive(data.isChatPlanActive)
              props.setModelProfileData(data.theModel)
              const channel = window.location.pathname.split("/").reverse()[0]
              join(channel, data.rtcToken, ctx.relatedUserId)
              sessionStorage.setItem("streamId", data.streamId)
              updateCtx.updateViewer({
                rtcToken: data.rtcToken,
                streamRoom: `${data.streamId}-public`,
              })
            })
        } else {
          /* get token  from local storage */
          const channel = window.location.pathname.split("/").reverse()[0]
          join(channel, localStorage.getItem("rtcToken"), ctx.relatedUserId)
        }
      } else {
        if (!localStorage.getItem("unAuthed-user-chat-name")) {
          localStorage.setItem(
            "unAuthed-user-chat-name",
            `Guest User - ${nanoid(6)} ${
              unAuthedUserEmojis[Math.floor((Math.random() * 100) % 25)]
            }`
          )
        }
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
              //debugger
              if (data?.message === "model not streaming") {
                return setIsModelOffline(true)
              }
              /* 🤩🤩🔥🔥 join stream */
              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)
              console.log("model profile 👉👉 ", data.theModel)
              props.setIsChatPlanActive(data.isChatPlanActive)
              props.setModelProfileData(data.theModel)
              const channel = window.location.pathname.split("/").reverse()[0]
              sessionStorage.setItem("streamId", data.streamId)
              join(channel, data.rtcToken, data.unAuthedUserId)
              if (data.newUnAuthedUserCreated) {
                /* if new viewer was created save the _id in localstorage */
                localStorage.setItem("unAuthedUserId", data.unAuthedUserId)
                updateCtx.updateViewer({
                  unAuthedUserId: data.unAuthedUserId,
                  rtcToken: data.rtcToken,
                  streamRoom: `${data.streamId}-public`,
                })
              } else {
                updateCtx.updateViewer({
                  rtcToken: data.rtcToken,
                  streamRoom: `${data.streamId}-public`,
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

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      debugger
      const socket = io.getSocket()
      if (!socket.hasListeners("model-call-request-response-received")) {
        socket.on("model-call-request-response-received", async (data) => {
          debugger
          alert("model response received")
          if (data.response !== "rejected") {
            if (ctx.isLoggedIn && data.relatedUserId === ctx.relatedUserId) {
              /* dont kick of, switch role to host */
              // await leave() /* why leave?? */
              setPendingCallRequest(false)
              setCallOnGoing(true)
              setCallType(data.callType)
              data.callStartTs /* 👈👈 */
              const [selfAudioFeed, selfVideoFeed] = await switchViewerToHost(
                "sd",
                ["self-video-container", "self-video"]
              )
              const selfVideo = document.getElementById("self-video-container")
              selfVideoFeed.play(selfVideo)
              // selfVideoFeed.play("self-video-container")
              // selfVideoFeed.play("self-video")
            } else {
              /* unsubscribe stream and close connection to agora */
              localStorage.removeItem("rtcToken")
              localStorage.removeItem("rtcTokenExpireIn")
              alert(
                "Model accepted " +
                  data?.username +
                  " your call Request, streaming will be ended now"
              )
              /* 🔻🔻leave al socket rooms also 🔺🔺 */
              leaveDueToPrivateCall()
            }
          } else {
            /* clear call type and pending call */
            alert("Model rejected your call Request")
            setPendingCallRequest(false)
            setCallOnGoing(false)
            alert("Model rejected call request!")
          }
        })
      }
    }
  }, [ctx.relatedUserId, socketCtx.setSocketSetupDone, switchViewerToHost])

  /* dev useEffect */

  // useEffect(async () => {
  //   if (callOnGoing && callType) {
  //     const [selfAudioFeed, selfVideoFeed] = await switchViewerToHost("sd", [
  //       "self-video-container",
  //       "self-video",
  //     ])
  //     const selfVideo = document.getElementById("self-video-container")
  //     selfVideoFeed.play(selfVideo)
  //   }
  // }, [])

  return (
    // 82 vh has no signifcate impact
    /* the left part of the screen 👇👇 */
    <div
      className="tw-absolute tw-top-0 tw-bottom-0 tw-w-full tw-z-10"
      ref={container}
    >
      {remoteUsers.length &&
        [remoteUsers[0]].map((user) => {
          return (
            <div
              className={
                "tw-min-h-full tw-w-full tw-relative tw-bg-green-color" +
                (callOnGoing
                  ? " tw-z-[300] tw-pointer-events-none"
                  : " tw-z-[20] tw-pointer-events-none")
              }
            >
              <div className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0">
                <div
                  className={
                    "tw-min-h-full tw-relative tw-min-w-[100vw] md:tw-min-w-[50vw]" +
                    (callOnGoing
                      ? " tw-z-[310] tw-pointer-events-none"
                      : " tw-z-[20] tw-pointer-events-none")
                  }
                >
                  <VideoPlayer
                    key={user.uid}
                    videoTrack={user.videoTrack}
                    audioTrack={user.audioTrack} //error of seesion storage is going
                    playAudio={true}
                  />
                  {callOnGoing && (
                    /* controls layer */
                    <div className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-grid tw-place-items-center tw-z-[390]">
                      <div className="tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-top-3 tw-flex tw-justify-around tw-items-center tw-rounded tw-px-4 tw-py-2 tw-bg-[rgba(22,22,22,0.35)] tw-z-[391] tw-backdrop-blur">
                        <p className="tw-text-center text-white">
                          {callDuration}
                        </p>
                      </div>

                      {callType === "audioCall" ? (
                        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-content-between">
                          <div className="">{/* timer */}</div>
                          <div className="">{/* model image */}</div>
                          <div className="">{/* call controls */}</div>
                        </div>
                      ) : (
                        <div
                          id="self-video-container"
                          className="tw-absolute tw-left-4 tw-bottom-1 tw-w-3/12 tw-h-24 md:tw-w-1/5 md:tw-h-32  lg:tw-w-1/6 lg:tw-h-36 tw-rounded tw-z-[390] tw-border tw-border-dreamgirl-red"
                        >
                          <div id="self-video"></div>
                        </div>
                      )}
                      {/* <div className="tw-absolute tw-bottom-0 tw-h-6 tw-bg-dark-black tw-left-0 tw-right-0 tw-z-0"></div> */}
                      <div className="tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-bottom-4 tw-flex tw-justify-around tw-items-center tw-rounded tw-px-4 tw-py-2 tw-bg-[rgba(255,255,255,0.1)] tw-z-[391] tw-backdrop-blur">
                        <button className="tw-inline-block tw-mx-2 tw-z-[390] tw-relative">
                          <VolumeUpIcon
                            fontSize="medium"
                            style={{ color: "white" }}
                          />
                        </button>
                        <button className="tw-inline-block tw-mx-2 tw-z-[390] tw-relative">
                          <CallEndIcon
                            fontSize="medium"
                            style={{ color: "red" }}
                          />
                        </button>
                        <button className="tw-inline-block tw-mx-2 tw-z-[390] tw-relative">
                          <MicOffIcon
                            fontSize="medium"
                            style={{ color: "white" }}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default ViewerScreen
