import Header from "../Mainpage/Header";
import SecondHeader from "../Mainpage/SecondHeader";
import photo from "../../../public/brandikaran.jpg";
import Image from "next/image";
import React, { useReducer } from "react";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import PersonIcon from "@material-ui/icons/Person";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import FlareIcon from "@material-ui/icons/Flare";
import Publicchat from "./PublicChat";
import PrivateChat from "./PrivateChat";
import LivePeople from "./LivePeople";

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

function Live() {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <div>
      <Header />
      <SecondHeader />
      <div className="tw-flex ">
        <div className="tw-bg-gray-800 tw-flex-[5] sm:tw-h-[40rem] tw-h-[30rem] sm:tw-ml-4 sm:tw-mt-4 tw-mt-2">
          <Image src={photo} height={500} />
          <div className=" tw-text-center tw-mt-2">
            <button className="tw-rounded-full tw-px-2 tw-py-1 tw-bg-yellow-300">
              Go Live
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
            {/* ------------------------------------------------------------------------------------- */}
            {/* <div
              className="tw-flex tw-text-center tw-content-center"
              onClick={() => dispatch({ type: "PERSON" })}
              style={{ cursor: "pointer" }}
            >
              <PersonIcon className="tw-mr-2" />
              <p>211</p>
            </div> */}

            {/* ------------------------------------------------------------------------------------- */}
            {/* <div
              className="tw-flex tw-text-center tw-content-center"
              style={{ cursor: "pointer" }}
            >
              <MoreVertIcon className="tw-mr-2" />
            </div> */}

            {/* ------------------------------------------------------------------------------------- */}
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

        <div className="tw-bg-yellow-400 tw-flex-[2] sm:tw-h-[40rem] tw-h-[30rem] sm:tw-ml-4 sm:tw-mt-4 tw-mt-2 tw-relative">
          <div className="tw-flex ">
            <PersonIcon className="tw-mr-2" />
            <p>211</p>
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
