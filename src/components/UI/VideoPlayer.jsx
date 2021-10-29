import React, { useRef, useEffect, useState } from "react"

function VideoPlayer({ videoTrack, audioTrack, uid, playAudio }) {
  const container = useRef()
  const [full, setFull] = useState(false)
 
  useEffect(() => {
    if (!container.current) return
    videoTrack?.play(container.current)
    if (playAudio) {
      audioTrack?.play()
    }

    return () => {
      videoTrack?.stop()
      audioTrack?.stop()
    }
  }, [videoTrack, container, audioTrack])

  return (
    <div
      ref={container}
      id="videoPlayer"
      className="video-player tw-absolute tw-pointer-events-none tw-top-0 tw-bottom-0 tw-left-0 tw-right-0"
    ></div>
  )
}

export default VideoPlayer
{
  /* <div
      ref={container}
      className="tw-absolute tw-pointer-events-none tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-border-white-color tw-border"
    ></div> */
}
