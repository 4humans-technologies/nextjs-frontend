import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer"
import PublicChat from "./PublicChat"
import PrivateChat from "./PrivateChat"
import dynamic from "next/dynamic"
import Token from "../model/Token"
import LocalActivityIcon from "@material-ui/icons/LocalActivity"
import MarkChatReadIcon from "@material-ui/icons/Markunread"
import Emoji from "../Emoji"
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
  const chatWindowRef = useRef()

  const modalCtx = useModalContext()
  const authCtx = useAuthContext()
  const updateCtx = useAuthUpdateContext()
  const router = useRouter()

  if (authCtx.isLoggedIn && authCtx.user.userType === "Model") {
    alert("currently only viewers are able to enter into the livestream!")
    router.replace("/")
  }

  const [chatWindow, setChatWindow] = useState(chatWindowOptions.PUBLIC)
  const [tipMenuActions, setTipMenuActions] = useState([])
  const [isModelOffline, setIsModelOffline] = useState(false)
  const [isChatPlanActive, setIsChatPlanActive] = useState(false)
  const [callOnGoing, setCallOnGoing] = useState(false)
  const [callType, setCallType] = useState("videoCall")
  const [pendingCallRequest, setPendingCallRequest] = useState(false)
  const [pendingCallEndRequest, setPendingCallEndRequest] = useState(false)

  useEffect(() => {
    chatWindowRef.current = chatWindow
  }, [chatWindow])

  const scrollOnChat = useCallback((scrollType) => {
    // document.getElementById("for-scroll-into-view").scrollIntoView({
    //   behavior: "smooth",
    //   block: "start",
    // })
    const containerElement = document.getElementById("chatBoxContainer")
    containerElement.scrollBy({
      top: containerElement.scrollHeight,
      behavior: scrollType ? scrollType : "smooth",
    })
  }, [])

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
        if (isModelOffline) {
          return alert(
            "Live chat with model is only available when model is streaming/live. 📴 😘😘"
          )
        }
        if (isChatPlanActive) {
          /* loggedIn & has private chat room */
          const ts = Date.now()
          payLoad = {
            to: `${window.location.pathname.split("/").reverse()[0]}-private`,
            chat: {
              by: authCtx.user.userType,
              ts: ts,
              msg: message,
            },
            dbId: sessionStorage.getItem("privateChatDbId"),
            viewerId: localStorage.getItem("relatedUserId"),
          }
          io.getSocket().emit("viewer-private-message-emitted", payLoad)
          const customEvent = new CustomEvent("send-private-message", {
            detail: {
              msg: message,
              ts: ts,
            },
          })
          document.dispatchEvent(customEvent)
        }
      } else if (chatWindow === chatWindowOptions.PUBLIC) {
        if (isModelOffline) {
          return alert(
            "chat is only available when model is streaming/live. 📴 😘😘"
          )
        }
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
      if (chatWindow === chatWindowOptions.PRIVATE) {
        if (isModelOffline) {
          return alert(
            "Live chat with model is only available when model is streaming/live. 📴 😘😘"
          )
        }
      }
      if (chatWindow === chatWindowOptions.PUBLIC) {
        if (isModelOffline) {
          return alert(
            "chat is only available when model is streaming/live. 📴 😘😘"
          )
        }
      }
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
    document.getElementById("message-input").scrollIntoView({
      block: "center",
    })
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
        if (data.actionStatus === "success") {
          updateCtx.updateWallet(activity.price, "dec")
          setChatWindow(chatWindowOptions.PUBLIC)
        } else {
          alert("Activity was not requested")
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
        model={props.modelProfileData}
      />
    )
  }, [
    modalCtx.showModalWithContent,
    pendingCallRequest,
    modalCtx.hideModal,
    props.modelProfileData,
  ])

  return (
    <>
      <audio
        preload="true"
        src="/audio/call-request.mp3"
        id="call-request-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/private-message.mp3"
        id="private-message-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/superchat-2.mp3"
        id="superchat-2-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/superchat.mp3"
        id="superchat-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/call-end.mp3"
        id="call-end-audio"
      ></audio>
      <div className="md:tw-flex md:tw-flex-1 tw-w-full tw-bg-dark-black tw-font-sans">
        <div className="tw-relative tw-bg-dark-black md:tw-w-8/12 tw-w-full md:tw-h-[37rem] tw-h-[30rem]">
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
            pendingCallRequest={pendingCallRequest}
            isModelOffline={isModelOffline}
            modelProfileData={props.modelProfileData}
            pendingCallEndRequest={pendingCallEndRequest}
            setPendingCallEndRequest={setPendingCallEndRequest}
            callType={callType}
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
                  <span
                    id="live-viewer-count"
                    className="tw-rounded-full tw-px-2.5 tw-py-0.5 tw-text-sm tw-inline-block tw-ml-3 tw-text-green-color tw-border tw-border-green-color"
                  >
                    0 Live
                  </span>
                </div>
                <div className="tw-col-span-1 tw-row-span-1 tw-justify-self-end">
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                    variant="danger"
                    onClick={() => {
                      if (authCtx.isLoggedIn) {
                        modalCtx.showModalWithContent(<Token />)
                      } else {
                        alert("Please login first, To Gift Coins")
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
                <div className="tw-flex tw-items-center tw-justify-start">
                  <button onClick={handleModelFollow}>
                    <span className="tw-p-1 tw-rounded-full tw-bg-white-color tw-inline-block">
                      <FavoriteIcon className="tw-text-red-600" />
                    </span>
                    <span className="tw-pl-2 tw-text-white-color tw-font-semibold">
                      33.k
                    </span>
                  </button>
                  <span
                    id="live-viewer-count"
                    className="tw-rounded-full tw-px-2.5 tw-py-0.5 tw-text-sm tw-inline-block tw-ml-3 tw-text-green-color tw-border tw-border-green-color"
                  >
                    0 Live
                  </span>
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
        <div className="tw-bg-second-color md:tw-w-4/12 md:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-screen">
          <div className="tw-flex tw-justify-around md:tw-justify-start tw-text-white md:tw-pt-3 tw-pb-3 tw-px-2 md:tw-px-4 tw-text-center tw-content-center tw-items-center tw-relative tw-shadow-md">
            <button
              className={`tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-z-[110] tw-mr-4 ${
                chatWindow === chatWindowOptions?.PUBLIC
                  ? "tw-text-dreamgirl-red tw-font-semibold"
                  : "tw-text-white-color tw-font-normal sm:-font-medium"
              }`}
              onClick={() => setChatWindow(chatWindowOptions.PUBLIC)}
            >
              <ChatBubbleIcon className="tw-mr-2 tw-my-auto" />
              <span className="tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                Live Chat
              </span>
            </button>
            <button
              className={`tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-z-[110] tw-mr-4 ${
                chatWindow === chatWindowOptions?.PRIVATE
                  ? "tw-text-dreamgirl-red tw-font-semibold"
                  : "tw-text-white-color tw-font-normal sm:-font-medium"
              }`}
              onClick={() => setChatWindow(chatWindowOptions.PRIVATE)}
            >
              <MarkChatReadIcon className="tw-mr-2 tw-my-auto" />
              <span className="tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                Private Chat
              </span>
            </button>
            {authCtx.user.userType !== "Model" && (
              <button
                className={`tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-z-[110] tw-mr-4 ${
                  chatWindow === chatWindowOptions?.TIP_MENU
                    ? "tw-text-dreamgirl-red tw-font-semibold"
                    : "tw-text-white-color tw-font-normal sm:-font-medium"
                }`}
                onClick={() => setChatWindow(chatWindowOptions.TIP_MENU)}
              >
                <LocalActivityIcon className="tw-mr-2 tw-my-auto" />
                <span className="tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
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
            id="chatBoxContainer"
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
                  chatWindowRef={chatWindowRef}
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
                  modalCtx={modalCtx}
                  chatWindowRef={chatWindowRef}
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

          <div
            id="message-input"
            className="tw-flex tw-items-center tw-py-1.5 tw-bg-second-color tw-text-white tw-absolute tw-bottom-0 tw-w-full tw-z-[300] tw-right-0"
          >
            {/* <div className="tw-rounded-full tw-bg-dark-black tw-flex md:tw-px-1 tw-outline-none tw-items-center tw-w-full tw-relative"> */}
            <span className="circle-shadow tw-h-10 tw-w-10 tw-inline-grid tw-flex-shrink-0 tw-p-1 tw-bg-second-color tw-ring-1 tw-shadow-inner tw-ring-gray-500 tw-place-items-center tw-rounded-full tw-cursor-pointer hover:tw-transform hover:tw-scale-[1.1]">
              <img
                src="/tips.png"
                alt=""
                className="tw-w-6 tw-h-6"
                onClick={() => setChatWindow(chatWindowOptions.TIP_MENU)}
              />
            </span>
            <input
              className="tw-rounded-full tw-py-2 tw-px-6 tw-bg-dark-black tw-border-0 tw-outline-none tw-flex-grow tw-ml-2"
              placeholder="Chat"
              ref={chatInputRef}
            ></input>
            <Emoji chatInputRef={chatInputRef} />
            <button
              onClick={sendChatMessage}
              className="sm:tw-py-3 tw-py-2 tw-px-2 sm:tw-px-4 tw-bg-blue-500 sm:tw-ml-1 tw-ml-2 tw-rounded-full"
            >
              Send
            </button>
          </div>
          {/* </div> */}
        </div>
      </div>
    </>
  )
}

export default LiveScreen
