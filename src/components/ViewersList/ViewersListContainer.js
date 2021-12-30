import React, { useEffect, useState } from "react"
import SingleViewerBlock from "./SingleViewerBlock"
import io from "../../socket/socket"
import { useSocketContext } from "../../app/socket/SocketContext"
import { useAuthContext } from "../../app/AuthContext"
import { toast } from "react-toastify"

let prevStreamViewers = []
const userType =
  typeof window !== "undefined" && localStorage.getItem("userType")
function ViewersListContainer(props) {
  const [viewers, setViewers] = useState([])
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
          }
          try {
            document.getElementById("live-viewer-count").innerText = `${
              data.roomSize - 1
            } Live`
            // live count of user in the live section
            document.getElementById("viewerCount").innerText = `${
              data.roomSize - 1
            } `
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
      }
      const clearForCallEnd = () => {
        /* clear the list */
        setViewers([])
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
      }

      socket.on("delete-stream-room", streamDeleteHandler)

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

export default ViewersListContainer
