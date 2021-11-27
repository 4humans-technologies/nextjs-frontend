import React, { useRef, useEffect } from "react"

function VideoPlayer({
  videoTrack,
  audioTrack,
  playAudio,
  config = "stream",
  fit = "cover",
}) {
  const container = useRef()
  const ensureVideoPlayingLoopRef = useRef()
  /* 
    config = "audioCall" || "videoCall" || "stream"
  */

  const ensureVideoPlaying = () => {
    /**
     * if on call mode and viewer not receiving video on a video call end the call after some time
     */
    let playRequestPending = false
    ensureVideoPlayingLoopRef.current = setInterval(() => {
      console.debug("Checking if video is playing...")
      if (!videoTrack?.isPlaying && !playRequestPending) {
        /* if not playing */
        videoTrack?.play(container.current, { fit: fit })
        playRequestPending = true
        console.error("Video was found to not playing, play request pending...")
      } else if (videoTrack?.isPlaying && playRequestPending) {
        playRequestPending = false
      } else if (!videoTrack?.isPlaying && playRequestPending) {
        console.error("Video not playing, play request pending...")
      }
    }, [2500])
  }

  useEffect(() => {
    if (!container.current) return
    videoTrack?.play(container.current, { fit: fit })

    if (playAudio) {
      audioTrack?.play()
    }

    if (config === "videoCall") {
      /* then check is video is playing or else retry */
      // ensureVideoPlaying()
    }

    return () => {
      videoTrack?.stop()
      audioTrack?.stop()
      if (config === "videoCall") {
        clearInterval(ensureVideoPlayingLoopRef.current)
      }
    }
  }, [videoTrack, container, audioTrack, config])

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
