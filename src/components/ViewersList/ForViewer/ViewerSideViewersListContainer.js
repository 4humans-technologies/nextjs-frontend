import React, { useEffect, useState, useRef } from "react"
import SingleViewerBlock from "../SingleViewerBlock"
import io from "../../../socket/socket"
import { useSocketContext } from "../../../app/socket/SocketContext"
import { toast } from "react-toastify"
import { nanoid } from "nanoid"

const userType =
  typeof window !== "undefined" && localStorage.getItem("userType")
function ViewerSideViewersListContainer(props) {
  const kingRef = useRef(null)
  const [viewers, setViewers] = useState([])
  const [king, setKing] = useState(props?.king)
  const socketCtx = useSocketContext()

  useEffect(() => {
    kingRef.current = king
  }, [king])

  useEffect(() => {
    setKing(props.king)
  }, [props?.king])

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
            setViewers((prev) => {
              /**
               * allow unique users only
               */
              if (prev.find((viewer) => viewer._id === data.viewer._id)) {
                return prev
              }
              prev.push(data.viewer)
              return [...prev]
            })
          }
        }
        socket.on("viewer-joined-private", userJoinedHandler)
      }

      userLeftHandler = (data) => {
        /**
         * if authed user
         */
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

        /* update the count */
        if (typeof data.roomSize === "number") {
          try {
            document.getElementById("live-viewer-count-lg").innerText = `${
              data.roomSize - 1
            } Live`
            document.getElementById("live-viewer-count-md").innerText = `${
              data.roomSize - 1
            } Live`
            liveCount.innerText = `(${data.roomSize - 1})`
          } catch (error) {
            /* just handle error */
          }
        }
      }
      socket.on("viewer-left-stream-received", userLeftHandler)

      const clearForCall = () => {
        setViewers([])
        setKing(null)
      }

      document.addEventListener(
        "clean-viewer-list-going-on-call",
        clearForCall,
        {
          passive: true,
        }
      )

      const handleViewersList = (data) => {
        /**
         * this is called when data is fetched in viewerScreen initially
         */
        if (data.detail?.viewersList) {
          setViewers((prev) => {
            const myId = localStorage.getItem("relatedUserId")
            const prevIds = prev.map((viewer) => viewer._id)
            return [
              ...data.detail.viewersList.filter(
                (viewer) => viewer._id !== myId && !prevIds.includes(viewer._id)
              ),
              ...prev,
            ]
          })
        }
      }

      document.addEventListener("viewers-list-fetched", handleViewersList, {
        once: true,
        passive: true,
      })

      const handleNewKing = (king) => {
        toast.info(`@${king.username} is now the 🏆 king of the room!`)
        setKing(king)
      }
      socket.on("new-king", handleNewKing)

      /**
       * viewer join and left handler
       */

      const liveCount = document.getElementById("live-user-count-highlight")

      let joinHandler = (data) => {
        if (data?.unAuthed) {
          setViewers((prev) => {
            prev.push({ unAuthed: true })
            return [...prev]
          })
        }

        if (typeof data.roomSize === "number") {
          document.getElementById("live-viewer-count-lg").innerText = `${
            data.roomSize - 1
          } Live`
          document.getElementById("live-viewer-count-md").innerText = `${
            data.roomSize - 1
          } Live`
        }
        liveCount.innerText = `(${data.roomSize - 1})`
      }

      socket.on("viewer-joined", joinHandler)

      const handleKingsDonations = (data) => {
        if (!kingRef.current) {
          return
        }
        if (data.chatType === "coin-superchat-public") {
          if (data.username === kingRef.current?.username) {
            setKing((prev) => {
              prev.spent = +prev.spent + +data.amountGiven
              return { ...prev }
            })
            toast.info(`King 🏆 gifted ${data.amountGiven} coins`)
          }
        } else if (data.chatType === "tipmenu-activity-superchat-public") {
          if (data.username === kingRef.current?.username) {
            setKing((prev) => {
              prev.spent = +prev.spent + +data.activity.price
              return { ...prev }
            })
            toast.info(
              `King 🏆 request ${data.activity.action} for ${data.amountGiven} coins`
            )
          }
        }
      }
      socket.on("viewer_super_message_pubic-received", handleKingsDonations)

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

        document.removeEventListener(
          "clean-viewer-list-going-on-call",
          clearForCall
        )

        document.removeEventListener("viewers-list-fetched", handleViewersList)

        socket.off("new-king", handleNewKing)

        if (socket.hasListeners("viewer-joined") && joinHandler) {
          socket.off("viewer-joined", joinHandler)
        }

        socket.off("viewer_super_message_pubic-received", handleKingsDonations)
      }
    }
  }, [socketCtx.socketSetupDone])

  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()
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

                  document.getElementById(
                    "live-user-count-highlight"
                  ).innerText = `(${data.roomSize - 1})`
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
        if (data.modelId !== props.modelId) {
          return
        }
        document.getElementById("live-user-count-highlight").innerText = "(0)"
        if (newStreamHandlerTimeout) {
          clearTimeout(newStreamHandlerTimeout)
          newStreamHandlerTimeout = null
        }
        setKing(null)
        setViewers([])
      }
      socket.on("delete-stream-room", streamDeleteHandler)

      return () => {
        if (socket.hasListeners("delete-stream-room") && streamDeleteHandler) {
          socket.off("delete-stream-room", streamDeleteHandler)
        }
        socket.off("new-model-started-stream", newStreamHandler)
        clearTimeout(newStreamHandlerTimeout)
      }
    }
  }, [socketCtx.socketSetupDone, props.modelId])

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
        <div className="tw-my-1 tw-pl-2 tw-rounded king-bg tw-text-white-color tw-ml-1 tw-text-center">
          <p className="tw-py-1 tw-font-medium tw-text-sm tw-px-2">
            No King In The Room Yet, Tip The Model To Become The 🏆 King And The
            Model Will Give You A Surprise 😘💖!
          </p>
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
          No User Is Live Now 😟
        </p>
      )}
    </>
  )
}

export default ViewerSideViewersListContainer
