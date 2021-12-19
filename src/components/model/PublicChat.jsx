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

let chatIndex = 0
let messageShowed = false
const chatWindowOptions = {
  PUBLIC: "public",
}
let UnAuthedViewerChatName
if (typeof window !== "undefined") {
  UnAuthedViewerChatName = localStorage.getItem("unAuthed-user-chat-name")
}
function PublicChatBox(props) {
  let pageUrl
  if (typeof window !== "undefined") {
    pageUrl = window.location.pathname
  }

  const [chatMessages, setChatMessages] = useState([])
  const [prevChats, setPrevChats] = useState([])
  const ctx = useSocketContext()
  const authCtx = useAuthContext()
  const { isModelOffline } = props

  const scrollOnChat = useCallback(
    (option) => {
      if (props.chatWindowRef.current) {
        props.scrollOnChat(option)
      }
    },
    [props.chatWindowRef]
  )

  useEffect(() => {
    if (
      !isModelOffline &&
      authCtx.isLoggedIn &&
      authCtx.user.userType === "Viewer"
    ) {
      if (!messageShowed) {
        messageShowed = true
        setTimeout(() => {
          setChatMessages((prevChats) => {
            const newChats = [
              ...prevChats,
              {
                type: "model-public-message",
                message: authCtx.isLoggedIn
                  ? `Hello my sweetheart ${
                      authCtx.user.user.relatedUser.name.split(" ")[0]
                    } 💘😘, welcome to me stream, check the tip menu (🔝) to see what can i do for you sweetheart 💘💘.`
                  : "Hello dear 💘, welcome to my stream i here to entertain you... 😘😘",
              },
            ]
            chatIndex++
            return newChats
          })
        }, [1000])
      }
    }
  }, [isModelOffline, authCtx.isLoggedIn, authCtx.user.userType])

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
              activityName: data.activity.action,
              activityPrice: data.activity.price,
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
          scrollOnChat()
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
            chatIndex++
            return newChats
          })
          scrollOnChat()
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
            chatIndex++
            return newChats
          })
          scrollOnChat()
          // document.dispatchEvent(chatEvent)
        })
      }
    }
  }, [ctx.socketSetupDone, io.getSocket()])

  /* fetch public chats from firebase */
  useEffect(() => {
    const url =
      "https://dreamgirl-dep1-default-rtdb.asia-southeast1.firebasedatabase.app/publicChats/"
    const fetchChats = (e) => {
      fetch(`${url}${e.detail.streamId}/chats.json`)
        .then((res) => res.json())
        .then((chats) => {
          scrollOnChat()
          if (chats) {
            setPrevChats(Object.values(chats))
          }
        })
    }
    document.addEventListener("fetch-firebase-chats", fetchChats)
    return () => {
      document.removeEventListener("fetch-firebase-chats", fetchChats)
    }
  }, [])

  useEffect(() => {
    /* why you have to remove the event listners any way */
    //debugger
    if (ctx.socketSetupDone) {
      return () => {
        // alert("removing listners")
        const socket = io.getSocket()
        //debugger
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
  }, [ctx.socketSetupDone, io.getSocket()])

  useEffect(() => {
    /* when the viwerscreen component un-mounts leave the public stream specific rooms */
    if (ctx.socketSetupDone) {
      return () => {
        const socket = io.getSocket()
        const socketRooms =
          JSON.parse(sessionStorage.getItem("socket-rooms")) || []
        const roomsToLeave = []
        socketRooms.forEach((room) => {
          if (room.endsWith("-public")) {
            roomsToLeave.push(room)
          }
        })
        socket.emit("take-me-out-of-these-rooms", [...roomsToLeave])
      }
    }
  }, [ctx.socketSetupDone, io.getSocket()])

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
            activityName={chat.activityName}
            activityPrice={chat.activityPrice}
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
    <div className="chat-box tw-max-w-full tw-mb-14 tw-pr-2 tw-mt-4">
      {prevChats.map((chat, index) => renderChats(chat, index, "prev_"))}
      {chatMessages.map((chat, index) => renderChats(chat, index))}
    </div>
  )
}

export default React.memo(PublicChatBox)
