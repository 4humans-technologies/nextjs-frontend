import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Button } from "react-bootstrap";
import MediaPlayer from "../UI/MediaPlayer";
import VideoPlayer from "../UI/VideoPlayer";
import FavoriteIcon from "@material-ui/icons/Favorite";
import useAgora from "../../hooks/useAgora";
import { useRouter } from "next/router";
import { useViewerContext } from "../../app/Viewercontext";

let client;
const createClient = (role) => {
  const clientOptions = { codec: "h264", mode: "live" };
  client = AgoraRTC.createClient(clientOptions);
  client.setClientRole("audience");
};
createClient();

const appId = "ae3edf155f1a4e78a544d125c8f53137"; // Replace with your App ID.
let token;
let channel;

function Videocall(props) {
  const ctx = useViewerContext();
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
    if (ctx.isLoggedIn === true) {
      fetch(
        "http://localhost:8080/api/website/token-builder/unauthed-viewer-join-stream",
        {
          method: "POST",
          cors: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: {
            viewerId: ctx.relatedUserId,
            channel: "ff",
            streamId: "ede",
          },
        }
      )
        .then((resp) => resp.json())
        .then((data) => {
          token = data.rtcToken;
          channel = "s";
        });
    } else {
      // un authenticated user
    }
    if (!router.streaming) {
      console.log("Joining ......");
      join(token, channel, ctx.relatedUserId);
    }
  }, []);

  return (
    <div className="sm:tw-h-[70vh] ">
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
              className="w-[50vh]"
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
