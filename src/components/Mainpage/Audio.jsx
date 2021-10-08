import React, { useState } from "react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Fragment } from "react";
import useAgora from "../../hooks/useAgora";

const CallDetailsPopUp = dynamic(() => import("../Call/CallDetailsPopUp"), {
  ssr: false,
});

const appId = "ae3edf155f1a4e78a544d125c8f53137"; // Replace with your App ID.
const token =
  "006ae3edf155f1a4e78a544d125c8f53137IACbg6y63Xr5Q4v/QXAJmmFejHW6hFqNZNN1B3cwXveDImLMzZAAAAAAEAAh3GK8FZxNYQEAAQATnE1h";
const channel = "test-channel";
let client;
const role = "host";
const callType = "audioCall";
const createClient = (role) => {
  const clientOptions = { codec: "h264", mode: "live" };
  client = AgoraRTC.createClient(clientOptions);
  client.setClientRole("host");
};
createClient();

function Audio() {
  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    ready,
  } = useAgora(client, appId, token, channel, role, null, callType);

  useEffect(() => {
    join();
  }, []);

  return (
    <>
      <div>{joinState ? "connect" : "not connected"}</div>
      <div>
        <div
          className="tw-flex tw-mt-4 "
          audioTrack={localAudioTrack}
          uid={4534534}
          playAudio={true}
        >
          <button
            onClick={join(channel, token, "12345")}
            className="tw-rounded-full tw-bg-green-400 tw-px-2 tw-py-1 tw-mx-4"
          >
            Join
          </button>
          <button
            className="tw-rounded-full tw-bg-yellow-200 tw-px-2 tw-py-1"
            onClick={leave}
          >
            Leave
          </button>
          <button
            className="tw-rounded-full tw-bg-yellow-200 tw-px-2 tw-py-1"
            onClick={() => {
              setEnable(!enable);
            }}
          >
            mute
          </button>
        </div>
      </div>
    </>
  );
}

export default Audio;
