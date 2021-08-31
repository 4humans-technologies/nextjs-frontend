import React, { useState } from "react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Fragment } from "react";

const codeMode = { codec: "vp8", mode: "rtc" };
const client = AgoraRTC.createClient(codeMode); //create agora client
// const joinChannel = async () => {
//   let uid = await client.join(appId, channel, token); //create new Uid for the channel
//   await client.join(appId, channel, token, uid);
// };
// const leaveChannel = async () => {
//   await client.leave();
// };
function Audio() {
  const appId = "ae3edf155f1a4e78a544d125c8f53137"; //replace with your app id
  const channel = "test"; //replace with your channel name
  const uid = `${Math.floor(Math.random() * 100000)}`; //replace with your uniqu Id in the channel
  const token =
    "006ae3edf155f1a4e78a544d125c8f53137IACO2G44ZH8TgZ+BjgnNABRw0H7D1VwqaKWa/m7eIFG60gx+f9gAAAAAEACUS06I/sAvYQEAAQD7wC9h"; //replace with your token
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [joinState, setJoinState] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [enable, setEnable] = useState(false);

  const createLocalTracks = async () => {
    const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setLocalAudioTrack(microphoneTrack);
    return microphoneTrack;
  };

  const join = async () => {
    if (!client) {
      return;
    }
    console.log("creating local Track");
    const microphoneTrack = await createLocalTracks();
    console.log("Joinig");
    await client.join(appId, channel, token, uid);
    console.log("publishing");
    await client.publish(microphoneTrack);
    setJoinState(true);
  };

  const leave = async () => {
    if (!client) {
      return;
    }
    if (localAudioTrack) {
      localAudioTrack.stop();
      await localAudioTrack.close();
    }
    await client.leave();
    setJoinState(false);
    setRemoteUsers([]);
  };

  useEffect(() => {
    if (!client) {
      return;
    }
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      setRemoteUsers((remote) => Array.from(client.remoteUsers));
    };
    const handleUserUnpublished = async (user, mediaType) => {
      await client.unsubscribe(user, mediaType);
      setRemoteUsers((remote) => Array.from(client.remoteUsers));
    };
    const handleUserJoined = async (user) => {
      setRemoteUsers((remote) => Array.from(client.remoteUsers));
    };
    const handleUserLeft = async (user) => {
      setRemoteUsers((remote) => Array.from(client.remoteUsers));
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);

      client.off("user-joined", handleUserJoined);
      client.off("user-left", handleUserLeft);
    };
  }, [client]);

  return (
    <>
      <div>{joinState ? "connect" : "not connected"}</div>
      <div>
        <div className="tw-flex tw-mt-4 ">
          <button
            onClick={join}
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
