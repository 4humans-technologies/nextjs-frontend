import React, { useState, useEffect, useRef, useCallback } from "react"
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
import { imageDomainURL } from "../../../dreamgirl.config"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit"

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
const callTimer = {
  value: 0,
  timerElement: null,
}
function ViewerScreen(props) {
  const container = useRef()
  const callTimerRef = useRef()

  const ctx = useAuthContext()
  const socketCtx = useSocketContext()
  const updateCtx = useAuthUpdateContext()
  const [callDuration, setCallDuration] = useState("05:46") /* in seconds */

  const {
    modelOfflineData,
    isModelOffline,
    setIsModelOffline,
    setTipMenuActions,
    pendingCallEndRequest,
    setPendingCallEndRequest,
  } = props

  const {
    callOnGoing,
    callType,
    setCallOnGoing,
    setCallType,
    setPendingCallRequest,
    pendingCallRequest,
  } = props

  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    leaveDueToPrivateCall,
    switchViewerToHost,
    leaveAndCloseTracks,
  } = useAgora(client, "audience", props.callType || "")

  const toggleFullscreen = useCallback(() => {
    /* fullscreen logic */
    const palyBackArea = document.getElementById("playback-area")
    if (!document.fullscreenElement) {
      palyBackArea.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  const startCallTimer = useCallback(() => {
    callTimer.timerElement = document.getElementById("call-timer")
    callTimerRef.current = setInterval(() => {
      const totalSeconds = ++callTimer.value
      let newTime
      if (totalSeconds < 3600) {
        newTime = new Date(totalSeconds * 1000).toISOString().substr(14, 5)
      } else {
        newTime = new Date(totalSeconds * 1000).toISOString().substr(11, 8)
      }
      callTimer.timerElement.innerText = newTime
    }, [1000])
  }, [callTimerRef])

  useEffect(() => {
    if (joinState && callOnGoing) {
      return () => {
        clearInterval(callTimerRef.current)
        callTimerRef.current = null
      }
    }
  }, [joinState, callOnGoing])

  useEffect(() => {
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
          })
            .then((res) => res.json())
            .then((data) => {
              join(
                window.location.pathname.split("/").reverse()[0],
                localStorage.getItem("rtcToken"),
                ctx.relatedUserId
              )
              setIsModelOffline(false)
            })
            .catch((err) => alert(err.message))
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
          setIsModelOffline(true)
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

  /* http fetch request for rtc token */
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
                props.setModelProfileData(data.theModel)
                return setIsModelOffline(true)
              }
              setTipMenuActions(data.theModel.tipMenuActions.actions)
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
                props.setModelProfileData(data.theModel)
                return setIsModelOffline(true)
              }
              setTipMenuActions(data.theModel.tipMenuActions.actions)
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

  const offCallListeners = () => {
    const socket = io.getSocket()
    if (!socket.hasListeners("model-call-end-request-init-received")) {
      socket.off("model-call-end-request-init-received")
    }
  }

  const setUpCallListeners = () => {
    const socket = io.getSocket()
    if (!socket.hasListeners("model-call-end-request-init-received")) {
      socket.on("model-call-end-request-init-received", async (data) => {
        /* model has put call end request before you */
        alert("model ended call")
        setCallOnGoing(false)
        setPendingCallEndRequest(true)
        await leaveAndCloseTracks()
        setIsModelOffline(true)
        offCallListeners()
      })
    }

    // if (!socket.hasListeners("model-call-end-request-finished")) {
    //   socket.on("model-call-end-request-finished", (data) => {
    //     /* the after call transaction is now complete, fetch the details of it now */
    //     fetch("", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         callId: sessionStorage.getItem("callId"),
    //         callType: callType,
    //       }),
    //     })
    //       .then((res) => res.json())
    //       .then((data) => {
    //         setIsModelOffline(true)
    //       })
    //       .catch((err) => alert(err.message))
    //   })
    // }
  }

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (!socket.hasListeners("model-call-request-response-received")) {
        socket.on("model-call-request-response-received", async (data) => {
          alert("model response received")
          if (data.response !== "rejected") {
            if (ctx.isLoggedIn && data.relatedUserId === ctx.relatedUserId) {
              /* dont kick of, switch role to host */
              // await leave() /* why leave?? */
              setPendingCallRequest(false)
              setCallOnGoing(true)
              setCallType(data.callType)
              const startCallTimerAfter =
                new Date(data.callStartTs).getTime() - Date.now()
              if (startCallTimerAfter <= 1) {
                /* start instantaneously */
                startCallTimer()
              } else {
                setTimeout(() => {
                  startCallTimer()
                }, startCallTimerAfter)
              }
              sessionStorage.removeItem("callId")
              sessionStorage.setItem("callId", data.callId)
              setUpCallListeners()
              await switchViewerToHost()
            } else {
              /* unsubscribe stream and close connection to agora */
              localStorage.removeItem("rtcToken")
              localStorage.removeItem("rtcTokenExpireIn")
              if (pendingCallRequest) {
                alert(
                  "Model rejected your call request and accepted other viewer's call request, Good luck next time 💘💘"
                )
              } else {
                alert(
                  "Model accepted " +
                    data?.username +
                    " your call Request, streaming will be ended now."
                )
              }
              /* 🔻🔻leave al socket rooms also 🔺🔺 */
              leaveDueToPrivateCall()
              /* also leave all chat channels */
              const socketRooms =
                JSON.parse(sessionStorage.getItem("socket-rooms")) || []
              const roomsToLeave = []
              socketRooms.forEach((room) => {
                if (room.endsWith("-public")) {
                  roomsToLeave.push(room)
                }
              })
              socket.emit(
                "take-me-out-of-these-rooms",
                [...roomsToLeave],
                (response) => {
                  if (response.status === "ok") {
                    updateCtx.updateViewer({ streamRoom: null })
                  }
                }
              )
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

  /* clear timer on component un-mounting */
  useEffect(() => {
    return () => {
      clearInterval(callTimerRef.current)
    }
  }, [])

  /**
   * commented for client presentation only it's working
   */

  // useEffect(() => {
  //   const socket = io.getSocket()
  //   if (socketCtx.setSocketSetupDone) {
  //     if (!socket.hasListeners("model-call-end-request-init-received")) {
  //       socket.off("model-call-end-request-init-received")
  //     }
  //     if (!socket.hasListeners("model-call-end-request-finished")) {
  //       socket.off("model-call-end-request-finished")
  //     }
  //   }
  // }, [socketCtx.setSocketSetupDone])

  /* handle call end */
  const handleCallEnd = async () => {
    if (!callOnGoing && !joinState) {
      return alert("no ongoing call")
    }
    const socket = io.getSocket()
    socket.emit("viewer-call-end-request-init-emitted", {
      action: "viewer-has-requested-call-end",
      room: `${sessionStorage.getItem("streamId")}-public`,
    })
    setCallOnGoing(false)
    setPendingCallEndRequest(true)
    await leaveAndCloseTracks()
    setIsModelOffline(true)
    offCallListeners()
    /* 
    * commented because of client presentation
    *
    * fetch("/api/website/stream/handle-call-end-from-viewer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callId: callId,
        callType: callType,
        endTimeStamp: Date.now(),
        streamId: sessionStorage.getItem("streamId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {})
      .catch((err) => alert(err.message))
    * 
    */

    /**
     * 1. close agora streaming first
     * 2. http request to the server with call end Timestamp
     * 3. show call end page/summary modal
     */
  }

  return (
    <div
      className={
        isModelOffline
          ? "tw-absolute tw-top-0 tw-bottom-0 tw-w-full tw-z-10 tw-flex tw-items-center tw-justify-center"
          : "tw-absolute tw-top-0 tw-bottom-0 tw-w-full tw-z-10"
      }
      ref={container}
      id="playback-area"
    >
      {callOnGoing && (
        <div className="tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-top-3 tw-flex tw-justify-around tw-items-center tw-rounded tw-px-4 tw-py-2 tw-bg-[rgba(22,22,22,0.35)] tw-z-[390] tw-backdrop-blur">
          <p id="call-timer" className="tw-text-center text-white">
            00:00
          </p>
        </div>
      )}

      {/* viewing streaming | call not ongoing */}
      {!callOnGoing && remoteUsers?.length > 0 ? (
        <VideoPlayer
          videoTrack={remoteUsers[0]?.videoTrack}
          audioTrack={remoteUsers[0].audioTrack} //error of session storage is going
          playAudio={true}
        />
      ) : null}

      {/* on "any-call" with model */}
      {callOnGoing && remoteUsers?.length > 0 ? (
        <VideoPlayer
          videoTrack={remoteUsers[0]?.videoTrack}
          audioTrack={remoteUsers[0].audioTrack} //error of session storage is going
          playAudio={true}
        />
      ) : null}

      {/* on audioCall with model */}
      {callOnGoing && callType === "audioCall" && remoteUsers?.length ? (
        <div className="tw-border-8 tw-border-red-200 tw-rounded-full tw-translate-y-[-24px]">
          <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-300 tw-rounded-full">
            <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-400 tw-rounded-full">
              <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-500 tw-rounded-full">
                <img
                  src={imageDomainURL + modelOfflineData.profileImage}
                  alt=""
                  className="tw-h-[100px] tw-w-[100px] md:tw-h-[150px] md:tw-w-[150px] lg:tw-h-[230px] lg:tw-w-[230px] tw-object-cover tw-rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/*  */}

      {/* not streaming && not on call | model circles | offline mode*/}
      {isModelOffline && !callOnGoing ? (
        <div className="tw-text-sm tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-top-4 md:tw-top-10 tw-px-4 tw-py-2 tw-rounded tw-bg-[rgba(70,70,70,0.1)]">
          <p className="tw-text-white-color tw-font-medium tw-text-center">
            The model is currently offline 😞😞
          </p>
        </div>
      ) : null}

      {/* not streaming && not on call | model circles | offline mode*/}
      {/* model image */}
      {isModelOffline && (
        <div className="tw-border-8 tw-border-red-200 tw-rounded-full tw-translate-y-[-24px]">
          <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-300 tw-rounded-full">
            <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-400 tw-rounded-full">
              <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-500 tw-rounded-full">
                <img
                  src={imageDomainURL + modelOfflineData.profileImage}
                  alt=""
                  className="tw-h-[120px] tw-w-[120px] md:tw-h-[180px] md:tw-w-[180px] lg:tw-h-[230px] lg:tw-w-[230px] tw-object-cover tw-rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* not streaming && not on call | model circles | offline mode*/}
      {/* model offline status */}
      {isModelOffline && !callOnGoing ? (
        <div className="tw-text-sm tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-bottom-4 md:tw-bottom-20 tw-backdrop-blur tw-px-4 tw-py-2 tw-rounded tw-bg-[rgba(255,255,255,0.1)]">
          <p className="tw-text-white-color tw-font-medium tw-text-center tw-capitalize">
            {modelOfflineData.offlineStatus}
          </p>
        </div>
      ) : null}

      {/* on call local preview */}
      {callOnGoing && callType === "videoCall" ? (
        <div
          id="self-video-container"
          className="tw-absolute tw-left-4 tw-bottom-1 tw-w-3/12 tw-h-24 md:tw-w-1/5 md:tw-h-32  lg:tw-w-1/6 lg:tw-h-36 tw-rounded tw-z-[390] tw-border tw-border-dreamgirl-red"
        >
          <div id="self-video" class="tw-relative tw-w-full tw-h-full">
            <VideoPlayer
              videoTrack={localVideoTrack}
              audioTrack={localAudioTrack}
              playAudio={false}
            />
          </div>
        </div>
      ) : null}

      {/* On call controls */}
      {callOnGoing && !isModelOffline && (
        <div className="tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-bottom-3 tw-flex tw-justify-around tw-items-center tw-rounded tw-px-4 tw-py-2 tw-bg-[rgba(255,255,255,0.1)] tw-z-[390] tw-backdrop-blur">
          <button className="tw-inline-block tw-mx-2 tw-z-[390]">
            <VolumeUpIcon fontSize="medium" style={{ color: "white" }} />
          </button>
          <button
            className="tw-inline-block tw-mx-2 tw-z-[390]"
            onClick={() => handleCallEnd()}
          >
            <CallEndIcon fontSize="medium" style={{ color: "red" }} />
          </button>
          <button className="tw-inline-block tw-mx-2 tw-z-[390]">
            <MicOffIcon fontSize="medium" style={{ color: "white" }} />
          </button>
          <button
            className="tw-inline-block tw-mx-2 tw-z-[390]"
            onClick={toggleFullscreen}
          >
            {document.fullscreenElement ? (
              <FullscreenExitIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
            ) : (
              <FullscreenIcon fontSize="medium" style={{ color: "white" }} />
            )}
          </button>
        </div>
      )}
      {!callOnGoing && !isModelOffline && remoteUsers?.length > 0 && (
        <div className="tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-bottom-3 tw-flex tw-justify-around tw-items-center tw-rounded tw-px-4 tw-py-2 tw-bg-[rgba(255,255,255,0.1)] tw-z-[390] tw-backdrop-blur">
          <button className="tw-inline-block tw-mx-2 tw-z-[390]">
            <MicOffIcon fontSize="medium" style={{ color: "white" }} />
          </button>
          <button
            className="tw-inline-block tw-mx-2 tw-z-[390]"
            onClick={toggleFullscreen}
          >
            {document.fullscreenElement ? (
              <FullscreenExitIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
            ) : (
              <FullscreenIcon fontSize="medium" style={{ color: "white" }} />
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ViewerScreen
