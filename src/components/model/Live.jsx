/* eslint-disable no-debugger */
import Header from "../Mainpage/Header";
import SecondHeader from "../Mainpage/SecondHeader";
import photo from "../../../public/brandikaran.jpg";
import Image from "next/image";
import Sidebar from "../Mainpage/Sidebar";
import React, { useReducer, useEffect, useState } from "react";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import Publicchat from "./PublicChat";
import PrivateChat from "./PrivateChat";
import LivePeople from "./LivePeople";
import AgoraRTC from "agora-rtc-sdk-ng";
import useAgora from "../../hooks/useAgora"; //using agora from Hooks
import VideoPlayer from "../UI/VideoPlayer";
import { io } from "socket.io-client";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import dynamic from "next/dynamic";

// import { useTokenContext } from "../../app/Tokencontext";
// import { useUpdateContext } from "../../app/Tokencontext";

import { useAuthContext } from "../../app/AuthContext";
import { useAuthUpdateContext } from "../../app/AuthContext";
import { useRouter } from "next/router";

const initState = { val: <Publicchat /> };

const reducer = (state = initState, action) => {
  switch (action.type) {
    case "PUBLIC":
      return { val: <Publicchat /> };
    case "PRIVATE":
      return { val: <PrivateChat /> };
    case "PERSON":
      return { val: <LivePeople /> };
    default:
      return state;
  }
};

// /api/website/token-builder/create-stream-and-gen-token

const appId = "ae3edf155f1a4e78a544d125c8f53137"; // Replace with your App ID.
let token;
let channel;
let client;
const role = "host";
const callType = "videoCall";

/**
 * CREATING AGORA CLIENT
 */

const clientOptions = { codec: "h264", mode: "live" };
client = AgoraRTC.createClient(clientOptions);
client.setClientRole("host");

function Live(props) {
  const updateCtx = useAuthUpdateContext();
  const ctx = useAuthContext();
  const [state, dispatch] = useReducer(reducer, initState);
  const [rejoin, setRejoin] = useState(true)

  if (token && channel) {
    const {
      localAudioTrack,
      localVideoTrack,
      joinState,
      leave,
      join,
      remoteUsers,
      startLocalCameraPreview,
    } = useAgora(client, appId, token, channel, role, null, callType);
  }

  useEffect(() => {
    debugger;
    if (ctx.loadedFromLocalStorage) {
      if ((ctx.isLoggedIn === true && ctx.user.userType === "Model")) {
        fetch(
          "/api/website/token-builder/create-stream-and-gen-token",
          {
            method: "POST",
            cors: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((resp) => {
            debugger;
            return resp.json()
          })
          .then((data) => {
            debugger;
            console.log(ctx);
            updateCtx.updateViewer({
              rtcToken: data.rtcToken,
            });
            token = data.rtcToken;
            channel = data.modelId;
            console.log(`${data.actionStatus}`);
          })
          .catch((error) => console.log(error));
      }
    }
  }, [token, channel,  ctx.loadedFromLocalStorage, ctx.isLoggedIn, ctx.user.userType, rejoin]);

  // implimenting soket

  return ((ctx.isLoggedIn === true && ctx.user.userType === "Model") ? token && channel ? (<div>
    <Header />
    <SecondHeader />
    <div className="tw-flex">
      <Sidebar />
      <div className="sm:tw-flex sm:tw-flex-1 tw-bg-dark-black sm:tw-mt-28">
        <div className="tw-bg-gray-800 tw-flex-[5] sm:tw-h-[37rem] tw-h-[50rem]  sm:tw-mt-4 tw-mt-2">
          <VideoPlayer
            videoTrack={localVideoTrack}
            audioTrack={localAudioTrack}
            uid={4534534}
            playAudio={false}
          />
          <div className="tw-text-center tw-mt-1 tw-flex tw-ml-[40%]">
            {joinState ? (
              <button
                onClick={leave}
                // onClick={socketjoin}
                // disabled={!joinState}
                className="tw-rounded-full sm:tw-px-2 tw-px-0 sm:tw-py-1 tw-py-0 tw-bg-yellow-300 tw-mx-2 "
              >
                leave
              </button>
            ) : (
              <button
                onClick={() => join(channel, token, channel)}
                // disabled={joinState}
                className="tw-rounded-full tw-px-2 tw-py-1 tw-bg-yellow-300 mx-2"
              >
                Go live
              </button>
            )}

            <button
              onClick={leave}
              disabled={joinState}
              className={`${joinState ? "tw-bg-green-500" : "tw-bg-red-500"
                } tw-rounded-full tw-px-2 tw-py-1`}
            >
              {`${joinState ? "joined" : "disconnected"}`}
            </button>
          </div>
        </div>
        <div className="tw-flex-[5] sm:tw-ml-4 sm:tw-mt-4 tw-mt-2 tw-bg-gray-400 sm:tw-w-7/12 sm:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-screen">
          <div className="tw-flex tw-bg-gray-700 tw-justify-between tw-text-white sm:tw-py-4 sm:tw-px-4 tw-text-center tw-content-center ">
            <div
              className="tw-flex tw-text-center tw-content-center"
              onClick={() => dispatch({ type: "PUBLIC" })}
              style={{ cursor: "pointer" }}
            >
              <ChatBubbleIcon className="tw-mr-2" />
              <p>Public </p>
            </div>
            {/* ------------------------------------------------------------------------------------- */}
            <div
              className="tw-flex tw-text-center tw-content-center"
              onClick={() => dispatch({ type: "PRIVATE" })}
              style={{ cursor: "pointer" }}
            >
              <QuestionAnswerIcon className="tw-mr-2" />
              <p>Private</p>
            </div>
          </div>

          <div className="tw-absolute tw-overflow-y-scroll tw-h-[90%] tw-bottom-4 tw-w-full">
            <div className="tw-bottom-0 tw-relative tw-w-full">
              {state.val}
            </div>
          </div>

          <div className="tw-flex tw-py-2 tw-bg-second-color tw-text-white tw-place-items-center tw-absolute tw-bottom-0 tw-w-[100%]">
            <div className="tw-rounded-full tw-bg-dark-black tw-flex md:tw-mx-1 tw-outline-none tw-place-items-center tw-w-full">
              <input
                className="tw-flex tw-flex-1  tw-rounded-full tw-py-3 tw-pl-2 tw-bg-dark-black tw-border-0 md:tw-mx-1 tw-outline-none"
                placeholder="Public Chat  ....."
              ></input>
              <EmojiEmotionsIcon className="tw-mr-2" />
              <div className="tw-rounded-full sm:tw-py-3 tw-py-2 tw-px-4 sm:tw-px-4 tw-bg-blue-500 sm:tw-mx-1 tw-mx-0">
                Send
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="tw-bg-second-color tw-flex-[2] sm:tw-h-[40rem] tw-h-[30rem] sm:tw-ml-4 sm:tw-mt-4 tw-mt-2 tw-relative">
          <div className="tw-flex ">
            <PersonIcon className="tw-mr-2 tw-text-white-color" />
            <p className="tw-text-white-color">211</p>
          </div>
          <div className="tw-absolute tw-bottom-2 tw-overflow-y-scroll sm:tw-h-[38rem] tw-h-[30rem]">
            <LivePeople />
          </div>
        </div> */}
    </div>
  </div>) : <div><h1 className="tw-text-center tw-text-lg">Without token and channel, fetch not initiated</h1><button className="tw-p-3" onClick={() => setRejoin(prev => !prev)}>Rejoin</button></div> : (
    <div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen">
      <h1 className="tw-font-semibold tw-text-xl">You are not a Model</h1>
    </div>
  ))

}

export default Live;
