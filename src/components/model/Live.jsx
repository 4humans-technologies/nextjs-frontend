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
// /api/website/token-builder/create-stream-and-gen-token

// Replace with your App ID.
let token
let client
let rtcTokenExpireIn
const callType =
  "videoCall" /* to tell useAgora if want to create videoTrack/audioTrack */

/**
 * CREATING AGORA CLIENT
 */
const createAgoraClient = (extraOptions) => {
  if (!extraOptions) {
    extraOptions = {}
  }
  const clientOptions = { codec: "h264", mode: "live", ...extraOptions }
  client = AgoraRTC.createClient(clientOptions)
  client.setClientRole("host")
}
/* Init Client */
createAgoraClient()

// Slide to show the things
function valuetext(value) {
  return `${value}°C`
}
const chatWindowOptions = {
  PRIVATE: "private",
  PUBLIC: "public",
  USERS: "users",
  TIP_MENU: "TIP_MENU",
}
let streamId
let goneLiveOnce /* only when gone live once the stream rooms will be created, before that no room exists */
function Live() {
  const ctx = useAuthContext()
  const updateCtx = useAuthUpdateContext()
  const [fullScreen, setFullScreen] = useState(false)
  const [value, setValue] = React.useState(30)
  const [chatWindow, setChatWindow] = useState(chatWindowOptions.PUBLIC)

  /* Ref's */
  const container = useRef()
  const chatInputRef = useRef()
  const chatBoxContainer = useRef()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const scrollOnChat = useCallback(() => {
    chatBoxContainer.current.scrollBy({
      top: 400,
      behavior: "smooth",
    })
  }, [chatBoxContainer.current])

  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    startLocalCameraPreview,
    leaveAndCloseTracks,
  } = useAgora(client, "host", callType)

  const requestStreamEnd = () => {
    fetch("/api/website/stream/handle-stream-end", {
      method: "POST",
      cors: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        streamId: streamId,
        reason: "Manual",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message)
      })
      .catch((err) => alert("Stream was not ended successfully!"))
  }

  useEffect(() => {
    startLocalCameraPreview()
    localStorage.removeItem("rtcToken")
    localStorage.removeItem("rtcTokenExpireIn")
    return () => {
      //debugger
      requestStreamEnd()
      leaveAndCloseTracks()
    }
  }, [])

  /* Will Not Go Live When The Component Mounts */
  const startStreamingAndGoLive = () => {
    //debugger
    if (!goneLiveOnce) {
      goneLiveOnce = true
    }

    if (
      !localStorage.getItem("rtcToken") &&
      localStorage.getItem("rtcTokenExpireIn") <= Date.now() + 10000 &&
      ctx.loadedFromLocalStorage
    ) {
      if (ctx.isLoggedIn === true && ctx.user.userType === "Model") {
        fetch("/api/website/token-builder/create-stream-and-gen-token", {
          method: "POST",
          cors: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => {
            //debugger
            return resp.json()
          })
          .then((data) => {
            //debugger
            token = data.rtcToken
            rtcTokenExpireIn = data.privilegeExpiredTs
            localStorage.setItem("rtcToken", data.rtcToken)
            localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)
            streamId = data.streamId
            return join(ctx.relatedUserId, token, ctx.relatedUserId)
          })
          .then((_result) => {
            /* successfully joined the channel */
          })
          .catch((error) => console.log(error))
      }
    } else {
      /* fetch request for status update not for rtc token */
      fetch("/api/website/stream/create-stream-without-token")
        .then((resp) => {
          return resp.json()
        })
        .then((data) => {
          //debugger
          streamId = data.streamId
          join(
            ctx.relatedUserId,
            localStorage.getItem("rtcToken"),
            ctx.relatedUserId
          )
        })
        .catch((error) => console.log(error))
    }
  }

  const sendChatMessage = () => {
    //debugger
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

    let payLoad
    const message = chatInputRef.current.value
    if (ctx.isLoggedIn && ctx.user.userType === "Model") {
      let finalRoom
      if (chatWindow === chatWindowOptions.PUBLIC) {
        JSON.parse(sessionStorage.getItem("socket-rooms")).forEach((room) => {
          if (room.includes("-public")) {
            finalRoom = room
          }
        })
      } else if (chatWindow === chatWindowOptions.PRIVATE) {
        JSON.parse(sessionStorage.getItem("socket-rooms")).forEach((room) => {
          if (room.includes("-private")) {
            finalRoom = room
          }
        })
      }
      payLoad = {
        room: finalRoom,
        message: message,
        username: ctx.user.user.username,
      }
      console.log("sent message to room >>> ", finalRoom)
      if (chatWindow === chatWindowOptions.PUBLIC) {
        io.getSocket().emit("model-message-public-emitted", payLoad)
      } else if (chatWindow === chatWindowOptions.PRIVATE) {
        io.getSocket().emit("model-message-private-emitted", payLoad)
      }
      chatInputRef.current.value = ""
    }
  }

  const endStream = async () => {
    //debugger
    await leave()
    requestStreamEnd()
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

  return ctx.isLoggedIn === true && ctx.user.userType === "Model" ? (
    <div>
      <Header />
      <SecondHeader />

      <div className="tw-flex">
        <Sidebar />
        <div
          className={"sm:tw-flex sm:tw-flex-1 tw-bg-dark-black sm:tw-mt-28 "}
        >
          <div
            className="tw-bg-gray-800 tw-flex-[5] sm:tw-h-[37rem] tw-h-[50rem]  sm:tw-mt-4 tw-mt-2"
            ref={container}
          >
            <VideoPlayer
              videoTrack={localVideoTrack}
              audioTrack={localAudioTrack}
              uid={ctx.relatedUserId}
              playAudio={false}
            />
            <div className="tw-w-32 tw-absolute tw-z-20 tw-flex tw-mt-[-32px] ">
              <VolumeUpIcon className="tw-text-white" fontSize="large" />
              <Slider
                defaultValue={30}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={200}
                onChange={handleChange}
                className="tw-self-center tw-ml-2"
              />
            </div>

            <div className="tw-text-center tw-mt-3 tw-flex tw-ml-[40%]">
              {joinState ? (
                <Button
                  className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-mx-4 tw-capitalize"
                  variant="danger"
                  onClick={endStream}
                >
                  <span className="md:tw-block tw-hidden">end streaming</span>
                  <span className="tw-block md:tw-hidden">end </span>
                </Button>
              ) : (
                <Button
                  className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-mx- tw-capitalize"
                  variant="success"
                  onClick={startStreamingAndGoLive}
                  // disabled={joinState}
                >
                  Go live
                </Button>
              )}

              <button
                onClick={endStream}
                disabled={joinState}
                className={`${
                  joinState ? "tw-bg-green-500" : "tw-bg-red-500"
                } tw-rounded-full tw-px-2  tw-capitalize`}
              >
                {`${joinState ? "connected to RTC servers" : "disconnected"}`}
              </button>
            </div>
          </div>

          {/* chat site | ex right side */}
          <div className="sm:tw-mt-4 tw-mt-2 tw-bg-second-color sm:tw-w-6/12 sm:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-screen">
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
                className="tw-inline-flex tw-items-center tw-content-center tw-py-2"
                onClick={() => setChatWindow(chatWindowOptions.PRIVATE)}
              >
                <MarkChatReadIcon className="tw-mr-2 tw-my-auto" />
                <span className="tw-font-normal sm:-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                  Private Chat
                </span>
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
              ref={chatBoxContainer}
              className="tw-absolute tw-h-[90%] tw-bottom-0 tw-max-w-[100vw] lg:tw-max-w-[49vw] chat-box-container tw-overflow-y-scroll tw-w-full"
            >
              <div className="tw-bottom-0 tw-relative tw-w-full tw-pb-18 tw-bg-second-color">
                <div
                  className=""
                  style={{
                    display:
                      chatWindow === chatWindowOptions.PUBLIC
                        ? "block"
                        : "none",
                  }}
                >
                  <PublicChat scrollOnChat={scrollOnChat} />
                </div>
                <div
                  className=""
                  style={{
                    display:
                      chatWindow === chatWindowOptions.PRIVATE
                        ? "block"
                        : "none",
                  }}
                >
                  <PrivateChat scrollOnChat={scrollOnChat} />
                </div>
                <div
                  className=""
                  style={{
                    display:
                      chatWindow === chatWindowOptions.TIP_MENU
                        ? "block"
                        : "none",
                  }}
                >
                  <TipMenuActions modalCtx={ctx} />
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
            </div>

            <div className="tw-flex tw-py-1.5 tw-bg-second-color tw-text-white tw-place-items-center tw-absolute tw-bottom-0 tw-w-full">
              <div className="tw-rounded-full tw-bg-dark-black tw-flex md:tw-mx-1 tw-outline-none tw-place-items-center tw-w-full tw-relative">
                {/* <button className="tw-absolute tw-top-[50%] tw-left-[5%] tw-translate-x-[-50%] tw-translate-y-[-50%] tw-rounded-full tw-px-2 tw-py-1 tw-bg-dreamgirl-red">
                <Image height={25} width={25} src={TipMenuIcon} />
              </button> */}
                <input
                  className="tw-flex tw-flex-1 tw-mx-2 tw-rounded-full tw-py-2 tw-px-6 tw-bg-dark-black tw-border-0 md:tw-mx-1 tw-outline-none"
                  placeholder="Enter your message here"
                  ref={chatInputRef}
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
