import React, { useCallback, useMemo, useState, useRef } from "react"
import "emoji-mart/css/emoji-mart.css"
// import { Picker } from "emoji-mart/dist-modern/index.js"
import { Picker, CategoryName } from "emoji-mart"

function Emoji(props) {
  const [showEmoji, setShowEmoji] = useState(false)
  const emojiRef = useRef()
  const { chatInputRef } = props

  const clickAwayListener = (e) => {
    emojiRef.current.contains(e.target)
  }

  // const handleClick = () => {
  //   document.getElementById("message-input").scrollIntoView({
  //     block: "end",
  //   })
  //   // if (!showEmoji) {
  //   //   window.addEventListener("click", clickAwayListener)
  //   // } else {
  //   //   window.removeEventListener("click", clickAwayListener)
  //   // }
  //   setShowEmoji((prev) => {
  //     return !prev
  //   })
  // }

  const handleSelect = useCallback(
    (emoji) => {
      chatInputRef.current.value = chatInputRef.current.value + emoji.native
    },
    [chatInputRef]
  )
  return (
    <span className="tw-relative">
      <button
        // onClick={handleClick}
        className="tw-px-1 tw-text-xl tw-font-semibold"
        id="emoji"
      >
        😀
      </button>
      <span
        style={{ display: props.showEmoji ? "inline" : "none" }}
        className="tw-absolute tw-bottom-11 tw-right-[-3rem] tw-z-[390]"
      >
        <span className="" ref={emojiRef}>
          {
            <Picker
              native={true}
              showPreview={false}
              onSelect={handleSelect}
              title="Pick Emoji"
              theme="dark"
              exclude={[
                "search",
                "symbols",
                "activity",
                "custom",
                "flags",
                "foods",
                "nature",
                "objects",
                "places",
                "recent",
              ]}
            />
          }
        </span>
      </span>
    </span>
  )
}

export default Emoji
