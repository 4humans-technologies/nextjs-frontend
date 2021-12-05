import React, { useState, useEffect, useRef, useCallback } from "react"
import AgoraRTC from "agora-rtc-sdk-ng"
import VideoPlayer from "../UI/VideoPlayer"
import useAgora from "../../hooks/useAgora"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import { useSocketContext } from "../../app/socket/SocketContext"
import { nanoid } from "nanoid"
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
import CallEndIcon from "@material-ui/icons/CallEnd"
import MicOffIcon from "@material-ui/icons/MicOff"
import io from "../../socket/socket"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit"
import useSpinnerContext from "../../app/Loading/SpinnerContext"
import useModalContext from "../../app/ModalContext"
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
  const isLiveNowRef = useRef("not-init")

  const [callEndDetails, setCallEndDetails] = useState(null)
  const [othersCall, setOthersCall] = useState({
    rejectedMyCall: false,
    acceptedOthersCall: false,
    otherUserData: {
      username: "",
      profileImage: "",
    },
  })

  const [isMuted, setIsMuted] = useState(false)

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
  } = useAgora(client, "audience", "videoCall")

  useEffect(() => {
    const tellIfLive = () => {
      if (isModelOffline || remoteUsers?.length === 0) {
        /* not live */
        return false
      } else {
        if (!joinState) {
          /* not live| iff isModelNotOffline && !joined */
          return false
        } else {
          /* live| iff isModelNotOffline && joinState */
          return true
        }
      }
    }
    isLiveNowRef.current = tellIfLive()
  }, [joinState, isModelOffline, remoteUsers])

  /* keep checking the rooms */
  useEffect(() => {
    const socket = io.getSocket()
    let joinAttempts = 0
    let joinRooms = []
    const myKeepInRoomLoop = setInterval(() => {
      /* can use this in here 😁😁😁 */
      /* socket.connected */
      if (joinAttempts > 5) {
        return console.log("more than five attempts")
      }

      /* if live then only check for rooms bro */
      if (isLiveNowRef.current) {
        console.log("Live and checking")
        const socketRooms =
          JSON.parse(sessionStorage.getItem("socket-rooms")) || []
        const myStreamId = sessionStorage.getItem("streamId")
        const myRelatedUserId = localStorage.getItem("relatedUserId")
        if (myRelatedUserId) {
          /* if logged in, check for both is private and public room */
          if (
            !socketRooms.includes(`${myStreamId}-public`) &&
            !socketRooms.includes(`${myRelatedUserId}-private`)
          ) {
            /* noy in public and private room */
            if (myStreamId) {
              if (!joinRooms.includes(`${myStreamId}-public`)) {
                joinRooms.push(`${myStreamId}-public`)
              }
            }
            if (!joinRooms.includes(`${myRelatedUserId}-private`)) {
              joinRooms.push(`${myRelatedUserId}-private`)
            }
          } else if (!socketRooms.includes(`${myRelatedUserId}-private`)) {
            /* only not in private */
            if (!joinRooms.includes(`${myRelatedUserId}-private`)) {
              joinRooms.push(`${myRelatedUserId}-private`)
            }
          } else if (!socketRooms.includes(`${myStreamId}-public`)) {
            /* only not in public */
            if (myStreamId) {
              if (!joinRooms.includes(`${myStreamId}-public`)) {
                joinRooms.push(`${myStreamId}-public`)
              }
            }
          }
        } else {
          /* if un authed */
          if (!socketRooms.includes(`${myStreamId}-public`)) {
            /* only not in public */
            joinRooms.push(`${myStreamId}-public`)
          }
        }
        if (joinRooms.length > 0) {
          joinAttempts++
          console.log(
            "Have to join rooms >> ",
            joinRooms,
            ` attempt: ${joinAttempts}`
          )
          /* join rooms is any room to join */
          socket.emit("putting-me-in-these-rooms", joinRooms, (response) => {
            // sessionStorage.setItem(
            //   "socket-rooms",
            //   joinRooms,
            //   JSON.stringify([...socketRooms, ...joinRooms])
            // )
            if (response.status === "ok") {
              joinAttempts = 0
              joinRooms = []
            }
          })
        }
      } else {
        console.log("Not live but listening")
      }
    }, 3000)
    return () => {
      clearInterval(myKeepInRoomLoop)
    }
  }, [isLiveNowRef])

  const toggleMuteMic = () => {
    if (localAudioTrack.muted) {
      /* un mute audio */
      localAudioTrack.setMuted(false)
      setIsMuted(false)
    } else {
      /* mute the audio */
      localAudioTrack.setMuted(true)
      setIsMuted(true)
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
      let newStreamHandler = (data) => {
        if (data.modelId !== window.location.pathname.split("/").reverse()[0]) {
          return
        }
        if (!localStorage.getItem("rtcToken")) {
          /* RELOAD */
          return window.location.reload()
        }
        /*  */
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
              sessionStorage.setItem("streamId", data.streamId)
              setPendingCallRequest(false)
              setOthersCall({
                acceptedOthersCall: false,
                rejectedMyCall: false,
                otherUserData: {
                  username: "",
                  profileImage: "",
                  callType: "",
                },
              })
              join(
                window.location.pathname.split("/").reverse()[0],
                localStorage.getItem("rtcToken"),
                ctx.relatedUserId
              ).catch((err) => {
                console.error(
                  "Error joining the stream, something is not right..!"
                )
              })
              props.setIsChatPlanActive(data.isChatPlanActive)
              setIsModelOffline(false)
              setTimeout(() => {
                fetch(
                  `/api/website/stream/get-live-room-count/${data.streamId}-public`
                )
                  .then((res) => res.json())
                  .then((data) => {
                    document.getElementById(
                      "live-viewer-count"
                    ).innerText = `${data.roomSize} Live`
                  })
              }, [4000])
              document.getElementById("live-viewer-count").innerText = `0 Live`
            } else {
              props.setIsChatPlanActive(data.isChatPlanActive)
              setPendingCallRequest(false)
              setIsModelOffline(true)
            }
          })
          .catch((err) => {
            alert(err.message)
          })
      }
      socket.on("new-model-started-stream", newStreamHandler)

      /* remove listener */
      return () => {
        if (
          socket.hasListeners("new-model-started-stream") &&
          newStreamHandler
        ) {
          socket.off("new-model-started-stream", newStreamHandler)
        }
      }
    }
  }, [ctx.isLoggedIn, socketCtx.socketSetupDone])

  useEffect(() => {
    /* listen for stream end events */
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      let streamDeleteHandler
      streamDeleteHandler = (data) => {
        if (data.modelId !== window.location.pathname.split("/").reverse()[0]) {
          return
        }
        setCallOnGoing(false)
        setPendingCallRequest(false)
        setIsModelOffline(true)
        sessionStorage.setItem("streamId", "")

        /* set live viewer count as Zero */
        document.getElementById("live-viewer-count").innerText = "0 Live"

        /* why need this, any way server will send room-left event */
        /* const socketRooms =
            JSON.parse(sessionStorage.getItem("socket-rooms")) || []
          sessionStorage.setItem(
            "socket-rooms",
            JSON.stringify(
              socketRooms.filter((room) => !room.endsWith("-public"))
            )
          ) */
      }
      socket.on("delete-stream-room", streamDeleteHandler)
      return () => {
        if (socket.hasListeners("delete-stream-room") && streamDeleteHandler) {
          socket.off("delete-stream-room", streamDeleteHandler)
        }
      }
    }
  }, [socketCtx.socketSetupDone])

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
          const myModelId = window.location.pathname.split("/").reverse()[0]
          fetch("/api/website/token-builder/authed-viewer-join-stream", {
            method: "POST",
            cors: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              modelId: myModelId,
              purchasedVideoAlbums:
                ctx.user.user.relatedUser.privateVideosPlans.find(
                  (collection) => (collection.model = myModelId)
                )?.albums || [],
              purchasedImageAlbums:
                ctx.user.user.relatedUser.privateImagesPlans.find(
                  (collection) => (collection.model = myModelId)
                )?.albums || [],
            }),
          })
            .then((resp) => resp.json())
            .then((data) => {
              /* model offline or online need to know chat plan status & get model data */
              props.setModelProfileData(data.theModel)
              props.setIsChatPlanActive(data.isChatPlanActive)

              /* check if model is streaming */
              if (data?.message === "model not streaming") {
                return setIsModelOffline(true)
              } else {
                setIsModelOffline(false)
              }

              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)

              sessionStorage.setItem("streamId", data.streamId)

              setTipMenuActions(data.theModel.tipMenuActions.actions)
              join(
                window.location.pathname.split("/").reverse()[0],
                data.rtcToken,
                ctx.relatedUserId
              ).catch((err) => {
                console.error(
                  "Error joining the stream, something is not right..!"
                )
              })
            })
        } else {
          /* get token  from local storage */
          join(
            window.location.pathname.split("/").reverse()[0],
            localStorage.getItem("rtcToken"),
            ctx.relatedUserId
          ).catch((err) => {
            console.error("Error joining the stream, something is not right..!")
          })
        }
      } else {
        if (!localStorage.getItem("unAuthed-user-chat-name")) {
          localStorage.setItem(
            "unAuthed-user-chat-name",
            `Guest User-${nanoid(8)} ${
              unAuthedUserEmojis[Math.floor((Math.random() * 100) % 25)]
            }`
          )
        }
        /* check if already have a valid rtc token */
        if (
          !localStorage.getItem("rtcToken") &&
          localStorage.getItem("rtcTokenExpireIn") < Date.now()
        ) {
          /**
           * fetch RTC token as a un-authenticated user, as no valid rtc token found
           */
          fetch("/api/website/token-builder/unauthed-viewer-join-stream", {
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
              /* 
                is model offline or online, we need model data & chat plan stat
              */
              props.setModelProfileData(data.theModel)
              props.setIsChatPlanActive(data.isChatPlanActive)

              /* check if model is offline */
              if (data?.message === "model not streaming") {
                return setIsModelOffline(true)
              } else {
                setIsModelOffline(false)
              }
              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)

              sessionStorage.setItem("streamId", data.streamId)

              /* as 👇 this is async */
              join(
                window.location.pathname.split("/").reverse()[0],
                data.rtcToken,
                data.unAuthedUserId
              ).catch((err) => {
                console.error(
                  "Error joining the stream, something is not right..!"
                )
              })
              setTipMenuActions(data.theModel.tipMenuActions.actions)

              /* if new Un-Authed user was registered */
              if (data.newUnAuthedUserCreated) {
                /* if new viewer was created save the _id in localstorage */
                localStorage.setItem("unAuthedUserId", data.unAuthedUserId)
              } else {
              }
            })
            .catch((err) => alert(err.message))
        } else {
          /* if already have a token no need to fetch new one */
          const channel = window.location.pathname.split("/").reverse()[0]
          join(
            channel,
            localStorage.getItem("rtcToken"),
            localStorage.getItem("unAuthedUserId")
          ).catch((err) => {
            console.error("Error joining the stream, something is not right..!")
          })
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
          }
          // setCallEndDetails(data.callEndDetails)
          setPendingCallEndRequest(false)
          setCallOnGoing(false)
          await leaveAndCloseTracks()
          await client.setClientRole("audience")
          setIsModelOffline(true)
          offCallListeners()
        })
      }
    }
  }, [socketCtx.socketSetupDone, offCallListeners])

  /* live viewer count listeners */
  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      let joinHandler
      let leftHandler
      if (!socket.hasListeners("viewer-joined")) {
        joinHandler = (data) => {
          document.getElementById(
            "live-viewer-count"
          ).innerText = `${data.roomSize} Live`
        }
        socket.on("viewer-joined", joinHandler)
      }
    }
  }, [socketCtx.socketSetupDone])

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (!socket.hasListeners("model-call-request-response-received")) {
        socket.on("model-call-request-response-received", (data) => {
          // alert("model response received")
          socket.emit("add-oncall-status-on-viewer-socket-client", {
            callId: data.callId,
          })
          if (data.response !== "rejected") {
            if (ctx.isLoggedIn && data.relatedUserId === ctx.relatedUserId) {
              /* dont kick of, switch role to host start the call 📞📞 */
              /* do a fetch request and update the status of the call as ongoing */
              fetch("/api/website/stream/set-call-ongoing", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  callId: data.callId,
                  callType: data.callType,
                }),
              })
                .then((res) => res.json())
                .then(async (result) => {
                  if (result.actionStatus === "success") {
                    sessionStorage.removeItem("callId")
                    sessionStorage.setItem("callId", data.callId)
                    setPendingCallRequest(false)
                    setCallType(data.callType)
                    setCallOnGoing(true)
                    setIsModelOffline(false)
                    setUpCallListeners()
                    await switchViewerToHost(
                      data.callType
                    ) /* actually switch viewer to host and create tracks */
                  }
                })
                .catch((err) => {
                  alert(err.message)
                  setPendingCallRequest(false)
                  setCallType(null)
                  setCallOnGoing(false)
                  setIsModelOffline(true)
                })
            } else {
              /* unsubscribe stream and close connection to agora */
              localStorage.removeItem("rtcToken")
              localStorage.removeItem("rtcTokenExpireIn")

              if (pendingCallRequest) {
                /* accepted others call, and rejected mine */
                setPendingCallRequest(false)
                setCallOnGoing(false)
                setIsModelOffline(false)
                setCallType(null)
                setOthersCall({
                  rejectedMyCall: true,
                  acceptedOthersCall: true,
                  otherUserData: {
                    username: data.username,
                    /* as current viewers don't have a profileimg, using placeholder */
                    // profileImage: data.profileImage,
                    profileImage: "/male-model.jpeg",
                    callType: data.callType,
                  },
                })
              } else {
                /* accepted someone's call hance have to leave */
                setPendingCallRequest(false)
                setCallOnGoing(false)
                setIsModelOffline(false)
                setCallType(null)
                setOthersCall({
                  rejectedMyCall: true,
                  acceptedOthersCall: true,
                  otherUserData: {
                    username: data.username,
                    /* as current viewers don't have a profileimg, using placeholder */
                    // profileImage: data.profileImage,
                    profileImage: "/male-model.jpeg",
                    callType: data.callType,
                  },
                })
              }

              leaveDueToPrivateCall()
              /**
               *
               * have kick out all sockets on the server itself as below alogo will
               * flood the client with "viewer left event"
               */
              document.getElementById("live-viewer-count").innerText = "0 Live"
              /* const socketRooms =
                JSON.parse(sessionStorage.getItem("socket-rooms")) || []
              if (socketRooms.find((room) => room.endsWith("-public"))) {
                socket.emit(
                  "take-me-out-of-these-rooms",
                  [socketRooms.find((room) => room.endsWith("-public"))],
                  (response) => {
                    if (response.status === "ok") {
                      console.log("removed from public room")
                    }
                  }
                )
              } */
            }
          } else {
            /* clear call type and pending call */
            document.getElementById("call-end-audio").play()
            if (ctx.isLoggedIn && data.relatedUserId === ctx.relatedUserId) {
              alert(
                "Model rejected your call request, better luck next time 😢🤗🤗"
              )
              setPendingCallRequest(false)
            }
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
        }
        setPendingCallEndRequest(false)
        setCallOnGoing(false)
        setIsModelOffline(true)
        offCallListeners()
        await leaveAndCloseTracks()
        await client.setClientRole("audience")
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
        isModelOffline ||
        (callOnGoing === true && callType === "audioCall") ||
        othersCall.acceptedOthersCall
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
      {callOnGoing && callType && !isModelOffline && remoteUsers[0] ? (
        <VideoPlayer
          videoTrack={
            callType === "videoCall" ? remoteUsers[0]?.videoTrack : null
          }
          audioTrack={remoteUsers[0].audioTrack} //error of session storage is going
          playAudio={true}
          config={callType}
        />
      ) : null}

      {/* on audioCall with model */}
      {callOnGoing &&
      callType === "audioCall" &&
      !isModelOffline &&
      remoteUsers[0] ? (
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
      {isModelOffline &&
      modelProfileData &&
      !callOnGoing &&
      remoteUsers?.length === 0 &&
      !othersCall.acceptedOthersCall ? (
        <div className="tw-text-sm tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-top-6  sm:tw-top-10 tw-px-4 tw-py-2 tw-rounded tw-bg-[rgba(112,112,112,0.25)] tw-min-w-[288px]">
          <p className="tw-text-white-color tw-font-medium tw-text-center">
            The model is currently offline 😞😞
          </p>
        </div>
      ) : null}

      {othersCall.acceptedOthersCall && !isModelOffline && (
        <div className="tw-text-sm tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-top-6  sm:tw-top-10 tw-px-4 tw-py-2 tw-rounded tw-bg-[rgba(112,112,112,0.25)] tw-min-w-[288px]">
          {othersCall.rejectedMyCall ? (
            <p className="tw-text-white-color tw-font-medium tw-text-center tw-capitalize">
              the model has accepted the {othersCall.otherUserData.callType} of{" "}
              {othersCall.otherUserData.username}, Sorry, better luck next time
              ,dont' be sad 🤗🤗
            </p>
          ) : (
            <p className="tw-text-white-color tw-font-medium tw-text-center tw-capitalize">
              the model has accepted the {othersCall.otherUserData.callType} of{" "}
              {othersCall.otherUserData.username}
            </p>
          )}
        </div>
      )}

      {callOnGoing &&
      callType === "audioCall" &&
      !othersCall.acceptedOthersCall ? (
        <div className="tw-text-sm tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-top-4  sm:tw-top-10 tw-px-4 tw-py-2 tw-rounded tw-bg-[rgba(112,112,112,0.25)] tw-min-w-[288px]">
          <p className="tw-text-white-color tw-font-medium tw-text-center">
            AudioCall With Model
          </p>
        </div>
      ) : null}

      {/* not streaming && not on call | model circles | offline mode*/}
      {/* model image */}

      {isModelOffline &&
        modelProfileData &&
        !callOnGoing &&
        remoteUsers?.length === 0 &&
        !othersCall.acceptedOthersCall && (
          <div className="tw-border-8 tw-border-red-200 tw-rounded-full tw-translate-y-[-64px] md:tw-translate-y-[-24px]">
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

      {/* when the model has accepted other viewers call */}
      {/* {othersCall.acceptedOthersCall && ( */}
      {othersCall.acceptedOthersCall && !isModelOffline && (
        <div className="tw-flex-shrink tw-flex-grow-0 tw-flex tw-justify-center tw-items-center tw-my-auto tw-relative">
          <div
            className="tw-absolute tw-translate-x-[-50%] tw-translate-y-[-50%] tw-left-[50%] tw-w-28 tw-h-28 sm:tw-w-32 sm:tw-h-32 lg:tw-w-36 lg:tw-h-36 tw-z-[391]"
            style={{
              backgroundImage: "url(/kiss-2.gif)",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="tw-border-8 tw-border-red-200 tw-rounded-full tw-translate-y-[-64px] md:tw-translate-y-[-24px] tw-mr--2">
            <img
              src={modelProfileData.profileImage}
              alt=""
              className="tw-h-[120px] tw-w-[120px] md:tw-h-[180px] md:tw-w-[180px] lg:tw-h-[230px] lg:tw-w-[230px] tw-object-cover tw-rounded-full"
            />
          </div>
          <div className="tw-border-8 tw-border-red-200 tw-rounded-full tw-translate-y-[-64px] md:tw-translate-y-[-24px] tw-ml--2">
            <img
              src={othersCall.otherUserData.profileImage}
              alt=""
              className="tw-h-[120px] tw-w-[120px] md:tw-h-[180px] md:tw-w-[180px] lg:tw-h-[230px] lg:tw-w-[230px] tw-object-cover tw-rounded-full"
            />
          </div>
        </div>
      )}

      {/* not streaming && not on call | model circles | offline mode*/}
      {/* model offline status */}
      {isModelOffline &&
      modelProfileData &&
      !callOnGoing &&
      remoteUsers?.length === 0 &&
      !othersCall.acceptedOthersCall ? (
        <div className="tw-text-sm tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-bottom-32 sm:tw-bottom-20 tw-backdrop-blur tw-px-4 tw-py-2 tw-rounded tw-bg-[rgba(112,112,112,0.25)] tw-min-w-[288px]">
          <p className="tw-text-white-color tw-font-medium tw-text-center tw-capitalize">
            {modelProfileData.offlineStatus}
          </p>
        </div>
      ) : null}

      {/* model has accepted someones call */}
      {othersCall.acceptedOthersCall && !isModelOffline && (
        <div className="tw-text-sm tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-bottom-32 sm:tw-bottom-20 tw-backdrop-blur tw-px-4 tw-py-2 tw-rounded tw-bg-[rgba(112,112,112,0.25)] tw-min-w-[288px]">
          <p className="tw-text-white-color tw-font-medium tw-text-center tw-capitalize">
            the model and {othersCall.otherUserData.username} are busy on call
            💘💘😍
          </p>
        </div>
      )}

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
          {localAudioTrack && (
            <button className="tw-inline-block tw-z-[390] tw-px-2">
              {!isMuted ? (
                <MicIcon
                  fontSize="medium"
                  style={{ color: "white" }}
                  onClick={toggleMuteMic}
                />
              ) : (
                <MicOffIcon
                  fontSize="medium"
                  style={{ color: "red" }}
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
