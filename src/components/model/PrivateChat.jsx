import React, { useState, useEffect } from "react"
import {
  Stars,
  StarOutline,
  ChatBubble,
  CheckCircle,
  SupervisedUserCircle,
  ExitToApp,
} from "@material-ui/icons"
import dynamic from "next/dynamic"
import { useAuthContext } from "../../app/AuthContext"
import Link from "next/link"
import NormalChatMessage from "../ChatMessageTypes/NormalChat"
import ModelChatMessage from "../ChatMessageTypes/ModelChatMessage"
import io from "../../socket/socket"
import { useSocketContext } from "../../app/socket/SocketContext"

const ChooseChatPlan = dynamic(() => import("../ViewerScreen/ChooseChatPlan"))
const data = []

const notLoggedInBanner = (
  <div className="tw-mt-6 tw-py-28">
    <div className="tw-text-center">
      <span className="tw-rounded-full tw-bg-dreamgirl-red tw-inline-grid tw-place-items-center tw-p-3 tw-mx-auto video-call-button">
        <StarOutline
          className="tw-text-white-color"
          style={{ fontSize: "50px" }}
        />
      </span>
      <p className="tw-capitalize tw-text-red-600 tw-font-semibold tw-mt-4">
        Exclusive Private Chat
      </p>
      <p className="tw-text-text-black tw-capitalize tw-mt-4">
        Please login to chat <br /> privately with the model
      </p>
    </div>
    <div className="tw-text-center tw-mt-4">
      <Link href="/auth/login">
        <button className="tw-capitalize tw-bg-dreamgirl-red tw-text-white tw-py-2 tw-px-8 tw-rounded-full tw-font-medium">
          <ExitToApp className="tw-text-white-color" fontSize="small" /> Login
        </button>
      </Link>
    </div>
  </div>
)

let chatIndex = 0
let username /* not using context because of closures */
function PrivateChat(props) {
  const authCtx = useAuthContext()
  const ctx = useSocketContext()

  const noPlanBanner = (
    <div className="tw-mt-6 tw-py-20">
      <div className="tw-text-center">
        <span className="tw-rounded-full tw-bg-dreamgirl-red tw-inline-grid tw-place-items-center tw-p-3 tw-mx-auto video-call-button">
          <StarOutline
            className="tw-text-white-color"
            style={{ fontSize: "50px" }}
          />
        </span>
        <p className="tw-font-semibold tw-text-red-500 tw-capitalize tw-mt-3">
          go ultimate
        </p>
        <p className="tw-text-text-black">to chat privately with any model</p>
      </div>
      <div className="tw-my-6 tw-rounded tw-bg-first-color tw-text-text-black tw-p-3">
        <p className="tw-mx-2 tw-my-1">
          <span className="tw-pr-2">
            <ChatBubble fontSize="small" />
          </span>
          Unlimited Private Messages
        </p>
        <p className="tw-mx-2 tw-my-1">
          <span className="tw-pr-2">
            <SupervisedUserCircle fontSize="small" />
          </span>
          Chat With Any Model
        </p>
        <p className="tw-mx-2 tw-my-1">
          <span className="tw-pr-2">
            <CheckCircle fontSize="small" />
          </span>
          Model Can Focus On You More
        </p>
      </div>
      <div className="tw-mt-3 tw-text-center">
        <button className="tw-capitalize tw-bg-dreamgirl-red tw-text-white tw-py-2 tw-px-4 tw-rounded-full tw-font-medium video-call-button">
          <Stars className="tw-text-white-color" fontSize="small" />
          <span
            className="tw-pl-2"
            onClick={() =>
              props.modalCtx.showModalWithContent(<ChooseChatPlan />)
            }
          >
            Get Pro Chat Plan
          </span>
        </button>
      </div>
    </div>
  )

  let chatContent
  if (authCtx.isLoggedIn) {
    if (authCtx.user.userType !== "Model") {
      if (props.hasActivePlan) {
        chatContent = (
          <NormalChatMessage
            index={0}
            displayName={"Model"}
            message={"Start chatting with the model privately! 🔏🔏"}
            walletCoins={"SECURE"}
          />
        )
      } else {
        chatContent = noPlanBanner
      }
    } else {
      chatContent = (
        <NormalChatMessage
          index={0}
          displayName={"Model"}
          message={"Click on Go Live, To Start "}
          walletCoins={"Not live"}
        />
      )
    }
  } else {
    chatContent = notLoggedInBanner
  }

  const [privateChatMessages, setPrivateChatMessages] = useState([])

  useEffect(() => {
    //debugger
    if (ctx.socketSetupDone) {
      //debugger
      /* 🟥 will it cause problem if i click on recommendation list */
      const socket = io.getSocket()
      if (!username) {
        username = JSON.parse(localStorage.getItem("user"))?.username
      }
      if (!socket.hasListeners("model-message-private-received")) {
        socket.on("model-message-private-received", (data) => {
          setPrivateChatMessages((prevChats) => {
            // document.dispatchEvent(chatScrollEvent)
            const newChats = [
              ...prevChats,
              {
                type: "model-private-message",
                index: chatIndex,
                message: data.message,
              },
            ]
            chatIndex++
            return newChats
          })
          props.scrollOnChat()
        })
      }
      if (!socket.hasListeners("viewer-message-private-received")) {
        socket.on("viewer-message-private-received", (data) => {
          if (localStorage.getItem("userType") === "Model") {
            setPrivateChatMessages((prevChats) => {
              const newChats = [
                ...prevChats,
                {
                  type: "normal-private-message",
                  index: chatIndex,
                  username: data.username,
                  message: data.message,
                  walletCoins: data.walletCoins,
                },
              ]
              chatIndex++
              return newChats
            })
            props.scrollOnChat()
          } else {
            if (data.username === username) {
              setPrivateChatMessages((prevChats) => {
                const newChats = [
                  ...prevChats,
                  {
                    type: "normal-private-message",
                    index: chatIndex,
                    username: data.username,
                    message: data.message,
                    walletCoins: data.walletCoins,
                  },
                ]
                chatIndex++
                return newChats
              })
              props.scrollOnChat()
            }
          }
        })
      }
    }
  }, [ctx.socketSetupDone, io.getSocket(), username])

  useEffect(() => {
    /* why you have to remove the event listners any way */
    //debugger
    if (ctx.socketSetupDone) {
      return () => {
        alert("removing Private listeners")
        const socket = io.getSocket()
        //debugger
        if (socket.hasListeners("viewer-message-private-received")) {
          socket.off("viewer-message-private-received")
        }
        if (socket.hasListeners("model-message-private-received")) {
          socket.off("model-message-private-received")
        }
      }
    }
  }, [ctx.socketSetupDone, io.getSocket()])

  return (
    <div className="chat-box tw-flex tw-flex-col tw-items-center tw-mb-14 tw-h-full tw-bg-dark-black tw-ml-1">
      {chatContent}
      {privateChatMessages.map((chat, index) => {
        switch (chat.type) {
          case "normal-private-message":
            return (
              <NormalChatMessage
                key={"*H^45%8H" + chat.index}
                index={chat.index}
                displayName={chat.username}
                message={chat.message}
                walletCoins={chat.walletCoins}
              />
            )
          case "model-private-message":
            return (
              <ModelChatMessage
                key={"*(78jht45k7" + chat.index}
                index={chat.index}
                message={chat.message}
              />
            )
        }
      })}
    </div>
  )
}

export default PrivateChat
