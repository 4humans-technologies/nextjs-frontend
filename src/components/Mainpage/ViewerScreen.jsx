import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Button } from "react-bootstrap";
import MediaPlayer from "../UI/MediaPlayer";
import VideoPlayer from "../UI/VideoPlayer";
import useAgora from "./useAgora";

let client;
const createClient = (role) => {
  const clientOptions = { codec: "h264", mode: "live" };
  client = AgoraRTC.createClient(clientOptions);
  client.setClientRole("audience");
};
createClient();

const appId = "ae3edf155f1a4e78a544d125c8f53137"; // Replace with your App ID.
const token =
  "006ae3edf155f1a4e78a544d125c8f53137IACImpgh8cu67QJ3fA3E5SGIX4w11GxpVzDkIqvOXxe6O2LMzZAAAAAAEABSSZ5eWH44YQEAAQBXfjhh";
const channel = "test-channel";
const host = "host";
const videoCall = "videoCall";

function Videocall(props) {
  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
  } = useAgora(client, appId, token, channel, props.role, null, props.callType);


  return (
    <div>
      <div className="tw-flex ">
        <Button variant="primary" onClick={join}>
          Join
        </Button>
        <Button variant="danger" onClick={leave}>
          Leave
        </Button>
      </div>
      {joinState ? <p>Connected</p> : <p>Disconnected</p>}

      <MediaPlayer
        local={
          <VideoPlayer
            videoTrack={localVideoTrack}
            audioTrack={localAudioTrack}
          />
        }
      >
        {remoteUsers.length > 0 &&
          remoteUsers.map((user) => {
            return (
              <VideoPlayer
                key={user.uid}
                videoTrack={user.videoTrack}
                audioTrack={user.audioTrack}
              />
            );
          })}
      </MediaPlayer>
    </div>
  );
}

export default Videocall;
