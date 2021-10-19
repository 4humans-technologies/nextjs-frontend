import React, { useState, useEffect } from "react"
import AgoraRTC from "agora-rtc-sdk-ng"

const appId = "ae3edf155f1a4e78a544d125c8f53137"
function useAgora(client, role, callType) {
  console.log("running useAgora!")
  const [localVideoTrack, setLocalVideoTrack] = useState(null)
  const [localAudioTrack, setLocalAudioTrack] = useState(null)
  const [joinState, setJoinState] = useState(false)
  const [remoteUsers, setRemoteUsers] = useState([])

  async function createLocalTracks() {
    const tracks = []
    if (role === "host") {
      if (callType === "audioCall") {
        const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
        tracks.push(microphoneTrack)
        setLocalAudioTrack(microphoneTrack)
      }
      if (callType === "videoCall") {
        const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
        const cameraTrack = await AgoraRTC.createCameraVideoTrack()
        tracks.push(microphoneTrack)
        tracks.push(cameraTrack)
        setLocalAudioTrack(microphoneTrack)
        setLocalVideoTrack(cameraTrack)
      }
      return tracks
    }
    // if client, no local track
    return null
  }

  async function join(channel, token, uid) {
    //debugger
    /* relatedUserId Will Be the > uid */
    console.log("join running..")

    if (!client) {
      return
    }
    if (role === "host") {
      let track = await createLocalTracks(null, {
        optimizationMode: "detail",
        facingMode: "user",
        encoderConfig: { height: 720, width: 720, frameRate: 23 },
      })
      //debugger
      await client.join(appId, channel, token, uid)
      await client.publish(track)
      return setJoinState(true)
    }
    // if client
    await client.join(appId, channel, token, uid)
  }

  async function startLocalCameraPreview() {
    //debugger
    if (!client) {
      return
    }
    if (role === "host") {
      if (!localAudioTrack || !localVideoTrack) {
        let track = await createLocalTracks()
        return track
      }
    }
  }

  async function leave() {
    await client?.leave()
    setRemoteUsers([])
    setJoinState(false)
  }

  async function leaveAndCloseTracks() {
    if (localAudioTrack) {
      localAudioTrack.stop()
      localAudioTrack.close()
    }

    if (localVideoTrack) {
      localVideoTrack.stop()
      localVideoTrack.close()
    }
  }

  useEffect(() => {
    if (!client) {
      return
    }
    // when component will mount
    setRemoteUsers(client.remoteUsers)

    const handleUserPublished = async function (user, mediaType) {
      console.log("new user published")
      await client.subscribe(user, mediaType)
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    const handleUserUnpublished = async function (user) {
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    const handleUsrJoined = async function (user) {
      console.log("new user joined")
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    const handleUserLeft = async function (user) {
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    client.on("user-published", handleUserPublished)
    client.on("user-unpublished", handleUserUnpublished)

    client.on("user-joined", handleUsrJoined)
    client.on("user-left", handleUserLeft)

    return () => {
      client.off("user-published", handleUserPublished)
      client.off("user-unpublished", handleUserUnpublished)

      client.off("user-joined", handleUsrJoined)
      client.off("user-left", handleUserLeft)
    }
  }, [client])

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    startLocalCameraPreview,
    leaveAndCloseTracks,
  }
}

export default useAgora
