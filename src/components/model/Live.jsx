/* eslint-disable no-//debugger */
import Header from "../Mainpage/Header"
import SecondHeader from "../Mainpage/SecondHeader"
import Sidebar from "../Mainpage/Sidebar"
import React, { useReducer, useEffect, useState, useRef } from "react"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer"
import { Button } from "react-bootstrap"
import Footer from "../Mainpage/Footer"

import Publicchat from "./PublicChat"
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
const initState = { val: <Publicchat /> }

const reducer = (state = initState, action) => {
  switch (action.type) {
    case "PUBLIC":
      return { val: <Publicchat /> }
    case "PRIVATE":
      return { val: <PrivateChat /> }
    case "PERSON":
      return { val: <LivePeople /> }
    default:
      return state
  }
}

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

function Live() {
  const ctx = useAuthContext()
  const container = useRef()
  const updateCtx = useAuthUpdateContext()
  const [state, dispatch] = useReducer(reducer, initState)
  const [fullScreen, setFullScreen] = useState(false)
  const [value, setValue] = React.useState(30)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

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

  useEffect(() => {
    startLocalCameraPreview()
    return () => leaveAndCloseTracks()
  }, [])

  /* Will Not Go Live When The Component Mounts */
  const startStreamingAndGoLive = () => {
    //debugger
    if (
      !localStorage.getItem("rtcToken") &&
      localStorage.getItem("rtcTokenExpireIn") <= Date.now() &&
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
            join(ctx.relatedUserId, token, ctx.relatedUserId)
          })
          .catch((error) => console.log(error))
      }
    } else {
      join(
        ctx.relatedUserId,
        localStorage.getItem("rtcToken"),
        ctx.relatedUserId
      )
    }
  }

  const endStream = () => {
    //debugger
    leave()
  }

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
                max={110}
                onChange={handleChange}
                className="tw-self-center tw-ml-2"
              />
            </div>

            <div className="tw-text-center tw-mt-3 tw-flex tw-ml-[40%]">
              {joinState ? (
                <Button
                  className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-mx-4"
                  variant="danger"
                  onClick={endStream}
                >
                  end streaming
                </Button>
              ) : (
                <Button
                  className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-mx-4"
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
                } tw-rounded-full tw-px-2 tw-py-1`}
              >
                {`${joinState ? "joined" : "disconnected"}`}
              </button>
            </div>
          </div>
          <div className="tw-flex-[5] sm:tw-ml-4 sm:tw-mt-4 tw-mt-2 tw-bg-gray-400 sm:tw-w-7/12 sm:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-screen">
            <div className="tw-flex tw-bg-gray-700 tw-justify-between tw-text-white sm:tw-py-4 sm:tw-px-4 tw-text-center tw-content-center ">
              <div
                className="tw-flex tw-text-center tw-content-center"
                onClick={() => dispatch({ type: "PUBLIC" })}
                style={{ cursor: "pointer" }}
              >
                <ChatBubbleIcon className="tw-mr-2" />
                <p>Public </p>
              </div>
              {/* ------------------------------------------------------------------------------------- */}
              <div
                className="tw-flex tw-text-center tw-content-center"
                onClick={() => dispatch({ type: "PRIVATE" })}
                style={{ cursor: "pointer" }}
              >
                <QuestionAnswerIcon className="tw-mr-2" />
                <p>Private</p>
              </div>
            </div>

            <div className="tw-absolute tw-overflow-y-scroll tw-h-[90%] tw-bottom-4 tw-w-full">
              <div className="tw-bottom-0 tw-relative tw-w-full">
                {state.val}
              </div>
            </div>

            <div className="tw-flex tw-py-2 tw-bg-second-color tw-text-white tw-place-items-center tw-absolute tw-bottom-0 tw-w-[100%]">
              <div className="tw-rounded-full tw-bg-dark-black tw-flex md:tw-mx-1 tw-outline-none tw-place-items-center tw-w-full">
                <input
                  className="tw-flex tw-flex-1  tw-rounded-full tw-py-3 tw-pl-2 tw-bg-dark-black tw-border-0 md:tw-mx-1 tw-outline-none"
                  placeholder="Public Chat  ....."
                ></input>
                <EmojiEmotionsIcon className="tw-mr-2" />
                <div className="tw-rounded-full sm:tw-py-3 tw-py-2 tw-px-4 sm:tw-px-4 tw-bg-blue-500 sm:tw-mx-1 tw-mx-0">
                  Send
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen">
      <h1 className="tw-font-semibold tw-text-xl">You are not a Model</h1>
    </div>
  )
}

export default Live
