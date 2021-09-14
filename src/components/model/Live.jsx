import Header from "../Mainpage/Header";
import SecondHeader from "../Mainpage/SecondHeader";
import photo from "../../../public/brandikaran.jpg";
import Image from "next/image";
import React, { useReducer, useEffect } from "react";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import PersonIcon from "@material-ui/icons/Person";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import FlareIcon from "@material-ui/icons/Flare";
import Publicchat from "./PublicChat";
import PrivateChat from "./PrivateChat";
import LivePeople from "./LivePeople";
import AgoraRTC from "agora-rtc-sdk-ng";
import useAgora from "../../hooks/useAgora"; //using agora from Hooks
import VideoPlayer from "../UI/VideoPlayer";
import { io } from "socket.io-client";

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

const appId = "ae3edf155f1a4e78a544d125c8f53137"; // Replace with your App ID.
const token =
  "006ae3edf155f1a4e78a544d125c8f53137IACgpUpAHLaEUdVHcxV33NRzkW8/DWcL3gC8WdB5ijYvMGLMzZAAAAAAEAD+bihb8LVBYQEAAQDttUFh";
const channel = "test-channel";
let client;
const role = "host";
const callType = "videoCall";
const createClient = (role) => {
  const clientOptions = { codec: "h264", mode: "live" };
  client = AgoraRTC.createClient(clientOptions);
  client.setClientRole("host");
};
createClient();

function Live() {
  const [state, dispatch] = useReducer(reducer, initState);

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
    ready();
  }, []);

  // implimenting soket

  return (
    <div>
      <Header />
      <SecondHeader />
      <div className="tw-flex tw-bg-dark-black">
        <div className="tw-bg-gray-800 tw-flex-[5] sm:tw-h-[40rem] tw-h-[30rem] sm:tw-ml-4 sm:tw-mt-4 tw-mt-2">
          <VideoPlayer
            videoTrack={localVideoTrack}
            audioTrack={localAudioTrack}
            uid={4534534}
            playAudio={true}
          />
          <div className="tw-text-center tw-mt-2">
            {joinState ? (
              <button
                onClick={leave}
                // onClick={socketjoin}
                // disabled={!joinState}
                className="tw-rounded-full tw-px-2 tw-py-1 tw-bg-yellow-300"
              >
                leave
              </button>
            ) : (
              <button
                onClick={join}
                // disabled={joinState}
                className="tw-rounded-full tw-px-2 tw-py-1 tw-bg-yellow-300"
              >
                Go live
              </button>
            )}

            <button
              onClick={leave}
              disabled={joinState}
              className={`${
                joinState ? "tw-bg-green-500" : "tw-bg-red-500"
              } tw-rounded-full tw-px-2 tw-py-1`}
            >
              {`${joinState ? "joined" : "disconnected"}`}
            </button>
          </div>
        </div>
        <div className="tw-flex-[5] sm:tw-ml-4 sm:tw-mt-4 tw-mt-2 tw-bg-gray-400 sm:tw-w-7/12 sm:tw-h-[40rem] tw-h-[30rem] tw-relative tw-w-screen">
          <div className="tw-flex tw-bg-gray-700 tw-justify-between tw-text-white sm:tw-py-4 sm:tw-px-4 tw-text-center tw-content-center">
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
            <div className="tw-bottom-12 tw-relative tw-w-full">
              {state.val}
            </div>
          </div>

          <div className="tw-flex tw-py-2 tw-bg-red-400 tw-text-white tw-place-items-center tw-absolute tw-bottom-1 tw-w-full">
            <div className="sm:tw-inline-block tw-hidden sm:tw-ml-4">
              <FlareIcon />
            </div>

            <input
              className="tw-flex tw-flex-1 tw-mx-2 tw-rounded-full tw-py-3 tw-px-6 tw-bg-yellow-200 tw-border-0 md:tw-mx-4 tw-outline-none"
              placeholder="Public Chat  ....."
            />
            <div className="tw-hidden sm:tw-inline-block sm:tw-ml-4">
              <AccountCircleIcon />
            </div>
            <div className="tw-rounded-full sm:tw-py-3 tw-py-2 tw-px-0 sm:tw-px-4 tw-bg-yellow-200 sm:tw-mx-4 tw-mx-2">
              Send Message
            </div>
          </div>
        </div>

        <div className="tw-bg-second-color tw-flex-[2] sm:tw-h-[40rem] tw-h-[30rem] sm:tw-ml-4 sm:tw-mt-4 tw-mt-2 tw-relative">
          <div className="tw-flex ">
            <PersonIcon className="tw-mr-2 tw-text-white-color" />
            <p className="tw-text-white-color">211</p>
          </div>
          <div className="tw-absolute tw-bottom-2 tw-overflow-y-scroll sm:tw-h-[38rem] tw-h-[30rem]">
            <LivePeople />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Live;
