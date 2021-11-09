import React, { useEffect } from "react"
import SelfChatMessage from "../SelfChatMessage"
import OtherSideChatMessage from "../OtherSideChatMessage"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"

function ViewerMessageContainer(props) {
  const { removeNewChatTag, chatsData } = props

  useEffect(() => {
    /* on unmount new chat tag from chats */
    if (removeNewChatTag) {
      return () => removeNewChatTag(localStorage.getItem("relatedUserId"))
    }
  }, [removeNewChatTag])

  useEffect(() => {
    return () => {
      /* clear current viewer also */
      sessionStorage.removeItem("viewerId")
    }
  }, [])

  return (
    <div className="tw-flex tw-flex-col tw-flex-nowrap tw-content-start tw-relative tw-pb-16 tw-w-full">
      {/* ==========chats area======= */}
      {chatsData.chats &&
        chatsData.chats.map((chat) => {
          switch (chat.by) {
            case "self":
              return <SelfChatMessage key={chat.ts} msg={chat.msg} />
            case "other":
              return <OtherSideChatMessage key={chat.ts} msg={chat.msg} />
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
        })}
    </div>
  )
}

export default ViewerMessageContainer
