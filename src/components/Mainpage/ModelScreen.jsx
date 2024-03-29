import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Button } from "react-bootstrap";
import MediaPlayer from "../UI/MediaPlayer";
import VideoPlayer from "../UI/VideoPlayer";

const appId = "ae3edf155f1a4e78a544d125c8f53137"; // Replace with your App ID.
const token =
  "006ae3edf155f1a4e78a544d125c8f53137IAAbuUyA4TY/KsKRDkbUQ5CpDJypO95JWaQhg30xxP9ek2LMzZAAAAAAEAC7qLCmdAM6YQEAAQByAzph";
const channel = "test-channel";
let client;
const role = "host";
const callType = "videoCall";
const createClient = (role) => {
  const clientOptions = { codec: "h264", mode: "live" };
  client = AgoraRTC.createClient(clientOptions);
  client.setClientRole("host");
};
createClient();

function Videocall() {
  console.log("client >>>", client);

  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
  } = useAgora(client, appId, token, channel, role, "re7e78", callType);

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
