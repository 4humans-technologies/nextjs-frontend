import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Button } from "react-bootstrap";
import MediaPlayer from "../UI/MediaPlayer";
import VideoPlayer from "../UI/VideoPlayer";
import FavoriteIcon from "@material-ui/icons/Favorite";
import useAgora from "../../hooks/useAgora";
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
let token;
function Videocall(props) {
  const ctx = useAuthContext();
  const updateCtx = useAuthUpdateContext();
  const {
    joinState,
    leave,
    join,
    remoteUsers
  } = useAgora(client, "audience", props.callType || "");

  useEffect(() => {
    debugger
    if (ctx.loadedFromLocalStorage) {
      if (ctx.isLoggedIn === true) {
        /**
         * if logged in then fetch RTC token as loggedIn user
         */
        if (!localStorage.getItem("rtcToken") && +localStorage.getItem("rtcTokenExpireIn") < Date.now()) {
          /* make new request as their is no token or expired token */
          fetch("/api/website/token-builder/authed-viewer-join-stream", {
            method: "POST",
            cors: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              modelId: window.location.pathname.split("/").reverse()[0],
            }),
          })
            .then((resp) => resp.json())
            .then((data) => {
              token = data.rtcToken
              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)
              const channel = window.location.pathname.split("/").reverse()[0]
              join(channel, data.rtcToken, ctx.relatedUserId)
              updateCtx.updateViewer({
                rtcToken: data.rtcToken
              })
            });
        } else {
          /* get token  from local storage */
          const channel = window.location.pathname.split("/").reverse()[0]
          join(channel, localStorage.getItem("rtcToken"), ctx.relatedUserId)
        }
      } else {
        if (!localStorage.getItem("rtcToken") && localStorage.getItem("rtcTokenExpireIn") < Date.now()) {
          /**
         * fetch RTC token as a un-authenticated user
         */
          const payload = {
            /* which models's stream to join */
            modelId: window.location.pathname.split("/").reverse()[0],
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
              debugger
              /* 🤩🤩🔥🔥 join stream */
              localStorage.setItem("rtcToken", data.rtcToken)
              localStorage.setItem("rtcTokenExpireIn", data.privilegeExpiredTs)
              const channel = window.location.pathname.split("/").reverse()[0]
              join(channel, data.rtcToken, data.unAuthedUserId)
              if (data.newUnAuthedUserCreated) {
                /* if new viewer was created save the _id in localstorage */
                localStorage.setItem("unAuthedUserId", data.unAuthedUserId)
                updateCtx.updateViewer({
                  unAuthedUserId: data.unAuthedUserId,
                  rtcToken: data.rtcToken
                })
              } else {
                updateCtx.updateViewer({
                  rtcToken: data.rtcToken
                })
              }
            })
            .catch(err => alert(err.message))
        } else {
          const channel = window.location.pathname.split("/").reverse()[0]
          join(channel, localStorage.getItem("rtcToken"), localStorage.getItem("unAuthedUserId"))
        }
      }
    }
  }, [ctx.isLoggedIn, ctx.socketSetup, ctx.relatedUserId, window.location.pathname, ctx.loadedFromLocalStorage]);

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
      {(remoteUsers.length > 0 &&
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
