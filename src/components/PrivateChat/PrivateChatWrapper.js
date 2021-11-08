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
import socket from "../../socket/socket"
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
  const { setNewMessages, inFocus } = props

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
  const [chatState, setChatState] = useState(initialChatState)
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
    inFocusRef.current = dbChatIds
  }, [dbChatIds])

  const handleViewerTileClick = (viewerId) => {
    let foundViewerIndex
    /* find that viewers chat data */
    const foundViewer = chatState.find((viewer, index) => {
      if (viewer.viewerId === viewerId) {
        foundViewerIndex = index
      }
      return viewer.viewerId === viewerId
    })

    /* merge new chats in the main chats */
    setChatState((prev) => {
      const stateCopy = { ...prev }
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

    /* isolate that viewers chat data in currentViewer */
    setCurrentViewer(foundViewer)
    /* mount detail screen with current viewer */
    setCurrentChatScreen(chatScreens.SINGLE_VIEWER_DETAIL_CHAT)

    /*  */
    sessionStorage.setItem("viewerId", viewerId)
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
        }
      })
    })
  }, [])

  useEffect(() => {
    /*  */
    if (socketCtx.socketSetupDone) {
      const { scrollOnChat } = props
      const socket = io.getSocket()
      if (!socket.hasListeners("private-message-received-from-viewer")) {
        socket.on("private-message-received-from-viewer", (data) => {
          if (
            !dbChatIdsRef.current
              .map((ch) => ch.dbChatId)
              .includes(data.dbChatId)
          ) {
            /* if viewer chats does not already exists
              fetch chats from online db
            */
            setDbChatIds((prevIds) =>
              prevIds.push({
                dbChatId: data.dbChatId,
                viewerId: data.viewerId,
              })
            )
            setChatState((prevChats) => {
              return prevChats.push({
                viewerId: data.viewerId,
                chats: [],
                /* has to go as no tile exist for this chat hence has to be new chat */
                newChats: {
                  chats: [{ ...data.chat }],
                  nos: 1,
                },
                highLightNewChat: true,
              })
            })
            /* request to fetch private chat from database */
            fetch("/api/website/private-chat/find-or-create-private-chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                dbChatId: data.dbChatId,
                by: "id",
              }),
            })
              .then((res) => res.json())
              .then((privateChat) => {
                setChatState((prev) => {
                  return prev.map((chatMsg) => {
                    if (chatMsg.viewerId === viewerId) {
                      /* add chats fetched from db into chatState */
                      return {
                        ...chatMsg,
                        viewerId: privateChat.viewer._id,
                        name: privateChat.viewer.name,
                        username: privateChat.viewer.rootUser.username,
                        profileImage: privateChat.viewer.profileImage,
                        chats: privateChat.chats,
                      }
                    }
                  })
                })
              })
          } else {
            if (
              currentChatScreenStateRef.current === chatScreens.VIEWERS_LIST &&
              currentViewerRef.current.viewerId === data.viewerId &&
              inFocusRef.current
            ) {
              /* in background add new chat message to new chats */
              setChatState((prev) => {
                const viewerIndex = prev.findIndex(
                  (viewer) => viewer.viewerId === data.viewerId
                )
                prev[viewerIndex] = {
                  ...prev[viewerIndex],
                  newChats: {
                    chats: [
                      ...prev[viewerIndex].newChats.chats,
                      {
                        ...data.chat,
                        by: userType === data.chat.by ? "self" : "other",
                      },
                    ],
                    nos: prev[viewerIndex].newChats.nos + 1,
                  },
                  highLightNewChat: true,
                }
                /* sort everyTime a new message is added */
                return prev.sort((a, b) =>
                  a.newChats.nos > b.newChats.nos
                    ? 1
                    : b.newChats.nos > a.newChats.nos
                    ? -1
                    : 0
                )
              })
              scrollOnChat()
            } else {
              /* directly add in latest chats */
              setChatState((prev) => {
                const viewerIndex = prev.findIndex(
                  (viewer) => viewer.viewerId === data.viewerId
                )
                prev[viewerIndex] = {
                  ...prev[viewerIndex],
                  chats: [
                    ...prev[viewerIndex].chats,
                    {
                      ...data.chat,
                      by: userType === data.chat.by ? "self" : "other",
                    },
                  ],
                  highLightNewChat: false,
                }
                return prev.sort((a, b) =>
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

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      return () => {
        /* remove listeners */
        const socket = io.getSocket()
        if (socket.hasListeners("private-message-received-from-viewer")) {
          socket.off("private-message-received-from-viewer", (data) => {})
        }
      }
    }
  }, [socketCtx.socketSetupDone])

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      document.addEventListener("send-private-message", ({ message }) => {
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
      })
    }
  }, [socketCtx.socketSetupDone])

  return (
    <>
      {/* render viewer tile list */}
      <div
        className="tw-w-full tw-h-full tw-pb-16"
        style={{
          display:
            currentChatScreen === chatScreens.VIEWERS_LIST ? "block" : "none",
        }}
      >
        {/* render all the list */}
        {chatState.map((viewer, index) => {
          return (
            <>
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
              <ViewerTile
                profileImage={viewer.profileImage}
                username={viewer.username}
                name={viewer.name}
                newMessages={viewer.newChats.nos}
                onClickHandler={() => handleViewerTileClick(viewer.viewerId)}
              />
            </>
          )
        })}
      </div>

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
