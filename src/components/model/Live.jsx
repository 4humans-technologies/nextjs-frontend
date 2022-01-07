import Sidebar from "../Mainpage/Sidebar"
import React, { useEffect, useState, useRef, useCallback } from "react"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import { Button } from "react-bootstrap"

import PublicChat from "./PublicChat"
import Emoji from "../Emoji"

import AgoraRTC from "agora-rtc-sdk-ng"
import useAgora from "../../hooks/useAgora" //using agora from Hooks
import VideoPlayer from "../UI/VideoPlayer"
import { useAuthContext } from "../../app/AuthContext"
import { useAuthUpdateContext } from "../../app/AuthContext"
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
import LocalActivityIcon from "@material-ui/icons/LocalActivity"
import MarkChatReadIcon from "@material-ui/icons/Markunread"
import io from "../../socket/socket"
import Videoshowcontroller from "./VideoStreaming/Videoshowcontroller"
import LiveTvIcon from "@material-ui/icons/LiveTv"
import { useSocketContext } from "../../app/socket/SocketContext"
import CallEndIcon from "@material-ui/icons/CallEnd"
import MicOffIcon from "@material-ui/icons/MicOff"
import MicIcon from "@material-ui/icons/Mic"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit"
import useSpinnerContext from "../../app/Loading/SpinnerContext"
import PrivateChatWrapper from "../PrivateChat/PrivateChatWrapper"
import ViewersListContainer from "../../components/ViewersList/ViewersListContainer"
import { toast } from "react-toastify"

// Replace with your App ID.
let token

/**
 * CREATING AGORA CLIENT
 */

const clientOptions = { codec: "h264", mode: "live" }
const client = AgoraRTC.createClient(clientOptions)
client.setClientRole("host")

const chatWindowOptions = {
  PRIVATE: "private",
  PUBLIC: "public",
  USERS: "users",
  TIP_MENU: "TIP_MENU",
}

let goneLiveOnce /* only when gone live once the stream rooms will be created, before that no room exists */
const streamTimer = {
  value: 0,
  timerElement: null,
}

const callTimer = {
  value: 0,
  timerElement: null,
}
const pendingCallInitialData = {
  pending: true,
  callType: "videoCall",
  data: {
    relatedUserId: null,
  },
}

function Live() {
  const chatWindowRef = useRef()
  const onCallUsefulRef = useRef({
    loopRef: null,
  })

  const publicChatContainerRef = useRef()
  const privateChatContainerRef = useRef()

  const ctx = useAuthContext()
  const spinnerCtx = useSpinnerContext()
  const updateCtx = useAuthUpdateContext()
  const socketCtx = useSocketContext()
  const [fullScreen, setFullScreen] = useState(false)
  const [chatWindow, setChatWindow] = useState(chatWindowOptions.USERS)

  useEffect(() => {
    let mounted = true
    if (mounted) {
      chatWindowRef.current = chatWindow
    }
    return () => {
      mounted = false
    }
  }, [chatWindow])

  const [pendingCallRequest, setPendingCallRequest] = useState({
    pending: false,
    callRequests: [],
    /* requests: [
      {
        callType:null,
        username:"string",
        viewer:"viewerDoc"
      }
    ] */
  })
  const [callOnGoing, setCallOnGoing] = useState(false)
  const [callType, setCallType] = useState("videoCall")
  const [pendingCallEndRequest, setPendingCallEndRequest] = useState(false)
  const [muted, setMuted] = useState(false)

  /* Ref's */
  const container = useRef()
  const chatInputRef = useRef()
  const streamTimerRef = useRef()
  const callTimerRef = useRef({
    interval: null,
    initialTimeout: null,
  })
  const newChatNotifierDotRef = useRef()
  const requestServerEndAndStreamLeaveRef = useRef()
  const leaveAndCloseTracksRef = useRef()
  const isLiveNowRef = useRef("not-init")

  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    join,
    remoteUsers,
    leaveAndCloseTracks,
    customDataRef,
  } = useAgora(client, "host", "videoCall")

  const toggleMuteMic = async () => {
    if (localAudioTrack.enabled) {
      /* un mute audio */
      await localAudioTrack.setEnabled(false)
      console.log(localAudioTrack.enabled)
      setMuted(true)
    } else {
      /* mute the audio */
      await localAudioTrack.setEnabled(true)
      console.log(localAudioTrack.enabled)
      setMuted(false)
    }
  }

  const toggleFullscreen = useCallback(() => {
    /* fullscreen logic */
    const palyBackArea = document.getElementById("playback-area")
    if (!document.fullscreenElement) {
      palyBackArea.requestFullscreen()
      setFullScreen(true)
    } else {
      document.exitFullscreen()
      setFullScreen(false)
    }
  }, [])

  useEffect(() => {
    isLiveNowRef.current = joinState || callOnGoing
  }, [joinState, callOnGoing])

  /* socket loop process */
  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      let joinAttempts = 0
      let joinRooms = []
      const myKeepInRoomLoop = setInterval(() => {
        /* can use this in here 😁😁😁 */
        /* socket.connected */
        if (socket.connected) {
          /* if live then only check for rooms bro */
          if (joinAttempts > 5) {
            return console.log("more than five attempts")
          }
          if (isLiveNowRef.current) {
            const myStreamId = sessionStorage.getItem("streamId")
            console.log("Live and checking")
            const socketRooms =
              JSON.parse(sessionStorage.getItem("socket-rooms")) || []
            const myRelatedUserId = localStorage.getItem("relatedUserId")
            if (
              !socketRooms.includes(`${myStreamId}-public`) &&
              !socketRooms.includes(`${myRelatedUserId}-private`)
            ) {
              /* noy in public and private room */
              joinRooms.push(`${myStreamId}-public`)
              joinRooms.push(`${myRelatedUserId}-private`)
            } else if (!socketRooms.includes(`${myRelatedUserId}-private`)) {
              /* only not in private */
              joinRooms.push(`${myRelatedUserId}-private`)
            } else if (!socketRooms.includes(`${myStreamId}-public`)) {
              /* only not in public */
              joinRooms.push(`${myStreamId}-public`)
            }
            if (joinRooms.length > 0) {
              joinAttempts++
              console.log(
                "Have to join rooms >> ",
                joinRooms,
                ` attempt: ${joinAttempts}`
              )
              /* join rooms is any room to join */
              socket.emit(
                "putting-me-in-these-rooms",
                joinRooms,
                (response) => {
                  if (response.status === "ok") {
                    joinAttempts = 0
                    joinRooms = []
                  }
                }
              )
            }
          } else {
            console.log("Not live but listening")
          }
        } else {
          console.log("socket is not connected", "color:green")
        }
        /* else if (!socket.connected && !reconnectInProgress) {
        // connect to the socket it's nesscssery
        reconnectInProgress = true
        const resetOnReconnect = () => {
          reconnectInProgress = false
        }
        socket.once("connect", resetOnReconnect)
        io.connect()
      } */
      }, 1500)

      return () => {
        console.log("clearing myKeepInRoomLoop interval 🔺🔺⭕⭕🔴🔴⭕⭕🔻🔻")
        clearInterval(myKeepInRoomLoop)
      }
    }
  }, [socketCtx.socketSetupDone])

  const scrollOnChat = useCallback((forBox, scrollType) => {
    if (forBox === "public") {
      var containerElement = publicChatContainerRef.current
    } else if (forBox === "private") {
      var containerElement = privateChatContainerRef.current
    } else {
      return
    }
    containerElement.scrollBy({
      top: containerElement.scrollHeight,
      behavior: scrollType ? scrollType : "smooth",
    })
  }, [])

  const startCallTimer = useCallback((waitFor = 0) => {
    callTimer.timerElement = document.getElementById("call-timer")
    callTimerRef.current.initialTimeout = setTimeout(() => {
      callTimerRef.current.interval = setInterval(() => {
        console.log("callTimer running")
        const totalSeconds = ++callTimer.value
        let newTime
        if (totalSeconds < 3600) {
          newTime = new Date(totalSeconds * 1000).toISOString().substr(14, 5)
        } else {
          newTime = new Date(totalSeconds * 1000).toISOString().substr(11, 8)
        }
        callTimer.timerElement.innerText = newTime
      }, [1000])
    }, [waitFor])
  }, [])

  const startStreamTimer = useCallback(() => {
    streamTimer.timerElement = document.getElementById("stream-timer")
    streamTimerRef.current = setInterval(() => {
      const totalSeconds = ++streamTimer.value
      let newTime
      if (totalSeconds < 3600) {
        newTime = new Date(totalSeconds * 1000).toISOString().substr(14, 5)
      } else {
        newTime = new Date(totalSeconds * 1000).toISOString().substr(11, 8)
      }
      streamTimer.timerElement.innerText = newTime
    }, [1000])
  }, [])

  /* clear the rtcToken onetime on first mount only */
  useEffect(() => {
    localStorage.removeItem("rtcToken")
    localStorage.removeItem("rtcTokenExpireIn")
    return () => {
      localStorage.removeItem("rtcToken")
      localStorage.removeItem("rtcTokenExpireIn")
    }
  }, [])

  /* Will Not Go Live When The Component Mounts */
  const startStreamingAndGoLive = useCallback(() => {
    if (!goneLiveOnce) {
      goneLiveOnce = true
    }
    const socket = io.getSocket()
    if (ctx.isLoggedIn === true && ctx.user.userType === "Model") {
      fetch("/api/website/token-builder/create-stream-and-gen-token", {
        method: "POST",
        cors: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => {
          return resp.json()
        })
        .then((data) => {
          if (data.actionStatus === "success") {
            socket.emit("update-client-info", {
              action: "join-the-stream-model",
              streamId: data.streamId,
            })
            socket.emit(
              "putting-me-in-these-rooms",
              {
                room: [`${ctx.relatedUserId}-private`],
              },
              (status) => {
                /* no need to add in session storage */
              }
            )
            sessionStorage.setItem("liveNow", "true")
            token = data.rtcToken
            localStorage.setItem("rtcToken", data.rtcToken)
            localStorage.setItem(
              "rtcTokenExpireIn",
              +data.privilegeExpiredTs * 1000
            )
            sessionStorage.setItem("streamId", data.streamId)

            const channelJoin = join(
              ctx.relatedUserId,
              token,
              ctx.relatedUserId
            ).catch((err) => {
              /* toast is handing it's rejection */
            })
            return toast.promise(channelJoin, {
              pending: "Publishing video via secure connection...",
              success: "You are live now",
              error: "Error joining channel",
            })
          } else {
            toast.error(data.message)
          }
        })
        .catch((err) => toast.error(err.message))
    }
  }, [
    ctx.isLoggedIn,
    ctx.user.userType,
    ctx.relatedUserId,
    ctx.loadedFromLocalStorage,
    goneLiveOnce,
  ])

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      socket.on("viewer-joined", (data) => {
        document.getElementById("live-viewer-count").innerText = `${
          data.roomSize - 1
        } Live`
      })
      socket.on("viewer-joined", (data) => {
        document.getElementById("viewerCount").innerText = `(${
          data.roomSize - 1
        } )`
      })
      /**
       * treat model's socket disconnection same as stream end when model is live
       * doesn't matter if onCall or isStreaming
       */
      var disconnectHandler = async () => {
        /**
         * get out of the public room
         */
        let socketRooms =
          JSON.parse(sessionStorage.getItem("socket-rooms")) || []
        socketRooms = socketRooms.filter((room) => room.endsWith("-public"))
        sessionStorage.setItem("socket-rooms", JSON.stringify(socketRooms))
        if (callOnGoing) {
          /**
           * end the call
           */
          const callEndPromise = new Promise(async (resolve, reject) => {
            const callEndClear = new Event("clear-viewer-list-going-on-call")
            document.dispatchEvent(callEndClear)

            /* clear call timer */
            clearInterval(callTimerRef.current.interval)
            clearTimeout(callTimerRef.current.initialTimeout)
            callTimer.value = 0
            clearTimeout(onCallUsefulRef.current.loopRef)
            onCallUsefulRef.current = {
              loopRef: null,
            }
            setCallOnGoing(false)
            setCallType(null)
            customDataRef.current.callOngoing = false
            offCallListeners()
            sessionStorage.setItem("liveNow", "false")
            try {
              await leaveAndCloseTracks()
              await localVideoTrack.setEnabled(true)
              resolve()
            } catch (error) {
              reject()
            }
          })
          toast.promise(callEndPromise, {
            pending:
              "Ending call due to network error, please check your internet connection",
            success: "Call ended successfully",
            error: "Please check your internet connection",
          })

          /**
           * one time connect event listener to do desired things on
           * reconnection
           */

          socket.on("connect", {
            /* can fetch call details */
          })
        } else {
          /**
           * end the stream
           */
          if (sessionStorage.getItem("liveNow") === "true") {
            sessionStorage.setItem("liveNow", "false")
            sessionStorage.removeItem("streamId")
            setCallOnGoing(false)
            const streamEnd = new Promise(async (resolve, reject) => {
              try {
                await leaveAndCloseTracks()
                resolve()
              } catch (err) {
                reject()
              }
            })
            toast.promise(streamEnd, {
              pending:
                "Ending stream due to network error, please check your internet connection",
              success: "Stream ended successfully",
              error: "Please check your internet connection",
            })
          }
        }
      }
      socket.on("disconnect", disconnectHandler)

      return () => {
        socket.off("disconnect", disconnectHandler)
      }
    }
  }, [
    socketCtx.socketSetupDone,
    callOnGoing,
    leaveAndCloseTracks,
    localVideoTrack,
  ])

  useEffect(() => {
    if (joinState && !callOnGoing) {
      startStreamTimer()
      return () => {
        clearInterval(streamTimerRef.current)
        streamTimerRef.current = null
        streamTimer.timerElement = null
        streamTimer.value = 0
      }
    }
  }, [startStreamTimer, joinState, callOnGoing])

  const requestServerEndAndStreamLeave = useCallback((joinStatus = true) => {
    if (sessionStorage.getItem("liveNow") === "false") {
      return
    }
    fetch("/api/website/stream/handle-stream-end", {
      method: "POST",
      cors: "include",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        streamId: sessionStorage.getItem("streamId"),
        reason: "Manual",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        sessionStorage.setItem("liveNow", "false")
        sessionStorage.removeItem("streamId")
        setCallOnGoing(false)
        toast.success("Stream was ended successfully")
      })
      .catch((err) =>
        toast.error("Stream not was ended successfully reason: ", err.message)
      )
  }, [])

  customDataRef.current.streamEndFunction = requestServerEndAndStreamLeave

  useEffect(() => {
    requestServerEndAndStreamLeaveRef.current = requestServerEndAndStreamLeave
    leaveAndCloseTracksRef.current = (mounted) => leaveAndCloseTracks(mounted)
  }, [requestServerEndAndStreamLeave, leaveAndCloseTracks])

  useEffect(() => {
    return () => {
      if (sessionStorage.getItem("liveNow") === "true") {
        requestServerEndAndStreamLeaveRef.current()
        leaveAndCloseTracksRef.current(false)
      }
      clearInterval(streamTimerRef.current)
      clearInterval(callTimerRef.current.interval)
      clearTimeout(callTimerRef.current.initialTimeout)
    }
  }, [streamTimerRef, callTimerRef])

  const sendChatMessage = () => {
    if (!chatInputRef.current.value) {
      return
    }

    if (!goneLiveOnce) {
      return toast.info(
        "Please Go Live First, Then Chat Will Start Automatically!"
      )
    }

    const message = chatInputRef.current.value
    if (ctx.isLoggedIn && ctx.user.userType === "Model") {
      let finalRoom
      if (chatWindow === chatWindowOptions.PUBLIC) {
        JSON.parse(sessionStorage.getItem("socket-rooms")).forEach((room) => {
          if (room.includes("-public")) {
            finalRoom = room
          }
        })
        if (finalRoom) {
          const payLoad = {
            room: finalRoom,
            message: message,
            username: ctx.user.user.username,
          }
          io.getSocket().emit("model-message-public-emitted", payLoad)
          chatInputRef.current.value = ""
        } else {
          /**
           * public room not in session
           */
          io.getSocket().emit(
            "putting-me-in-these-rooms",
            [`${sessionStorage.getItem("streamId")}-public`],
            (response) => {
              if (response.status === "ok") {
                const payLoad = {
                  room: `${sessionStorage.getItem("streamId")}-public`,
                  message: message,
                  username: ctx.user.user.username,
                }
                io.getSocket().emit("model-message-public-emitted", payLoad)
                chatInputRef.current.value = ""
              }
            }
          )
        }
      } else if (chatWindow === chatWindowOptions.PRIVATE) {
        const customEvent = new CustomEvent("send-private-message", {
          detail: { message: message },
        })
        document.dispatchEvent(customEvent)
        chatInputRef.current.value = ""
      }
    }
  }

  const addAtTheRate = (username) => {
    if (chatInputRef.current.value.trim() !== "") {
      chatInputRef.current.value = `${chatInputRef.current.value} @${username}`
    } else {
      chatInputRef.current.value = `@${username} `
    }
    document.getElementById("message-input").scrollIntoView({
      block: "center",
    })
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.keyCode === 13) {
        sendChatMessage()
      }
    }
    document.addEventListener("keydown", handleKeyPress)
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [sendChatMessage])

  const offCallListeners = useCallback(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (socket.hasListeners("viewer-call-end-request-init-received")) {
        socket.off("viewer-call-end-request-init-received")
      }
      if (socket.hasListeners("viewer-call-end-request-finished")) {
        socket.off("viewer-call-end-request-finished")
      }
    }
  }, [socketCtx.socketSetupDone])

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      /**
       * when viewer goes back during call
       */
      return () => {
        const socket = io.getSocket()
        if (socket.hasListeners("viewer-call-end-request-init-received")) {
          socket.off("viewer-call-end-request-init-received")
        }
        if (socket.hasListeners("viewer-call-end-request-finished")) {
          socket.off("viewer-call-end-request-finished")
        }
      }
    }
  }, [socketCtx.socketSetupDone])

  const setUpCallListeners = () => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      let timeOutRef
      if (!socket.hasListeners("viewer-call-end-request-init-received")) {
        socket.on("viewer-call-end-request-init-received", (data) => {
          spinnerCtx.setShowSpinner(true, "Processing transaction...")
          setPendingCallEndRequest(true)
          clearInterval(callTimerRef.current.interval)
          clearTimeout(callTimerRef.current.initialTimeout)
          callTimer.value = 0
          clearTimeout(onCallUsefulRef.current.loopRef)
          onCallUsefulRef.current = {
            loopRef: null,
          }
          const callEndClear = new Event("clear-viewer-list-going-on-call")
          document.dispatchEvent(callEndClear)
          /* model is not live from now */
          sessionStorage.setItem("liveNow", "false")

          /**
           * if call end response not received
           */
          timeOutRef = setTimeout(async () => {
            /**
             * rollback as before call
             */
            clearInterval(callTimerRef.current.interval)
            clearTimeout(callTimerRef.current.initialTimeout)
            callTimer.value = 0
            setPendingCallEndRequest(false)
            setCallOnGoing(false)
            offCallListeners()
            spinnerCtx.setShowSpinner(false, "Please wait...")
            await leaveAndCloseTracks()

            /**
             * clear call details from model's socket
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
          }, [15000])
        })
      }

      /**
       * call was ended successfully by the viewer
       */
      if (!socket.hasListeners("viewer-call-end-request-finished")) {
        socket.on("viewer-call-end-request-finished", async (data) => {
          if (data.ended === "ok") {
            updateCtx.updateWallet(data.currentAmount, "set")
          }
          clearInterval(callTimerRef.current.interval)
          clearTimeout(callTimerRef.current.initialTimeout)
          callTimer.value = 0
          /* re-doing this just to be sure the call loop is clear */
          if (onCallUsefulRef.current.loopRef) {
            clearTimeout(onCallUsefulRef.current.loopRef)
            onCallUsefulRef.current = {
              loopRef: null,
            }
          }

          clearTimeout(timeOutRef)
          setPendingCallEndRequest(false)
          setCallOnGoing(false)
          offCallListeners()
          spinnerCtx.setShowSpinner(false, "Please wait...")
          await leaveAndCloseTracks()
          /**
           * clear call details from model's socket
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
        })
      }
      // toast.promise(thePromise, {
      //   pending: "Viewer has ended the call, processing transaction...",
      //   success: "Call was ended successfully",
      //   error: "Call was not ended successfully",
      // })
    }
  }

  const handleModelResponse = (response, relatedUserId, myCallType) => {
    /* can set encryption config */
    document.getElementById("call-request-audio").pause()
    document.getElementById("call-request-audio").currentTime = 0
    if (response === "rejected") {
      /* 
          if call rejected then directly emit event via socket no need for http request
      */
      const socket = io.getSocket()
      socket.emit("model-call-request-response-emitted", {
        response: response,
        relatedUserId: relatedUserId,
        callType: myCallType,
        room: `${sessionStorage.getItem("streamId")}-public`,
      })

      /* clear pending call request */
      setPendingCallRequest((prev) => {
        prev.callRequests = prev.callRequests.filter(
          (request) => request.viewer._id !== relatedUserId
        )
        prev.pending = prev.callRequests.length > 0
        return { ...prev }
      })
    } else {
      /* ACCEPTED */
      const socket = io.getSocket()
      fetch("/api/website/stream/accepted-call-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socketData: {
            response: response /* RESPONSE will be accepted is reach here */,
            callType: myCallType,
            relatedUserId: relatedUserId /* viewer */,
          },
          streamId: sessionStorage.getItem("streamId"),
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.actionStatus === "success") {
            customDataRef.current.callOngoing = true
            if (!data.socketDataUpdated) {
              socket.emit("update-client-info", {
                action: "set-call-data-model",
                callId: data.callId,
                callType: myCallType,
                sharePercent: data.sharePercent,
              })
            }

            /* clear all pending call requests */
            setPendingCallRequest((prev) => {
              prev.pending = false
              prev.callRequests = []
              return { ...prev }
            })
            /* clear stream timer */
            clearInterval(streamTimerRef.current)

            /* set up call states */
            setCallType(myCallType)
            setCallOnGoing(true)
            setUpCallListeners()
            sessionStorage.setItem("callId", data.callDoc._id)

            /* re-new with time-bound new token */
            await client.renewToken(data.rtcToken)

            /* disable video if audio call */
            if (myCallType === "audioCall") {
              await localVideoTrack.setEnabled(false)
            }

            // have to use own interval loop to request tokens
            const RENEW_BUFFER_TIME = 8000 /* fetch new token before this amount of time before actual expiry time */

            const setUpNewTimeout = async (privilegeExpiredTs, canRenew) => {
              clearTimeout(onCallUsefulRef.current.loopRef)
              if (!canRenew) {
                /* alert about the last minute */
                customDataRef.current.gracefulTokenExpiryAllowed = true
                setTimeout(() => {
                  toast.info(
                    "This is the last minute of the call, rap-up lady!"
                  )
                }, [privilegeExpiredTs - Date.now() - 60000])
              }

              const timeOutAfter = canRenew
                ? privilegeExpiredTs - Date.now() - RENEW_BUFFER_TIME
                : privilegeExpiredTs - Date.now()

              onCallUsefulRef.current.loopRef = setTimeout(() => {
                if (canRenew) {
                  fetchAndRenewToken()
                } else {
                  /* end the call... */
                  console.debug("Call should end now!🔻🔻🔻🔻")
                  // handleCallEnd()
                }
              }, [timeOutAfter])
            }

            const fetchAndRenewToken = async () => {
              try {
                const {
                  rtcToken,
                  privilegeExpiredTs,
                  canRenew,
                  endImmediately,
                } = await (
                  await fetch(
                    `/api/website/token-builder/global-renew-token?channel=${client.channelName}&onCall=true&callId=${data.callDoc._id}&callType=${myCallType}&viewerId=${relatedUserId}`
                  )
                ).json()

                if (endImmediately) {
                  toast.warn("Viewer has used all coins, call will end now")
                  return customDataRef.current.handleCallEnd()
                }

                /**
                 * canRenew tell is next time can i renew the token or not
                 */
                await client.renewToken(rtcToken)
                setUpNewTimeout(+privilegeExpiredTs * 1000, canRenew)
              } catch (err) {
                toast.warn(err.message, " Call will end now!")
              }
            }

            if (data.canAffordNextMinute) {
              onCallUsefulRef.current.loopRef = setTimeout(() => {
                fetchAndRenewToken()
              }, [
                +data.privilegeExpiredTs * 1000 -
                  Date.now() -
                  RENEW_BUFFER_TIME,
              ])
            } else {
              /**
               * anyway token will expire and end the call
               * hence not need for setting timeout
               */
              customDataRef.current.gracefulTokenExpiryAllowed = true
              setTimeout(() => {
                toast.info("This is the last minute of the call, rap-up lady!")
              }, [+data.privilegeExpiredTs * 1000 - Date.now() - 60000])
            }

            /* fire event for clearing all viewer list */
            const viewerClearEvent = new CustomEvent(
              "clean-viewer-list-going-on-call",
              {
                detail: { viewerId: relatedUserId },
              }
            )
            document.dispatchEvent(viewerClearEvent)

            /**
             * start call timer
             */
            const startCallTimerAfter =
              new Date(data.callStartTs).getTime() - Date.now()
            startCallTimer(startCallTimerAfter)
          } else {
            if (data?.notStreaming) {
              /* model is not streaming from the stand point of server */
              /* clear all pending call requests */
              setPendingCallRequest({ pending: false, callRequests: [] })
            }
          }
        })
        .catch((err) => {
          toast.error(err.message, "CODE: ", err?.code)
        })
    }
  }

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      /* listen for viewer call request with all the details of the viewer */
      const socket = io.getSocket()
      if (!socket.hasListeners("viewer-requested-for-call-received-private")) {
        socket.on("viewer-requested-for-call-received-private", (data) => {
          // alert("call request received from viewer!")
          /* check if call request form this viewer already exists */
          if (
            !pendingCallRequest.callRequests.find(
              (request) => request.username === data.username
            )
          ) {
          }
          document.getElementById("call-request-audio").play()
          setPendingCallRequest((prev) => {
            prev.pending = true
            prev.callRequests.push({
              callType: data.callType,
              username: data.username,
              viewer: data.viewer,
            })
            return { ...prev }
          })
        })
        return () => {
          socket.off("viewer-requested-for-call-received-private")
        }
      }
    }
  }, [socketCtx.socketSetupDone])

  const handleCallEnd = useCallback(async () => {
    /**
     * deps: [callType,localVideoTrack,leaveAndCloseTracks,offCallListeners]
     */

    if (pendingCallEndRequest) {
      return toast.info(
        "Your call end request is processing please have patience... 😀"
      )
    }

    const a = await callOnGoing
    if (!a) {
      return alert("no ongoing call")
    }

    /* model is not live from now */
    sessionStorage.setItem("liveNow", "false")

    const socket = io.getSocket()
    socket.emit("model-call-end-request-init-emitted", {
      action: "model-has-requested-call-end",
      room: `${sessionStorage.getItem("streamId")}-public`,
    })

    const callEndClear = new Event("clear-viewer-list-going-on-call")
    document.dispatchEvent(callEndClear)

    /* clear call timer */
    clearInterval(callTimerRef.current.interval)
    clearTimeout(callTimerRef.current.initialTimeout)
    callTimer.value = 0

    clearTimeout(onCallUsefulRef.current.loopRef)
    onCallUsefulRef.current = {
      loopRef: null,
    }
    spinnerCtx.setShowSpinner(true, "Processing transaction...")
    setPendingCallEndRequest(true)

    fetch("/api/website/stream/handle-call-end-from-model", {
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
        /**
         * three scenario's are possible
         * call end request put first
         * wasNot first
         * call not setuped properly
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
        /* CASE:1 if call was not setup properly */
        if (data?.callWasNotSetupProperly) {
          /* just close the whole call setup and restore back to the stream mode */
          setCallOnGoing(false)
          spinnerCtx.setShowSpinner(false, "Please wait...")
          await leaveAndCloseTracks()
          offCallListeners()
          setPendingCallEndRequest(false)
          localVideoTrack.setEnabled(true)
        } else if (
          !data?.callWasNotSetupProperly &&
          data.wasFirst === "yes" &&
          data.actionStatus === "success"
        ) {
          /* just close the whole call setup and restore back to the stream mode */
          setCallOnGoing(false)
          spinnerCtx.setShowSpinner(false, "Please wait...")
          await leaveAndCloseTracks()
          offCallListeners()
          setPendingCallEndRequest(false)
          offCallListeners()
          localVideoTrack.setEnabled(true)
          updateCtx.updateWallet(data.currentAmount, "set")
        } else if (!data?.callWasNotSetupProperly && data.wasFirst === "no") {
          /* if was not first wait for the socket end call response for 10 seconds or error out if not received */
          setTimeout(() => {
            setCallOnGoing(async (isCallOngoing) => {
              const a = await isCallOngoing
              if (a) {
                toast.warn(
                  "Viewer requested for call end before you, please wait white transaction is processing"
                )
                spinnerCtx.setShowSpinner(false, "Please wait...")
                await leaveAndCloseTracks()
                offCallListeners()
                setPendingCallEndRequest(false)
                offCallListeners()
              }
              return false
            })
          }, [10000])
          localVideoTrack.setEnabled(true)
        }
      })
      .catch(async (err) => {
        alert("Call was not ended successfully!")
        setCallOnGoing(false)
        spinnerCtx.setShowSpinner(false, "Please wait...")
        await leaveAndCloseTracks()
        offCallListeners()
        setPendingCallEndRequest(false)
        offCallListeners()
        localVideoTrack.setEnabled(true)
      })
  }, [
    callType,
    localVideoTrack,
    leaveAndCloseTracks,
    offCallListeners,
    callOnGoing,
    pendingCallEndRequest,
    customDataRef,
    onCallUsefulRef,
    callTimerRef,
  ])

  customDataRef.current.handleCallEnd = handleCallEnd

  return ctx.isLoggedIn === true && ctx.user.userType === "Model" ? (
    <div className="tw-w-full">
      {pendingCallRequest.pending && (
        <div className="tw-px-6 tw-py-1.5 tw-text-white-color tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-backdrop-blur tw-z-[390] tw-text-sm">
          {pendingCallRequest.callRequests.map((request, index) => {
            return (
              <div className="tw-flex tw-justify-center tw-items-center tw-mb-0.5">
                <p className="tw-mx-2">
                  Incoming{" "}
                  <span className="tw-text-dreamgirl-red">
                    {request.callType}
                  </span>{" "}
                  from{" "}
                  <span className="tw-font-semibold">
                    {request.viewer.rootUser.username}
                  </span>
                </p>
                <Button
                  className="tw-rounded-full tw-self-center tw-text-sm tw-z-[110] tw-inline-block tw-mx-2"
                  variant="success"
                  size="sm"
                  onClick={() =>
                    handleModelResponse(
                      "accepted",
                      request.viewer._id,
                      request.callType
                    )
                  }
                >
                  <span className="tw-pl-1">Accept</span>
                </Button>
                <Button
                  className="tw-rounded-full tw-self-center tw-text-sm tw-z-[110] tw-inline-block tw-mx-2"
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    handleModelResponse(
                      "rejected",
                      request.viewer._id,
                      request.callType
                    )
                  }
                >
                  <span className="tw-pl-1">Cancel</span>
                </Button>
              </div>
            )
          })}
        </div>
      )}
      <div className="tw-flex tw-w-full">
        <div className={"sm:tw-flex sm:tw-flex-1 tw-bg-dark-black"}>
          <div
            className="tw-bg-first-color tw-flex-[5] sm:tw-h-[37rem] tw-h-[40rem] tw-relative xl:tw-h-[90vh] "
            ref={container}
            id="playback-area"
          >
            {/* on call timer */}
            {callOnGoing && (
              <div className="tw-absolute tw-left-[50%] tw-translate-x-[-50%] tw-top-3 tw-flex tw-justify-around tw-items-center tw-rounded tw-px-4 tw-py-2 tw-bg-[rgba(22,22,22,0.35)] tw-z-[390] tw-backdrop-blur">
                <p id="call-timer" className="tw-text-center text-white">
                  00:00
                </p>
              </div>
            )}

            {/* if streaming, model's preview */}
            {!callOnGoing && !remoteUsers[0] ? (
              <VideoPlayer
                videoTrack={localVideoTrack}
                audioTrack={localAudioTrack}
                playAudio={false}
              />
            ) : null}

            {/* on call | viewer image */}
            {callOnGoing && callType && remoteUsers[0] ? (
              <VideoPlayer
                videoTrack={
                  callType === "videoCall" ? remoteUsers[0].videoTrack : null
                }
                audioTrack={remoteUsers[0].audioTrack}
                playAudio={true}
                config={callType}
              />
            ) : null}

            {/* on call | model's image */}
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
                    config={callType}
                  />
                </div>
              </div>
            ) : null}

            {/* call controls */}
            {callOnGoing && (
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
                    {!muted ? (
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
                  {fullScreen ? (
                    <FullscreenExitIcon
                      fontSize="medium"
                      style={{ color: "white" }}
                    />
                  ) : (
                    <FullscreenIcon
                      fontSize="medium"
                      style={{ color: "white" }}
                    />
                  )}
                </button>
              </div>
            )}
            {/* on stream controls */}
            {!callOnGoing && (
              <div className="tw-absolute tw-w-full tw-bottom-0 tw-z-[110] tw-backdrop-blur">
                <div className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-px-4 tw-bg-[rgba(29,26,26,0.62)]">
                  {!joinState ? (
                    <Button
                      className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                      variant="success"
                      onClick={startStreamingAndGoLive}
                    >
                      <LiveTvIcon fontSize="small" />
                      <span className="tw-pl-1 tw-tracking-tight">Go Live</span>
                    </Button>
                  ) : (
                    <Button
                      className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                      variant="danger"
                      onClick={() => {
                        requestServerEndAndStreamLeave(joinState)
                        leaveAndCloseTracks()
                      }}
                    >
                      <LiveTvIcon fontSize="small" />
                      <span className="tw-pl-1 tw-tracking-tight">
                        End Streaming
                      </span>
                    </Button>
                  )}

                  <div className="tw-px-3 tw-flex tw-items-center tw-justify-between">
                    {joinState && (
                      <span className="tw-relative tw-mr-3">
                        <p
                          className="tw-px-3 tw-py-1.5 tw-text-white-color"
                          id="stream-timer"
                        >
                          00:00
                        </p>
                      </span>
                    )}
                    {joinState && (
                      <div className="tw-rounded tw-ml-3">
                        {localAudioTrack && (
                          <button className="tw-inline-block tw-px-2">
                            {!muted ? (
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
                      </div>
                    )}
                  </div>
                  <span
                    id="live-viewer-count"
                    className={
                      joinState
                        ? "tw-text-green-color tw-border tw-border-green-color tw-rounded-full tw-px-2 tw-py-0.5 tw-text-sm tw-tracking-tight"
                        : "tw-text-red-400 tw-border tw-border-red-400 tw-rounded-full tw-px-2 tw-py-0.5 tw-text-sm tw-tracking-tight "
                    }
                  >
                    {`${joinState ? "🕓🕔..." : "You are not live"}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* chat site | ex right side */}
          <div className="tw-bg-second-color sm:tw-w-[40%] sm:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-screen xl:tw-h-[90vh] tw-flex tw-flex-col tw-justify-between tw-items-stretch">
            <div className="tw-flex   tw-text-white sm:tw-pt-3 tw-pb-3 tw-px-2 sm:tw-px-4 tw-text-center tw-content-center tw-items-center tw-shadow-md">
              <button
                className={`tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-mr-4 ${
                  chatWindow === chatWindowOptions?.PUBLIC
                    ? "tw-text-dreamgirl-red tw-font-semibold"
                    : "tw-text-white-color tw-font-normal sm:-font-medium"
                }`}
                onClick={() => setChatWindow(chatWindowOptions.PUBLIC)}
              >
                <ChatBubbleIcon
                  className="tw-mr-1 tw-my-auto"
                  fontSize="small"
                />
                <span className="tw-my-auto tw-text-xs md:tw-text-sm">
                  Live Chat
                </span>
              </button>
              <button
                className={`tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-relative tw-mr-4 ${
                  chatWindow === chatWindowOptions?.PRIVATE
                    ? "tw-text-dreamgirl-red tw-font-semibold"
                    : "tw-text-white-color"
                }`}
                onClick={() => {
                  setChatWindow(chatWindowOptions.PRIVATE)
                  newChatNotifierDotRef.current.display = "none"
                }}
              >
                <MarkChatReadIcon
                  className="tw-mr-1 tw-my-auto"
                  fontSize="small"
                />
                <span className="tw-font-normal sm:-font-medium tw-my-auto tw-text-xs md:tw-text-sm">
                  Private Chat
                </span>
                <span
                  ref={newChatNotifierDotRef}
                  className="tw-absolute tw-top-0 tw-left-0 tw-w-2 tw-h-2 tw-bg-dreamgirl-red tw-rounded-full tw-hidden"
                ></span>
              </button>
              {ctx.user.userType !== "Model" && (
                <button
                  className={`tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-mr-4 ${
                    chatWindow === chatWindowOptions?.TIP_MENU
                      ? "tw-text-dreamgirl-red tw-font-semibold"
                      : "tw-text-white-color"
                  }`}
                  onClick={() => setChatWindow(chatWindowOptions.TIP_MENU)}
                >
                  <LocalActivityIcon
                    className="tw-mr-1 tw-my-auto"
                    fontSize="small"
                  />
                  <span className="tw-font-normal sm:tw-font-medium tw-my-auto tw-text-xs md:tw-text-sm">
                    Tip Menu
                  </span>
                </button>
              )}
              {ctx.user.userType === "Model" ? (
                <button
                  className={`tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-mr-4 ${
                    chatWindow === chatWindowOptions?.USERS
                      ? "tw-text-dreamgirl-red tw-font-semibold"
                      : "tw-text-white-color"
                  }`}
                  onClick={() => setChatWindow(chatWindowOptions.USERS)}
                >
                  <ChatBubbleIcon
                    className="tw-mr-1 tw-my-auto"
                    fontSize="small"
                  />
                  <span className="tw-font-normal sm:tw-font-medium tw-my-auto tw-text-xs md:tw-text-sm">
                    Users
                    <span
                      id="viewerCount"
                      className="tw-font-extralight tw-text-xs tw-ml-2"
                    >
                      (0)
                    </span>
                  </span>
                </button>
              ) : null}
            </div>

            <div className="tw-flex-grow tw-max-w-[100vw] lg:tw-max-w-[49vw] tw-flex-shrink-0 tw-relative tw-z-[110]">
              {/* PUBLIC CHAT */}
              <div
                ref={publicChatContainerRef}
                style={{
                  zIndex: chatWindow === chatWindowOptions.PUBLIC ? 120 : 111,
                  visibility:
                    chatWindow === chatWindowOptions.PUBLIC
                      ? "visible"
                      : "hidden",
                }}
                className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-overflow-y-scroll tw-bg-second-color"
              >
                <PublicChat
                  scrollOnChat={scrollOnChat}
                  addAtTheRate={addAtTheRate}
                  chatWindowRef={chatWindowRef}
                />
              </div>

              {/* PRIVATE CHAT */}
              <div
                ref={privateChatContainerRef}
                style={{
                  zIndex: chatWindow === chatWindowOptions.PRIVATE ? 120 : 113,
                  visibility:
                    chatWindow === chatWindowOptions.PRIVATE
                      ? "visible"
                      : "hidden",
                }}
                className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-overflow-y-scroll tw-bg-second-color"
              >
                <PrivateChatWrapper
                  scrollOnChat={scrollOnChat}
                  chatWindowRef={chatWindowRef}
                  newChatNotifierDotRef={newChatNotifierDotRef}
                />
              </div>

              {/* VIEWERS LIST */}
              <div
                style={{
                  zIndex: chatWindow === chatWindowOptions.USERS ? 120 : 117,
                  visibility:
                    chatWindow === chatWindowOptions.USERS
                      ? "visible"
                      : "hidden",
                }}
                className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-overflow-y-scroll tw-bg-second-color"
              >
                <ViewersListContainer
                  callOnGoing={callOnGoing}
                  addAtTheRate={(username) => {
                    addAtTheRate(username)
                    setChatWindow(chatWindowOptions.PUBLIC)
                  }}
                />
              </div>
            </div>

            {/* MESSAGE INPUT */}
            <div
              id="message-input"
              className="tw-flex tw-py-1.5 tw-bg-second-color tw-text-white tw-place-items-center tw-w-full tw-border-b tw-border-first-color tw-flex-shrink tw-flex-grow-0"
            >
              <div className="tw-rounded-full tw-bg-dark-black tw-flex md:tw-mx-1 tw-outline-none tw-place-items-center tw-w-full tw-relative">
                <input
                  className="tw-flex tw-flex-1 tw-mx-2 tw-rounded-full tw-py-1 tw-px-2 tw-bg-dark-black tw-border-0 md:tw-mx-1 tw-outline-none"
                  placeholder="Enter your message here"
                  ref={chatInputRef}
                  id="chat-message-input"
                ></input>
                <Emoji chatInputRef={chatInputRef} />
                <button
                  onClick={sendChatMessage}
                  className="sm:tw-py-3 tw-py-2 tw-px-2 sm:tw-px-4 tw-bg-blue-500 sm:tw-ml-1 tw-ml-2 tw-rounded-full"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Videoshowcontroller />
    </div>
  ) : (
    <div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen">
      <h1 className="tw-font-semibold tw-text-xl">You are not a Model</h1>
    </div>
  )
}

export default Live
