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
    callType: null,
    callId: null,
    streamEndFunction: null,
    handleCallEnd: null,
    gracefulTokenExpiryAllowed: false,
  })

  useEffect(() => {
    localAudioTrackRef.current = localAudioTrack
  }, [localAudioTrack])

  useEffect(() => {
    localVideoTrackRef.current = localVideoTrack
  }, [localVideoTrack])

  const spinnerCtx = useSpinnerContext()

  async function createLocalTracks(callType = "videoCall") {
    const tracks = []
    if (role === "host") {
      if (callType === "audioCall" || callType === "videoCall") {
        if (!localAudioTrack) {
          let microphoneTrack
          try {
            microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
          } catch (err) {
            toast.error(
              "Was not able to capture camera track, please try reloading"
            )
          }
          tracks.push(microphoneTrack)
          setLocalAudioTrack(microphoneTrack)
        }
      }
      if (callType === "videoCall") {
        if (!localAudioTrack) {
          let microphoneTrack
          try {
            microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
          } catch (err) {
            toast.error(
              "Was not able to capture camera track, please try reloading"
            )
          }
          tracks.push(microphoneTrack)
          setLocalAudioTrack(microphoneTrack)
        }
        if (!localVideoTrack) {
          let cameraTrack
          try {
            cameraTrack = await AgoraRTC.createCameraVideoTrack({
              optimizationMode: "detail",
              encoderConfig: {
                frameRate: 20,
                height: 580,
                width: 720,
                bitrateMin: 600,
              },
            })
          } catch (err) {
            toast.error(
              "Was not able to capture camera track, please try reloading"
            )
          }
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
        await localVideoTrack.setEnabled(true)
        await localAudioTrack.setEnabled(true)
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

  useEffect(async () => {
    if (role === "host") {
      await createLocalTracks("videoCall")
    }
  }, [])

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
    [client]
  )

  const switchViewerToHost = useCallback(
    async (callType, rtcToken) => {
      /* switch viewer to host and capture tracks */
      let microphoneTrack
      let cameraTrack

      await client.renewToken(rtcToken)

      /* ========== */
      if (callType === "audioCall" || callType === "videoCall") {
        microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
        setLocalAudioTrack(microphoneTrack)
        await client.setClientRole("host")
        if (callType === "audioCall") {
          await client.publish(microphoneTrack)
        }
      }

      /* ========== */
      if (callType === "videoCall") {
        cameraTrack = await AgoraRTC.createCameraVideoTrack()
        setLocalVideoTrack(cameraTrack)
        await client.publish([microphoneTrack, cameraTrack])
      }

      setJoinState(true)
    },
    [client]
  )

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
  }, [client])

  const modelUnPublishVideoTrack = async () => {
    await localVideoTrack.setEnabled(false)
  }

  useEffect(() => {
    if (!client) {
      return
    }

    setRemoteUsers(client.remoteUsers)

    const renewRtcToken = async function () {
      /* do a fetch request to renew token if not oncall */
      const fetchToken = async () => {
        // toast.info("RTC token expired fetching new token!")
        try {
          let url
          if (customDataRef.current.callOngoing) {
            url = `/api/website/token-builder/global-renew-token?channel=${client.channelName}&onCall=${customDataRef.current.callOngoing}&callId=${customDataRef.current.callId}&callType=${customDataRef.current.callType}`
          } else {
            url = `/api/website/token-builder/global-renew-token?channel=${client.channelName}&onCall=${customDataRef.current.callOngoing}`
          }
          const { rtcToken, privilegeExpiredTs, ...rest } = await (
            await fetch(url)
          ).json()

          if (rest?.canRenew) {
            customDataRef.current.canRenewToken = rest.canRenew
          }

          if (rtcToken) {
            if (!customDataRef.current.callOngoing) {
              /**
               * don't save to local storage if call ongoing, as these tokens are for one time use only
               */
              localStorage.setItem("rtcToken", rtcToken)
              localStorage.setItem(
                "rtcTokenExpireIn",
                +privilegeExpiredTs * 1000
              )
            }
            await client.renewToken(rtcToken)
            // toast.info("fetched-rtc token, renewed!")
          } else {
            // toast.warn("No token is response")
          }
        } catch (err) {
          // toast.warn(err.message)
        }
      }

      if (localStorage.getItem("userType") === "Model") {
        if (!customDataRef.current.callOngoing) {
          return fetchToken()
        }
        return
      } else {
        return fetchToken()
      }
    }

    const handleTokenExpire = async function () {
      /* when token did expire */
      if (!customDataRef.current.gracefulTokenExpiryAllowed) {
        /**
         * if graceful token expiry is disAllowed
         */
        if (customDataRef.current.callOngoing) {
          toast.error("RTC token has EXPIRED, call will ended now!")
        } else {
          toast.error("RTC token has EXPIRED, stream will ended now!")
        }
      }
      /**
       * if model
       */
      if (localStorage.getItem("userType") === "Model") {
        if (customDataRef.current.callOngoing) {
          return await customDataRef.current.handleCallEnd()
        } else {
          return await customDataRef.current.streamEndFunction()
        }
      }
      /**
       * if viewer
       */
      if (customDataRef.current.callOngoing) {
        return await customDataRef.current.handleCallEnd()
      } else {
        return await leave()
      }
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
    leaveAndCloseTracks,
    switchViewerToHost,
    modelUnPublishVideoTrack,
    customDataRef,
  }
}

export default useAgora
