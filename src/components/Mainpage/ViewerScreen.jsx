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
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit"
import useSpinnerContext from "../../app/Loading/SpinnerContext"
import useModalContext from "../../app/ModalContext"
import CallEndDetails from "../Call/CallEndDetails"
import MicIcon from "@material-ui/icons/Mic"

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

  const ctx = useAuthContext()
  const socketCtx = useSocketContext()
  const updateCtx = useAuthUpdateContext()
  const spinnerCtx = useSpinnerContext()
  const modalCtx = useModalContext()

  const [callEndDetails, setCallEndDetails] = useState(null)
  const [othersCall, setOthersCall] = useState({
    rejectedMyCall: null,
    acceptedOthersCall: null,
    othersUsername: null,
  })

  const {
    modelProfileData,
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

  const toggleMuteMic = () => {
    if (localAudioTrack.muted) {
      /* un mute audio */
      localAudioTrack.setMuted(false)
    } else {
      /* mute the audio */
      localAudioTrack.setMuted(true)
    }
  }

  const toggleFullscreen = useCallback(() => {
    /* fullscreen logic */
    const palyBackArea = document.getElementById("playback-area")
    if (!document.fullscreenElement) {
      palyBackArea.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

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
              if (data.actionStatus === "success") {
                join(
                  window.location.pathname.split("/").reverse()[0],
                  localStorage.getItem("rtcToken"),
                  ctx.relatedUserId
                )
                props.setIsChatPlanActive(data.isChatPlanActive)
                setIsModelOffline(false)
              } else {
                props.setIsChatPlanActive(data.isChatPlanActive)
                setIsModelOffline(true)
              }
            })
            .catch((err) => {
              alert(err.message)
            })
        })
      }

      /* __  __ */
      if (socket.hasListeners("new-model-started-stream")) {
        return () => {
          socket.off("new-model-started-stream")
        }
      }
    }
  }, [ctx.isLoggedIn])

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
              socketRooms.filter((room) => !room.endsWith("-public"))
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
  }, [setCallOnGoing])

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
    if (
      socketCtx.setSocketSetupDone &&
      !tokenRequestDoneOnce &&
      ctx.loadedFromLocalStorage
    ) {
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
              props.setModelProfileData(data.theModel)
              props.setIsChatPlanActive(data.isChatPlanActive)
              if (data?.message === "model not streaming") {
                return setIsModelOffline(true)
              } else {
                setIsModelOffline(false)
              }
              setTipMenuActions(data.theModel.tipMenuActions.actions)
              token = data.rtcToken
              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)
              console.log("model profile 👉👉 ", data.theModel)
              props.setIsChatPlanActive(data.isChatPlanActive)
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
              props.setModelProfileData(data.theModel)
              props.setIsChatPlanActive(data.isChatPlanActive)
              if (data?.message === "model not streaming") {
                return setIsModelOffline(true)
              } else {
                setIsModelOffline(false)
              }
              setTipMenuActions(data.theModel.tipMenuActions.actions)
              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)
              console.log("model profile 👉👉 ", data.theModel)
              props.setIsChatPlanActive(data.isChatPlanActive)
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
    socketCtx.setSocketSetupDone,
    tokenRequestDoneOnce,
    ctx.loadedFromLocalStorage,
  ])

  const offCallListeners = useCallback(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (socket.hasListeners("model-call-end-request-init-received")) {
        socket.off("model-call-end-request-init-received")
      }
      if (socket.hasListeners("model-call-end-request-finished")) {
        socket.off("model-call-end-request-finished")
      }
    }
  }, [socketCtx.socketSetupDone])

  const setUpCallListeners = useCallback(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      /* model has put call end request before you */
      if (!socket.hasListeners("model-call-end-request-init-received")) {
        socket.on("model-call-end-request-init-received", (data) => {
          // alert("model ended call")
          setPendingCallEndRequest(true)
          spinnerCtx.setShowSpinner(true, "Processing transaction...")
          /**
           * now show spinner and wait for call-end-request-finished
           * do a fetch request in that listener nad fetch the call end details/metrics
           * then show the call metric/details page/modal
           */
        })
      }

      /* the, after call transaction is now complete, fetch the details of it now */
      if (!socket.hasListeners("model-call-end-request-finished")) {
        socket.on("model-call-end-request-finished", async (data) => {
          if (data.ended === "ok") {
            sessionStorage.setItem("callEndDetails", JSON.stringify(data))
            spinnerCtx.setShowSpinner(false, "Please wait...")
            // modalCtx.showModalWithContent(
            //   <CallEndDetails
            //     dateTime={data.dateTime}
            //     viewerName={data.name}
            //     totalCharges={data.totalCharges}
            //     currentWalletAmount={data.currentAmount}
            //     callType={data.callType}
            //     callDuration={data.callDuration}
            //     theCall={data.theCall}
            //     totalCharges={data.totalCharges}
            //     userType="Viewer"
            //   />
            // )
          }
          // setCallEndDetails(data.callEndDetails)
          setPendingCallEndRequest(false)
          setCallOnGoing(false)
          await leaveAndCloseTracks()
          setIsModelOffline(true)
          offCallListeners()
        })
      }
    }
  }, [socketCtx.socketSetupDone, offCallListeners])

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (!socket.hasListeners("model-call-request-response-received")) {
        socket.on("model-call-request-response-received", async (data) => {
          // alert("model response received")
          socket.emit("add-oncall-status-on-viewer-socket-client", {
            callId: data.callId,
          })
          if (data.response !== "rejected") {
            if (ctx.isLoggedIn && data.relatedUserId === ctx.relatedUserId) {
              /* dont kick of, switch role to host */
              setPendingCallRequest(false)
              setCallOnGoing(true)
              setCallType(data.callType)
              sessionStorage.removeItem("callId")
              sessionStorage.setItem("callId", data.callId)
              setUpCallListeners()
              await switchViewerToHost()
            } else {
              /* unsubscribe stream and close connection to agora */
              localStorage.removeItem("rtcToken")
              localStorage.removeItem("rtcTokenExpireIn")

              if (pendingCallRequest) {
                setOthersCall({
                  acceptedOthersCall: true,
                  othersUsername: data.username,
                  rejectedMyCall: true,
                })
                setPendingCallRequest(false)
              } else {
                setOthersCall({
                  acceptedOthersCall: true,
                  othersUsername: data.username,
                  rejectedMyCall: false,
                })
                setPendingCallRequest(false)
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
            setPendingCallRequest(false)
            // setCallOnGoing(false)
          }
        })
      }
    }
  }, [
    ctx.relatedUserId,
    socketCtx.setSocketSetupDone,
    switchViewerToHost,
    setUpCallListeners,
  ])

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
    if (pendingCallEndRequest) {
      return alert(
        "Your call end request is processing please have patience.... 🙏🎵🎵"
      )
    }

    if (!callOnGoing && !joinState) {
      return alert("no ongoing call")
    }

    const socket = io.getSocket()

    /* inform model viewer has already put call end request, and end the call there also */
    socket.emit("viewer-call-end-request-init-emitted", {
      action: "viewer-has-requested-call-end",
      room: `${sessionStorage.getItem("streamId")}-public`,
    })

    /* show spinner */
    spinnerCtx.setShowSpinner(true, "Processing transaction...")
    setPendingCallEndRequest(true)

    //  commented because of client presentation
    fetch("/api/website/stream/handle-call-end-from-viewer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callId: sessionStorage.getItem("callId"),
        callType: callType,
        endTimeStamp: Date.now(),
        streamId: sessionStorage.getItem("streamId"),
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.wasFirst === "yes") {
          // spinnerCtx.setShowSpinner(false, "Please wait...")
          sessionStorage.setItem("callEndDetails", JSON.stringify(data))
          // modalCtx.showModalWithContent(
          //   <CallEndDetails
          //     dateTime={data.dateTime}
          //     viewerName={data.name}
          //     totalCharges={data.totalCharges}
          //     currentWalletAmount={data.currentAmount}
          //     callType={data.callType}
          //     callDuration={data.callDuration}
          //     theCall={data.theCall}
          //     totalCharges={data.totalCharges}
          //     userType="Viewer"
          //   />
          // )
        }
        setPendingCallEndRequest(false)
        setCallOnGoing(false)
        setIsModelOffline(true)
        offCallListeners()
        await leaveAndCloseTracks()
      })
      .catch((err) => alert(err.message))

    /**
     * 1. close agora streaming first
     * 2. http request to the server with call end Timestamp
     * 3. show call end page/summary modal
     */
  }

  return (
    <div
      className={
        isModelOffline || (callOnGoing && callType === "audioCall")
          ? "tw-absolute tw-top-0 tw-bottom-0 tw-w-full tw-z-10 tw-flex tw-items-center tw-justify-center"
          : "tw-absolute tw-top-0 tw-bottom-0 tw-w-full tw-z-10"
      }
      ref={container}
      id="playback-area"
    >
      {callOnGoing && callType === "videoCall" && (
        <div className="tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-top-3 tw-flex tw-justify-around tw-items-center tw-rounded tw-px-4 tw-py-2 tw-bg-[rgba(22,22,22,0.35)] tw-z-[390] tw-backdrop-blur">
          <p id="call-timer" className="tw-text-center text-white">
            LIVE
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
      {callOnGoing &&
      callType &&
      !isModelOffline &&
      remoteUsers?.length === 1 ? (
        <VideoPlayer
          videoTrack={
            callType === "videoCall" ? remoteUsers[0]?.videoTrack : null
          }
          audioTrack={remoteUsers[0].audioTrack} //error of session storage is going
          playAudio={true}
        />
      ) : null}

      {/* on audioCall with model */}
      {callOnGoing &&
      callType === "audioCall" &&
      !isModelOffline &&
      remoteUsers?.length > 0 ? (
        <div className="tw-border-8 tw-border-red-200 tw-rounded-full tw-translate-y-[-24px]">
          <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-300 tw-rounded-full">
            <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-400 tw-rounded-full">
              <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-500 tw-rounded-full">
                <img
                  src={modelProfileData.profileImage}
                  alt=""
                  className="tw-h-[120px] tw-w-[120px] md:tw-h-[180px] md:tw-w-[180px] lg:tw-h-[230px] lg:tw-w-[230px] tw-object-cover tw-rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/*  */}

      {/* not streaming && not on call | model circles | offline mode*/}
      {isModelOffline && modelProfileData && !joinState && !callOnGoing ? (
        <div className="tw-text-sm tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-top-4 md:tw-top-10 tw-px-4 tw-py-2 tw-rounded tw-bg-[rgba(70,70,70,0.1)]">
          <p className="tw-text-white-color tw-font-medium tw-text-center">
            The model is currently offline 😞😞
          </p>
        </div>
      ) : null}

      {callOnGoing && callType === "audioCall" ? (
        <div className="tw-text-sm tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-top-4 md:tw-top-10 tw-px-4 tw-py-2 tw-rounded tw-bg-[rgba(112,112,112,0.25)]">
          <p className="tw-text-white-color tw-font-medium tw-text-center">
            AudioCall With Model
          </p>
        </div>
      ) : null}

      {/* not streaming && not on call | model circles | offline mode*/}
      {/* model image */}

      {isModelOffline && modelProfileData && !joinState && !callOnGoing && (
        <div className="tw-border-8 tw-border-red-200 tw-rounded-full tw-translate-y-[-24px]">
          <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-300 tw-rounded-full">
            <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-400 tw-rounded-full">
              <div className="tw-w-full tw-h-full tw-border-8 tw-border-red-500 tw-rounded-full">
                <img
                  src={modelProfileData.profileImage}
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
      {isModelOffline && modelProfileData && !joinState && !callOnGoing ? (
        <div className="tw-text-sm tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-bottom-4 md:tw-bottom-20 tw-backdrop-blur tw-px-4 tw-py-2 tw-rounded tw-bg-[rgba(255,255,255,0.1)]">
          <p className="tw-text-white-color tw-font-medium tw-text-center tw-capitalize">
            {modelProfileData.offlineStatus}
          </p>
        </div>
      ) : null}

      {/* on call local preview */}
      {callOnGoing && callType === "videoCall" && joinState ? (
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
          {localAudioTrack && (
            <button className="tw-inline-block tw-z-[390] tw-px-2">
              {localAudioTrack.muted ? (
                <MicIcon
                  fontSize="medium"
                  style={{ color: "white" }}
                  onClick={toggleMuteMic}
                />
              ) : (
                <MicOffIcon
                  fontSize="medium"
                  style={{ color: "white" }}
                  onClick={toggleMuteMic}
                />
              )}
            </button>
          )}
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
      {!callOnGoing && joinState ? (
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
      ) : null}
    </div>
  )
}

export default ViewerScreen
