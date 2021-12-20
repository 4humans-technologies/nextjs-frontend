import React, { useEffect } from "react"
import SelfChatMessage from "./SelfChatMessage"
import OtherSideChatMessage from "./OtherSideChatMessage"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"

function MessageContainer(props) {
  const { currentViewer, removeNewChatTag, goBack } = props

  useEffect(() => {
    /* on unmount new chat tag from chats */
    if (removeNewChatTag) {
      return () => removeNewChatTag(currentViewer.viewerId)
    }
  }, [removeNewChatTag])

  useEffect(() => {
    props.scrollOnChat()
    return () => {
      /* clear current viewer also */
      sessionStorage.removeItem("viewerId")
    }
  }, [])

  return (
    <div className="tw-flex tw-flex-col tw-flex-nowrap tw-content-start tw-relative tw-pb-16">
      {/* watsapp like header for helping in identification of of the viewer */}
      <div className="tw-sticky tw-top-0 tw-left-0 tw-right-0 tw-flex-grow tw-w-full tw-py-2 tw-px-2 tw-bg-first-color tw-flex tw-items-center">
        <div className="tw-flex-shrink tw-flex-grow-0 tw-mr-3">
          {currentViewer?.profileImage ? (
            <>
              <span className="tw-w-10 tw-h-10 tw-rounded-full tw-border-dreamgirl-red tw-border-2 tw-inline-block tw-relative tw-my-auto">
                <img
                  src={currentViewer?.profileImage}
                  alt=""
                  className="tw-w-full tw-h-full tw-rounded-full tw-object-cover"
                />
                <span className="tw-inline-block tw-w-1 tw-h-1 tw-bg-green-color tw-absolute tw-top-[78%] tw-left-[78%] tw-rounded-full tw-translate-x-[-50%] tw-translate-y-[50%]"></span>
              </span>
            </>
          ) : (
            <div className="tw-bg-dreamgirl-red tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-ring-2 tw-ring-white-color">
              <span className="tw-text-lg tw-text-white-color tw-font-light">
                {currentViewer.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="tw-flex-grow tw-flex tw-flex-col tw-justify-start tw-text-white-color tw-items-start tw-ml-2">
          <p className="tw-flex-grow tw-flex-shrink-0 tw-font-semibold tw-capitalize tw-my-0">
            {currentViewer.name}
          </p>
          <p className="tw-flex-grow tw-flex-shrink-0 tw-text-sm tw-my-0">
            @{currentViewer.username}
          </p>
        </div>
        <button
          onClick={goBack}
          className="tw-flex-shrink tw-text-white-color tw-py-2 tw-px-3 tw-grid tw-place-items-center"
        >
          <ArrowBackIosIcon fontSize="small" />
        </button>
      </div>
      {/* ==========chats area======= */}
      {currentViewer?.chats ? (
        currentViewer.chats.map((chat) => {
          switch (chat.by) {
            case "self":
              return <SelfChatMessage key={chat.ts} msg={chat.msg} />
            case "other":
              return (
                <OtherSideChatMessage
                  key={chat.ts}
                  msg={chat.msg}
                  username={currentViewer.username}
                />
              )
            case "system":
              return (
                <div className="tw-flex tw-flex-grow tw-w-full tw-items-center tw-justify-center tw-my-6">
                  <div className="tw-flex-grow tw-flex-shrink-0 tw-border-t tw-border-white-color"></div>
                  <span className="tw-rounded-full tw-px-3 tw-py-1 tw-text-sm tw-border tw-border-white-color tw-text-white-color tw-flex-grow-0 tw-flex-shrink tw-mx-3">
                    {chat.msg || "New Message"}
                  </span>
                  <div className="tw-flex-grow tw-flex-shrink-0 tw-border-t tw-border-white-color"></div>
                </div>
              )
            default:
              break
          }
        })
      ) : (
        <p className="tw-w-full tw-flex-grow tw-px-3 tw-text-center tw-py-2 tw-bg-first-color tw-rounded">
          No Message
        </p>
      )}
    </div>
  )
}

export default MessageContainer
