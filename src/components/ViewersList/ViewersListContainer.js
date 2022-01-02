import React, { useEffect, useState } from "react"
import SingleViewerBlock from "./SingleViewerBlock"
import io from "../../socket/socket"
import { useSocketContext } from "../../app/socket/SocketContext"
import { useAuthContext } from "../../app/AuthContext"
import { toast } from "react-toastify"
import { nanoid } from "nanoid"

let prevStreamViewers = []
const userType =
  typeof window !== "undefined" && localStorage.getItem("userType")
function ViewersListContainer(props) {
  const [viewers, setViewers] = useState([])
  const [king, setKing] = useState(null)
  const socketCtx = useSocketContext()

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      let userJoinedHandler
      let userLeftHandler
      if (!socket.hasListeners("viewer-joined-private")) {
        userJoinedHandler = (data) => {
          document.getElementById("live-viewer-count").innerText = `${
            data.roomSize - 1
          } Live`

          /* new viewer joined */
          try {
            toast.success(`${data.viewer.username} Has Joined The Stream`, {
              autoClose: 1000,
            })
          } catch (err) {
            toast.success(`A Viewer Has Joined The Stream`, {
              autoClose: 1000,
            })
          }
          setViewers((prev) => {
            /**
             * add unique viewers only
             */
            if (prev.find((viewer) => viewer._id === data.viewer._id)) {
              return prev
            }
            prev.push(data.viewer)
            return [...prev]
          })
        }
        socket.on("viewer-joined-private", userJoinedHandler)
      }

      if (!socket.hasListeners("viewer-left-stream-received")) {
        userLeftHandler = (data) => {
          /* update roomSize, and remove viewer */
          if (data?.relatedUserId) {
            setViewers((prev) => {
              return prev.filter((viewer) => {
                return viewer._id !== data.relatedUserId
              })
            })
          } else {
            setViewers((prev) => {
              const i = prev.findIndex((viewer) => viewer?.unAuthed === true)
              if (i >= 0) {
                prev.splice(i, 1)
              }
              return [...prev]
            })
          }

          /* update viewer count */
          try {
            document.getElementById("live-viewer-count").innerText = `${
              data.roomSize - 1
            } Live`
          } catch (err) {
            /* just don't raise error */
          }
        }
        socket.on("viewer-left-stream-received", userLeftHandler)
      }

      const cleanForCall = (data) => {
        /* clear all other user details except the caller one's details */
        setViewers((prev) => {
          return [prev.find((viewer) => viewer._id === data.detail.viewerId)]
        })
        setKing(null)
      }
      const clearForCallEnd = () => {
        /* clear the list */
        setViewers([])
        setKing(null)
      }
      document.addEventListener(
        "clean-viewer-list-going-on-call",
        cleanForCall,
        {
          passive: true,
        }
      )

      /* remove all viewers except the caller */
      document.addEventListener(
        "clear-viewer-list-going-on-call",
        clearForCallEnd,
        {
          passive: true,
        }
      ) /* clear the list */

      let newStreamHandlerTimeout
      const newStreamHandler = (data) => {
        newStreamHandlerTimeout = setTimeout(() => {
          fetch(`/api/website/stream/get-live-viewers/${data.streamId}-public`)
            .then((res) => res.json())
            .then((data) => {
              try {
                document.getElementById("live-viewer-count").innerText = `${
                  data.roomSize - 1
                } Live`
              } catch (err) {
                /* in-case the roomSize was not a NAN */
              }
              setViewers((prev) => {
                const prevIds = prev.map((viewer) => viewer._id)
                return [
                  ...JSON.parse(data.viewersList).filter(
                    (viewer) => !prevIds.includes(viewer._id)
                  ),
                  ...prev,
                ]
              })
            })
            .catch((err) => console.error("Live viewer count not fetched"))
        }, [8000])
      }
      socket.on("new-model-started-stream", newStreamHandler)

      let streamDeleteHandler = (data) => {
        if (data.modelId !== localStorage.getItem("relatedUserId")) {
          return
        }
        if (newStreamHandlerTimeout) {
          clearTimeout(newStreamHandlerTimeout)
          newStreamHandlerTimeout = null
        }
        setViewers([])
        setKing(null)
      }

      socket.on("delete-stream-room", streamDeleteHandler)

      const handleNewKing = (king) => {
        toast.info(`@${king.username} is now the 🏆 king of the room!`)
        setKing(king)
      }
      socket.on("new-king", handleNewKing)

      /**
       * viewer join and leave handler
       */
      let viewerJoinedHandler = (data) => {
        if (data?.unAuthed) {
          setViewers((prev) => {
            prev.push({ unAuthed: true })
            return [...prev]
          })
        }
        document.getElementById("live-viewer-count").innerText = `${
          data.roomSize - 1
        } Live`
      }
      socket.on("viewer-joined", viewerJoinedHandler)

      return () => {
        if (
          socket.hasListeners("viewer-left-stream-received") &&
          userLeftHandler
        ) {
          socket.off("viewer-left-stream-received", userLeftHandler)
        }
        if (socket.hasListeners("viewer-joined-private") && userJoinedHandler) {
          socket.off("viewer-joined-private", userJoinedHandler)
        }
        if (socket.hasListeners("delete-stream-room") && streamDeleteHandler) {
          socket.off("delete-stream-room", streamDeleteHandler)
        }
        document.removeEventListener(
          "clean-viewer-list-going-on-call",
          cleanForCall
        )
        document.removeEventListener(
          "clear-viewer-list-going-on-call",
          clearForCallEnd
        ) /* clear the list */

        socket.off("new-model-started-stream", newStreamHandler)
        clearTimeout(newStreamHandlerTimeout)

        socket.off("new-king", handleNewKing)

        socket.off("viewer-joined", viewerJoinedHandler)
      }
    }
  }, [socketCtx.socketSetupDone])

  return (
    <>
      {king ? (
        <div className="tw-mb-2 tw-pl-2 tw-rounded king-bg tw-text-white-color tw-ml-1">
          <div className="tw-flex tw-w-full tw-items-center">
            <div className="tw-flex-shrink-0 tw-mr-6 tw-my-auto tw-grid tw-place-items-center tw-py-0.5">
              {king.profileImage ? (
                <>
                  <span className="tw-w-12 tw-h-12 tw-rounded-full tw-border-dreamgirl-red tw-border-2 tw-inline-block tw-relative tw-my-auto">
                    <img
                      src={
                        king.profileImage
                          ? king.profileImage
                          : "/male-model.jpeg"
                      }
                      alt=""
                      className="tw-w-full tw-h-full tw-rounded-full tw-object-cover"
                    />
                  </span>
                </>
              ) : (
                <div className="tw-bg-dreamgirl-red tw-rounded-full tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-ring-2 tw-ring-white-color">
                  <span className="tw-text-lg tw-text-white-color tw-font-light">
                    {king.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="tw-bg-yellow-800/20 tw-px-2 tw-rounded tw-flex-grow">
              <p className="tw-font-medium tw-text-left">
                King Of The Room: <span className="tw-text-sm">🏆</span> @
                {king.username}
              </p>
              <p className="">Spent: {king.spent} Coins</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="tw-my-2 tw-pl-2 tw-rounded king-bg tw-text-white-color tw-ml-1 tw-text-center">
          <p className="tw-py-1 tw-font-medium">No King In The Room Yet!</p>
        </div>
      )}
      {viewers.length > 0 && (
        <div className="tw-pb-16 tw-mt-4">
          {viewers.map((viewerData, index) => {
            if (viewerData?.unAuthed) {
              return (
                <div className="tw-mx-2 tw-text-left tw-mt-0">
                  <p className="tw-text-white-color tw-py-1 tw-bg-third-color tw-rounded tw-px-2">{`Guest-${nanoid(
                    8
                  )}`}</p>
                </div>
              )
            } else {
              return (
                <SingleViewerBlock
                  key={`viewer_block${index}`}
                  viewer={viewerData}
                  addAtTheRate={props.addAtTheRate}
                  userType={userType}
                />
              )
            }
          })}
        </div>
      )}
      {viewers.length === 0 && (
        <p className="tw-mt-4 tw-text-center tw-px-4 tw-bg-dark-black tw-mx-2 tw-text-white-color tw-rounded tw-p-3 tw-font-medium">
          No Authenticated User Is Live Now 😟
        </p>
      )}
    </>
  )
}

export default ViewersListContainer
