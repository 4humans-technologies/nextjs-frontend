import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Button } from "react-bootstrap";
import MediaPlayer from "../UI/MediaPlayer";
import VideoPlayer from "../UI/VideoPlayer";
import FavoriteIcon from "@material-ui/icons/Favorite";
import useAgora from "./useAgora";
import { useRouter } from "next/router";
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext";

/**
 * If this screen is being mounted then it is understood by default that,
 * role will of be viewer.
 */

const clientOptions = { codec: "h264", mode: "live" };
let client = AgoraRTC.createClient(clientOptions);
client.setClientRole("audience");

/**
 * APPID can in feature be dynamic also
 */
const appId = "ae3edf155f1a4e78a544d125c8f53137";
let token;
let channel;

function Videocall(props) {
  const ctx = useAuthContext();
  const updateCtx = useAuthUpdateContext()
  // console.log(">>>", window.location.pathname.split("/").reverse()[0]);
  if (!token && channel) {
    /**
     * if there is no token and channel then don't call useAgora as the required
     * parameters will not have been ready yet
     */
    const {
      localAudioTrack,
      localVideoTrack,
      joinState,
      leave,
      join,
      remoteUsers,
    } = useAgora(client, appId, token, channel, props.role, null, props.callType);
  }

  useEffect(() => {
    if (ctx.isLoggedIn === true) {
      /**
       * if logged in then fetch RTC token as loggedIn user
       */
      fetch(
        "/api/website/token-builder/authed-viewer-join-stream",
        {
          method: "POST",
          cors: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({
            viewerId: ctx.relatedUserId,
            modelId: window.location.pathname.split("/").reverse()[0],
          }),
        }
      )
        .then((resp) => resp.json())
        .then((data) => {
          token = data.rtcToken;
          channel = "s";
        });
    } else {
      /**
       * fetch RTC token as a un-authenticated user
       */
      let newSession = false;
      if (!sessionStorage.getItem(newSession)) {
        sessionStorage.setItem("newSession", "false")
        newSession = true
      }
      const payload = {
        modelId: window.location.pathname.split("/").reverse()[0],
        newSession: newSession
      }
      if (ctx.unAuthedUserId) {
        payload.unAuthedUserId = unAuthedUserId
      }

      fetch(
        "/api/website/token-builder/unauthed-viewer-join-stream",
        {
          method: "POST",
          cors: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )
        .then((resp) => resp.json())
        .then((data) => {
          localStorage.setItem("unAuthed-namespace", JSON.stringify({
            unAuthedUserId: data.unAuthedUserId
          }))
          updateCtx({
            unAuthedUserId: unAuthedUserId
          })
        })
        .catch(err => alert(err))
    }
  }, []);

  return (
    <div className="sm:tw-h-[70vh] ">
      {token && <div className="tw-flex tw-py-2 tw-justify-between tw-items-center">
        <Button variant="primary" onClick={join}>
          Join
        </Button>
        <Button variant="danger" onClick={leave}>
          Leave
        </Button>
      </div>}
      {token ? (joinState ? (
        <p className="tw-text-white">Connected</p>
      ) : (
        <p className="tw-text-white">Disconnected</p>
      )) : null}
      {token && (remoteUsers.length > 0 &&
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
        }))}
    </div>
  );
}

export default Videocall;
