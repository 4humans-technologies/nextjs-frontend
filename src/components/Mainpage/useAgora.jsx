import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

function useAgora(client, appId, token, channel, role, uid, callType) {
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [joinState, setJoinState] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);

  async function createLocalTracks() {
    const tracks = [];
    if (role === "host") {
      if (callType === "audioCall") {
        const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();
        tracks.push(microphoneTrack)
        setLocalAudioTrack(microphoneTrack);
      }
      if (callType === "videoCall") {
        const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const cameraTrack = await AgoraRTC.createCameraVideoTrack();
        tracks.push(microphoneTrack);
        tracks.push(cameraTrack);
        setLocalAudioTrack(microphoneTrack);
        setLocalVideoTrack(cameraTrack);
      }
      return tracks;
    }
    // if client
    return null;
  }

  async function join() {
    console.log("join running..");

    if (!client) {
      return;
    }
    if (role === "host") {
      let track = await createLocalTracks(null, {
        optimizationMode: "detail",
        facingMode: "user",
        encoderConfig: { height: 720, width: 720, frameRate: 23 },
      });
      await client.join(appId, channel, token || null, uid);
      await client.publish(track);
      return setJoinState(true);
    }
    // if client
    await client.join(appId, channel, token || null, uid);
  }

  async function leave() {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }

    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    await client?.leave();
    setRemoteUsers([]);
    setJoinState(false);
  }

  useEffect(() => {
    if (!client) {
      return;
    }
    // when component will mount
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async function (user, mediaType) {
      console.log("new user published");
      await client.subscribe(user, mediaType);
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers));
    };

    const handleUserUnpublished = async function (user) {
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers));
    };

    const handleUsrJoined = async function (user) {
      console.log("new user joined");
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers));
    };

    const handleUserLeft = async function (user) {
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers));
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    client.on("user-joined", handleUsrJoined);
    client.on("user-left", handleUserLeft);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);

      client.off("user-joined", handleUsrJoined);
      client.off("user-left", handleUserLeft);
    };
  }, [client]);

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
  };
}

export default useAgora;
