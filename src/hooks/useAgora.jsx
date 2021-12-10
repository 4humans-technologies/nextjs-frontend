import React, { useState, useEffect, useCallback, useRef } from "react"
import AgoraRTC from "agora-rtc-sdk-ng"
import useSpinnerContext from "../app/Loading/SpinnerContext"
import { toast } from "react-toastify"

const appId = "ee68eb6fcb93426e81c89f5ad6b0401f"
function useAgora(client, role, callType) {
  const [localVideoTrack, setLocalVideoTrack] = useState(null)
  const [localAudioTrack, setLocalAudioTrack] = useState(null)
  const [joinState, setJoinState] = useState(false)
  const [remoteUsers, setRemoteUsers] = useState([])
  const localAudioTrackRef = useRef()
  const localVideoTrackRef = useRef()

  /**
   * for saving some meta data about the current state
   * ex: is is call on-going
   */
  const customDataRef = useRef({
    callOngoing: false,
    canRenewToken: true,
    wasOnCall: false,
    streamEndFunction: null,
  })

  useEffect(() => {
    localAudioTrackRef.current = localAudioTrack
  }, [localAudioTrack])

  useEffect(() => {
    localVideoTrackRef.current = localVideoTrack
  }, [localVideoTrack])

  const spinnerCtx = useSpinnerContext()
  const statsRef = useRef()

  async function createLocalTracks(callType = "videoCall") {
    const tracks = []
    if (role === "host") {
      if (callType === "audioCall" || callType === "videoCall") {
        if (!localAudioTrack) {
          const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
          tracks.push(microphoneTrack)
          setLocalAudioTrack(microphoneTrack)
        }
      }
      if (callType === "videoCall") {
        if (!localAudioTrack) {
          const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
          tracks.push(microphoneTrack)
          setLocalAudioTrack(microphoneTrack)
        }
        if (!localVideoTrack) {
          const cameraTrack = await AgoraRTC.createCameraVideoTrack({
            optimizationMode: "detail",
            encoderConfig: {
              frameRate: 20,
              height: 400,
              width: 350,
              bitrateMin: 600,
            },
          })
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
    const createMyTrack = async () => {
      if (!localAudioTrack || !localVideoTrack) {
        return await createLocalTracks("videoCall", {
          optimizationMode: "detail",
          facingMode: "user",
          encoderConfig: { height: 400, width: 400, frameRate: 20 },
        })
      } else {
        localVideoTrack.setEnabled(true)
        return [localAudioTrack, localVideoTrack]
      }
    }
    if (role === "host") {
      spinnerCtx.setShowSpinner(true, "Going Live...")
      const track = await createMyTrack()
      await client.join(appId, channel, token, uid)
      if (track) {
        await client.publish(track)
        spinnerCtx.setShowSpinner(false, "Please wait...")
        return setJoinState(true)
      } else {
        /* if no track */
        const newTrack = await createMyTrack()
        if (
          client.connectionState !== "CONNECTED" ||
          client.connectionState !== "RECONNECTING"
        ) {
          await client.join(appId, channel, token, uid)
        }
        await client.publish(newTrack)
        spinnerCtx.setShowSpinner(false, "Please wait...")
        return setJoinState(true)
      }
    }
    // if client
    /* there is some error occurring even after completion of joining of the channel spinner is not showing */
    // spinnerCtx.setShowSpinner(true, "Connecting...")
    await client.join(appId, channel, token, uid)
    setJoinState(true)
    // spinnerCtx.setShowSpinner(false, "Please wait...")
  }

  const startLocalCameraPreview = useCallback(async () => {
    if (!client) {
      return
    }
    if (role === "host") {
      let track = await createLocalTracks("videoCall")
      return track
    }
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.paly()
    }
    if (localVideoTrackRef.current) {
      localVideoTrackRef.current.paly()
    }
  }, [client, localAudioTrackRef, localVideoTrackRef])

  const leave = useCallback(async () => {
    await client.leave()
    setRemoteUsers([])
    setJoinState(false)
  }, [client])

  const leaveAndCloseTracks = useCallback(
    async (mounted = true) => {
      /* client.connectionState !== "DISCONNECTED" &&
      client.connectionState !== "DISCONNECTING" */
      await client.leave()

      if (mounted) {
        setRemoteUsers([])
        setJoinState(false)
      }
    },
    [client, localVideoTrackRef, localAudioTrackRef]
  )

  async function switchViewerToHost(callType) {
    /* switch viewer to host and capture tracks */
    let microphoneTrack
    let cameraTrack

    if (callType === "audioCall" || callType === "videoCall") {
      microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
      setLocalAudioTrack(microphoneTrack)
      await client.setClientRole("host")
      if (callType === "audioCall") {
        await client.publish(microphoneTrack)
      }
    }

    if (callType === "videoCall") {
      cameraTrack = await AgoraRTC.createCameraVideoTrack()
      setLocalVideoTrack(cameraTrack)
      await client.publish([microphoneTrack, cameraTrack])
    }
    setJoinState(true)
  }

  useEffect(() => {
    if (!localVideoTrackRef.current && !localAudioTrackRef.current) {
      startLocalCameraPreview()
    }
  }, [startLocalCameraPreview])

  useEffect(() => {
    return async () => {
      await client.leave()
      if (localAudioTrackRef.current) {
        await localAudioTrackRef.current.stop()
        await localAudioTrackRef.current.close()
      }

      if (localVideoTrackRef.current) {
        await localVideoTrackRef.current.stop()
        await localVideoTrackRef.current.close()
      }
    }
  }, [client.leave, localAudioTrackRef, localVideoTrackRef])

  const modelUnPublishVideoTrack = async () => {
    await localVideoTrack.setEnabled(false)
  }

  useEffect(() => {
    if (!client) {
      return
    }

    setRemoteUsers(client.remoteUsers)

    const renewRtcToken = async function () {
      /* do a fetch request to renew token */
      if (customDataRef.current.callOngoing) {
        toast.info("RTC token expired fetching new token!")
        try {
          const { rtcToken, privilegeExpiredTs, ...rest } = await (
            await fetch(
              `/api/website/token-builder/global-renew-token?channel=${client.channelName}&onCall=${customDataRef.current.callOngoing}`
            )
          ).json()

          if (rest?.canRenew) {
            customDataRef.current.canRenewToken = rest.canRenew
          }

          if (rtcToken) {
            localStorage.setItem("rtcToken", rtcToken)
            localStorage.setItem("privilegeExpiredTs", privilegeExpiredTs)
            await client.renewToken(rtcToken)
            toast.info("fetched-rtc token, renewed!")
          } else {
            toast.warn("No token is response")
          }
        } catch (err) {
          toast.warn(err.message)
        }
      }
    }

    const handleTokenExpire = async function () {
      if (customDataRef.current.callOngoing) {
        toast.error("RTC token has EXPIRED, call will ended now!")
      } else {
        toast.error("RTC token has EXPIRED, stream will ended now!")
      }
      // also have to do a fetch request to end the stream
      if (localStorage.getItem("userType") === "Model") {
        await customDataRef.current.streamEndFunction()
      }
      await leave()
    }

    const handleUserPublished = async function (user, mediaType) {
      await client.subscribe(user, mediaType)
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    const handleUserUnpublished = async function (user) {
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
      /* check is any remote users if not then leave the channel */
    }

    const handleUsrJoined = async function (user) {
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    const handleUserLeft = async function (user) {
      setRemoteUsers((_remoteUsers) => Array.from(client.remoteUsers))
    }

    const agoraExceptionHandler = (e) => {
      console.warn(
        "An Agora Exception Has Ocurred : ",
        e.msg,
        " faced by user : ",
        e.uid
      )
    }

    client.on("user-published", handleUserPublished)
    client.on("user-unpublished", handleUserUnpublished)

    client.on("user-joined", handleUsrJoined)
    client.on("user-left", handleUserLeft)
    client.on("token-privilege-will-expire", renewRtcToken)
    client.on("token-privilege-did-expire", handleTokenExpire)
    // client.on("exception", agoraExceptionHandler)

    return () => {
      client.off("user-published", handleUserPublished)
      client.off("user-unpublished", handleUserUnpublished)

      client.off("user-joined", handleUsrJoined)
      client.off("user-left", handleUserLeft)
      client.off("token-privilege-will-expire", renewRtcToken)
      client.off("token-privilege-did-expire", handleTokenExpire)
      // client.off("exception", agoraExceptionHandler)
    }
  }, [client, leave, customDataRef])

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    startLocalCameraPreview,
    leaveAndCloseTracks,
    switchViewerToHost,
    modelUnPublishVideoTrack,
    customDataRef,
  }
}

export default useAgora
