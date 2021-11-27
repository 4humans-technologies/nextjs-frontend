import React, { useEffect, useState } from "react"
import SingleViewerBlock from "./SingleViewerBlock"
import io from "../../socket/socket"
import { useSocketContext } from "../../app/socket/SocketContext"

const prevStreamViewers = []
function ViewersListContainer() {
  const [viewers, setViewers] = useState([])

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
            const prevViewer = viewers.find(
              (viewer) => viewer._id === data.relatedUserId
            )
            if (prevViewer) {
              setViewers((prev) => {
                prev.push(prevViewer)
                return [...prev]
              })
            } else {
              /* fetch the viewer details */
            }
          } else {
            /* new viewer joined */
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
              return prev.filter((viewer) => viewer._id !== data.relatedUserId)
            })
          }
          document.getElementById(
            "live-viewer-count"
          ).innerText = `${data.roomSize} Live`
        }
        socket.on("viewer-left-stream-received", userLeftHandler)
      }

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
      }
    }
  }, [socketCtx.socketSetupDone])

  return (
    <>
      {viewers.length > 0 && (
        <div className="tw-bg-third-color tw-py-1 tw-pb-16">
          {viewers.map((viewerData, index) => {
            return (
              <SingleViewerBlock key={`viewer_block${index}`} viewer={viewerData} />
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
