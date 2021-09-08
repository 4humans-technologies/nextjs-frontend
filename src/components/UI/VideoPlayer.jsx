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
      <div>
        <div ref={container} className='tw-h-96 tw-w-96'></div>
        <p>{uid && uid}</p>
      </div>
    );
}

export default VideoPlayer
