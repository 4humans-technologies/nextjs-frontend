import React, { useState, useEffect } from "react"
import Image from "next/image"
import flowerImage from "../../../public/flower-rose-png.jpg"
import coinsImage from "../../../public/coins.png"
import io from "../../socket/socket"
import { useSocketContext } from "../../app/socket/SocketContext"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

/* 
  if normal message
  {
    type:"normal-public-message"
    timeStamp:324234,
    username/uid:xxxxxxxx,
    message:xxxxxx
  }
  if model message
  {
    type:"model-public-message",
    timeStamp:3423432,
    message:xxxxxxxxxx
  },
  if gift-superChat
  {
    type:"gift-superchat-public",
    username:xxxxxxxxx,
    timestamp:3121212,
    message:xxxxxxxxx
  }
  if coins superchat
  {
    type:"coin-superchat-public",
    username:xxxxxxxxx,
    timestamp:23123123,
    message:xxxxxxxxx
  }
*/

function NormalChatMessage(props) {
  return (
    <div className="tw-flex tw-items-center tw-justify-between tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 tw-bg-first-color tw-text-white-color tw-flex-grow tw-flex-shrink-0 tw-w-full">
      <div className="tw-flex-grow tw-pr-2">
        <span className="display-name tw-font-semibold tw-capitalize tw-inline-block tw-pr-3">
          {props.displayName}:
        </span>
        <span className="user-message tw-text-sm tw-font-normal">
          {props.message}
        </span>
      </div>
      <div className="tw-flex-shrink-0 tw-flex-grow-0 tw-pl-2">
        {props.walletCoins}
      </div>
    </div>
  )
}

function ModelChatMessage(props) {
  return (
    <div className="tw-flex tw-flex-grow tw-flex-shrink-0 tw-w-full tw-bg-first-color tw-text-white-color tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 tw-justify-between">
      <div className="tw-flex-grow tw-flex-shrink-0">
        <h2 className="tw-font-semibold tw-text-sm tw-mb-1 tw-bg-second-color tw-px-1.5 tw-rounded tw-inline-block tw-py-1 tw-tracking-wider">
          Message By Model
        </h2>
        <p className="tw-mt-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo,
          esse?
        </p>
      </div>
    </div>
  )
}

function GiftSuperChat(props) {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-between tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 gift-superchat-bg tw-text-white-color tw-flex-grow tw-flex-shrink-0 tw-w-full">
      <div className="tw-flex-grow-0 tw-mb-2 tw-px-1.5 tw-pt-1.5 tw-rounded tw-bg-second-color tw-mr-auto">
        <Image
          src={props.giftImageUrl}
          width={90}
          height={90}
          objectFit="contain"
          objectPosition="center"
          className="tw-rounded tw-mr-auto"
        />
      </div>
      <div className="tw-flex tw-px-2 tw-justify-between tw-w-full tw-flex-grow">
        <div className="tw-flex-grow tw-pr-2">
          <span className="display-name tw-font-semibold tw-capitalize tw-inline-block tw-pr-3">
            {props.displayName}:
          </span>
          <span className="user-message tw-text-sm tw-font-normal">
            {props.message}
          </span>
        </div>
        <p className="tw-flex-shrink-0 tw-flex-grow-0 tw-pl-2 tw-text-yellow-400 tw-font-medium">
          {props.walletCoins}
        </p>
      </div>
    </div>
  )
}

function CoinSuperChat(props) {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-between tw-my-0.5 tw-px-3 tw-py-1.5 tw-ml-2 coin-superchat-bg tw-text-white-color tw-flex-grow tw-flex-shrink-0 tw-w-full">
      <div className="tw-flex-grow-0 tw-mb-2 tw-px-1.5 tw-pt-1.5 tw-rounded tw-mr-auto">
        <Image
          src={coinsImage}
          width={90}
          height={90}
          objectFit="contain"
          objectPosition="center"
          className="tw-rounded tw-mr-auto"
        />
        <p className="tw-mt-1 tw-font-semibold tw-text-yellow-400">
          <span className="display-name tw-font-semibold tw-capitalize tw-inline-block tw-pr-3">
            {props.displayName}:
          </span>
          {props.amountGiven}
        </p>
      </div>
      <div className="tw-flex tw-px-2 tw-justify-between tw-w-full tw-flex-grow">
        <div className="tw-flex-grow tw-pr-2">
          <span className="user-message tw-text-sm tw-font-normal">
            {props.message}
          </span>
        </div>
        <p className="tw-flex-shrink-0 tw-flex-grow-0 tw-pl-2 tw-text-yellow-400">
          {props.walletCoins}
        </p>
      </div>
    </div>
  )
}

const initialMessages = [
  {
    type: "normal-public-message",
    index: 1,
    username: "ravi",
    message: "Hello how is every one, feel very good here",
    walletCoins: 100,
  },
  {
    type: "model-public-message",
    index: 2,
    message: "Hello how is every one, feel very good here",
  },
  {
    type: "gift-superchat-public",
    index: 3,
    username: "Neeraj rai",
    giftImageUrl: flowerImage,
    message: "Hello how is every one, feel very good here",
    walletCoins: 100,
  },
  {
    type: "gift-superchat-public",
    username: "Neeraj rai",
    index: 4,
    walletCoins: 100,
    giftImageUrl: flowerImage,
    message: "Hello how is every one, feel very good here",
  },
  {
    type: "coin-superchat-public",
    username: "Vikas kumawat",
    index: 5,
    amountGiven: 40,
    message: "Hello how is every one, feel very good here",
    walletCoins: 100,
  },
  {
    type: "coin-superchat-public",
    username: "Vikas kumawat",
    index: 6,
    amountGiven: 100,
    message: "Hello how is every one, feel very good here",
    walletCoins: 50,
  },
]

let chatIndex = 0
let socketSetup = false
function PublicChatBox() {
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const ctx = useSocketContext()
  const authCtx = useAuthContext()
  const authUpdateCtx = useAuthUpdateContext()
  useEffect(() => {
    let socket
    if (ctx.isConnected && !socketSetup) {
      socket = io.getSocket()
      socketSetup = true
      const doSetup = () => {
        socket.on("viewer-message-public-received", (data) => {
          setChatMessages((prevChats) => {
            const newChats = [
              ...prevChats,
              {
                type: "normal-public-message",
                index: chatIndex,
                username: data.username,
                message: data.message,
                walletCoins: data.walletCoins,
              },
            ]
            chatIndex++
            return newChats
          })
        })
        socket.on("model-message-public-received", (data) => {
          setChatMessages((prevChats) => {
            const newChats = [
              ...prevChats,
              {
                type: "model-public-message",
                index: chatIndex,
                message: data.message,
              },
            ]
            chatIndex++
            return newChats
          })
        })
        socket.on("viewer_super_message_pubic-received", (data) => {
          let chat
          if (data.chatType === "gift-superchat-public") {
            chat = {
              type: data.chatType,
              index: chatIndex,
              username: data.username,
              giftImageUrl: data.gift.giftImageUrl,
              message: data.message,
              walletCoins: data.walletCoins,
            }
          } else if (data.chatType === "coin-superchat-public") {
            chat = {
              type: data.chatType,
              index: chatIndex,
              username: data.username,
              amountGiven: data.amountGiven,
              message: data.message,
              walletCoins: data.walletCoins,
            }
          }
          setChatMessages((prevChats) => {
            return [...prevChats, chat]
          })
        })
      }

      doSetup()
    }
    if (ctx.isConnected) {
      if (!socket) {
        socket = io.getSocket()
      }
      return () => {
        if (authCtx.streamRoom) {
          socket.off("viewer-message-public-received")
          socket.off("model-message-public-received")
          socket.off("viewer_super_message_pubic-received")
          socket.emit(
            "take-me-out-of-these-rooms",
            [authCtx.streamRoom],
            (response) => {
              if (response.status === "ok") {
                /* remove this room from session storage also */
                const rooms =
                  JSON.parse(sessionStorage.getItem("socket-rooms")) || []
                sessionStorage.setItem(
                  "socket-rooms",
                  JSON.stringify(
                    rooms.filter((room) => room !== authCtx.streamRoom)
                  )
                )
                authUpdateCtx.updateViewer({ streamRoom: null })
              }
            }
          )
        }
      }
    }
  }, [
    socketSetup,
    ctx.isConnected,
    authCtx.streamRoom,
    io.getSocket(),
    sessionStorage.getItem("socket-rooms"),
  ])

  return (
    <div className="chat-box tw-flex tw-flex-col tw-items-center tw-mb-14">
      {chatMessages.map((chat, index) => {
        switch (chat.type) {
          case "normal-public-message":
            return (
              <NormalChatMessage
                index={chat.index}
                displayName={chat.username}
                message={chat.message}
                walletCoins={chat.walletCoins}
              />
            )
          case "model-public-message":
            return (
              <ModelChatMessage index={chat.index} message={chat.message} />
            )
          case "gift-superchat-public":
            return (
              <GiftSuperChat
                index={chat.index}
                displayName={chat.username}
                message={chat.message}
                giftImageUrl={chat.giftImageUrl}
                walletCoins={chat.walletCoins}
              />
            )
          case "coin-superchat-public":
            return (
              <CoinSuperChat
                index={chat.index}
                displayName={chat.username}
                message={chat.message}
                amountGiven={chat.amountGiven}
                walletCoins={chat.walletCoins}
              />
            )
          default:
            break
        }
      })}
    </div>
  )
}

export default PublicChatBox
