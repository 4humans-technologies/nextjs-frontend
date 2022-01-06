import React, { useState, useEffect, useCallback, useRef } from "react"
import io from "../../socket/socket"
import { useSocketContext } from "../../app/socket/SocketContext"
import { useAuthContext } from "../../app/AuthContext"
import NormalChatMessage from "../ChatMessageTypes/NormalChat"
import ModelChatMessage from "../ChatMessageTypes/ModelChatMessage"
import CoinSuperChat from "../ChatMessageTypes/TokenGift"
import TipMenuActivityRequest from "../ChatMessageTypes/TipMenuActivity"
import CallRequestChat from "../ChatMessageTypes/CallRequest"
import GiftSuperChat from "../ChatMessageTypes/GiftSuperChat"

let messageShowed = false
const chatWindowOptions = {
  PUBLIC: "public",
}
let UnAuthedViewerChatName
if (typeof window !== "undefined") {
  UnAuthedViewerChatName = localStorage.getItem("unAuthed-user-chat-name")
}
function PublicChatBox(props) {
  const [chatMessages, setChatMessages] = useState([])
  const [prevChats, setPrevChats] = useState([])
  const [welcomeMsg, setWelcomeMsg] = useState("")
  const ctx = useSocketContext()
  const authCtx = useAuthContext()
  const { isModelOffline, modelWelcomeMessage, scrollOnChat } = props

  useEffect(() => {
    if (
      !isModelOffline &&
      authCtx.isLoggedIn &&
      authCtx.user.userType === "Viewer" &&
      modelWelcomeMessage
    ) {
      if (!messageShowed) {
        messageShowed = true
        if (modelWelcomeMessage) {
          // setTimeout(() => {
          setWelcomeMsg(
            modelWelcomeMessage.replaceAll(
              "__name__",
              authCtx.user.user.relatedUser.name
            )
          )
          // }, [8000])
        }
      }
      return () => {
        messageShowed = false
      }
    }
  }, [
    isModelOffline,
    authCtx.isLoggedIn,
    modelWelcomeMessage,
    authCtx.user.userType,
  ])

  useEffect(() => {
    if (ctx.socketSetupDone) {
      /* 🟥 will it cause problem if i click on recommendation list */
      const socket = io.getSocket()
      if (!socket.hasListeners("viewer_super_message_pubic-received")) {
        // alert("init socket listners")
        socket.on("viewer_super_message_pubic-received", (data) => {
          let chat
          if (data.chatType === "gift-superchat-public") {
            chat = {
              type: data.chatType,
              username: data.username,
              giftImageUrl: data.gift.giftImageUrl,
              message: data.message,
              walletCoins: data.walletCoins,
            }
          } else if (data.chatType === "coin-superchat-public") {
            chat = {
              type: data.chatType,
              username: data.username,
              amountGiven: data.amountGiven,
              message: data.message,
              walletCoins: data.walletCoins,
            }
            if (authCtx.user.userType !== "Model") {
              document.getElementById("superchat-audio").play()
            }
          } else if (data.chatType === "tipmenu-activity-superchat-public") {
            chat = {
              type: data.chatType,
              username: data.username,
              activity: {
                action: data.activity.action,
                price: data.activity.price,
              },
              walletCoins: data.walletCoins,
            }
            if (authCtx.user.userType !== "Model") {
              document.getElementById("superchat-audio").play()
            }
          }
          setChatMessages((prevChats) => {
            // document.dispatchEvent(chatScrollEvent)
            return [...prevChats, chat]
          })
          scrollOnChat("public")
          // document.dispatchEvent(chatEvent)
        })
      }
      if (!socket.hasListeners("model-message-public-received")) {
        socket.on("model-message-public-received", (data) => {
          setChatMessages((prevChats) => {
            const newChats = [
              ...prevChats,
              {
                type: "model-public-message",
                message: data.message,
              },
            ]
            return newChats
          })
          scrollOnChat("public")
          // document.dispatchEvent(chatEvent)
        })
      }
      if (!socket.hasListeners("viewer-message-public-received")) {
        socket.on("viewer-message-public-received", (data) => {
          setChatMessages((prevChats) => {
            const newChats = [
              ...prevChats,
              {
                type: "normal-public-message",
                username: data.username,
                message: data.message,
                walletCoins: data.walletCoins,
              },
            ]
            return newChats
          })
          scrollOnChat("public")
          // document.dispatchEvent(chatEvent)
        })
      }

      return () => {
        /**
         * get out of the public room
         */
        const socketRooms =
          JSON.parse(sessionStorage.getItem("socket-rooms")) || []
        if (socketRooms.find((room) => room.endsWith("-public"))) {
          socket.emit("take-me-out-of-these-rooms", [
            socketRooms.find((room) => room.endsWith("-public")),
          ])
        }

        if (socket.hasListeners("viewer-message-public-received")) {
          socket.off("viewer-message-public-received")
        }
        if (socket.hasListeners("model-message-public-received")) {
          socket.off("model-message-public-received")
        }
        if (socket.hasListeners("viewer_super_message_pubic-received")) {
          socket.off("viewer_super_message_pubic-received")
        }
        if (socket.hasListeners("viewer-requested-for-call-emitted")) {
          socket.off("viewer-requested-for-call-emitted")
        }
      }
    }
  }, [ctx.socketSetupDone])

  /* fetch public chats from firebase */
  useEffect(() => {
    const url =
      "https://dreamgirl-dep1-default-rtdb.asia-southeast1.firebasedatabase.app/publicChats/"
    const fetchChats = (e) => {
      fetch(`${url}${e.detail.streamId}/chats.json`)
        .then((res) => res.json())
        .then((chats) => {
          if (chats) {
            setPrevChats(Object.values(chats))
          }
          setTimeout(() => {
            document.getElementById("public-chat-container").scrollBy({
              top: document.getElementById("public-chat-container")
                .scrollHeight,
              behavior: "smooth",
            })
          }, [100])
        })
    }
    document.addEventListener("fetch-firebase-chats", fetchChats, {
      passive: true,
    })
    return () => {
      document.removeEventListener("fetch-firebase-chats", fetchChats)
    }
  }, [])

  const shouldHighLight = useCallback(
    (message) => {
      if (
        authCtx.user.userType === "Viewer" ||
        authCtx.user.userType === "Model"
      ) {
        if (message.includes(`@${authCtx.user.user.username}`)) {
          return true
        }
        return false
      } else if (authCtx.user.userType === "UnAuthedViewer") {
        if (message.includes(`@${UnAuthedViewerChatName}`)) {
          return true
        }
        return false
      }
    },
    [authCtx.user.userType, authCtx.user.user?.username]
  )

  const renderChats = (chat, index, prefix) => {
    switch (chat?.type || chat?.chatType) {
      case "normal-public-message":
        return (
          <NormalChatMessage
            key={prefix + "current_chat" + index}
            displayName={chat.username}
            message={chat.message}
            walletCoins={
              authCtx.user.userType === "Model" ? chat.walletCoins : null
            }
            highlight={shouldHighLight(chat.message)}
            addAtTheRate={() => props.addAtTheRate(chat?.username)}
          />
        )
      case "model-public-message":
        return (
          <ModelChatMessage
            key={prefix + "model_chat" + index}
            message={chat.message}
            highlight={shouldHighLight(chat.message)}
            addAtTheRate={() =>
              props.addAtTheRate(
                authCtx.user.userType === "Model"
                  ? authCtx.user.user.username
                  : props.modelUsername
              )
            }
            modelUsername={
              authCtx.user.userType === "Model" ? " you" : props.modelUsername
            }
          />
        )
      case "gift-superchat-public":
        return (
          <GiftSuperChat
            key={prefix + "gift_super" + index}
            displayName={chat.username}
            message={chat.message}
            giftImageUrl={chat.giftImageUrl}
            walletCoins={chat.walletCoins}
            showWallet={authCtx.user.userType === "Model"}
            addAtTheRate={() => props.addAtTheRate(chat?.username)}
          />
        )
      case "coin-superchat-public":
        return (
          <CoinSuperChat
            key={prefix + "coins_gift" + index}
            displayName={chat.username}
            message={chat.message}
            amountGiven={chat.amountGiven}
            walletCoins={chat.walletCoins}
            showWallet={authCtx.user.userType === "Model"}
            addAtTheRate={() => props.addAtTheRate(chat?.username)}
          />
        )
      case "viewer-call-request":
        return (
          <CallRequestChat username={chat.username} callType={chat.callType} />
        )
      case "tipmenu-activity-superchat-public":
        return (
          <TipMenuActivityRequest
            key={prefix + "activity" + index}
            username={chat.username}
            callType={chat.callType}
            // activityName={chat?.activityName || chat?.activity?.action}
            // activityPrice={chat?.activityPrice || chat?.activity?.price}
            activityName={chat.activity.action}
            activityPrice={chat.activity.price}
            walletCoins={chat.walletCoins}
            message={`${chat.username} requested activity`}
            addAtTheRate={() => props.addAtTheRate(chat?.username)}
          />
        )
      default:
        break
    }
  }

  return (
    <div className="tw-h-full">
      {prevChats.map((chat, index) => renderChats(chat, index, "prev_"))}
      {welcomeMsg && authCtx.user.userType === "Viewer" ? (
        <ModelChatMessage
          key={"model_welcome_message"}
          message={welcomeMsg}
          highlight={false}
          addAtTheRate={() => props.addAtTheRate(props?.modelUsername)}
          modelUsername={props?.modelUsername}
        />
      ) : null}
      {chatMessages.map((chat, index) => renderChats(chat, index))}
    </div>
  )
}

export default React.memo(PublicChatBox)
