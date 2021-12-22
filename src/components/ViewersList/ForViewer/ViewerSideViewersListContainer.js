import React, { useEffect, useState } from "react"
import SingleViewerBlock from "../SingleViewerBlock"
import io from "../../../socket/socket"
import { useSocketContext } from "../../../app/socket/SocketContext"
import { toast } from "react-toastify"

let prevStreamViewers = []
const userType =
  typeof window !== "undefined" && localStorage.getItem("userType")
function ViewerSideViewersListContainer(props) {
  const [viewers, setViewers] = useState([])
  const socketCtx = useSocketContext()

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      let userJoinedHandler
      let userLeftHandler
      if (!socket.hasListeners("viewer-joined-private")) {
        userJoinedHandler = (data) => {
          /**
           * add viewers excluding self
           */
          if (data.viewer._id !== localStorage.getItem("relatedUserId")) {
            /* new viewer joined */
            toast.success(
              `${
                data.viewer?.username
                  ? data.viewer.username + "Has Joined The Stream"
                  : "A Viewer Has Joined The Stream"
              }`,
              {
                autoClose: 1000,
              }
            )

            setViewers((prev) => {
              prev.push(data.viewer)
              return [...prev]
            })
          }
        }
        socket.on("viewer-joined-private", userJoinedHandler)
      }

      userLeftHandler = (data) => {
        /* update roomSize, and remove viewer */
        if (data?.relatedUserId) {
          setViewers((prev) => {
            return prev.filter((viewer) => {
              return viewer._id !== data.relatedUserId
            })
          })
        }
      }
      socket.on("viewer-left-stream-received", userLeftHandler)

      const clearForCall = () => {
        setViewers([])
      }

      document.addEventListener("clean-viewer-list-going-on-call", clearForCall)

      /**
       * listen for new model started streaming
       */
      let newStreamHandlerTimeout
      let newStreamHandler = (data) => {
        newStreamHandlerTimeout = setTimeout(() => {
          // /get-live-room-count/
          fetch(`/api/website/stream/get-live-viewers/${data.streamId}-public`)
            .then((res) => res.json())
            .then((data) => {
              try {
                if (typeof data.roomSize === "number") {
                  document.getElementById(
                    "live-viewer-count-lg"
                  ).innerText = `${data.roomSize - 1} Live`
                  document.getElementById(
                    "live-viewer-count-md"
                  ).innerText = `${data.roomSize - 1} Live`
                }
              } catch (err) {
                /* try/catch as roomSize can be undefined */
              } finally {
                /**
                 * merge with existing users
                 */
                setViewers((prev) => {
                  const myId = localStorage.getItem("relatedUserId")
                  const prevIds = prev.map((viewer) => viewer._id)
                  return [
                    ...JSON.parse(data.viewersList).filter((viewer) => {
                      return (
                        viewer._id !== myId && !prevIds.includes(viewer._id)
                      )
                    }),
                    ...prev,
                  ]
                })
              }
            })
            .catch((err) => {
              toast.error("Live viewers list not fetched!")
            })
        }, [5000])
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
      }

      socket.on("delete-stream-room", streamDeleteHandler)

      const handleViewersList = (data) => {
        if (data.detail?.viewersList) {
          setViewers((prev) => {
            const myId = localStorage.getItem("relatedUserId")
            return [
              ...data.detail.viewersList.filter(
                (viewer) => viewer._id !== myId
              ),
              ...prev,
            ]
          })
        }
      }

      document.addEventListener("viewers-list-fetched", handleViewersList, {
        once: true,
      })

      return () => {
        if (socket.hasListeners("viewer-joined-private") && userJoinedHandler) {
          socket.off("viewer-joined-private", userJoinedHandler)
        }
        if (
          socket.hasListeners("viewer-left-stream-received") &&
          userLeftHandler
        ) {
          socket.off("viewer-left-stream-received", userLeftHandler)
        }
        if (socket.hasListeners("delete-stream-room") && streamDeleteHandler) {
          socket.off("delete-stream-room", streamDeleteHandler)
        }

        document.removeEventListener(
          "clean-viewer-list-going-on-call",
          clearForCall
        )

        socket.off("new-model-started-stream", newStreamHandler)

        document.removeEventListener("viewers-list-fetched", handleViewersList)
        clearTimeout(newStreamHandlerTimeout)
      }
    }
  }, [socketCtx.socketSetupDone])

  return (
    <>
      {viewers.length > 0 && (
        <div className="tw-pb-16 tw-mt-4">
          {viewers.map((viewerData, index) => {
            return (
              <SingleViewerBlock
                key={`viewer_block${index}`}
                viewer={viewerData}
                addAtTheRate={props.addAtTheRate}
                userType={userType}
              />
            )
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

export default ViewerSideViewersListContainer
