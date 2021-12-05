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
    chats: [],
    highLightNewChat: false,
    newChats: {
      chats: [],
      nos: 0,
    },
  },
]

const chatWindowOptions = {
  PRIVATE: "private",
}

function PrivateChatWrapper(props) {
  const { newChatNotifierDotRef } = props

  const socketCtx = useSocketContext()
  const currentChatScreenStateRef = useRef()
  const currentViewerRef = useRef()
  const dbChatIdsRef = useRef()

  const scrollOnChat = () => {
    if (props.chatWindowRef.current) {
      props.scrollOnChat()
    }
  }

  /**
   * handling viewer tile or on chat screen with viewer
   */
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
    dbChatIdsRef.current = dbChatIds
  }, [dbChatIds])

  const handleViewerTileClick = (viewerId) => {
    sessionStorage.setItem("viewerId", viewerId)
    setChatState((prev) => {
      /* merge new chats in the main chats */
      return prev.map((chatData) => {
        if (chatData.viewerId === viewerId) {
          if (chatData.newChats.nos > 0) {
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
    setCurrentViewer(viewerId)

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
              return [...prevIds]
            })
            /* init chat state for this viewer,meanwhile we fetch chats data from database */
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
              return [...prevChats]
            })
            /* request to fetch private chat from database */
            fetch("/api/website/stream/private-chat/get-my-private-cht-by-id", {
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
                  document.getElementById("private-message-audio").play()
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
                          chats: result.privateChat.chats.map((theChat) => ({
                            ...theChat,
                            by: theChat.by === "Model" ? "self" : "other",
                          })),
                        }
                      } else {
                        /* return other chats as it is */
                        return chatMsg
                      }
                    })
                  })
                } else {
                  alert("Error chats not fetched!")
                }
                scrollOnChat()
              })
              .catch((err) => alert(err.message))
          } else {
            /* if chat already fetched from database */
            document.getElementById("private-message-audio").play()
            if (
              currentChatScreenStateRef.current === chatScreens.VIEWERS_LIST &&
              currentViewerRef.current !== data.viewerId &&
              !props.chatWindowRef.current
            ) {
              /* in background add new chat message to new chats */
              newChatNotifierDotRef.current.display = "inline"
              setChatState((prev) => {
                return prev.map((chatData) => {
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
                // .sort((a, b) =>
                //   a.newChats.nos > b.newChats.nos
                //     ? 1
                //     : b.newChats.nos > a.newChats.nos
                //     ? -1
                //     : 0
                // )
              })
              scrollOnChat()
            } else {
              /* directly add in latest chats */
              setChatState((prev) => {
                return prev.map((chatData) => {
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
                // .sort((a, b) =>
                //   a.newChats.nos > b.newChats.nos
                //     ? 1
                //     : b.newChats.nos > a.newChats.nos
                //     ? -1
                //     : 0
                // )
              })
              scrollOnChat()
            }
          }
        })
      }
    }
  }, [socketCtx.socketSetupDone])

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
      const sendChatAndPushLocally = (e) => {
        if (
          currentChatScreenStateRef.current ===
            chatScreens.SINGLE_VIEWER_DETAIL_CHAT &&
          currentViewerRef.current
        ) {
          // alert("sending private chat message")
          /* if on message screen, not on viewer list */
          const ts = Date.now()
          const theChat = {
            by: "Model",
            ts: ts,
            msg: e.detail.message,
          }
          socket.emit("model-private-message-emitted", {
            to: `${currentViewerRef.current}-private`,
            dbId: dbChatIdsRef.current.filter(
              (id) => id.viewerId === currentViewerRef.current
            )[0].dbChatId,
            chat: theChat,
          })
          setChatState((prev) => {
            return prev.map((chatData) => {
              if (chatData.viewerId === currentViewerRef.current) {
                return {
                  ...chatData,
                  chats: [...chatData.chats, { ...theChat, by: "self" }],
                }
              } else {
                return chatData
              }
            })
          })
          scrollOnChat()
        } else {
          document.getElementById("chat-message-input").value = e.detail.message
          return alert("Please click on the viewer to send this message")
        }
      }

      document.addEventListener("send-private-message", sendChatAndPushLocally)
      return () => {
        document.removeEventListener(
          "send-private-message",
          sendChatAndPushLocally
        )
      }
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
                    key={viewer.viewerId}
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
            <p className="tw-mt-4 tw-text-center tw-px-4 tw-bg-dark-black tw-mx-2 tw-text-white-color tw-rounded tw-p-3 tw-font-medium">
              No new private chat message from any viewer! 😟
            </p>
          )}
        </div>
      )}

      {/* render detail view */}
      {currentChatScreen === chatScreens.SINGLE_VIEWER_DETAIL_CHAT && (
        <div className="tw-h-full tw-w-full">
          <MessageContainer
            currentViewer={chatState.find(
              (chatData) => chatData.viewerId === currentViewer
            )}
            removeNewChatTag={removeNewChatTag}
            goBack={goBack}
            scrollOnChat={scrollOnChat}
          />
        </div>
      )}
    </>
  )
}

export default PrivateChatWrapper
