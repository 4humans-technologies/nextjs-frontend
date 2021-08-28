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

function Livescreen() {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <div className="sm:flex sm:flex-1 w-full">
      <div className="bg-gray-400 md:ml-2 mt-4">
        <img src="brandikaran.jpg" alt="" />
      </div>

      <div className=" sm:ml-4 sm:mt-4 mt-2 bg-gray-400 sm:w-7/12 sm:h-[40rem] h-[30rem]  relative w-screen">
        <div className="flex bg-gray-700 justify-between text-white sm:py-4 sm:px-4 text-center content-center">
          <div
            className="flex text-center content-center"
            onClick={() => dispatch({ type: "PUBLIC" })}
            style={{ cursor: "pointer" }}
          >
            <ChatBubbleIcon className="mr-2 " />
            <p>Public </p>
          </div>
          {/* ------------------------------------------------------------------------------------- */}
          <div
            className="flex text-center content-center"
            onClick={() => dispatch({ type: "PRIVATE" })}
            style={{ cursor: "pointer" }}
          >
            <QuestionAnswerIcon className="mr-2" />
            <p>Private</p>
          </div>
          {/* ------------------------------------------------------------------------------------- */}
          <div
            className="flex text-center content-center"
            onClick={() => dispatch({ type: "PERSON" })}
            style={{ cursor: "pointer" }}
          >
            <PersonIcon className="mr-2" />
            <p>211</p>
          </div>

          {/* ------------------------------------------------------------------------------------- */}
          <div
            className="flex text-center content-center"
            style={{ cursor: "pointer" }}
          >
            <MoreVertIcon className="mr-2" />
          </div>

          {/* ------------------------------------------------------------------------------------- */}
        </div>
        <div className="absolute overflow-y-scroll h-[90%]  bottom-4 w-full">
          <div className="bottom-12 relative w-full ">{state.val}</div>
        </div>

        <div className="flex py-2 bg-red-400 text-white place-items-center absolute bottom-1 w-full">
          <div className="sm:inline-block hidden sm:ml-4">
            <FlareIcon />
          </div>

          <input
            className="flex flex-1 mx-2 rounded-full py-3 px-6 bg-yellow-200 border-0 md:mx-4 outline-none"
            placeholder="Public Chat  ....."
          />
          <div className="hidden sm:inline-block sm:ml-4">
            <AccountCircleIcon />
          </div>
          <div className="rounded-full sm:py-3 py-2 px-0 sm:px-4 bg-yellow-200 sm:mx-4 mx-2">
            Send Message
          </div>
        </div>
      </div>
    </div>
  );
}

export default Livescreen;
