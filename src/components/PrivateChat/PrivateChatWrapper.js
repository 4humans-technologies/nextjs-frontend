import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"
import MessageContainer from "./MessagesContainer"
import ViewerTile from "./ViewerTile"
import io from "../../socket/socket"
import { useSocketContext } from "../../app/socket/SocketContext"
import { useAuthContext } from "../../app/AuthContext"

const chatScreens = {
  VIEWERS_LIST: "viewers-list",
  SINGLE_VIEWER_DETAIL_CHAT: "single-viewer-detail-chat",
}

const chatActions = {
  NEW_MESSAGE_FROM_VIEWER: "new-message-from-viewer",
}

const initialChatState = [
  {
    viewerId: "",
    name: "",
    username: "",
    profileImage: "",
    chats: [
      {
        by: "other" /* ["self","other"] */,
        msg: "hello this is a dummy message",
        ts: 54655646254654,
      },
      {
        by: "other" /* ["self","other"] */,
        msg: "hello this is a dummy message",
        ts: 54655646543654,
      },
      {
        by: "self" /* ["self","other"] */,
        msg: "hello this is a dummy message",
        ts: 5465564654654,
      },
      {
        by: "self" /* ["self","other"] */,
        msg: "hello this is a dummy message",
        ts: 54655646546542,
      },
      {
        by: "other" /* ["self","other"] */,
        msg: "hello this is a dummy message",
        ts: 54655646543654,
      },
      {
        by: "self" /* ["self","other"] */,
        msg: "hello this is a dummy message",
        ts: 5465564654654,
      },
      {
        by: "other" /* ["self","other"] */,
        msg: "hello this is a dummy message",
        ts: 54655646543654,
      },
      {
        by: "self" /* ["self","other"] */,
        msg: "hello this is a dummy message",
        ts: 5465564654654,
      },
    ],
    highLightNewChat: false,
    newChats: {
      chats: [],
      nos: 0,
    },
  },
]

function PrivateChatWrapper(props) {
  const { scrollOnChat, inFocus, newChatNotifierDotRef } = props

  const socketCtx = useSocketContext()
  const currentChatScreenStateRef = useRef()
  const currentViewerRef = useRef()
  const inFocusRef = useRef()
  const dbChatIdsRef = useRef()
  const userType = useAuthContext().user.userType

  const [currentChatScreen, setCurrentChatScreen] = useState(
    chatScreens.VIEWERS_LIST
  )

  const goBack = () => {
    setCurrentChatScreen(chatScreens.VIEWERS_LIST)
  }

  const [currentViewer, setCurrentViewer] = useState(null)
  // const [chatState, setChatState] = useState(initialChatState)
  const [chatState, setChatState] = useState([])
  const [dbChatIds, setDbChatIds] = useState([
    {
      dbChatId: null,
      viewerId: null,
    },
  ])

  useEffect(() => {
    currentChatScreenStateRef.current = currentChatScreen
  }, [currentChatScreen])

  useEffect(() => {
    currentViewerRef.current = currentViewer
  }, [currentViewer])

  useEffect(() => {
    inFocusRef.current = inFocus
  }, [inFocus])

  useEffect(() => {
    dbChatIdsRef.current = dbChatIds
  }, [dbChatIds])

  const handleViewerTileClick = (viewerId) => {
    sessionStorage.setItem("viewerId", viewerId)
    /* merge new chats in the main chats */
    let foundViewer
    setChatState((prev) => {
      /* merge new chats in the main chats */
      return prev.map((chatData) => {
        if (chatData.viewerId === viewerId) {
          foundViewer = chatData
          if (chatData.highLightNewChat && chatData.newChats.nos > 0) {
            /* add new messages tag and merge new chats below it */
            return {
              ...chatData,
              chats: [
                ...chatData.chats,
                { by: "system", msg: "New Message" },
                ...chatData.newChats.chats,
              ],
              newChats: {
                chats: [],
                nos: 0,
                highLightNewChat: false,
              },
            }
          } else {
            return chatData
          }
        } else {
          return chatData
        }
      })
    })

    /* find that viewers chat data */
    /* isolate that viewers chat data in currentViewer */
    setCurrentViewer(foundViewer)
    /* mount detail screen with current viewer */
    setCurrentChatScreen(chatScreens.SINGLE_VIEWER_DETAIL_CHAT)
  }

  /* currently in no use */
  const mergeNewChatsWithMainChats = () => {
    setChatState((prev) => {
      const stateCopy = { ...prev }

      /* find that viewers chat data */
      const foundViewerIndex = chatState.findIndex((viewer) => {
        return viewer.viewerId === viewerId
      })

      /* merge new chats in the main chats */
      stateCopy[foundViewerIndex].chats = [
        ...prev[foundViewerIndex].chats,
        { by: "system", msg: "New Message" },
        ...prev[foundViewerIndex].newChats.chats,
      ]

      /* empty new chats, no new chat now */
      stateCopy[foundViewerIndex].newChats = {
        chats: [],
        nos: 0,
        highLightNewChat: false,
      }
      return stateCopy
    })
  }

  const removeNewChatTag = useCallback((viewerId) => {
    /* remove new messages tag from chats */
    setChatState((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.viewerId === viewerId) {
          return {
            ...chat,
            chats: chat.chats.filter((chatMsg) => chatMsg.by !== "system"),
            newChats: {
              chats: [],
              nos: 0,
            },
          }
        } else {
          return chat
        }
      })
    })
  }, [])

  /* listen for new chat messages */
  useEffect(() => {
    /*  */
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      if (!socket.hasListeners("viewer-private-message-received")) {
        socket.on("viewer-private-message-received", (data) => {
          if (
            !dbChatIdsRef.current.map((ch) => ch.dbChatId).includes(data.dbId)
          ) {
            /* if viewer chats does not already exists
              fetch chats from online db
            */
            setDbChatIds((prevIds) => {
              prevIds.push({
                dbChatId: data.dbId,
                viewerId: data.viewerId,
              })
              return prevIds
            })
            setChatState((prevChats) => {
              prevChats.push({
                viewerId: data.viewerId,
                chats: [],
                /* has to go as no tile exist for this chat hence has to be new chat */
                newChats: {
                  chats: [{ ...data.chat }],
                  nos: 1,
                },
                highLightNewChat: true,
              })
              return prevChats
            })
            /* request to fetch private chat from database */
            fetch("/api/website/private-chat/get-my-private-cht-by-id", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                dbChatId: data.dbId,
              }),
            })
              .then((res) => res.json())
              .then((result) => {
                if (result.actionStatus === "success") {
                  setChatState((prev) => {
                    return prev.map((chatMsg) => {
                      if (chatMsg.viewerId === data.viewerId) {
                        /* add chats fetched from db into chatState */
                        return {
                          ...chatMsg,
                          viewerId: result.privateChat.viewer._id,
                          name: result.privateChat.viewer.name,
                          username: result.privateChat.viewer.rootUser.username,
                          profileImage: result.privateChat.viewer.profileImage,
                          chats: result.privateChat.chats,
                        }
                      }
                    })
                  })
                } else {
                  alert("Error chats not fetched!")
                }
              })
          } else {
            if (
              currentChatScreenStateRef.current === chatScreens.VIEWERS_LIST &&
              currentViewerRef.current.viewerId !== data.viewerId &&
              !inFocusRef.current
            ) {
              /* in background add new chat message to new chats */
              newChatNotifierDotRef.current.display = "inline"
              setChatState((prev) => {
                return (
                  prev
                    .map((chatData) => {
                      if (chatData.viewerId === data.viewerId) {
                        return {
                          ...chatData,
                          newChats: {
                            chats: [
                              ...chatData.newChats.chats,
                              {
                                ...data.chat,
                                by: "Model" === data.chat.by ? "self" : "other",
                              },
                            ],
                            nos: chatData.newChats.nos + 1,
                          },
                          highLightNewChat: true,
                        }
                      } else {
                        return chatData
                      }
                    })
                    /* sort everyTime a new message is added */
                    .sort((a, b) =>
                      a.newChats.nos > b.newChats.nos
                        ? 1
                        : b.newChats.nos > a.newChats.nos
                        ? -1
                        : 0
                    )
                )
              })
              scrollOnChat()
            } else {
              /* directly add in latest chats */
              setChatState((prev) => {
                return prev
                  .map((chatData) => {
                    if (chatData.viewerId === data.viewerId) {
                      return {
                        ...chatData,
                        chats: [
                          ...chatData.chats,
                          {
                            ...data.chat,
                            by: "Model" === data.chat.by ? "self" : "other",
                          },
                        ],
                      }
                    } else {
                      return chatData
                    }
                  })
                  .sort((a, b) =>
                    a.newChats.nos > b.newChats.nos
                      ? 1
                      : b.newChats.nos > a.newChats.nos
                      ? -1
                      : 0
                  )
              })
              scrollOnChat()
            }
          }
        })
      }
    }
  }, [])

  /* remove chat event listeners */
  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      return () => {
        /* remove listeners */
        const socket = io.getSocket()
        if (socket.hasListeners("viewer-private-message-received")) {
          socket.off("viewer-private-message-received", (data) => {})
        }
      }
    }
  }, [socketCtx.socketSetupDone])

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      document.addEventListener("send-private-message", ({ message }) => {
        alert("send private chat message")
        if (
          currentChatScreenStateRef.current ===
            chatScreens.SINGLE_VIEWER_DETAIL_CHAT &&
          currentViewerRef.current
        ) {
          /* if on message screen, not on viewer list */
          socket.emit("model-private-message-emitted", {
            to: currentViewerRef.current.viewerId,
            dbId: dbChatIdsRef.current.filter(
              (id) => id.viewerId === currentViewerRef.current.viewerId
            )[0].dbChatId,
            chat: {
              by: "Model",
              ts: Date.now(),
              msg: message,
            },
          })
        }
      })
    }
  }, [socketCtx.socketSetupDone])

  return (
    <>
      {/* render viewer tile list */}
      {currentChatScreen === chatScreens.VIEWERS_LIST && (
        <div className="tw-w-full tw-h-full tw-pb-16">
          {/* render all the list */}
          {chatState?.length > 0 ? (
            chatState.map((viewer, index) => {
              return (
                <>
                  <ViewerTile
                    profileImage={viewer.profileImage}
                    username={viewer.username}
                    name={viewer.name}
                    newMessages={viewer.newChats.nos}
                    onClickHandler={() =>
                      handleViewerTileClick(viewer.viewerId)
                    }
                  />
                </>
              )
            })
          ) : (
            <div className="tw-my-2 tw-py-2 tw-px-6 tw-rounded tw-flex tw-items-center tw-cursor-pointer tw-bg-first-color tw-ml-2">
              <p className="tw-text-white-color tw-text-center tw-capitalize tw-flex-grow">
                No new private chat message from any viewer! 😞☹
              </p>
            </div>
          )}
        </div>
      )}

      {/* render detail view */}
      {currentChatScreen === chatScreens.SINGLE_VIEWER_DETAIL_CHAT && (
        <div className="tw-h-full tw-w-full">
          <MessageContainer
            currentViewer={currentViewer}
            removeNewChatTag={removeNewChatTag}
            goBack={goBack}
          />
        </div>
      )}
    </>
  )
}

export default PrivateChatWrapper