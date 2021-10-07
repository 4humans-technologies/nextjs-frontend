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
import dynamic from "next/dynamic";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";

// for audio video call
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";
import VideocamIcon from "@material-ui/icons/Videocam";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { Button } from "react-bootstrap";
import useModalContext from "../../app/ModalContext";

const ViewerScreen = dynamic(() => import("../Mainpage/ViewerScreen"), {
  ssr: false,
});

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

function Livescreen() {
  const [state, dispatch] = useReducer(reducer, initState);
  const ctx = useModalContext()
  return (
    <div className="sm:tw-flex sm:tw-flex-1 tw-w-full tw-bg-dark-black tw-font-sans  tw-mt-28">
      <div className="tw-relative tw-bg-dark-black tw-mt-4 sm:tw-w-7/12 tw-w-full sm:tw-h-[37rem] tw-h-[30rem]">
        {/* <img src="brandikaran.jpg" alt="" /> */}
        <ViewerScreen />
        <div className=" tw-bg-second-color tw-w-full tw-absolute tw-bottom-0 tw-py-3 tw-px-2">
          <div className="tw-grid lg:tw-hidden tw-grid-cols-2 tw-grid-rows-2 tw-gap-y-3 tw-gap-x-2">
            <div className="tw-col-span-1 tw-row-span-1 tw-flex tw-items-center tw-justify-start">
              <FavoriteIcon className="tw-text-red-600" />
              <p className="tw-pl-2 tw-text-white-color tw-font-semibold">33.k</p>
            </div>
            <div className="tw-col-span-1 tw-row-span-1 tw-justify-self-end">
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                variant="danger"
              >
                <CardGiftcardIcon fontSize="small" />
                <p className="tw-pl-1 tw-tracking-tight">Send Gift</p>
              </Button>
            </div>
            <div className="tw-col-span-1 tw-row-span-1">
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm"
                variant="primary"
                onClick={ctx.toggleCallModal}
              >
                <VideocamIcon fontSize="small" />
                <p className="tw-pl-1 tw-tracking-tight">Private video call</p>
              </Button>
            </div>
            <div className="tw-col-span-1 tw-row-span-1 tw-justify-self-end">
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                variant="success"
                onClick={ctx.toggleCallModal}
              >
                <PhoneInTalkIcon fontSize="small" />
                <span className="tw-pl-1 tw-tracking-tight">Private Audio call</span>
              </Button>
            </div>
          </div>
          <div className="tw-hidden lg:tw-flex md:tw-justify-between md:tw-self-center tw-text-white">
            <div className="tw-flex tw-self-center">
              <FavoriteIcon className="tw-rounded-full tw-flex sm:tw-mr-2" />
              <p className="pl-4">33.k</p>
            </div>
            <div className="tw-flex tw-justify-between">
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm"
                variant="success"
                onClick={ctx.toggleCallModal}
              >
                <PhoneInTalkIcon fontSize="small" />
                <span className="tw-pl-1 tw-tracking-tight">Private Audio call</span>
              </Button>
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm"
                variant="primary"
                onClick={ctx.toggleCallModal}
              >
                <VideocamIcon fontSize="small" />
                <p className="tw-pl-1 tw-tracking-tight">Private video call</p>
              </Button>
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                variant="danger"
              >
                <CardGiftcardIcon fontSize="small" />
                <p className="tw-pl-1 tw-tracking-tight">Send Gift</p>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:tw-mt-4 tw-mt-2 tw-bg-second-color sm:tw-w-7/12 sm:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-screen">
        <div className="tw-flex tw-justify-between tw-text-white sm:tw-py-4 sm:tw-px-4 tw-text-center tw-content-center">
          <button
            className="tw-flex tw-text-center tw-content-center"
            onClick={() => dispatch({ type: "PUBLIC" })}
            style={{ cursor: "pointer" }}
          >
            <ChatBubbleIcon className="tw-mr-2" />
            <span>Public</span>
          </button>
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
          <div
            className="tw-flex tw-text-center tw-content-center"
            onClick={() => dispatch({ type: "PERSON" })}
            style={{ cursor: "pointer" }}
          >
            <PersonIcon className="tw-mr-2" />
            <p>211</p>
          </div>

          {/* ------------------------------------------------------------------------------------- */}
          <div
            className="tw-flex tw-text-center tw-content-center"
            style={{ cursor: "pointer" }}
          >
            <MoreVertIcon className="tw-mr-2" />
          </div>

          {/* ------------------------------------------------------------------------------------- */}
        </div>
        <div className="tw-absolute tw-h-[90%] tw-bottom-0 tw-w-full chat-box-container tw-overflow-y-scroll">
          <div className="tw-bottom-0 tw-relative tw-w-full tw-pb-18">{state.val}</div>
        </div>

        <div className="tw-flex tw-py-1.5 tw-bg-second-color tw-text-white tw-place-items-center tw-absolute tw-bottom-0 tw-w-full">
          <div className="tw-rounded-full tw-bg-dark-black tw-flex md:tw-mx-1 tw-outline-none tw-place-items-center tw-w-full">
            <input
              className="tw-flex tw-flex-1 tw-mx-2 tw-rounded-full tw-py-2 tw-px-6 tw-bg-dark-black tw-border-0 md:tw-mx-1 tw-outline-none"
              placeholder="Public Chat  ....."
            ></input>
            {/* <EmojiEmotionsIcon /> */}
            <button className="sm:tw-py-3 tw-py-2 tw-px-0 sm:tw-px-4 tw-bg-blue-500 sm:tw-ml-1 tw-ml-2 tw-rounded-tr-full tw-rounded-br-full">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Livescreen;
