import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
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
import { ToastContainer, toast } from "react-toastify"
import ViewerSideViewersListContainer from "../ViewersList/ForViewer/ViewerSideViewersListContainer"
import { useSocketContext } from "../../app/socket/SocketContext"
import Link from "next/link"

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
  const publicChatContainerRef = useRef()
  const privateChatContainerRef = useRef()

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
  const [king, setKing] = useState(false)
  const [isChatPlanActive, setIsChatPlanActive] = useState(false)
  const [callOnGoing, setCallOnGoing] = useState(false)
  const [callType, setCallType] = useState("videoCall")
  const [pendingCallRequest, setPendingCallRequest] = useState(false)
  const [pendingCallEndRequest, setPendingCallEndRequest] = useState(false)

  // FOR RECREATING THE COMPONENT WHEN CLICKED ON MODEL FROM RECOMMENDATIONS
  const [theKey, setTheKey] = useState(0)
  useEffect(() => {
    const handleRouteChange = (url) => {
      setTheKey((prev) => prev + 1)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [])

  useEffect(() => {
    chatWindowRef.current = chatWindow
  }, [chatWindow])

  const scrollOnChat = useCallback((forBox, scrollType) => {
    if (forBox === "public") {
      var containerElement = publicChatContainerRef.current
    } else if (forBox === "private") {
      var containerElement = privateChatContainerRef.current
    } else {
      return
    }
    containerElement.scrollBy({
      top: containerElement.scrollHeight,
      behavior: scrollType ? scrollType : "smooth",
    })
  }, [])

  const handleModelFollow = useCallback(() => {
    if (!authCtx.isLoggedIn) {
      return toast.error("Please login to follow the model!")
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
        if (data.actionStatus == "success") {
          document.getElementById(
            "model-follower-count-lg"
          ).innerText = `${data.newCount}`
          document.getElementById(
            "model-follower-count-sm"
          ).innerText = `${data.newCount}`

          if (data.action == "follow") {
            updateCtx.setAuthState((prev) => {
              return {
                ...prev,
                user: {
                  ...prev.user,
                  user: {
                    ...prev.user.user,
                    relatedUser: {
                      ...prev.user.user.relatedUser,
                      following: [
                        ...prev.user.user.relatedUser.following,
                        window.location.pathname.split("/").reverse()[0],
                      ],
                    },
                  },
                },
              }
            })
          } else {
            updateCtx.setAuthState((prev) => {
              return {
                ...prev,
                user: {
                  ...prev.user,
                  user: {
                    ...prev.user.user,
                    relatedUser: {
                      ...prev.user.user.relatedUser,
                      following: [
                        ...prev.user.user.relatedUser.following,
                      ].filter(
                        (el) =>
                          el != window.location.pathname.split("/").reverse()[0]
                      ),
                    },
                  },
                },
              }
            })
          }
        }
      })
      .catch((err) => err.message)
  }, [authCtx.isLoggedIn])

  const sendChatMessage = () => {
    if (!chatInputRef.current?.value) {
      return
    }
    let payLoad
    const message = chatInputRef.current.value
    if (authCtx.isLoggedIn) {
      /* can have private room */
      let finalRoom
      if (chatWindow === chatWindowOptions.PRIVATE) {
        if (chatInputRef.current.value.length > 256) {
          toast.error(
            "Your chat messages too big, please keep it below 256 letters"
          )
          return
        }
        if (isModelOffline) {
          return toast.error(
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
        if (chatInputRef.current.value.length > 128) {
          toast.error(
            "Your chat messages too big, please keep it below 128 letters"
          )
          return
        }
        if (isModelOffline) {
          return toast.error(
            <p>
              You have reached guest message limit.Please{" "}
              <Link href="https://tuktuklive.com/auth/login">
                <a className="tw-underline tw-text-blue-500  tw-mx-2">Login</a>
              </Link>
              <br />
              <Link href="https://tuktuklive.com/auth/viewerRegistration">
                <a className="tw-underline tw-text-blue-500 tw-mr-2">sign up</a>
              </Link>
              to send unlimited message
            </p>
          )

          // return toast.error(
          //   "chat is only available when model is streaming/live. 📴 😘😘"
          // )
        }
        /**
         * fetch the public rom
         */
        finalRoom = (
          JSON.parse(sessionStorage.getItem("socket-rooms")) || []
        ).find((room) => room.endsWith("-public"))

        if (finalRoom) {
          payLoad = {
            room: finalRoom,
            message: message,
            username: authCtx.user.user.username,
            walletCoins: authCtx.user.user.relatedUser.wallet.currentAmount,
          }
          io.getSocket().emit("viewer-message-public-emitted", payLoad)
          scrollOnChat("public")
        } else {
          /**
           * if not final room put in public room
           */
          io.getSocket().emit(
            "putting-me-in-these-rooms",
            [`${sessionStorage.getItem("streamId")}-public`],
            (response) => {
              if (response.status === "ok") {
                payLoad = {
                  room: `${sessionStorage.getItem("streamId")}-public`,
                  message: message,
                  username: authCtx.user.user.username,
                  walletCoins:
                    authCtx.user.user.relatedUser.wallet.currentAmount,
                }
                io.getSocket().emit("viewer-message-public-emitted", payLoad)
                scrollOnChat("public")
              }
            }
          )
        }
      }
    } else {
      /**
       * if un-authed
       */
      if (chatWindow === chatWindowOptions.PRIVATE) {
        return toast.error(
          "Please login to chat privately with the model. 📴 😘😘"
        )
      }

      if (chatWindow === chatWindowOptions.PUBLIC) {
        if (isModelOffline) {
          return toast.error(
            <p>
              You have reached guest message limit.Please{" "}
              <Link href="https://tuktuklive.com/auth/login">
                <a className="tw-underline tw-text-blue-500  tw-mx-2">Login</a>
              </Link>
              <br />
              <Link href="https://tuktuklive.com/auth/viewerRegistration">
                <a className="tw-underline tw-text-blue-500 tw-mr-2">sign up</a>
              </Link>
              to send unlimited message
            </p>
          )
          // return toast.error(
          //   "Chat is only available when model is streaming/live. 📴 😘😘"
          // )
        }
      }
      /*     
      {
        "modelId":"count"
      } 
    */
      const chatCountRecord = localStorage.getItem("chatCountRecord")
      const modelId = window.location.pathname.split("/").reverse()[0]
      if (chatCountRecord) {
        try {
          const record = JSON.parse(chatCountRecord)
          if (!record[modelId]) {
            record[modelId] = 0
          }
          record[modelId] += 1
          if (record[modelId] > 5) {
            chatInputRef.current.value = ""
            return toast.error(
              "You have reached guest message limit.Please Login or Sign Up to send unlimited message "
            )
          }
          localStorage.setItem("chatCountRecord", JSON.stringify(record))
        } catch (err) {
          console.error(err)
        }
      } else {
        return localStorage.setItem(
          "chatCountRecord",
          JSON.stringify({ [modelId]: 0 })
        )
      }
      /* un-authed user, no private room*/
      const toRoom = JSON.parse(sessionStorage.getItem("socket-rooms"))?.[0]
      if (toRoom) {
        payLoad = {
          room: JSON.parse(sessionStorage.getItem("socket-rooms"))[0],
          message: message,
          username: localStorage.getItem("unAuthed-user-chat-name"),
          walletCoins: 0,
        }
        io.getSocket().emit("viewer-message-public-emitted", payLoad)
        scrollOnChat("public")
      } else {
        io.getSocket().emit(
          "putting-me-in-these-rooms",
          [`${sessionStorage.getItem("streamId")}-public`],
          (response) => {
            if (response.status === "ok") {
              payLoad = {
                room: `${sessionStorage.getItem("streamId")}-public`,
                message: message,
                username: localStorage.getItem("unAuthed-user-chat-name"),
                walletCoins: 0,
              }
              io.getSocket().emit("viewer-message-public-emitted", payLoad)
              scrollOnChat("public")
            }
          }
        )
      }
    }

    chatInputRef.current.value = ""
  }

  const addAtTheRate = useCallback((username) => {
    if (chatInputRef.current.value.trim() !== "") {
      chatInputRef.current.value = `${chatInputRef.current.value} @${username}`
    } else {
      chatInputRef.current.value = `@${username} `
    }
    document.getElementById("message-input").scrollIntoView({
      block: "center",
    })
  }, [])

  const onClickSendTipMenu = (activity) => {
    /*  */
    if (!authCtx.isLoggedIn) {
      return toast.error("Please login first!")
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
          username: `${authCtx.user.user.username}`,
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
          toast.error(data.message)
        }
      })
      .catch((err) => toast.error(err.message))
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.keyCode === 13) {
        sendChatMessage()
      }
    }
    document.addEventListener("keydown", handleKeyPress, {
      passive: true,
    })
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [sendChatMessage])

  const showCallDetailPopUp = useCallback(() => {
    if (!authCtx.isLoggedIn) {
      toast.error("Please Login To Make Private Call Request 👑")
      return
    }
    modalCtx.showModalWithContent(
      <CallDetailsPopUp
        closeModal={modalCtx.hideModal}
        setPendingCallRequest={setPendingCallRequest}
        pendingCallRequest={pendingCallRequest}
        setCallType={setCallType}
        model={props.modelProfileData}
        key={theKey}
      />,
      {
        contentStyles: {
          minWidth: "min(700px, 90%)",
        },
      }
    )
  }, [
    modalCtx.showModalWithContent,
    pendingCallRequest,
    modalCtx.hideModal,
    props.modelProfileData,
  ])

  const viewerListAddAtTheRate = useCallback((username) => {
    addAtTheRate(username)
    setChatWindow(chatWindowOptions.PUBLIC)
  }, [])

  const openGiftGiver = useCallback(() => {
    if (authCtx.isLoggedIn) {
      modalCtx.showModalWithContent(<Token key={theKey + 600} />, {
        contentStyles: {
          minWidth: "min(520px, 90%)",
        },
      })
    } else {
      toast.error("Please login first, To Gift Coins 👑")
    }
  }, [authCtx.isLoggedIn, modalCtx.showModalWithContent, theKey])

  return (
    <>
      <div className="md:tw-flex md:tw-flex-1 tw-w-full tw-bg-dark-black tw-font-sans md:tw-pt-12 tw-pt-16">
        {pendingCallRequest && (
          <div className="tw-px-2 tw-py-2 tw-text-white-color tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-backdrop-blur tw-z-[390]">
            <div className="tw-flex tw-justify-center tw-items-center">
              <p className="tw-mx-2">
                Your
                {/* <span className="tw-text-dreamgirl-red">
                  {request.callType}
                </span> */}{" "}
                call request is pending, you will be notified when model
                responds!
              </p>
            </div>
          </div>
        )}
        <div
          id="viewerscreen-area"
          className="tw-relative tw-bg-dark-black md:tw-w-[60%] tw-w-full  tw-h-[30rem] md:tw-h-[37rem] lg:tw-h-[82vh] "
        >
          {isModelOffline || callType === "audioCall" ? (
            <div
              className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-bg-cover tw-bg-no-repeat tw-z-[9]"
              style={{
                backgroundImage: `url('${props.modelProfileData?.backGroundImage}')`,
              }}
            ></div>
          ) : null}
          <ViewerScreen
            // key={theKey + 200}
            setIsChatPlanActive={setIsChatPlanActive}
            setCallOnGoing={setCallOnGoing}
            setCallType={setCallType}
            setPendingCallRequest={setPendingCallRequest}
            setIsModelOffline={setIsModelOffline}
            setTipMenuActions={setTipMenuActions}
            setKing={setKing}
            setChatWindow={setChatWindow}
            setModelProfileData={props.setModelProfileData}
            callOnGoing={callOnGoing}
            pendingCallRequest={pendingCallRequest}
            isModelOffline={isModelOffline}
            modelProfileData={props.modelProfileData}
            pendingCallEndRequest={pendingCallEndRequest}
            setPendingCallEndRequest={setPendingCallEndRequest}
            callType={callType}
            openGiftGiver={openGiftGiver}
          />

          {!callOnGoing ? (
            <div className=" tw-bg-second-color tw-w-full tw-absolute tw-bottom-0 tw-py-3 tw-px-2 tw-z-[300]">
              <div className="tw-grid lg:tw-hidden tw-grid-cols-2 tw-grid-rows-2 tw-gap-y-3 tw-gap-x-2">
                <div className="tw-col-span-1 tw-row-span-1 tw-flex tw-items-center tw-justify-start">
                  <button onClick={handleModelFollow}>
                    <span
                      className={`tw-p-1 tw-rounded-full tw-bg-black tw-inline-block`}
                    >
                      <FavoriteIcon className="tw-bg-black" />
                    </span>
                    <span
                      id="model-follower-count-lg"
                      className="tw-pl-2 tw-text-white-color tw-font-semibold"
                    >
                      {props?.modelProfileData?.numberOfFollowers &&
                        props.modelProfileData.numberOfFollowers}
                    </span>
                  </button>
                  <span
                    id="live-viewer-count-md"
                    className="tw-rounded-full tw-px-2.5 tw-py-0.5 tw-text-sm tw-inline-block tw-ml-3 tw-text-green-color tw-border tw-border-green-color"
                  >
                    0 Live
                  </span>
                </div>
                <div className="tw-col-span-1 tw-row-span-1 tw-justify-self-end">
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                    variant="danger"
                    onClick={openGiftGiver}
                  >
                    <CardGiftcardIcon fontSize="small" />
                    <span className="tw-pl-1 tw-tracking-tight">
                      Gift Coins
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
                      Private Video Call
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
                      Private Audio Call
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
                    <span
                      id="model-follower-count-sm"
                      className="tw-pl-2 tw-text-white-color tw-font-semibold"
                    >
                      {props?.modelProfileData?.numberOfFollowers &&
                        props.modelProfileData.numberOfFollowers}
                    </span>
                  </button>
                  <span
                    id="live-viewer-count-lg"
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
                      Private Audio Call
                    </span>
                  </Button>
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm tw-z-[110]"
                    variant="primary"
                    onClick={showCallDetailPopUp}
                  >
                    <VideocamIcon fontSize="small" />
                    <p className="tw-pl-1 tw-tracking-tight">
                      Private Video Call
                    </p>
                  </Button>
                  <Button
                    className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-z-[110]"
                    variant="danger"
                    onClick={openGiftGiver}
                  >
                    <CardGiftcardIcon fontSize="small" />
                    <span className="tw-pl-1 tw-tracking-tight">
                      Gift Coins
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* >>>>>>> THE SECOND HALF <<<<<<<<<<< */}
        <div className="tw-bg-second-color md:tw-w-[40%] md:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-full lg:tw-h-[82vh] tw-flex tw-flex-col tw-justify-between tw-items-stretch">
          {/* TAB SWITCH BUTTONS */}
          <div className="tw-flex-shrink-0 tw-flex-grow-0 tw-w-full tw-flex tw-text-white md:tw-pt-3 tw-pb-3 tw-px-2 md:tw-px-4 tw-text-center tw-content-center tw-items-center tw-relative tw-shadow-md">
            <button
              className={`tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-z-[110] tw-pr-4 ${
                chatWindow === chatWindowOptions?.PUBLIC
                  ? "tw-text-dreamgirl-red tw-font-semibold"
                  : "tw-text-white-color tw-font-normal sm:-font-medium"
              }`}
              onClick={() => setChatWindow(chatWindowOptions.PUBLIC)}
            >
              <ChatBubbleIcon className="tw-mr-1 tw-my-auto" fontSize="small" />
              <span className="tw-my-auto tw-text-xs md:tw-text-sm">
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
              <MarkChatReadIcon
                className="tw-mr-1 tw-my-auto"
                fontSize="small"
              />
              <span className="tw-my-auto tw-text-xs md:tw-text-sm">
                Private Chat
              </span>
            </button>
            <button
              className={`tw-inline-flex tw-items-center tw-content-center tw-py-2 tw-z-[110] tw-mr-4 ${
                chatWindow === chatWindowOptions?.USERS
                  ? "tw-text-dreamgirl-red tw-font-semibold"
                  : "tw-text-white-color tw-font-normal sm:-font-medium"
              }`}
              onClick={() => setChatWindow(chatWindowOptions.USERS)}
            >
              <LocalActivityIcon
                className="tw-mr-1 tw-my-auto"
                fontSize="small"
              />
              <span className="tw-my-auto tw-text-xs md:tw-text-sm">
                Users
                <span
                  className="tw-text-xs tw-font-extralight"
                  id="live-user-count-highlight"
                >
                  {"(0)"}
                </span>
              </span>
            </button>
          </div>

          <div className="tw-flex-grow tw-max-w-[100vw] lg:tw-max-w-[49vw] tw-flex-shrink-0 tw-relative tw-z-[110]">
            {/* PUBLIC CHATS */}
            <div
              id="public-chat-container"
              ref={publicChatContainerRef}
              style={{
                zIndex: chatWindow === chatWindowOptions.PUBLIC ? 120 : 111,
                visibility:
                  chatWindow === chatWindowOptions.PUBLIC
                    ? "visible"
                    : "hidden",
              }}
              className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-overflow-y-scroll tw-bg-second-color"
            >
              <PublicChat
                // key={theKey + 800}
                isModelOffline={isModelOffline}
                modelWelcomeMessage={props.modelProfileData?.welcomeMessage}
                addAtTheRate={addAtTheRate}
                scrollOnChat={scrollOnChat}
                chatWindowRef={chatWindowRef}
                containerRef={publicChatContainerRef}
                modelUsername={props.modelProfileData?.rootUser?.username}
              />
            </div>

            {/* PRIVATE CHATS */}
            <div
              ref={privateChatContainerRef}
              id="private-chat-container"
              style={{
                zIndex: chatWindow === chatWindowOptions.PRIVATE ? 120 : 113,
                visibility:
                  chatWindow === chatWindowOptions.PRIVATE
                    ? "visible"
                    : "hidden",
              }}
              className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-overflow-y-scroll tw-bg-second-color"
            >
              <PrivateChat
                // key={theKey + 1000}
                hasActivePlan={isChatPlanActive}
                scrollOnChat={scrollOnChat}
                setIsChatPlanActive={setIsChatPlanActive}
                modalCtx={!isChatPlanActive && modalCtx}
                chatWindowRef={chatWindowRef}
                containerRef={privateChatContainerRef}
                modelUsername={props.modelProfileData?.rootUser.username}
              />
            </div>

            {/* TIP MENU */}
            <div
              style={{
                zIndex: chatWindow === chatWindowOptions.TIP_MENU ? 120 : 115,
                visibility:
                  chatWindow === chatWindowOptions.TIP_MENU
                    ? "visible"
                    : "hidden",
              }}
              className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-overflow-y-scroll tw-bg-second-color"
            >
              <TipMenuActions
                // key={theKey + 1200}
                tipMenuActions={tipMenuActions}
                setTipMenuActions={setTipMenuActions}
                onClickSendTipMenu={onClickSendTipMenu}
              />
            </div>

            {/* VIEWER SIDE LIST */}
            <div
              style={{
                zIndex: chatWindow === chatWindowOptions.USERS ? 120 : 117,
                visibility:
                  chatWindow === chatWindowOptions.USERS ? "visible" : "hidden",
              }}
              className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-overflow-y-scroll tw-bg-second-color"
            >
              <ViewerSideViewersListContainer
                // key={theKey + 1400}
                callOnGoing={callOnGoing}
                addAtTheRate={viewerListAddAtTheRate}
                modelId={props.modelProfileData?._id}
                king={king}
              />
            </div>
          </div>

          {/* MESSAGE INPUT PANE */}
          <div
            id="message-input"
            className="tw-flex tw-items-center tw-bg-second-color tw-text-white tw-w-full tw-z-[300] tw-pb-2 tw-pt-2.5"
          >
            <button
              onClick={() => setChatWindow(chatWindowOptions.TIP_MENU)}
              className="circle-shadow  tw-h-10 tw-w-[15] tw-inline-flex tw-flex-shrink-0 tw-p-1  tw-bg-second-color tw-ring-1 tw-shadow-inner tw-ring-gray-500 tw-place-items-center tw-rounded-full tw-cursor-pointer hover:tw-transform hover:tw-scale-[1.1]"
            >
              <img src="/tips.png" className="tw-w-6 tw-h-6" />
            </button>
            <input
              className="tw-rounded-full tw-py-2 tw-px-6 tw-bg-dark-black tw-border-0 tw-outline-none tw-flex-grow md:tw-ml-2 "
              placeholder="Start Chatting..."
              ref={chatInputRef}
            ></input>
            <Emoji chatInputRef={chatInputRef} />
            <button
              onClick={sendChatMessage}
              className="tw-rounded-full tw-flex tw-self-center tw-text-sm tw-bg-dreamgirl-red tw-px-4 tw-py-2 md:tw-mr-4 tw-mr-2"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default LiveScreen
