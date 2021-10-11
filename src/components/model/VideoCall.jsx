import React, { useState, useEffect } from "react"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit"
import useAgora from "../../hooks/useAgora"
import AgoraRTC from "agora-rtc-sdk-ng"
import { Button } from "react-bootstrap"

import MediaPlayer from "../UI/MediaPlayer"
import VideoPlayer from "../UI/VideoPlayer"
let client
const createClient = (role) => {
  const clientOptions = { codec: "h264", mode: "live" }
  client = AgoraRTC.createClient(clientOptions)
  client.setClientRole("host")
}
createClient()

const appId = "ae3edf155f1a4e78a544d125c8f53137"

function VideoCall(props) {
  const [fullScreen, setFullScreen] = useState(false)
  const [imageChange, setImageChange] = useState(false)

  const [cordinate, setCordinate] = useState({
    X: "",
    Y: "",
  })

  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    startLocalCameraPreview,
  } = useAgora(client, "host", "videoCall")

  useEffect(() => {
    startLocalCameraPreview()
  }, [])
  const changeScreen = (e) => {
    e.preventDefault()
    setImageChange(!imageChange)
  }

  return (
    <div>
      <div className="tw-flex">
        {/* Model call frame */}
        <div className="tw-transition-all">
          <img
            src={`${imageChange ? "/pp.jpg" : "/brandikaran.jpg"}`}
            className={` ${fullScreen ? "tw-w-screen tw-h-screen" : null}`}
          />
          {fullScreen ? (
            <FullscreenExitIcon
              className={`${
                fullScreen
                  ? "tw-absolute tw-z-10 tw-bottom-4 tw-bg-red-500"
                  : "tw-relative tw-bg-yellow-400 tw-bottom-12"
              }`}
              fontSize="large"
              onClick={() => {
                setFullScreen(!fullScreen)
                console.log(fullScreen)
              }}
            />
          ) : (
            <FullscreenIcon
              fontSize="large"
              className={`${
                fullScreen
                  ? "tw-absolute tw-z-10 tw-bottom-4 tw-bg-red-500"
                  : "tw-relative tw-bg-yellow-400 tw-bottom-12"
              }`}
              onClick={() => {
                setFullScreen(!fullScreen)
                console.log(fullScreen)
              }}
            />
          )}
        </div>

        {/* user  call frame*/}
        <div
          draggable="true"
          onDragStart={(e) => {
            e.dataTransfer.dropEffect = "move"
          }}
        >
          <img
            src={`${imageChange ? "/brandikaran.jpg" : "/pp.jpg"}`}
            onClick={changeScreen}
            className={`${
              fullScreen
                ? "tw-absolute tw-w-1/3 tw-h-1/3 tw-bottom-0 tw-right-0 tw-z-10"
                : null
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export default VideoCall
