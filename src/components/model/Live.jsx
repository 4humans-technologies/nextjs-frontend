import Header from "../Mainpage/Header"
import SecondHeader from "../Mainpage/SecondHeader"
import Sidebar from "../Mainpage/Sidebar"
import React, {
  useReducer,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer"
import { Button } from "react-bootstrap"
import Footer from "../Mainpage/Footer"

import PublicChat from "./PublicChat"
import PrivateChat from "./PrivateChat"
import LivePeople from "./LivePeople"
import AgoraRTC from "agora-rtc-sdk-ng"
import useAgora from "../../hooks/useAgora" //using agora from Hooks
import VideoPlayer from "../UI/VideoPlayer"
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions"
import { useAuthContext } from "../../app/AuthContext"
import { useAuthUpdateContext } from "../../app/AuthContext"
import Slider from "@material-ui/core/Slider"
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
import { useRouter } from "next/router"
import LocalActivityIcon from "@material-ui/icons/LocalActivity"
import MarkChatReadIcon from "@material-ui/icons/Markunread"
import TipMenuActions from "../ViewerScreen/TipMenuActions"
import io from "../../socket/socket"
import Showcontroler from "./VideoStreaming/Showcontroler"
import Videoshowcontroller from "./VideoStreaming/Videoshowcontroller"
import LiveTvIcon from "@material-ui/icons/LiveTv"
import { useSocketContext } from "../../app/socket/SocketContext"
import useModalContext from "../../app/ModalContext"
import CallEndIcon from "@material-ui/icons/CallEnd"
import MicOffIcon from "@material-ui/icons/MicOff"
import MicIcon from "@material-ui/icons/Mic"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit"
import useSpinnerContext from "../../app/Loading/SpinnerContext"
import CallEndDetails from "../Call/CallEndDetails"
import PrivateChatWrapper from "../PrivateChat/PrivateChatWrapper"

// Replace with your App ID.
let token
let client
let rtcTokenExpireIn

/**
 * CREATING AGORA CLIENT
 */

const clientOptions = { codec: "h264", mode: "live" }
client = AgoraRTC.createClient(clientOptions)
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

  const ctx = useAuthContext()
  const socketCtx = useSocketContext()
  const spinnerCtx = useSpinnerContext()
  const updateCtx = useAuthUpdateContext()
  const modalCtx = useModalContext()
  const [fullScreen, setFullScreen] = useState(false)
  const [chatWindow, setChatWindow] = useState(chatWindowOptions.PUBLIC)

  useEffect(() => {
    chatWindowRef.current = chatWindow
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
  const callTimerRef = useRef()
  const newChatNotifierDotRef = useRef()
  const requestServerEndAndStreamLeaveRef = useRef()
  const leaveAndCloseTracksRef = useRef()
  const isLiveNowRef = useRef("not-init")

  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    startLocalCameraPreview,
    leaveAndCloseTracks,
  } = useAgora(client, "host", "videoCall")

  const toggleMuteMic = () => {
    if (localAudioTrack.muted) {
      /* un mute audio */
      localAudioTrack.setMuted(false)
      setMuted(false)
    } else {
      /* mute the audio */
      localAudioTrack.setMuted(true)
      setMuted(true)
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

  useEffect(() => {
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
    }, 3000)

    return () => {
      clearInterval(myKeepInRoomLoop)
    }
  }, [isLiveNowRef])

  const scrollOnChat = useCallback((scrollType) => {
    // document.getElementById("for-scroll-into-view").scrollIntoView({
    //   behavior: "smooth",
    //   block: "start",
    // })
    const containerElement = document.getElementById("chatBoxContainer")
    containerElement.scrollBy({
      top: containerElement.scrollHeight,
      behavior: scrollType ? scrollType : "smooth",
    })
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

  useEffect(() => {
    /* clear the rtcToken onetime on first mount only */
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

    if (
      !localStorage.getItem("rtcToken") &&
      +localStorage.getItem("rtcTokenExpireIn") <= Date.now() + 180000 &&
      ctx.loadedFromLocalStorage
    ) {
      /* if no token or expired token, fetch new token */
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
            sessionStorage.setItem("liveNow", "true")
            token = data.rtcToken
            rtcTokenExpireIn = data.privilegeExpiredTs
            localStorage.setItem("rtcToken", data.rtcToken)
            localStorage.setItem(
              "rtcTokenExpireIn",
              +data.privilegeExpiredTs * 1000
            )
            sessionStorage.setItem("streamId", data.streamId)
            return join(ctx.relatedUserId, token, ctx.relatedUserId)
          })
          .catch((error) => console.log(error))
      }
    } else {
      /* have a valid token, fetch request for status update not for rtc token */
      fetch("/api/website/stream/create-stream-without-token")
        .then((resp) => {
          return resp.json()
        })
        .then((data) => {
          //debugger
          sessionStorage.setItem("liveNow", "true")
          sessionStorage.setItem("streamId", data.streamId)
          return join(
            ctx.relatedUserId,
            localStorage.getItem("rtcToken"),
            ctx.relatedUserId
          )
        })
        .catch((error) => console.log(error))
    }
  }, [
    ctx.isLoggedIn,
    ctx.user.userType,
    ctx.relatedUserId,
    ctx.loadedFromLocalStorage,
    goneLiveOnce,
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
  }, [startStreamTimer, joinState, callOnGoing, streamTimerRef])

  const requestServerEndAndStreamLeave = useCallback((joinStatus = true) => {
    if (!joinStatus) {
      return
    }
    if (sessionStorage.getItem("liveNow") === "false") {
      return
    }
    // alert("will end stream now")
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
        // alert(data.message)
        sessionStorage.setItem("liveNow", "false")
        sessionStorage.removeItem("streamId")
        setCallOnGoing(false)
        // leaveAndCloseTracks()
      })
      .catch((err) =>
        alert("Stream was not ended successfully! " + err.message)
      )
  }, [])

  useEffect(() => {
    requestServerEndAndStreamLeaveRef.current = requestServerEndAndStreamLeave
    leaveAndCloseTracksRef.current = leaveAndCloseTracks
  }, [requestServerEndAndStreamLeave, leaveAndCloseTracks])

  useEffect(() => {
    return () => {
      if (sessionStorage.getItem("liveNow") === "true") {
        requestServerEndAndStreamLeaveRef.current()
        leaveAndCloseTracksRef.current()
      }
      clearInterval(streamTimerRef.current)
      clearInterval(callTimerRef.current)
    }
  }, [])

  const sendChatMessage = () => {
    if (!chatInputRef.current) {
      alert("ref not created, updated")
      return
    }

    if (!chatInputRef.current.value) {
      return
    }

    if (!goneLiveOnce) {
      alert("Please Go Live First, Then Chat Will Start Automatically!")
      return
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
        const payLoad = {
          room: finalRoom,
          message: message,
          username: ctx.user.user.username,
        }
        io.getSocket().emit("model-message-public-emitted", payLoad)
        chatInputRef.current.value = ""
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
    if (!chatInputRef.current) {
      alert("ref not created, updated")
      return
    }
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

  const offCallListeners = () => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (socket.hasListeners("viewer-call-end-request-init-received")) {
        socket.off("viewer-call-end-request-init-received")
      }
      if (socket.hasListeners("viewer-call-end-request-finished")) {
        socket.off("viewer-call-end-request-finished")
      }
    }
  }

  const setUpCallListeners = () => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (!socket.hasListeners("viewer-call-end-request-init-received")) {
        socket.on("viewer-call-end-request-init-received", (data) => {
          /* viewer has put call end request before you */
          // alert("viewer ended call")
          setPendingCallEndRequest(true)
          spinnerCtx.setShowSpinner(true, "Processing transaction...")
        })
      }

      /*  */
      if (!socket.hasListeners("viewer-call-end-request-finished")) {
        socket.on("viewer-call-end-request-finished", async (data) => {
          if (data.ended === "ok") {
            sessionStorage.setItem("callEndDetails", JSON.stringify(data))
            spinnerCtx.setShowSpinner(false, "Processing transaction...")
          }
          setPendingCallEndRequest(false)
          // setCallEndDetails(data.callEndDetails)
          setCallOnGoing(false)
          offCallListeners()
          spinnerCtx.setShowSpinner(false, "Processing transaction...")
          await leaveAndCloseTracks()
        })
      }
    }
  }

  const handleModelResponse = (response, relatedUserId, callType) => {
    /* can set encryption config */
    if (response === "rejected") {
      /* 
          if call rejected then directly emit event via socket no need for http request
      */

      io.getSocket().emit("model-call-request-response-emitted", {
        response: response,
        relatedUserId: relatedUserId,
        callType: callType,
        room: `${sessionStorage.getItem("streamId")}-public`,
      })
      setPendingCallRequest((prev) => {
        prev.pending = false

        prev.callRequests.filter(
          (request) => request.viewer.relatedUser._id !== relatedUserId
        )

        return { ...prev }
      })
    } else {
      fetch("/api/website/stream/accepted-call-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socketData: {
            response: response /* RESPONSE will be accepted is reach here */,
            callType: callType,
            relatedUserId: relatedUserId /* viewer */,
          },
          streamId: sessionStorage.getItem("streamId"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // data.callStartTs
          setPendingCallRequest((prev) => {
            prev.pending = false
            prev.callRequests.filter(
              (request) => request.viewer.relatedUser._id !== relatedUserId
            )

            return { ...prev }
          })
          setCallType(callType)
          setCallOnGoing(true)
          setUpCallListeners()
          sessionStorage.setItem("callId", data.callDoc._id)
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
        })
        .catch((err) => alert(err.message))
    }
  }

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      /* listen for viewer call request with all the details of the viewer */
      const socket = io.getSocket()
      if (!socket.hasListeners("viewer-requested-for-call-received-private")) {
        socket.on("viewer-requested-for-call-received-private", (data) => {
          // alert("call request received from viewer!")
          document.getElementById("call-request-audio").play()
          setPendingCallRequest({
            callType: data.callType,
            pending: true,
            data: data,
          })
        })
        return () => {
          socket.off("viewer-requested-for-call-received-private")
        }
      }
    }
  }, [socketCtx.socketSetupDone])

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
    socket.emit("model-call-end-request-init-emitted", {
      action: "model-has-requested-call-end",
      room: `${sessionStorage.getItem("streamId")}-public`,
    })

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
        if (data.wasFirst === "yes" && data.actionStatus === "success") {
          /* */
          sessionStorage.setItem("callEndDetails", JSON.stringify(data))
          spinnerCtx.setShowSpinner(false, "Please wait...")
        }
        setCallOnGoing(false)
        await leaveAndCloseTracks()
        offCallListeners()
        setPendingCallEndRequest(false)
        // setCallEndDetails(data.callEndDetails)
        offCallListeners()
      })
  }

  return ctx.isLoggedIn === true && ctx.user.userType === "Model" ? (
    <div>
      <Header />
      <audio
        preload="true"
        src="/audio/call-request.mp3"
        id="call-request-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/private-message.mp3"
        id="private-message-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/superchat-2.mp3"
        id="superchat-2-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/superchat.mp3"
        id="superchat-audio"
      ></audio>
      <audio
        preload
        src="/audio/money-debit.mp3"
        id="money-debit-audio"
      ></audio>
      {pendingCallRequest.pending && (
        <div className="tw-px-6 tw-py-4 tw-text-white-color tw-font-semibold tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-backdrop-blur tw-z-[390]">
          <div className="tw-flex tw-justify-center tw-items-center">
            <p className="tw-mx-2">
              Incoming {pendingCallRequest[0].callType} from{" "}
              {pendingCallRequest[0].viewer.username}
            </p>
            <Button
              className="tw-rounded-full tw-self-center tw-text-sm tw-z-[110] tw-inline-block tw-mx-2"
              variant="success"
              onClick={() =>
                handleModelResponse(
                  "accepted",
                  pendingCallRequest[0].viewer.relatedUser._id,
                  pendingCallRequest[0].callType
                )
              }
            >
              <span className="tw-pl-1">Accept</span>
            </Button>
            <Button
              className="tw-rounded-full tw-self-center tw-text-sm tw-z-[110] tw-inline-block tw-mx-2"
              variant="danger"
              onClick={() =>
                handleModelResponse(
                  "rejected",
                  pendingCallRequest[0].viewer.relatedUser._id,
                  pendingCallRequest[0].callType
                )
              }
            >
              <span className="tw-pl-1">Cancel</span>
            </Button>
          </div>
        </div>
      )}
      <div className="tw-flex">
        <Sidebar />
        <div
          className={"sm:tw-flex sm:tw-flex-1 tw-bg-dark-black sm:tw-mt-28 "}
        >
          <div
            className="tw-bg-first-color tw-flex-[5] sm:tw-h-[37rem] tw-h-[50rem]  sm:tw-mt-4 tw-mt-2 tw-relative"
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
                config={"videoCall"}
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

            {/* {!callOnGoing && joinState && localAudioTrack ? (
              <div className="tw-rounded tw-px-4 tw-py-2 tw-bg-[rgba(58,54,54,0.2)] tw-z-[300] tw-backdrop-blur">
                <button className="tw-inline-block tw-px-2 tw-z-[390]">
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
              </div>
            ) : null} */}

            {/* on stream controls */}
            {!callOnGoing && (
              <div className="tw-absolute tw-w-full tw-bottom-0">
                <div className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-px-4 tw-z-[300] tw-bg-[rgba(29,26,26,0.62)]">
                  {!joinState ? (
                    <Button
                      className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-z-[110]"
                      variant="success"
                      onClick={startStreamingAndGoLive}
                    >
                      <LiveTvIcon fontSize="small" />
                      <span className="tw-pl-1 tw-tracking-tight">Go Live</span>
                    </Button>
                  ) : (
                    <Button
                      className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-z-[110]"
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
                  {joinState && (
                    <span className="tw-relative tw-z-[390]">
                      <p
                        className="tw-px-3 tw-py-1.5 tw-rounded tw-font-semibold tw-bg-[rgba(20,20,20,0.75)] tw-text-white-color tw-z-[110]"
                        id="stream-timer"
                      >
                        00:00
                      </p>
                    </span>
                  )}
                  {joinState && (
                    <div className="tw-rounded tw-px-4 tw-py-2 tw-bg-[rgba(58,54,54,0.2)] tw-z-[300] tw-backdrop-blur">
                      <button className="tw-inline-block tw-px-2 tw-z-[390]">
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
                    </div>
                  )}
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-z-[110] tw-capitalize"
                    variant={joinState ? "success" : "danger"}
                  >
                    <span className="tw-pl-1 tw-tracking-tight">{`${
                      joinState ? "you are live" : "you're not live"
                    }`}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* chat site | ex right side */}
          <div className="sm:tw-mt-4 tw-mt-2 tw-bg-second-color sm:tw-w-4/12 sm:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-screen">
            <div className="tw-flex tw-justify-around sm:tw-justify-between tw-text-white sm:tw-pt-3 tw-pb-3 tw-px-2 sm:tw-px-4 tw-text-center tw-content-center tw-items-center">
              <button
                className="tw-inline-flex tw-items-center tw-content-center tw-py-2"
                onClick={() => setChatWindow(chatWindowOptions.PUBLIC)}
              >
                <ChatBubbleIcon className="tw-mr-2 tw-my-auto" />
                <span className="tw-font-normal sm:-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                  Live Chat
                </span>
              </button>
              <button
                className="tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-relative"
                onClick={() => {
                  setChatWindow(chatWindowOptions.PRIVATE)
                  newChatNotifierDotRef.current.display = "none"
                }}
              >
                <MarkChatReadIcon className="tw-mr-2 tw-my-auto" />
                <span className="tw-font-normal sm:-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                  Private Chat
                </span>
                <span
                  ref={newChatNotifierDotRef}
                  className="tw-absolute tw-top-0 tw-left-0 tw-w-2 tw-h-2 tw-bg-dreamgirl-red tw-rounded-full tw-hidden"
                ></span>
              </button>
              {ctx.user.userType !== "Model" && (
                <button
                  className="tw-inline-flex tw-items-center tw-content-center tw-py-2"
                  onClick={() => setChatWindow(chatWindowOptions.TIP_MENU)}
                >
                  <LocalActivityIcon className="tw-mr-2 tw-my-auto" />
                  <span className="tw-font-normal sm:tw-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                    Tip Menu
                  </span>
                </button>
              )}
              {ctx.user.userType === "Model" ? (
                <button
                  className="tw-inline-flex tw-items-center tw-content-center tw-py-2"
                  onClick={() => setChatWindow(chatWindowOptions.USERS)}
                >
                  <ChatBubbleIcon className="tw-mr-2 tw-my-auto" />
                  <span className="tw-font-normal sm:tw-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                    Users
                  </span>
                </button>
              ) : null}
            </div>

            <div
              id="chatBoxContainer"
              className="tw-absolute tw-h-[90%] tw-bottom-0 tw-max-w-[100vw] lg:tw-max-w-[49vw] chat-box-container tw-overflow-y-scroll tw-w-full"
            >
              <div className="tw-bottom-0 tw-relative tw-w-full tw-pb-18 tw-bg-second-color">
                <div
                  className="tw-relative"
                  style={{
                    display:
                      chatWindow === chatWindowOptions.PUBLIC
                        ? "block"
                        : "none",
                  }}
                >
                  <PublicChat
                    scrollOnChat={scrollOnChat}
                    addAtTheRate={addAtTheRate}
                    chatWindowRef={chatWindowRef}
                  />
                </div>
                <div
                  className="tw-relative"
                  style={{
                    display:
                      chatWindow === chatWindowOptions.PRIVATE
                        ? "block"
                        : "none",
                  }}
                >
                  <PrivateChatWrapper
                    scrollOnChat={scrollOnChat}
                    chatWindowRef={chatWindowRef}
                    newChatNotifierDotRef={newChatNotifierDotRef}
                  />
                </div>
                <div
                  className="tw-relative"
                  style={{
                    display:
                      chatWindow === chatWindowOptions.TIP_MENU
                        ? "block"
                        : "none",
                  }}
                >
                  <TipMenuActions />
                </div>
                <div
                  className=""
                  style={{
                    display:
                      chatWindow === chatWindowOptions.USERS ? "block" : "none",
                  }}
                >
                  <div className="">USERS</div>
                </div>
              </div>
              <div id="for-scroll-into-view"></div>
            </div>

            <div
              id="message-input"
              className="tw-flex tw-py-1.5 tw-bg-second-color tw-text-white tw-place-items-center tw-absolute tw-bottom-0 tw-w-full tw-border-b tw-border-first-color"
            >
              <div className="tw-rounded-full tw-bg-dark-black tw-flex md:tw-mx-1 tw-outline-none tw-place-items-center tw-w-full tw-relative">
                <input
                  className="tw-flex tw-flex-1 tw-mx-2 tw-rounded-full tw-py-2 tw-px-6 tw-bg-dark-black tw-border-0 md:tw-mx-1 tw-outline-none"
                  placeholder="Enter your message here"
                  ref={chatInputRef}
                  id="chat-message-input"
                ></input>
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
      <Footer />
    </div>
  ) : (
    <div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen">
      <h1 className="tw-font-semibold tw-text-xl">You are not a Model</h1>
    </div>
  )
}

export default Live
