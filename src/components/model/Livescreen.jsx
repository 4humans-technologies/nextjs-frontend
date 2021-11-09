import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer"
import PersonIcon from "@material-ui/icons/Person"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import FlareIcon from "@material-ui/icons/Flare"
import PublicChat from "./PublicChat"
import PrivateChat from "./PrivateChat"
import LivePeople from "./LivePeople"
import dynamic from "next/dynamic"
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions"
import Token from "../model/Token"
import LocalActivityIcon from "@material-ui/icons/LocalActivity"
import MarkChatReadIcon from "@material-ui/icons/Markunread"

// for audio video call
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk"
import VideocamIcon from "@material-ui/icons/Videocam"
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard"
import FavoriteIcon from "@material-ui/icons/Favorite"
import { Button } from "react-bootstrap"
import useModalContext from "../../app/ModalContext"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import { useRouter } from "next/router"
import io from "../../socket/socket"
import TipMenuActions from "../ViewerScreen/TipMenuActions"
import Image from "next/image"
import TipMenuIcon from "../../../public/tips.png"

const CallDetailsPopUp = dynamic(() => import("../Call/CallDetailsPopUp"), {
  ssr: false,
})

const ViewerScreen = dynamic(() => import("../Mainpage/ViewerScreen"), {
  ssr: false,
})

const chatWindowOptions = {
  PRIVATE: "private",
  PUBLIC: "public",
  USERS: "users",
  TIP_MENU: "TIP_MENU",
}

function LiveScreen(props) {
  const chatInputRef = useRef()
  const chatBoxContainer = useRef()

  const modalCtx = useModalContext()
  const authCtx = useAuthContext()
  const updateCtx = useAuthUpdateContext()
  const router = useRouter()

  const [chatWindow, setChatWindow] = useState(chatWindowOptions.PUBLIC)
  const [tipMenuActions, setTipMenuActions] = useState([])
  const [isModelOffline, setIsModelOffline] = useState(false)
  const [isChatPlanActive, setIsChatPlanActive] = useState(false)
  const [callOnGoing, setCallOnGoing] = useState(false)
  const [callType, setCallType] = useState("videoCall")
  const [pendingCallRequest, setPendingCallRequest] = useState(false)
  const [pendingCallEndRequest, setPendingCallEndRequest] = useState(false)

  const scrollOnChat = () => {
    chatBoxContainer.current.scrollBy({
      top: 400,
      behavior: "smooth",
    })
  }

  const handleModelFollow = useCallback(() => {
    if (!authCtx.isLoggedIn) {
      return alert("Please login to follow the model!")
    }
    fetch("/api/website/stream/follow-model", {
      method: "POST",
      cors: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modelId: window.location.pathname.split("/").reverse()[0],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        /*  */
      })
      .catch((err) => err.message)
  }, [authCtx.isLoggedIn])

  const sendChatMessage = () => {
    if (!chatInputRef.current) {
      alert("ref not created, updated")
      return
    }

    if (!chatInputRef.current?.value) {
      return
    }

    let payLoad
    const message = chatInputRef.current.value
    if (authCtx.isLoggedIn) {
      /* can have private room */
      let finalRoom
      if (chatWindow === chatWindowOptions.PRIVATE) {
        if (isChatPlanActive) {
          /* loggedIn & has private chat room */
          finalRoom = `${
            window.location.pathname.split("/").reverse()[0]
          }-private`
          payLoad = {
            to: finalRoom,
            chat: {
              by: authCtx.user.userType,
              ts: Date.now(),
              msg: message,
            },
            dbId: sessionStorage.getItem("privateChatDbId"),
            viewerId: localStorage.getItem("relatedUserId"),
          }
          io.getSocket().emit("viewer-private-message-emitted", payLoad)
        }
      } else if (chatWindow === chatWindowOptions.PUBLIC) {
        /* logged in, on public tab */
        JSON.parse(sessionStorage.getItem("socket-rooms")).forEach((room) => {
          if (room.includes("-public")) {
            finalRoom = room
          }
        })
        payLoad = {
          room: finalRoom,
          message: message,
          username: authCtx.user.user.username,
          walletCoins: authCtx.user.user.relatedUser.wallet.currentAmount,
        }
        io.getSocket().emit("viewer-message-public-emitted", payLoad)
      }
    } else {
      /* un-authed user, no private room*/
      payLoad = {
        room: JSON.parse(sessionStorage.getItem("socket-rooms"))[0],
        message: message,
        username: localStorage.getItem("unAuthed-user-chat-name"),
        walletCoins: 0,
      }
      io.getSocket().emit("viewer-message-public-emitted", payLoad)
    }
    chatInputRef.current.value = ""
  }

  const addAtTheRate = (username) => {
    if (!chatInputRef.current) {
      alert("ref not created, updated")
      return
    }
    if (chatInputRef.current.value.trim() !== "") {
      chatInputRef.current.value = `${chatInputRef.current.value} @${username}`
    } else {
      chatInputRef.current.value = `@${username} `
    }
  }

  const onClickSendTipMenu = (activity) => {
    /*  */
    if (!authCtx.isLoggedIn) {
      return alert("Please login first")
    }

    fetch("/api/website/stream/request-process-tip-menu-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activity: activity,
        modelId: window.location.pathname.split("/").reverse()[0],
        room: JSON.parse(sessionStorage.getItem("socket-rooms")).filter(
          (room) => room.includes("-public")
        )[0],
        socketData: {
          chatType: "tipmenu-activity-superchat-public",
          activity: activity,
          username: `${authCtx.user.user.username} 👑`,
          walletCoins: authCtx.user.user.relatedUser.wallet.currentAmount,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.actionStatus) {
          updateCtx.updateNestedPaths((prevState) => {
            return {
              ...prevState,
              user: {
                ...prevState.user,
                user: {
                  ...prevState.user.user,
                  relatedUser: {
                    ...prevState.user.user.relatedUser,
                    wallet: {
                      ...prevState.user.user.relatedUser.wallet,
                      currentAmount:
                        prevState.user.user.relatedUser.wallet.currentAmount -
                        activity.price,
                    },
                  },
                },
              },
            }
          })
          setChatWindow(chatWindowOptions.PUBLIC)
        }
      })
      .catch((err) => alert(err.message))
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.keyCode === 13) {
        sendChatMessage()
      }
    }
    document.addEventListener("keydown", handleKeyPress)
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [sendChatMessage])

  const showCallDetailPopUp = useCallback(() => {
    if (!authCtx.isLoggedIn) {
      alert("Please Login To Make Private Call Request 👑👑")
      return
    }
    modalCtx.showModalWithContent(
      <CallDetailsPopUp
        closeModal={modalCtx.hideModal}
        setPendingCallRequest={setPendingCallRequest}
        pendingCallRequest={pendingCallRequest}
        setCallType={setCallType}
      />
    )
  }, [modalCtx.showModalWithContent, pendingCallRequest, modalCtx.hideModal])

  return (
    <>
      <div className="sm:tw-flex sm:tw-flex-1 tw-w-full tw-bg-dark-black tw-font-sans  tw-mt-28">
        <div className="tw-relative tw-bg-dark-black tw-mt-4 sm:tw-w-6/12 tw-w-full sm:tw-h-[37rem] tw-h-[30rem]">
          {/* <img src="brandikaran.jpg" alt="" /> */}

          <ViewerScreen
            setIsChatPlanActive={setIsChatPlanActive}
            setCallOnGoing={setCallOnGoing}
            setCallType={setCallType}
            setPendingCallRequest={setPendingCallRequest}
            setIsModelOffline={setIsModelOffline}
            setTipMenuActions={setTipMenuActions}
            setModelProfileData={props.setModelProfileData}
            callOnGoing={callOnGoing}
            callType={callType}
            pendingCallRequest={pendingCallRequest}
            isModelOffline={isModelOffline}
            modelProfileData={props.modelProfileData}
            pendingCallEndRequest={pendingCallEndRequest}
            setPendingCallEndRequest={setPendingCallEndRequest}
          />

          {!callOnGoing ? (
            <div className=" tw-bg-second-color tw-w-full tw-absolute tw-bottom-0 tw-py-3 tw-px-2 tw-z-[300]">
              <div className="tw-grid lg:tw-hidden tw-grid-cols-2 tw-grid-rows-2 tw-gap-y-3 tw-gap-x-2">
                <div className="tw-col-span-1 tw-row-span-1 tw-flex tw-items-center tw-justify-start">
                  <button onClick={handleModelFollow}>
                    <span className="tw-p-1 tw-rounded-full tw-bg-white-color tw-inline-block">
                      <FavoriteIcon className="tw-text-red-600" />
                    </span>
                    <span className="tw-pl-2 tw-text-white-color tw-font-semibold">
                      33.k
                    </span>
                  </button>
                </div>
                <div className="tw-col-span-1 tw-row-span-1 tw-justify-self-end">
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                    variant="danger"
                    onClick={() => {
                      if (authCtx.isLoggedIn) {
                        modalCtx.showModalWithContent(<Token />)
                      } else {
                        alert("Please login first")
                      }
                    }}
                  >
                    <CardGiftcardIcon fontSize="small" />
                    <span className="tw-pl-1 tw-tracking-tight">
                      Send Coins
                    </span>
                  </Button>
                </div>
                <div className="tw-col-span-1 tw-row-span-1">
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm"
                    variant="primary"
                    onClick={showCallDetailPopUp}
                  >
                    <VideocamIcon fontSize="small" />
                    <p className="tw-pl-1 tw-tracking-tight">
                      Private video call
                    </p>
                  </Button>
                </div>
                <div className="tw-col-span-1 tw-row-span-1 tw-justify-self-end">
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                    variant="success"
                    onClick={showCallDetailPopUp}
                  >
                    <PhoneInTalkIcon fontSize="small" />
                    <span className="tw-pl-1 tw-tracking-tight">
                      Private Audio call
                    </span>
                  </Button>
                </div>
              </div>
              <div className="tw-hidden lg:tw-flex md:tw-justify-between md:tw-self-center tw-text-white">
                <div className="tw-flex tw-self-center">
                  <button onClick={handleModelFollow}>
                    <span className="tw-p-1 tw-rounded-full tw-bg-white-color tw-inline-block">
                      <FavoriteIcon className="tw-text-red-600" />
                    </span>
                    <span className="tw-pl-2 tw-text-white-color tw-font-semibold">
                      33.k
                    </span>
                  </button>
                </div>
                <div className="tw-flex tw-justify-between">
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm tw-z-[110]"
                    variant="success"
                    onClick={showCallDetailPopUp}
                  >
                    <PhoneInTalkIcon fontSize="small" />
                    <span className="tw-pl-1 tw-tracking-tight">
                      Private Audio call
                    </span>
                  </Button>
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm tw-z-[110]"
                    variant="primary"
                    onClick={showCallDetailPopUp}
                  >
                    <VideocamIcon fontSize="small" />
                    <p className="tw-pl-1 tw-tracking-tight">
                      Private video call
                    </p>
                  </Button>
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-z-[110]"
                    variant="danger"
                    onClick={() => {
                      if (authCtx.isLoggedIn) {
                        modalCtx.showModalWithContent(<Token />)
                      } else {
                        alert("Please login first")
                      }
                    }}
                  >
                    <CardGiftcardIcon fontSize="small" />
                    <span className="tw-pl-1 tw-tracking-tight">
                      Send Coins
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="sm:tw-mt-4 tw-mt-2 tw-bg-second-color sm:tw-w-6/12 sm:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-screen">
          <div className="tw-flex tw-justify-around sm:tw-justify-between tw-text-white sm:tw-pt-3 tw-pb-3 tw-px-2 sm:tw-px-4 tw-text-center tw-content-center tw-items-center tw-relative">
            <button
              className="tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-z-[110]"
              onClick={() => setChatWindow(chatWindowOptions.PUBLIC)}
            >
              <ChatBubbleIcon className="tw-mr-2 tw-my-auto" />
              <span className="tw-font-normal sm:-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                Live Chat
              </span>
            </button>
            <button
              className="tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-z-[110]"
              onClick={() => setChatWindow(chatWindowOptions.PRIVATE)}
            >
              <MarkChatReadIcon className="tw-mr-2 tw-my-auto" />
              <span className="tw-font-normal sm:-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                Private Chat
              </span>
            </button>
            {authCtx.user.userType !== "Model" && (
              <button
                className="tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-z-[110]"
                onClick={() => setChatWindow(chatWindowOptions.TIP_MENU)}
              >
                <LocalActivityIcon className="tw-mr-2 tw-my-auto" />
                <span className="tw-font-normal sm:tw-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                  Tip Menu
                </span>
              </button>
            )}
            {/* pending call request  */}
          </div>
          {pendingCallRequest && (
            <div className="tw-absolute tw-top-14 tw-left-1 tw-right-1 tw-py-1.5 tw-px-4 tw-bg-[rgba(56,117,37,0.4)] tw-text-white-color tw-font-semibold tw-z-[300] tw-backdrop-blur">
              <p className="tw-capitalize tw-text-white-color tw-font-medium">
                {`Your private
              ${callType === "videoCall" ? "video call" : "audio call"} request
              is pending`}
              </p>
            </div>
          )}
          <div
            ref={chatBoxContainer}
            className="tw-absolute tw-h-[90%] tw-bottom-0 tw-max-w-[100vw] lg:tw-max-w-[49vw] chat-box-container tw-overflow-y-scroll tw-w-full"
          >
            <div className="tw-bottom-0 tw-relative tw-w-full tw-pb-18 tw-bg-second-color">
              <div
                className=""
                style={{
                  display:
                    chatWindow === chatWindowOptions.PUBLIC ? "block" : "none",
                }}
              >
                <PublicChat
                  scrollOnChat={scrollOnChat}
                  isModelOffline={isModelOffline}
                  addAtTheRate={addAtTheRate}
                />
              </div>
              <div
                className=""
                style={{
                  display:
                    chatWindow === chatWindowOptions.PRIVATE ? "block" : "none",
                }}
              >
                <PrivateChat
                  scrollOnChat={scrollOnChat}
                  hasActivePlan={isChatPlanActive}
                  setIsChatPlanActive={setIsChatPlanActive}
                  inFocus={chatWindow === chatWindowOptions.PRIVATE}
                  modalCtx={modalCtx}
                />
              </div>
              <div
                className=""
                style={{
                  display:
                    chatWindow === chatWindowOptions.TIP_MENU
                      ? "block"
                      : "none",
                }}
              >
                <TipMenuActions
                  tipMenuActions={tipMenuActions}
                  setTipMenuActions={setTipMenuActions}
                  onClickSendTipMenu={onClickSendTipMenu}
                />
              </div>
              <div
                className=""
                style={{
                  display:
                    chatWindow === chatWindowOptions.USERS ? "block" : "none",
                }}
              >
                <div className="">USERS</div>
              </div>
            </div>
          </div>

          <div className="tw-flex tw-py-1.5 tw-bg-second-color tw-text-white tw-place-items-center tw-absolute tw-bottom-0 tw-w-full tw-z-[300]">
            <div className="tw-rounded-full tw-bg-dark-black tw-flex md:tw-mx-1 tw-outline-none tw-place-items-center tw-w-full tw-relative">
              <img
                src="/tips.png"
                alt=""
                className=" tw-h-8 tw-pl-4"
                onClick={() => setChatWindow(chatWindowOptions.TIP_MENU)}
              />
              <input
                className="tw-flex tw-flex-1 tw-mx-2 tw-rounded-full tw-py-2 tw-px-6 tw-bg-dark-black tw-border-0 md:tw-mx-1 tw-outline-none"
                placeholder="Enter your message here"
                ref={chatInputRef}
              ></input>
              <button
                onClick={sendChatMessage}
                className="sm:tw-py-3 tw-py-2 tw-px-2 sm:tw-px-4 tw-bg-blue-500 sm:tw-ml-1 tw-ml-2 tw-rounded-full"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LiveScreen
