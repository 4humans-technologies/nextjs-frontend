import React, { useEffect, useState } from "react"
import SingleViewerBlock from "./SingleViewerBlock"
import io from "../../socket/socket"
import { useSocketContext } from "../../app/socket/SocketContext"
import { useAuthContext } from "../../app/AuthContext"
import { toast } from "react-toastify"

let prevStreamViewers = []
function ViewersListContainer(props) {
  const [viewers, setViewers] = useState([])
  const authCtx = useAuthContext()
  const socketCtx = useSocketContext()

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
      let userJoinedHandler
      let userLeftHandler
      if (!socket.hasListeners("viewer-joined-private")) {
        userJoinedHandler = (data) => {
          document.getElementById(
            "live-viewer-count"
          ).innerText = `${data.roomSize} Live`
          if (data?.reJoin) {
            /* you have access to relatedUserId, do what you want */
            const prevViewer = prevStreamViewers.find(
              (viewer) => viewer._id === data.relatedUserId
            )
            if (prevViewer) {
              setViewers((prev) => {
                prev.push(prevViewer)
                return [...prev]
              })
            } else {
              /* fetch the viewer details */
              fetch(
                `/api/website/stream/get-a-viewers-details/${data.relatedUserId}`
              )
                .then((res) => res.json())
                .then((data) => {
                  setViewers((prev) => {
                    prev.push(data.viewer)
                    return [...prev]
                  })
                })
            }
          } else {
            /* new viewer joined */
            toast.success(`${data.viewer.username} Has Joined The Stream`, {
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              autoClose: 3000,
              theme: "colored",
            })
            setViewers((prev) => {
              prev.push(data.viewer)
              return [...prev]
            })
          }
        }
        socket.on("viewer-joined-private", userJoinedHandler)
      }

      if (!socket.hasListeners("viewer-left-stream-received")) {
        userLeftHandler = (data) => {
          /* update roomSize, and remove viewer */
          if (data?.relatedUserId) {
            setViewers((prev) => {
              return prev.filter((viewer) => {
                if (viewer._id !== data.relatedUserId) {
                  toast.info(`${viewer.username} Has Joined The Stream`, {
                    position: "bottom-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    autoClose: 2000,
                    theme: "colored",
                  })
                }
                return viewer._id !== data.relatedUserId
              })
            })
          }
          document.getElementById(
            "live-viewer-count"
          ).innerText = `${data.roomSize} Live`
        }
        socket.on("viewer-left-stream-received", userLeftHandler)
      }
      let streamDeleteHandler = (data) => {
        if (data.modelId !== authCtx.relatedUserId) {
          return
        }
        /* move the current live user in prev streamViewers */
        prevStreamViewers = [...viewers]
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
      }
    }
  }, [socketCtx.socketSetupDone])

  return (
    <>
      {viewers.length > 0 && (
        <div className="tw-bg-third-color tw-py-1 tw-pb-16">
          {viewers.map((viewerData, index) => {
            return (
              <SingleViewerBlock
                key={`viewer_block${index}`}
                viewer={viewerData}
                addAtTheRate={props.addAtTheRate}
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