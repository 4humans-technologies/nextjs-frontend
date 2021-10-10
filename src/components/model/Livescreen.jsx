import React, { useReducer, useState } from "react"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer"
import PersonIcon from "@material-ui/icons/Person"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import FlareIcon from "@material-ui/icons/Flare"
import Publicchat from "./PublicChat"
import PrivateChat from "./PrivateChat"
import LivePeople from "./LivePeople"
import dynamic from "next/dynamic"
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions"
import BrowseGifts from "../Gift/BrowseGifts"

// for audio video call
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk"
import VideocamIcon from "@material-ui/icons/Videocam"
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard"
import FavoriteIcon from "@material-ui/icons/Favorite"
import { Button } from "react-bootstrap"
import useModalContext from "../../app/ModalContext"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import { useRouter } from "next/router"

const ViewerScreen = dynamic(() => import("../Mainpage/ViewerScreen"), {
  ssr: false,
})

function Livescreen() {
  const ctx = useModalContext()
  const authCtx = useAuthContext()
  const updateCtx = useAuthUpdateContext()
  const router = useRouter()
  const [showBrowseGifts, setShowBrowseGifts] = useState(false)
  const [gifts, setGifts] = useState([])
  const [chosenGift, setChosenGift] = useState(null)

  const fetchGifts = () => {
    if (!authCtx.isLoggedIn) {
      router.replace("/auth/login")
      updateCtx.updateViewer({ loginSuccessUrl: window.location.pathname })
    } else {
      /* fetch gifts from server */
      const giftUrl = ""
      fetch(giftUrl)
        .then((res) => res.json())
        .then((data) => {
          /* render gift component and mount */
          setGifts()
          showBrowseGifts(true)
        })
        .catch((err) => {
          /* call error modal */
          alert("Error fetching gifts" + err.message)
        })
    }
  }

  const buyGift = () => {
    if (!authCtx.isLoggedIn) {
      alert("How you dare to buy gifts without logging in 😡😡😠😠😡😡")
      router.replace("/auth/login")
      updateCtx.updateViewer({ loginSuccessUrl: window.location.pathname })
    } else {
      /* fetch request buy gift _id to buy */
    }
  }

  return (
    <div className="sm:tw-flex sm:tw-flex-1 tw-w-full tw-bg-dark-black tw-font-sans  tw-mt-28">
      <div className="tw-relative tw-bg-dark-black tw-mt-4 sm:tw-w-6/12 tw-w-full sm:tw-h-[37rem] tw-h-[30rem]">
        {/* <img src="brandikaran.jpg" alt="" /> */}
        <ViewerScreen />
        <div className=" tw-bg-second-color tw-w-full tw-absolute tw-bottom-0 tw-py-3 tw-px-2">
          <div className="tw-grid lg:tw-hidden tw-grid-cols-2 tw-grid-rows-2 tw-gap-y-3 tw-gap-x-2">
            <div className="tw-col-span-1 tw-row-span-1 tw-flex tw-items-center tw-justify-start">
              <FavoriteIcon className="tw-text-red-600" />
              <p className="tw-pl-2 tw-text-white-color tw-font-semibold">
                33.k
              </p>
            </div>
            <div className="tw-col-span-1 tw-row-span-1 tw-justify-self-end">
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                variant="danger"
                onClick={() => setShowBrowseGifts((prev) => !prev)}
              >
                <CardGiftcardIcon fontSize="small" />
                <span className="tw-pl-1 tw-tracking-tight">Send Gift</span>
              </Button>
            </div>
            <div className="tw-col-span-1 tw-row-span-1">
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm"
                variant="primary"
                onClick={ctx.toggleCallModal}
              >
                <VideocamIcon fontSize="small" />
                <p className="tw-pl-1 tw-tracking-tight">Private video call</p>
              </Button>
            </div>
            <div className="tw-col-span-1 tw-row-span-1 tw-justify-self-end">
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                variant="success"
                onClick={ctx.toggleCallModal}
              >
                <PhoneInTalkIcon fontSize="small" />
                <span className="tw-pl-1 tw-tracking-tight">
                  Private Audio call
                </span>
              </Button>
            </div>
          </div>
          <div className="tw-hidden lg:tw-flex md:tw-justify-between md:tw-self-center tw-text-white">
            <div className="tw-flex tw-self-center">
              <FavoriteIcon className="tw-rounded-full tw-flex sm:tw-mr-2" />
              <p className="pl-4">33.k</p>
            </div>
            <div className="tw-flex tw-justify-between">
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm"
                variant="success"
                onClick={ctx.toggleCallModal}
              >
                <PhoneInTalkIcon fontSize="small" />
                <span className="tw-pl-1 tw-tracking-tight">
                  Private Audio call
                </span>
              </Button>
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-mr-2 tw-text-sm"
                variant="primary"
                onClick={ctx.toggleCallModal}
              >
                <VideocamIcon fontSize="small" />
                <p className="tw-pl-1 tw-tracking-tight">Private video call</p>
              </Button>
              <Button
                className="tw-rounded-full tw-flex tw-self-center tw-text-sm"
                variant="danger"
              >
                <CardGiftcardIcon fontSize="small" />
                <p className="tw-pl-1 tw-tracking-tight">Send Gift</p>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:tw-mt-4 tw-mt-2 tw-bg-second-color sm:tw-w-6/12 sm:tw-h-[37rem] tw-h-[30rem] tw-relative tw-w-screen">
        <div className="tw-flex tw-justify-between tw-text-white tw-pt-3 sm:tw-py-2 sm:tw-px-4 tw-text-center tw-content-center tw-items-center">
          <button className="tw-inline-flex tw-items-center tw-content-center tw-py-2">
            <ChatBubbleIcon className="tw-mr-2 tw-my-auto" />
            <span className="tw-font-semibold tw-text-lg tw-pl-2 tw-my-auto">
              Live Chat
            </span>
          </button>
        </div>
        <div className="tw-absolute tw-h-[90%] tw-bottom-0 tw-w-full chat-box-container tw-overflow-y-scroll">
          <div className="tw-bottom-0 tw-relative tw-w-full tw-pb-18">
            <Publicchat />
          </div>
        </div>

        <div className="tw-flex tw-py-1.5 tw-bg-second-color tw-text-white tw-place-items-center tw-absolute tw-bottom-0 tw-w-full">
          <div className="tw-rounded-full tw-bg-dark-black tw-flex md:tw-mx-1 tw-outline-none tw-place-items-center tw-w-full">
            <input
              className="tw-flex tw-flex-1 tw-mx-2 tw-rounded-full tw-py-2 tw-px-6 tw-bg-dark-black tw-border-0 md:tw-mx-1 tw-outline-none"
              placeholder="Public Chat  ....."
            ></input>
            <button className="sm:tw-py-3 tw-py-2 tw-px-0 sm:tw-px-4 tw-bg-blue-500 sm:tw-ml-1 tw-ml-2 tw-rounded-tr-full tw-rounded-br-full">
              Send Message
            </button>
          </div>
        </div>
      </div>

      {showBrowseGifts && (
        <BrowseGifts
          closeBrowseGiftsSection={setShowBrowseGifts}
          setChosenGift={setChosenGift}
          buyGift={buyGift}
        />
      )}
    </div>
  )
}

export default Livescreen
