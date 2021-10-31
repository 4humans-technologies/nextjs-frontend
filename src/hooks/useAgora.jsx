import React, { useState, useEffect, useCallback } from "react"
import AgoraRTC from "agora-rtc-sdk-ng"

const appId = "ae3edf155f1a4e78a544d125c8f53137"
function useAgora(client, role, callType) {
  // console.log("running useAgora!")
  const [localVideoTrack, setLocalVideoTrack] = useState(null)
  const [localAudioTrack, setLocalAudioTrack] = useState(null)
  const [joinState, setJoinState] = useState(false)
  const [remoteUsers, setRemoteUsers] = useState([])
  const [streamOnGoing, setStreamOnGoing] = useState(true)

  async function createLocalTracks() {
    const tracks = []
    if (role === "host") {
      if (callType === "audioCall") {
        if (localAudioTrack) {
          return
        }
        const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
        tracks.push(microphoneTrack)
        setLocalAudioTrack(microphoneTrack)
      }
      if (callType === "videoCall") {
        if (!localAudioTrack) {
          const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
          tracks.push(microphoneTrack)
          setLocalAudioTrack(microphoneTrack)
        }
        if (!localVideoTrack) {
          const cameraTrack = await AgoraRTC.createCameraVideoTrack()
          tracks.push(cameraTrack)
          setLocalVideoTrack(cameraTrack)
        }
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

  const startLocalCameraPreview = useCallback(async () => {
    if (!client) {
      return
    }
    if (role === "host") {
      let track = await createLocalTracks()
      return track
    }
  }, [])

  async function changeClientRole(role) {
    await client.setClientRole(role)
  }

  const leave = useCallback(async () => {
    await client?.leave()
    setRemoteUsers([])
    setJoinState(false)
  }, [client])

  async function leaveDueToPrivateCall(username) {
    alert(
      "Model has accepted call request by " +
        username +
        " ,stream is ended now 🥺🥺"
    )
    await client?.leave()
    setRemoteUsers([])
    setJoinState(false)
  }

  const leaveAndCloseTracks = useCallback(async () => {
    if (client.connectionState) {
      await client?.leave()
    }
    if (localAudioTrack) {
      localAudioTrack.stop()
      localAudioTrack.close()
    }

    if (localVideoTrack) {
      localVideoTrack.stop()
      localVideoTrack.close()
    }

    setRemoteUsers([])
    setJoinState(false)
  }, [localAudioTrack, localVideoTrack, client])

  const renewRtcToken = async function () {
    /* do a fetch request to renew token */
    // fetch("/api/website/stream/global-renew-token")
  }

  async function switchViewerToHost() {
    /* switch viewer to host and capture tracks */
    await client.setClientRole("host")
    const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
    const cameraTrack = await AgoraRTC.createCameraVideoTrack()
    setLocalAudioTrack(microphoneTrack)
    setLocalVideoTrack(cameraTrack)
    await client.publish([microphoneTrack, cameraTrack])
    setJoinState(true)
  }

  useEffect(() => {
    if (!client) {
      return
    }

    // when component will mount
    setRemoteUsers(client.remoteUsers)

    // //for volume change this is by Ravi shankar still in trail stage
    // const handleUserVolume = async function (user, mediaType) {
    //   await client.subscribe(user, mediaType)
    //   setRemoteUsers((_remoteUsers) =>
    //     Array.from(client.remoteUsers.audioTrack.setVolume(vol))
    //   )
    // }

    const handleUserPublished = async function (user, mediaType) {
      await client.subscribe(user, mediaType)
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    const handleUserUnpublished = async function (user) {
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    const handleUsrJoined = async function (user) {
      if (streamOnGoing && remoteUsers.length >= 2) {
        alert(
          "A user hacker has published 💀💀, please contact the admin otherwise all your money can be lost... fast."
        )
        return
      }
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    const handleUserLeft = async function (user) {
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    client.on("user-published", handleUserPublished)
    client.on("user-unpublished", handleUserUnpublished)

    client.on("user-joined", handleUsrJoined)
    client.on("user-left", handleUserLeft)
    client.on("token-privilege-will-expire", renewRtcToken)

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
    leaveDueToPrivateCall,
    changeClientRole,
    switchViewerToHost,
  }
}

export default useAgora
