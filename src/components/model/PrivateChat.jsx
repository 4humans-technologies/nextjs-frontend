import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react"
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
import ViewerMessageContainer from "../PrivateChat/viewer/ViewerMessageContainer"

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
        <a className="tw-capitalize tw-bg-dreamgirl-red tw-text-white tw-py-2 tw-px-8 tw-rounded-full tw-font-medium">
          <ExitToApp className="tw-text-white-color" fontSize="small" /> Login
        </a>
      </Link>
    </div>
  </div>
)

const chatWindowOptions = {
  PRIVATE: "private",
}

function PrivateChat(props) {
  const authCtx = useAuthContext()
  const ctx = useSocketContext()

  const chatDataRef = useRef()
  const inFocusRef = useRef()

  useEffect(() => {
    inFocusRef.current =
      props.chatWindowRef.current === chatWindowOptions.PRIVATE
    if (inFocusRef.current) {
      console.debug("Private chat in focus")
    }
  }, [props.chatWindowRef.current])

  const [chatsData, setChatsData] = useState({
    chats: [],
    highLightChat: false,
    nos: 0,
  })

  const [privateChatDbId, setPrivateChatDbId] = useState(null)

  const { hasActivePlan } = props

  const scrollOnChat = (option) => {
    if (inFocusRef.current) {
      props.scrollOnChat(option)
    }
  }

  useEffect(() => {
    chatDataRef.current = chatsData
  }, [chatsData])

  useEffect(() => {
    const pushPrivateChatLocally = (e) => {
      // alert("send private chat msg " + e.detail.msg)
      setChatsData((prev) => {
        prev.chats.push({
          by: "self",
          ts: e.detail.ts,
          msg: e.detail.msg,
        })
        return { ...prev }
      })
      scrollOnChat()
    }
    document.addEventListener("send-private-message", pushPrivateChatLocally)
    return () => {
      document.removeEventListener(
        "send-private-message",
        pushPrivateChatLocally
      )
    }
  }, [])

  /* fetch chats from the db */
  useEffect(() => {
    if (authCtx.isLoggedIn && hasActivePlan) {
      fetch("/api/website/stream/private-chat/find-or-create-private-chat", {
        // fetch("/api/website/private-chat/check-if-private-chat-exists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelId: window.location.pathname.split("/").reverse()[0],
          viewerId: authCtx.relatedUserId,
          quickFindIndex: `${
            window.location.pathname.split("/").reverse()[0]
          }-${authCtx.relatedUserId}`,
        }),
        // body: JSON.stringify({
        //   quickFindIndex: `${
        //     window.location.pathname.split("/").reverse()[0]
        //   }-${authCtx.relatedUserId}`,
        // }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.privateChat) {
            setPrivateChatDbId(data.privateChat._id)
            setChatsData((prev) => {
              return {
                ...prev,
                chats: data.privateChat.chats.map((chat) => {
                  return {
                    ...chat,
                    by: chat.by === "Viewer" ? "self" : "other",
                  }
                }),
              }
            })
            sessionStorage.setItem("privateChatDbId", data.privateChat._id)
          } else {
            setPrivateChatDbId(false)
          }
        })
    } else {
      setPrivateChatDbId(false)
    }
  }, [hasActivePlan, authCtx.isLoggedIn])

  /* listen for message from model */
  useEffect(() => {
    if (ctx.socketSetupDone && hasActivePlan) {
      /* viewer side  */
      const socket = io.getSocket()
      if (!socket.hasListeners("model-private-message-received")) {
        socket.on("model-private-message-received", (data) => {
          document.getElementById("private-message-audio").play()
          if (inFocusRef.current) {
            /* if in focus  */
            setChatsData((prevChatData) => {
              const prev = { ...prevChatData }
              prev.chats.push({
                ...data.chat,
                by: data.chat.by === "Viewer" ? "Self" : "other",
              })
              prev.nos = 0
              prev.highLightChat = false
              return prev
            })
            scrollOnChat()
          } else {
            /* if not in focus, viewing some other tab */
            if (
              !chatDataRef.current.highLightChat &&
              chatDataRef.current.nos === 0
            ) {
              /* no new chat beforehand, add new message tag also */
              setChatsData((prev) => {
                /* push new tag */
                prev.chats.push({
                  by: "system",
                  msg: "New Messages",
                })
                /* push actual message */
                prev.chats.push({
                  ...data.chat,
                  by: data.chat.by === "Viewer" ? "Self" : "other",
                })

                prev.nos = prev.nos + 1
                prev.highLightChat = true
                return { ...prev }
              })
            } else {
              /* if not in focus, viewing some other tab, and new message tag already exists
                 hence directly add the chat message
              */
              setChatsData((prev) => {
                prev.chats.push({
                  ...data.chat,
                  by: data.chat.by === "Viewer" ? "Self" : "other",
                })
                prev.nos = prev.nos + 1
                return { ...prev }
              })
            }
          }
        })

        /* remove listeners on unmount */
        return () => {
          if (socket.hasListeners("model-private-message-received")) {
            socket.off("model-private-message-received")
          }
        }
      }
    }
  }, [ctx.socketSetupDone, hasActivePlan, chatDataRef])

  useEffect(() => {
    if (inFocusRef.current) {
      scrollOnChat("auto")
    }
  }, [])

  const noPlanBanner = useMemo(() => {
    return (
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
        <div className="tw-my-6 tw-rounded tw-bg-first-color tw-text-text-black tw-p-3 tw-text-left">
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
                props.modalCtx.showModalWithContent(
                  <ChooseChatPlan setIsChatPlanActive={hasActivePlan} />
                )
              }
            >
              Get Pro Chat Plan
            </span>
          </button>
        </div>
      </div>
    )
  }, [props.modalCtx.showModalWithContent])

  let privateChatDynamicBlock = useMemo(() => {
    let chatContent
    if (authCtx.isLoggedIn) {
      if (authCtx.user.userType === "Viewer") {
        if (hasActivePlan) {
          chatContent = (
            <ViewerMessageContainer
              chatsData={chatsData}
              modelUsername={props.modelUsername}
            />
          )
        } else {
          chatContent = noPlanBanner
        }
      }
    } else {
      chatContent = notLoggedInBanner
    }
    return chatContent
  }, [authCtx.isLoggedIn, hasActivePlan, authCtx.user.userType, chatsData])

  useEffect(() => {
    return () => sessionStorage.removeItem("privateChatDbId")
  }, [])

  return privateChatDbId === null && authCtx.isLoggedIn ? (
    <div className="tw-w-full tw-px-4 tw-py-3 tw-text-center">
      <p className="tw-text-white-color tw-font-semibold">
        Loading Your Private Chats...
      </p>
    </div>
  ) : (
    <div className="chat-box tw-flex tw-flex-col tw-items-center tw-mb-14 tw-h-full tw-bg-dark-black tw-ml-1">
      {privateChatDynamicBlock}
    </div>
  )
}

export default React.memo(PrivateChat)
