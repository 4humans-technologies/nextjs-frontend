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

const giftData = [
  {
    _id: "6162af0bfae2928e5cc98cbd",
    name: "flower_1",
    price: 10,
    imageUrl: "/images/gifts/kZbV-mMd_flower_1_gift.png",
    packages: [],
    createdAt: "2021-10-10T09:14:52.633Z",
    updatedAt: "2021-10-10T09:14:52.633Z",
    __v: 0,
  },
  {
    _id: "6162afa1f477334b400a6b55",
    name: "teddy",
    price: 100,
    imageUrl: "/images/gifts/Ar8BORml_teddy_gift.png",
    packages: [],
    createdAt: "2021-10-10T09:17:21.914Z",
    updatedAt: "2021-10-10T09:17:21.914Z",
    __v: 0,
  },
  {
    _id: "6162afb0f477334b400a6b57",
    name: "sunflower",
    price: 1000,
    imageUrl: "/images/gifts/mbgXSvj9_sunflower_gift.png",
    packages: [],
    createdAt: "2021-10-10T09:17:36.373Z",
    updatedAt: "2021-10-10T09:17:36.373Z",
    __v: 0,
  },
  {
    _id: "6162afc9f477334b400a6b59",
    name: "purple_bush",
    price: 500,
    imageUrl: "/images/gifts/i3Nx_5ED_purple_bush_gift.png",
    packages: [],
    createdAt: "2021-10-10T09:18:01.394Z",
    updatedAt: "2021-10-10T09:18:01.394Z",
    __v: 0,
  },
  {
    _id: "6162afd9f477334b400a6b5b",
    name: "iris_bush",
    price: 5000,
    imageUrl: "/images/gifts/Lp88JtNB_iris_bush_gift.png",
    packages: [],
    createdAt: "2021-10-10T09:18:17.488Z",
    updatedAt: "2021-10-10T09:18:17.488Z",
    __v: 0,
  },
  {
    _id: "6162affbf477334b400a6b5d",
    name: "flower_pot",
    price: 473,
    imageUrl: "/images/gifts/Tvh731hH_flower_pot_gift.png",
    packages: [],
    createdAt: "2021-10-10T09:18:51.394Z",
    updatedAt: "2021-10-10T09:18:51.394Z",
    __v: 0,
  },
  {
    _id: "6162b01af477334b400a6b5f",
    name: "symetetrical_flower",
    price: 90,
    imageUrl: "/images/gifts/CKtWuBB9_symetetrical_flower_gift.png",
    packages: [],
    createdAt: "2021-10-10T09:19:22.190Z",
    updatedAt: "2021-10-10T09:19:22.190Z",
    __v: 0,
  },
  {
    _id: "6162b02cf477334b400a6b61",
    name: "vass",
    price: 12,
    imageUrl: "/images/gifts/SHDMLgSZ_vass_gift.png",
    packages: [],
    createdAt: "2021-10-10T09:19:40.857Z",
    updatedAt: "2021-10-10T09:19:40.857Z",
    __v: 0,
  },
]

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
  const [showBrowseGifts, setShowBrowseGifts] = useState(true)
  const [gifts, setGifts] = useState(giftData)

  // useEffect(() => {
  //   document.addEventListener("new-chat", () => {
  //     alert("scrolling chat")
  //     console.log(chatBoxContainer.current)
  //     chatBoxContainer.current.scrollBy({
  //       top: 400,
  //       behavior: "smooth",
  //     })
  //   })
  // }, [chatBoxContainer.current])

  const scrollOnChat = useCallback(() => {
    chatBoxContainer.current.scrollBy({
      top: 400,
      behavior: "smooth",
    })
  }, [chatBoxContainer.current])

  const sendChatMessage = () => {
    //debugger
    if (!chatInputRef.current) {
      alert("ref not created, updated")
      return
    }

    if (!chatInputRef.current?.value) {
      return
    }

    let payLoad
    const message = chatInputRef.current.value
    console.log(
      "sent message to room >>>",
      JSON.parse(sessionStorage.getItem("socket-rooms"))[0]
    )
    if (authCtx.isLoggedIn) {
      payLoad = {
        room:
          authCtx.streamRoom ||
          JSON.parse(sessionStorage.getItem("socket-rooms"))[0],
        message: message,
        username: authCtx.user.user.username,
        walletCoins: authCtx.user.user.relatedUser.wallet.currentAmount,
      }
    } else {
      /* un-authed user */
      payLoad = {
        room:
          authCtx.streamRoom ||
          JSON.parse(sessionStorage.getItem("socket-rooms"))[0],
        message: message,
        username: localStorage.getItem("unAuthed-user-chat-name"),
        walletCoins: 0,
      }
    }
    io.getSocket().emit("viewer-message-public-emitted", payLoad)
    chatInputRef.current.value = ""
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

  const showCallDetailPopUp = useCallback(
    () =>
      modalCtx.showModalWithContent(
        <CallDetailsPopUp closeModal={modalCtx.hideModal} />
      ),
    [modalCtx.showModalWithContent, modalCtx.hideModal]
  )
  return (
    <>
      <div className="sm:tw-flex sm:tw-flex-1 tw-w-full tw-bg-dark-black tw-font-sans  tw-mt-28">
        <div className="tw-relative tw-bg-dark-black tw-mt-4 sm:tw-w-6/12 tw-w-full sm:tw-h-[37rem] tw-h-[30rem]">
          {/* <img src="brandikaran.jpg" alt="" /> */}
          <ViewerScreen setModelProfileData={props.setModelProfileData} />
          <div className=" tw-bg-second-color tw-w-full tw-absolute tw-bottom-0 tw-py-3 tw-px-2">
            <div className="tw-grid lg:tw-hidden tw-grid-cols-2 tw-grid-rows-2 tw-gap-y-3 tw-gap-x-2">
              <div className="tw-col-span-1 tw-row-span-1 tw-flex tw-items-center tw-justify-start">
                <FavoriteIcon className="tw-text-red-600" />
                <p className="tw-pl-2 tw-text-white-color tw-font-semibold">
                  33.k
                </p>
              </div>
              <div className="tw-col-span-1 tw-row-span-1 tw-justify-self-end">
                <Button
                  className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                  variant="danger"
                  onClick={() => {
                    setShowBrowseGifts((prev) => !prev)
                  }}
                >
                  <CardGiftcardIcon fontSize="small" />
                  <span className="tw-pl-1 tw-tracking-tight">Send Gift</span>
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
                <FavoriteIcon className="tw-rounded-full tw-flex sm:tw-mr-2" />
                <p className="pl-4">33.k</p>
              </div>
              <div className="tw-flex tw-justify-between">
                <Button
                  className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm"
                  variant="success"
                  onClick={showCallDetailPopUp}
                >
                  <PhoneInTalkIcon fontSize="small" />
                  <span className="tw-pl-1 tw-tracking-tight">
                    Private Audio call
                  </span>
                </Button>
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
                <Button
                  className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                  variant="danger"
                  onClick={() => {
                    modalCtx.showModalWithContent(<Token />)
                  }}
                >
                  <CardGiftcardIcon fontSize="small" />
                  <span className="tw-pl-1 tw-tracking-tight">Send Gift</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:tw-mt-4 tw-mt-2 tw-bg-second-color sm:tw-w-6/12 sm:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-screen">
          <div className="tw-flex tw-justify-around sm:tw-justify-between tw-text-white sm:tw-pt-3 tw-pb-3 tw-px-2 sm:tw-px-4 tw-text-center tw-content-center tw-items-center">
            <button
              className="tw-inline-flex tw-items-center tw-content-center tw-py-2"
              onClick={() => setChatWindow(chatWindowOptions.PUBLIC)}
            >
              <ChatBubbleIcon className="tw-mr-2 tw-my-auto" />
              <span className="tw-font-normal sm:-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                Live Chat
              </span>
            </button>
            <button
              className="tw-inline-flex tw-items-center tw-content-center tw-py-2"
              onClick={() => setChatWindow(chatWindowOptions.PRIVATE)}
            >
              <MarkChatReadIcon className="tw-mr-2 tw-my-auto" />
              <span className="tw-font-normal sm:-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                Private Chat
              </span>
            </button>
            {authCtx.user.userType !== "Model" && (
              <button
                className="tw-inline-flex tw-items-center tw-content-center tw-py-2"
                onClick={() => setChatWindow(chatWindowOptions.TIP_MENU)}
              >
                <LocalActivityIcon className="tw-mr-2 tw-my-auto" />
                <span className="tw-font-normal sm:tw-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                  Tip Menu
                </span>
              </button>
            )}
            {authCtx.user.userType === "Model" ? (
              <button
                className="tw-inline-flex tw-items-center tw-content-center tw-py-2"
                onClick={() => setChatWindow(chatWindowOptions.USERS)}
              >
                <ChatBubbleIcon className="tw-mr-2 tw-my-auto" />
                <span className="tw-font-normal sm:tw-font-medium tw-pl-2 tw-my-auto tw-text-xs md:tw-text-sm">
                  Users
                </span>
              </button>
            ) : null}
          </div>
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
                <PublicChat scrollOnChat={scrollOnChat} />
              </div>
              <div
                className=""
                style={{
                  display:
                    chatWindow === chatWindowOptions.PRIVATE ? "block" : "none",
                }}
              >
                <PrivateChat scrollOnChat={scrollOnChat} />
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
                <TipMenuActions modalCtx={modalCtx} />
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

          <div className="tw-flex tw-py-1.5 tw-bg-second-color tw-text-white tw-place-items-center tw-absolute tw-bottom-0 tw-w-full">
            <div className="tw-rounded-full tw-bg-dark-black tw-flex md:tw-mx-1 tw-outline-none tw-place-items-center tw-w-full tw-relative">
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
