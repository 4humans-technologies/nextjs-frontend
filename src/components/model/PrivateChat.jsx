import React, { useState } from "react"
import {
  Stars,
  StarOutline,
  ChatBubble,
  CheckCircle,
  SupervisedUserCircle,
  ExitToApp,
} from "@material-ui/icons"
import dynamic from "next/dynamic"
import { useAuthContext } from "../../app/AuthContext"

const ChooseChatPlan = dynamic(() => import("../ViewerScreen/ChooseChatPlan"))

const data = []

const notLoggedInBanner = (
  <div className="tw-mt-6 tw-py-28">
    <div className="tw-text-center">
      <span className="tw-rounded-full tw-bg-dreamgirl-red tw-inline-grid tw-place-items-center tw-p-3 tw-mx-auto video-call-button">
        <StarOutline
          className="tw-text-white-color"
          style={{ fontSize: "50px" }}
        />
      </span>
      <p className="tw-capitalize tw-text-red-600 tw-font-semibold tw-mt-4">
        Exclusive Private Chat
      </p>
      <p className="tw-text-text-black tw-capitalize tw-mt-4">
        Please login to chat <br /> privately with the model
      </p>
    </div>
    <div className="tw-text-center tw-mt-4">
      <button className="tw-capitalize tw-bg-dreamgirl-red tw-text-white tw-py-2 tw-px-8 tw-rounded-full tw-font-medium">
        <ExitToApp className="tw-text-white-color" fontSize="small" /> Login
      </button>
    </div>
  </div>
)

function PrivateChat(props) {
  const [hasPlan, setHasPlan] = useState(false)
  const [privateChatMessages, setPrivateChatMessages] = useState([
    {
      type: "normal-public-message",
      index: 1,
      username: "Model",
      message: "Start chatting with  me 💌💌🥰",
      walletCoins: "You are live",
    },
  ])

  const authCtx = useAuthContext()

  const noPlanBanner = (
    <div className="tw-mt-6 tw-py-20">
      <div className="tw-text-center">
        <span className="tw-rounded-full tw-bg-dreamgirl-red tw-inline-grid tw-place-items-center tw-p-3 tw-mx-auto video-call-button">
          <StarOutline
            className="tw-text-white-color"
            style={{ fontSize: "50px" }}
          />
        </span>
        <p className="tw-font-semibold tw-text-red-500 tw-capitalize tw-mt-3">
          go ultimate
        </p>
        <p className="tw-text-text-black">to chat privately with any model</p>
      </div>
      <div className="tw-my-6 tw-rounded tw-bg-first-color tw-text-text-black tw-p-3">
        <p className="tw-mx-2 tw-my-1">
          <span className="tw-pr-2">
            <ChatBubble fontSize="small" />
          </span>
          Unlimited Private Messages
        </p>
        <p className="tw-mx-2 tw-my-1">
          <span className="tw-pr-2">
            <SupervisedUserCircle fontSize="small" />
          </span>
          Chat With Any Model
        </p>
        <p className="tw-mx-2 tw-my-1">
          <span className="tw-pr-2">
            <CheckCircle fontSize="small" />
          </span>
          Model Can Focus On You More
        </p>
      </div>
      <div className="tw-mt-3 tw-text-center">
        <button className="tw-capitalize tw-bg-dreamgirl-red tw-text-white tw-py-2 tw-px-4 tw-rounded-full tw-font-medium video-call-button">
          <Stars className="tw-text-white-color" fontSize="small" />
          <span
            className="tw-pl-2"
            onClick={() =>
              props.modalCtx.showModalWithContent(<ChooseChatPlan />)
            }
          >
            Get Pro Chat Plan
          </span>
        </button>
      </div>
    </div>
  )

  let chatContent
  if (authCtx.isLoggedIn) {
    if (props.hasActivePlan) {
      chatContent = <div className="">You Can Chat</div>
    } else {
      chatContent = noPlanBanner
    }
  } else {
    chatContent = notLoggedInBanner
  }

  return (
    <div className="chat-box tw-flex tw-flex-col tw-items-center tw-mb-14 tw-h-full tw-bg-dark-black tw-ml-1">
      {chatContent}
    </div>
  )
}

export default PrivateChat
