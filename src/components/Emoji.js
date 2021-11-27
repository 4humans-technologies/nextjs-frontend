import React, { useCallback, useMemo, useState } from "react"
import "emoji-mart/css/emoji-mart.css"
import dynamic from "next/dynamic"
import { Picker } from "emoji-mart"

/* const Picker = dynamic(
  () => import("emoji-mart").then((emojiMart) => emojiMart.Picker),
  {
    ssr: false,
  }
) */

function Emoji(props) {
  const [showEmoji, setShowEmoji] = useState(false)
  const { chatInputRef } = props

  const handleClick = () => {
    document.getElementById("message-input").scrollIntoView({
      block: "end",
    })
    setShowEmoji((prev) => !prev)
  }

  const handleSelect = useCallback(
    (emoji) => {
      chatInputRef.current.value = chatInputRef.current.value + emoji.native
    },
    [chatInputRef]
  )
  const MyPicker = useMemo(
    () => (
      <Picker
        native={true}
        showPreview={false}
        onSelect={handleSelect}
        title="Pick Emoji"
        theme="dark"
      />
    ),
    []
  )
  return (
    <span className="tw-relative">
      <button
        onClick={handleClick}
        className="tw-px-1 tw-text-xl tw-font-semibold"
      >
        😀
      </button>
      <span className="tw-absolute tw-bottom-11 tw-right-10 tw-z-[6000]">
        <span style={{ display: showEmoji ? "inline" : "none" }}>
          {MyPicker}
        </span>
      </span>
    </span>
  )
}

export default Emoji
