import React, { useCallback, useMemo, useState } from "react"
import "emoji-mart/css/emoji-mart.css"
import { Picker } from "emoji-mart"

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
  // const MyPicker = useMemo(
  //   () => (
  //     <Picker
  //       native={true}
  //       showPreview={false}
  //       onSelect={handleSelect}
  //       title="Pick Emoji"
  //       theme="dark"
  //     />
  //   ),
  //   []
  // )
  return (
    <span className="tw-relative">
      <button
        onClick={handleClick}
        className="tw-px-1 tw-text-xl tw-font-semibold"
      >
        😀
      </button>
      <span
        style={{ display: showEmoji ? "inline" : "none" }}
        className="tw-absolute tw-bottom-11 tw-right-0 tw-z-[6000] tw-pt-16 tw-pl-16 tw-pr-32"
        onClick={handleClick}
      >
        <span className="">
          {
            <Picker
              native={true}
              showPreview={false}
              onSelect={handleSelect}
              title="Pick Emoji"
              theme="dark"
            />
          }
        </span>
      </span>
    </span>
  )
}

export default Emoji
