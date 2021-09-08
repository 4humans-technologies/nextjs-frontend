import React,{useRef,useEffect} from 'react'

function VideoPlayer({videoTrack,audioTrack,uid,playAudio}) {
    const container = useRef();
    useEffect(() => {
        if (!container.current) return;
        videoTrack?.play(container.current)
        if(playAudio){
            audioTrack?.play();
        }

        return () => {
            videoTrack?.stop()
            audioTrack?.stop()
        }
    }, [videoTrack,container,audioTrack])
    return (
      <div className="tw-h-full video-player">
        <div ref={container} className="tw-h-[80%]"></div>
        <p>{uid && uid}</p>
      </div>
    );
}

export default VideoPlayer
