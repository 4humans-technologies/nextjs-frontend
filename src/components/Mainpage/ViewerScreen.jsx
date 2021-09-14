import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Button } from "react-bootstrap";
import MediaPlayer from "../UI/MediaPlayer";
import VideoPlayer from "../UI/VideoPlayer";
import useAgora from "./useAgora";
import {useRouter} from "next/router";

let client;
const createClient = (role) => {
  const clientOptions = { codec: "h264", mode: "live" };
  client = AgoraRTC.createClient(clientOptions);
  client.setClientRole("audience");
};
createClient();

const appId = "ae3edf155f1a4e78a544d125c8f53137"; // Replace with your App ID.
const token =
  "006ae3edf155f1a4e78a544d125c8f53137IACgpUpAHLaEUdVHcxV33NRzkW8/DWcL3gC8WdB5ijYvMGLMzZAAAAAAEAD+bihb8LVBYQEAAQDttUFh";
const channel = "test-channel";
const host = "audience";
const videoCall = "videoCall";

function Videocall(props) {
  const router = useRouter();
  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
  } = useAgora(client, appId, token, channel, props.role, null, props.callType);

  console.log("props >>", router.streaming);
  useEffect(() => {
    if (!router.streaming) {
      console.log("Joining ......");
      join();
    }
  }, []);

  return (
    <div className="tw-h-[100vh]">
      <div className="tw-flex">
        <Button variant="primary" onClick={join}>
          Join
        </Button>
        <Button variant="danger" onClick={leave}>
          Leave
        </Button>
      </div>
      {joinState ? (
        <p className="tw-text-white">Connected</p>
      ) : (
        <p className="tw-text-white">Disconnected</p>
      )}

      {remoteUsers.length > 0 &&
        remoteUsers.map((user) => {
          return (
            <VideoPlayer
              key={user.uid}
              videoTrack={user.videoTrack}
              audioTrack={user.audioTrack}
              playAudio={true}
            />
          );
        })}
    </div>
  );
}

export default Videocall;
