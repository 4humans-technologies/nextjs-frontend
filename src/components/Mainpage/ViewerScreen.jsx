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
import { toast } from "react-toastify"

/**
 * If this screen is being mounted then it is understood by default that,
 * role will of be viewer.
 */
const clientOptions = { codec: "h264", mode: "live" }
let client = AgoraRTC.createClient(clientOptions)
client.setClientRole("audience", {
  level: 1,
})

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
    switchViewerToHost,
    leaveAndCloseTracks,
    customDataRef,
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
    if (socketCtx.socketSetupDone) {
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
              if (response.status === "ok") {
                joinAttempts = 0
                joinRooms = []
              }
            })
          }
        } else {
          console.log("Not live but listening")
        }
      }, 1500)
      return () => {
        console.log("clearing myKeepInRoomLoop interval 🔺🔺⭕⭕🔴🔴⭕⭕🔻🔻")
        clearInterval(myKeepInRoomLoop)
      }
    }
  }, [isLiveNowRef, socketCtx.socketSetupDone])

  const toggleMuteMic = async () => {
    if (localAudioTrack.enabled) {
      /* un mute audio */
      await localAudioTrack.setEnabled(false)
      console.log(localAudioTrack.enabled)
      setIsMuted(false)
    } else {
      /* mute the audio */
      await localAudioTrack.setEnabled(true)
      console.log(localAudioTrack.enabled)
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

  /* re-join model stream */
  useEffect(() => {
    if (socketCtx.socketSetupDone && ctx.loadedFromLocalStorage) {
      const socket = io.getSocket()
      if (joinState) {
        /**
         * when have already joined the channel then no need to rejoin
         */
        return
      }
      let newStreamHandler = (data) => {
        if (data.modelId !== window.location.pathname.split("/").reverse()[0]) {
          return
        }

        let url
        if (ctx.isLoggedIn) {
          url = "/api/website/stream/re-join-models-currentstream-authed"
        } else {
          url = "/api/website/stream/re-join-models-currentstream-unauthed"
        }

        let getNewToken = false
        if (!localStorage.getItem("rtcToken")) {
          /* RELOAD */
          return window.location.reload()
        } else if (
          +localStorage.getItem("rtcTokenExpireIn") <
          Date.now() + 60000
        ) {
          getNewToken = true
        }

        const newStream = new Promise((resolve, reject) => {
          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              modelId: window.location.pathname.split("/").reverse()[0],
              getNewToken: getNewToken,
              unAuthedUserId: ctx.isLoggedIn
                ? null
                : localStorage.getItem("unAuthedUserId"),
            }),
          })
            .then((res) => res.json())
            .then(async (data) => {
              if (data.actionStatus === "success") {
                sessionStorage.setItem("streamId", data.streamId)
                if (getNewToken) {
                  /* save rtcToken in lc */
                  localStorage.setItem("rtcToken", data.rtcToken)
                  localStorage.setItem(
                    "rtcTokenExpireIn",
                    +data.privilegeExpiredTs * 1000
                  )
                }
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
                const modelDataEvent = new CustomEvent(
                  "model-profile-data-fetched",
                  {
                    detail: {
                      turnStatus: "isStreaming",
                    },
                  }
                )
                document.dispatchEvent(modelDataEvent)
                /**
                 * Agora raising error that client is already connected to the channel
                 * so have to check if client is correctly leaving or not
                 * during stream end
                 */
                await join(
                  window.location.pathname.split("/").reverse()[0],
                  localStorage.getItem("rtcToken"),
                  ctx.isLoggedIn
                    ? ctx.relatedUserId
                    : localStorage.getItem("unAuthedUserId")
                )
                  .then(() => {
                    resolve()
                  })
                  .catch((err) => {
                    reject(err.message)
                  })

                props.setIsChatPlanActive(data.isChatPlanActive)
                setIsModelOffline(false)
                document.getElementById("live-viewer-count-lg").innerText =
                  "Getting live users..."
                document.getElementById("live-viewer-count-md").innerText =
                  "Getting live users..."
                if (!data.socketUpdated) {
                  if (ctx.isLoggedIn) {
                    socket.emit("update-client-info", {
                      action: "rejoin-the-stream-authed-viewer",
                      streamId: data.streamId,
                      modelRoom: `${
                        window.location.pathname.split("/").reverse()[0]
                      }-private`,
                    })
                  } else {
                    socket.emit("update-client-info", {
                      action: "join-the-stream-unauthed-viewer",
                      streamId: data.streamId,
                    })
                  }
                }
              } else {
                props.setIsChatPlanActive(data.isChatPlanActive)
                setPendingCallRequest(false)
                setIsModelOffline(true)
                reject(err.message)
              }
            })
            .catch((err) => {
              reject(err.message)
            })
        })

        toast.promise(
          newStream,
          {
            pending: "Model started streaming, establishing secure connection",
            success: "Successfully joined the stream",
            error: {
              render(err) {
                return "Error joining the stream err: " + err.data
              },
            },
          },
          {
            autoClose: 1000,
          }
        )
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
  }, [
    ctx.isLoggedIn,
    socketCtx.socketSetupDone,
    ctx.loadedFromLocalStorage,
    joinState,
  ])

  useEffect(() => {
    /* listen for stream end events */
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      let streamDeleteHandler = (data) => {
        if (data.modelId !== window.location.pathname.split("/").reverse()[0]) {
          return
        }
        setCallOnGoing(false)
        setPendingCallRequest(false)
        setIsModelOffline(true)
        sessionStorage.setItem("streamId", "")

        /* set live viewer count as Zero */
        document.getElementById("live-viewer-count-lg").innerText = "0 Live"
        document.getElementById("live-viewer-count-md").innerText = "0 Live"

        toast.info(
          "Model ended the stream, will auto-connect if she starts again 😀"
        )
        const modelDataEvent = new CustomEvent("model-profile-data-fetched", {
          detail: {
            turnStatus: "offline",
          },
        })
        document.dispatchEvent(modelDataEvent)
        leave()
      }
      socket.on("delete-stream-room", streamDeleteHandler)
      return () => {
        socket.off("delete-stream-room", streamDeleteHandler)
      }
    }
  }, [socketCtx.socketSetupDone, leave])

  useEffect(() => {
    return () => {
      tokenRequestDoneOnce = false
      localStorage.removeItem("rtcToken")
      localStorage.removeItem("rtcTokenExpireIn")
    }
  }, [])

  /* http fetch request for rtc token */
  useEffect(() => {
    if (
      socketCtx.socketSetupDone &&
      !tokenRequestDoneOnce &&
      ctx.loadedFromLocalStorage
    ) {
      /* on first load fetch rtcToken and join */
      const socket = io.getSocket()
      tokenRequestDoneOnce = true
      if (ctx.isLoggedIn) {
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

              /* set header details for the viewer */
              const modelDataEvent = new CustomEvent(
                "model-profile-data-fetched",
                {
                  detail: {
                    viewer: {
                      username: data.theModel.rootUser.username,
                      profileImage: data.theModel.profileImage,
                      isStreaming: data.theModel.isStreaming,
                      onCall: data.theModel.onCall,
                    },
                  },
                }
              )
              document.dispatchEvent(modelDataEvent)

              /**
               * viewers list fetched
               */
              const viersListEvent = new CustomEvent("viewers-list-fetched", {
                detail: {
                  viewersList: data.liveViewersList,
                },
              })
              document.dispatchEvent(viersListEvent)

              /* fetch previous chats */
              const chatEvent = new CustomEvent("fetch-firebase-chats", {
                detail: {
                  streamId: data.streamId,
                },
              })
              document.dispatchEvent(chatEvent)

              /* check if model is streaming */
              if (data?.message === "model not streaming") {
                return setIsModelOffline(true)
              } else {
                /* if model is streaming */
                setIsModelOffline(false)
                if (!data.socketUpdated) {
                  socket.emit("update-client-info", {
                    action: "join-the-stream-authed-viewer",
                    streamId: data.streamId,
                    viewerDetails: data.viewerDetails,
                    modelRoom: `${
                      window.location.pathname.split("/").reverse()[0]
                    }-public`,
                  })
                }
              }

              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem(
                "rtcTokenExpireIn",
                +data.privilegeExpiredTs * 1000
              )

              sessionStorage.setItem("streamId", data.streamId)

              setTipMenuActions(data.theModel.tipMenuActions.actions)

              const joinPromise = join(
                window.location.pathname.split("/").reverse()[0],
                data.rtcToken,
                ctx.relatedUserId
              ).catch((err) => {
                console.error(
                  "Error joining the stream, something is not right..!"
                )
              })

              toast.promise(joinPromise, {
                pending: "Establishing secure connection",
                success: "Successfully joined the stream",
                error: "Error joining the stream, something is not right..!",
              })
            })
        } else {
          /* get token  from local storage */
          const joinPromise = join(
            window.location.pathname.split("/").reverse()[0],
            localStorage.getItem("rtcToken"),
            ctx.relatedUserId
          ).catch((err) => {
            console.error("Error joining the stream, something is not right..!")
          })

          toast.promise(joinPromise, {
            pending: "Establishing secure connection..",
            success: "Connected to the server, getting stream",
            error: "Error joining the stream, something is not right..!",
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

              /* set header details for the viewer */
              const modelDataEvent = new CustomEvent(
                "model-profile-data-fetched",
                {
                  detail: {
                    viewer: {
                      username: data.theModel.rootUser.username,
                      profileImage: data.theModel.profileImage,
                      isStreaming: data.theModel.isStreaming,
                      onCall: data.theModel.onCall,
                    },
                  },
                }
              )
              document.dispatchEvent(modelDataEvent)

              /**
               * viewers list fetched
               */
              const viersListEvent = new CustomEvent("viewers-list-fetched", {
                detail: {
                  viewersList: data.liveViewersList,
                },
              })
              document.dispatchEvent(viersListEvent)

              /* fetch previous chats */
              const chatEvent = new CustomEvent("fetch-firebase-chats", {
                detail: {
                  streamId: data.streamId,
                },
              })
              document.dispatchEvent(chatEvent)

              /* check if model is offline */
              if (data?.message === "model not streaming") {
                return setIsModelOffline(true)
              } else {
                /* if model is streaming */
                setIsModelOffline(false)
                if (!data.socketUpdated) {
                  socket.emit("update-client-info", {
                    action: "join-the-stream-unauthed-viewer",
                    streamId: data.streamId,
                  })
                }
              }

              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem(
                "rtcTokenExpireIn",
                +data.privilegeExpiredTs * 1000
              )

              sessionStorage.setItem("streamId", data.streamId)
              setTipMenuActions(data.theModel.tipMenuActions.actions)

              if (!data.newUnAuthedUserCreated) {
                /* if new viewer was created save the _id in localStorage */
                /* as 👇 this is async */
                const joinPromise = join(
                  window.location.pathname.split("/").reverse()[0],
                  data.rtcToken,
                  localStorage.getItem("unAuthedUserId")
                ).catch((err) => {
                  console.error(
                    "Error joining the stream, something is not right..!"
                  )
                })

                toast.promise(joinPromise, {
                  pending: "Establishing secure connection..",
                  success: "Connected to the server, getting stream",
                  error: "Error joining the stream, something is not right..!",
                })
              } else {
                /* if new Un-Authed user was registered */
                localStorage.setItem("unAuthedUserId", data.unAuthedUserId)
                const joinPromise = join(
                  window.location.pathname.split("/").reverse()[0],
                  data.rtcToken,
                  data.unAuthedUserId
                ).catch((err) => {
                  console.error(
                    "Error joining the stream, something is not right..!"
                  )
                })

                toast.promise(joinPromise, {
                  pending: "Establishing secure connection..",
                  success: "Connected to the server, getting stream",
                  error: "Error joining the stream, something is not right..!",
                })
              }
            })
            .catch((err) => toast.error(err.message))
        } else {
          /* if already have a token no need to fetch new one */
          const joinPromise = join(
            window.location.pathname.split("/").reverse()[0],
            localStorage.getItem("rtcToken"),
            localStorage.getItem("unAuthedUserId")
          ).catch((err) => {
            console.error("Error joining the stream, something is not right..!")
          })

          toast.promise(joinPromise, {
            pending: "Establishing secure connection..",
            success: "Connected to the server, getting stream",
            error: "Error joining the stream, something is not right..!",
          })
        }
      }
    }
  }, [
    ctx.isLoggedIn,
    ctx.relatedUserId,
    window.location.pathname,
    socketCtx.socketSetupDone,
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

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      return offCallListeners
    }
  }, [socketCtx.socketSetupDone])

  const setUpCallListeners = useCallback(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      let timeOutRef
      const afterCallRapUp = async (timeOut) => {
        const modelDataEvent = new CustomEvent("model-profile-data-fetched", {
          detail: {
            turnStatus: "offline",
          },
        })
        if (timeOut) {
          clearTimeout(timeOut)
        }
        document.dispatchEvent(modelDataEvent)
        spinnerCtx.setShowSpinner(false, "Please wait...")
        setPendingCallEndRequest(false)
        setCallOnGoing(false)
        await leaveAndCloseTracks()
        await client.setClientRole("audience")
        setIsModelOffline(true)
        offCallListeners()
        toast.success("Call has ended successfully!", {
          autoClose: false,
        })

        /**
         * clear the call details from socket
         */
        socket.emit(
          "update-client-info",
          {
            action: "clear-call-details",
          },
          (status) => {
            if (!status.ok) {
              socket.close()
              socket.open()
            }
          }
        )
      }

      /* model has put call end request before you */
      if (!socket.hasListeners("model-call-end-request-init-received")) {
        socket.on("model-call-end-request-init-received", (data) => {
          setPendingCallEndRequest(true)
          spinnerCtx.setShowSpinner(true, "Processing transaction...")
          toast.info(
            "Model has ended/disconnected the call, Processing transaction...",
            {
              autoClose: 3000,
            }
          )

          /**
           * clear customDataRef
           */
          customDataRef.current.callId = null
          customDataRef.current.callType = null
          customDataRef.current.callOngoing = false

          timeOutRef = setTimeout(() => {
            afterCallRapUp()
          }, [15000])
        })
      }

      /* the, after call transaction is now complete, fetch the details of it now */
      if (!socket.hasListeners("model-call-end-request-finished")) {
        socket.on("model-call-end-request-finished", (data) => {
          if (data?.ended === "not-setuped-properly") {
            updateCtx.updateWallet(data.amountToRefund, "add")
          } else if (data?.totalCharges) {
            updateCtx.updateWallet(data.totalCharges, "dec")
          }
          afterCallRapUp(timeOutRef)
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

      joinHandler = (data) => {
        if (typeof data.roomSize === "number") {
          document.getElementById("live-viewer-count-lg").innerText = `${
            data.roomSize - 1
          } Live`
          document.getElementById("live-viewer-count-md").innerText = `${
            data.roomSize - 1
          } Live`
        }
      }

      socket.on("viewer-joined", joinHandler)

      leftHandler = (data) => {
        if (typeof data.roomSize === "number") {
          try {
            document.getElementById("live-viewer-count-lg").innerText = `${
              data.roomSize - 1
            } Live`
            document.getElementById("live-viewer-count-md").innerText = `${
              data.roomSize - 1
            } Live`
          } catch (error) {
            /* just handle error */
          }
        }
      }

      socket.on("viewer-left-stream-received", leftHandler)

      return () => {
        if (socket.hasListeners("viewer-left-stream-received") && leftHandler) {
          socket.off("viewer-left-stream-received", leftHandler)
        }
        if (socket.hasListeners("viewer-joined") && joinHandler) {
          socket.off("viewer-joined", joinHandler)
        }
      }
    }
  }, [socketCtx.socketSetupDone])

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (!socket.hasListeners("model-call-request-response-received")) {
        socket.on("model-call-request-response-received", async (data) => {
          if (data.response === "accepted") {
            if (
              localStorage.getItem("jwtToken") &&
              data.relatedUserId === localStorage.getItem("relatedUserId")
            ) {
              /* dont kick of, switch role to host start the call 📞📞 */
              /* do a fetch request and update the status of the call as ongoing */
              const callConnectPromise = new Promise((resolve, reject) => {
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
                      customDataRef.current.callId = data.callId
                      customDataRef.current.callType = data.callType
                      customDataRef.current.callOngoing = true
                      if (!result.socketUpdated) {
                        /* socket was not updated server side update it by socket request */
                        socket.emit(
                          "update-client-info",
                          {
                            action: "set-call-data-viewer",
                            sharePercent: result.sharePercent,
                            callId: data.callId,
                            callType: data.callType,
                          },
                          async (status) => {
                            if (status.ok) {
                              /* should show spinner also */
                              sessionStorage.removeItem("callId")
                              sessionStorage.setItem("callId", data.callId)
                              /* update the model status to "onCall" in the second header */
                              const modelDataEvent = new CustomEvent(
                                "model-profile-data-fetched",
                                {
                                  detail: {
                                    turnStatus: "onCall",
                                  },
                                }
                              )
                              document.dispatchEvent(modelDataEvent)

                              const clearViewerListEvent = new Event(
                                "clean-viewer-list-going-on-call"
                              )
                              document.dispatchEvent(clearViewerListEvent)

                              setPendingCallRequest(false)
                              setCallType(data.callType)
                              setCallOnGoing(true)
                              setIsModelOffline(false)
                              setUpCallListeners()

                              let hasAudioDevices = false
                              let hasVideoDevices = false
                              navigator.mediaDevices
                                .enumerateDevices()
                                .then((myData) => {
                                  myData = myData.filter((device) => {
                                    return (
                                      device.label !== "" &&
                                      device.deviceId !== ""
                                    )
                                  })
                                  myData.forEach((a) => {
                                    if (a.kind === "audioinput") {
                                      hasAudioDevices = true
                                    }
                                    if (a.kind === "videoinput") {
                                      hasVideoDevices = true
                                    }
                                  })
                                  return myData
                                })
                                .then(() => {
                                  if (data.callType === "videoCall") {
                                    if (!hasVideoDevices && !hasAudioDevices) {
                                      toast.info(
                                        " 👈👈 Please ALLOW MICROPHONE and CAMERA permissions.",
                                        {
                                          position: "top-center",
                                          autoClose: false,
                                        }
                                      )
                                    } else if (
                                      hasVideoDevices &&
                                      !hasAudioDevices
                                    ) {
                                      toast.info(
                                        " 👈👈 Please ALLOW CAMERA permissions.",
                                        {
                                          position: "top-center",
                                          autoClose: false,
                                        }
                                      )
                                    }
                                  } else {
                                    /* if audio call */
                                    if (!hasAudioDevices) {
                                      toast.info(
                                        " 👈👈 Please ALLOW MICROPHONE permissions.",
                                        {
                                          position: "top-center",
                                          autoClose: false,
                                        }
                                      )
                                    }
                                  }
                                })

                              /* switch to host with the new token */
                              try {
                                await switchViewerToHost(
                                  data.callType,
                                  data.rtcToken
                                )
                                /**
                                 * resolve the promise
                                 */
                                resolve()
                              } catch (err) {
                                reject(err)
                              }
                            }
                          }
                        )
                      } else {
                        /* ====== IF SOCKET DATA WAS ALSO SUCCESSFULLY UPDATED IN THE FETCH REQUEST ====== */
                        sessionStorage.removeItem("callId")
                        sessionStorage.setItem("callId", data.callId)
                        const modelDataEvent = new CustomEvent(
                          "model-profile-data-fetched",
                          {
                            detail: {
                              turnStatus: "onCall",
                            },
                          }
                        )
                        document.dispatchEvent(modelDataEvent)

                        const clearViewerListEvent = new Event(
                          "clean-viewer-list-going-on-call"
                        )
                        document.dispatchEvent(clearViewerListEvent)

                        setPendingCallRequest(false)
                        setCallType(data.callType)
                        setCallOnGoing(true)
                        setIsModelOffline(false)
                        setUpCallListeners()

                        let hasAudioDevices = false
                        let hasVideoDevices = false
                        navigator.mediaDevices
                          .enumerateDevices()
                          .then((myData) => {
                            myData = myData.filter((device) => {
                              return (
                                device.label !== "" && device.deviceId !== ""
                              )
                            })
                            myData.forEach((a) => {
                              if (a.kind === "audioinput") {
                                hasAudioDevices = true
                              }
                              if (a.kind === "videoinput") {
                                hasVideoDevices = true
                              }
                            })
                            return myData
                          })
                          .then(() => {
                            if (data.callType === "videoCall") {
                              if (!hasVideoDevices && !hasAudioDevices) {
                                toast.info(
                                  " 👈👈 Please ALLOW MICROPHONE and CAMERA permissions.",
                                  {
                                    position: "top-center",
                                    autoClose: false,
                                  }
                                )
                              } else if (hasVideoDevices && !hasAudioDevices) {
                                toast.info(
                                  " 👈👈 Please ALLOW CAMERA permissions.",
                                  {
                                    position: "top-center",
                                    autoClose: false,
                                  }
                                )
                              }
                            } else {
                              /* if audio call */
                              if (!hasAudioDevices) {
                                toast.info(
                                  " 👈👈 Please ALLOW MICROPHONE permissions.",
                                  {
                                    position: "top-center",
                                    autoClose: false,
                                  }
                                )
                              }
                            }
                          })
                        try {
                          await switchViewerToHost(data.callType, data.rtcToken)
                          /**
                           * resolve the promise
                           */
                          resolve()
                        } catch (err) {
                          reject(err)
                        }
                      }
                    }
                  })
                  .catch((err) => {
                    reject(err)
                    setPendingCallRequest(false)
                    setCallType(null)
                    setCallOnGoing(false)
                    setIsModelOffline(true)
                  })
              })

              toast.promise(
                callConnectPromise,
                {
                  pending: "Call accepted, Establishing secure connection",
                  success: "Call connected successfully",
                  error: "Call was not setup properly, please end the call!",
                },
                {
                  autoClose: 1000,
                  bodyClassName: "tw-tracking-tight tw-text-sm tw-py-2 tw-px-4",
                }
              )
            } else {
              /* unsubscribe stream and close connection to agora */
              localStorage.removeItem("rtcToken")
              localStorage.removeItem("rtcTokenExpireIn")

              if (pendingCallRequest) {
                /* accepted others call, and rejected mine */
                const modelDataEvent = new CustomEvent(
                  "model-profile-data-fetched",
                  {
                    detail: {
                      turnStatus: "onCall",
                    },
                  }
                )
                document.dispatchEvent(modelDataEvent)
                setPendingCallRequest(false)
                setCallOnGoing(false)
                setIsModelOffline(false)
                setCallType(null)
                setOthersCall({
                  rejectedMyCall: true,
                  acceptedOthersCall: true,
                  otherUserData: {
                    username: data.username,
                    profileImage: data.profileImage,
                    callType: data.callType,
                  },
                })
              } else {
                /**
                 * for un-authed viewers and viewers who did't put a request
                 */
                const modelDataEvent = new CustomEvent(
                  "model-profile-data-fetched",
                  {
                    detail: {
                      turnStatus: "onCall",
                    },
                  }
                )
                document.dispatchEvent(modelDataEvent)
                setPendingCallRequest(false)
                setCallOnGoing(false)
                setIsModelOffline(false)
                setCallType(null)
                setOthersCall({
                  rejectedMyCall: true,
                  acceptedOthersCall: true,
                  otherUserData: {
                    username: data.username,
                    profileImage: data.profileImage,
                    callType: data.callType,
                  },
                })
                toast.info("Model Is Now OnCall With " + data.username, {
                  position: "bottom-right",
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                })
              }

              await leave()
              /**
               *
               * have kick out all sockets on the server itself as below alogo will
               * flood the client with "viewer left event"
               */
              document.getElementById("live-viewer-count-lg").innerText =
                "0 Live"
              document.getElementById("live-viewer-count-md").innerText =
                "0 Live"

              const socketRooms =
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
              }
            }
          } else if (data.response === "rejected") {
            /* clear call type and pending call */
            if (ctx.isLoggedIn && data.relatedUserId === ctx.relatedUserId) {
              document.getElementById("call-end-audio").play()
              toast.error("Your Call Request Was Rejected!", {
                position: "bottom-right",
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
              })
              setPendingCallRequest(false)
            }
          } else {
            toast.error("Invalid response from model", {
              position: "bottom-right",
              closeOnClick: true,
            })
          }
        })
      }

      return () => {
        if (socket.hasListeners("model-call-request-response-received")) {
          socket.off("model-call-request-response-received")
        }
      }
    }
  }, [socketCtx.socketSetupDone, switchViewerToHost, setUpCallListeners, leave])

  /* handle call end */
  const handleCallEnd = async () => {
    if (pendingCallEndRequest) {
      return toast.error(
        "Your call end request is processing please have patience.... 🙏",
        {
          autoClose: 3000,
        }
      )
    }

    if (!callOnGoing) {
      return alert("No ongoing call")
    }

    const modelDataEvent = new CustomEvent("model-profile-data-fetched", {
      detail: {
        turnStatus: "offline",
      },
    })
    document.dispatchEvent(modelDataEvent)

    /**
     * clear customDataRef
     */
    customDataRef.current.callId = null
    customDataRef.current.callType = null
    customDataRef.current.callOngoing = false

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
        socket.emit(
          "update-client-info",
          {
            action: "clear-call-details",
          },
          (status) => {
            if (!status.ok) {
              socket.close()
              socket.open()
            }
          }
        )
        if (data.wasFirst === "yes") {
          // spinnerCtx.setShowSpinner(false, "Please wait...")
          // sessionStorage.setItem("callEndDetails", JSON.stringify(data))
        }
        setPendingCallEndRequest(false)
        setCallOnGoing(false)
        setIsModelOffline(true)
        offCallListeners()
        await leaveAndCloseTracks()
        await client.setClientRole("audience")
      })
      .catch((err) => toast.error(err.message))

    /**
     * 1. close agora streaming first
     * 2. http request to the server with call end Timestamp
     * 3. show call end page/summary modal
     */
  }

  customDataRef.current.handleCallEnd = handleCallEnd

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
            {othersCall.otherUserData?.profileImage ? (
              <img
                src={othersCall.otherUserData.profileImage}
                alt=""
                className="tw-h-[120px] tw-w-[120px] md:tw-h-[180px] md:tw-w-[180px] lg:tw-h-[230px] lg:tw-w-[230px] tw-object-cover tw-rounded-full"
              />
            ) : (
              <div className="tw-h-[120px] tw-w-[120px] md:tw-h-[180px] md:tw-w-[180px] lg:tw-h-[230px] lg:tw-w-[230px] tw-bg-dreamgirl-red tw-grid tw-place-items-start tw-text-white-color tw-font-semibold tw-ring-2 tw-ring-white-color">
                <span className="tw-text-3xl tw-uppercase">
                  {othersCall.otherUserData.username.charAt(0)}
                </span>
              </div>
            )}
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
          <div id="self-video" className="tw-relative tw-w-full tw-h-full">
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
