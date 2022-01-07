import React, { useRef, useEffect } from "react"

function VideoPlayer({
  videoTrack,
  audioTrack,
  playAudio,
  config = "stream",
  fit = "cover",
}) {
  const container = useRef()
  /* 
    config = "audioCall" || "videoCall" || "stream"
  */

  useEffect(() => {
    videoTrack?.play(container.current, { fit: fit })

    if (playAudio) {
      audioTrack?.play()
    }

    return () => {
      videoTrack?.stop()
      audioTrack?.stop()
    }
  }, [videoTrack, audioTrack, config])

  return (
    <div
      ref={container}
      className="video-player tw-absolute tw-pointer-events-none tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-z-10"
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
