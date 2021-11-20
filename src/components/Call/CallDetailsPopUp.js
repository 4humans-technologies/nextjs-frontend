import React, { useState, useEffect } from "react"
import Modal from "react-modal"
import useModalContext from "../../app/ModalContext"
import {
  VideoCall,
  Audiotrack,
  Favorite,
  Security,
  FlashOn,
  Cancel,
} from "@material-ui/icons"
import Image from "next/image"
import neeraj from "../../../public/brandikaran.jpg"
import { useRouter } from "next/router"
import useAgora from "../../hooks/useAgora"
import AgoraRTC from "agora-rtc-sdk-ng"
import Videocall from "../model/VideoCall" // Replace with your App ID.
import { FastForward } from "@material-ui/icons"
import io from "../../socket/socket"
import { useAuthContext } from "../../app/AuthContext"
import { useSocketContext } from "../../app/socket/SocketContext"

function CallDetailsPopUp(props) {
  const router = useRouter()

  const authCtx = useAuthContext()
  const socketCtx = useSocketContext()

  const { model } = props

  const handleCallRequest = (callType) => {
    if (props.pendingCallRequest) {
      alert("Your call request is pending! please for model's response 👑👑")
      return
    }
    debugger
    if (socketCtx.setSocketSetupDone) {
      /* can either emit or do http request */
      /* const socket = io.getSocket()
      socket.emit("viewer-requested-for-call-emitted",
        {
          callType: callType,
          relatedUserId: authCtx.relatedUserId,
          modelId: window.location.pathname.split("/").reverse()[0],
          walletCoins: authCtx.user.user.relatedUser.wallet.currentAmount,
          username: authCtx.user.user.username
        }) */

      /* do http request */
      fetch("/api/website/stream/handle-viewer-call-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          callType: callType,
          relatedUserId: authCtx.relatedUserId,
          modelId: window.location.pathname.split("/").reverse()[0],
          walletCoins: authCtx.user.user.relatedUser.wallet.currentAmount,
          username: authCtx.user.user.username,
          streamId: sessionStorage.getItem("streamId"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          props.setPendingCallRequest(true)
          props.setCallType(callType)
          props.closeModal()
        })
        .catch((err) => alert(err.message))
    }
  }

  return (
    <>
      <div className="tw-relative">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5 tw-justify-center tw-justify-items-stretch tw-place-content-center tw-w-11/12 md:tw-w-10/12 lg:tw-w-8/12 xl:tw-w-7/12 2xl:tw-w-6/12 tw-mx-auto">
          <div className="tw-col-span-1 md:tw-col-span-2">
            <div className="tw-flex tw-justify-between tw-items-center tw-px-3 tw-mb-2 tw-bg-second-color tw-rounded-md tw-py-2">
              <div className="tw-inline-flex tw-justify-between tw-items-center">
                <img
                  src={model.profileImage}
                  height={60}
                  width={60}
                  className="tw-w-[60px] tw-h-[60px] tw-rounded-full tw-border-white-color tw-border-2 tw-object-cover"
                />
                <p className="tw-text-sm tw-font-medium tw-text-white-color  tw-pl-3">
                  <span className="tw-font-bold tw-text-lg tw-capitalize">
                    {model.name}
                  </span>
                  <br />@{model.rootUser.username}
                </p>
              </div>
              <div className="tw-flex tw-justify-center tw-items-center tw-flex-col tw-text-white-color">
                <p>10 reviews</p>
                <p>
                  <span className="tw-text-lg tw-pr-2 tw-font-semibold">
                    {model.rating || 5}
                  </span>{" "}
                  Stars
                </p>
              </div>
            </div>
          </div>
          <div className="tw-col-span-1 tw-text-center">
            <div className="video-call tw-rounded-md red-gray-gradient tw-py-4 tw-h-full">
              <div className="video-call-icon-container tw-mb-4 tw-w-28 tw-h-28 tw-rounded-full tw-bg-second-color tw-grid tw-place-items-center mx-auto tw-border-4 tw-border-white-color">
                <Favorite
                  className="tw-text-dreamgirl-red video-call-icon"
                  style={{ fontSize: "4rem" }}
                />
              </div>
              <h2 className="tw-text-lg tw-font-bold tw-mb-2 tw-text-white-color tw-uppercase">
                private video call
              </h2>
              <hr className="tw-w-8/12 tw-my-4 tw-text-white-color tw-mx-auto" />
              <div className="mt-2">
                <button
                  className="video-call-button tw-capitalize tw-font-semibold tw-text-sm tw-rounded-full tw-px-3 tw-py-2 tw-bg-dreamgirl-red tw-text-white-color"
                  onClick={() => handleCallRequest("videoCall")}
                >
                  Start {model.charges.videoCall} coins/min
                </button>
              </div>
              <p className="tw-text-sm tw-text-center tw-mt-4 tw-text-white-color tw-capitalize">
                minimum call duration {model.minCallDuration} min
              </p>
              <div className="tw-rounded tw-p-2 tw-mt-2">
                <p className="tw-mt-1 tw-capitalize tw-flex tw-justify-center tw-items-center tw-text-white-color tw-text-xs">
                  <span className="tw-pr-1">
                    <FastForward fontSize="small" />
                  </span>
                  <span className="tw-pl-1">Ultra-low latency video calls</span>
                </p>
                <p className="tw-mt-1 tw-capitalize tw-flex tw-justify-center tw-items-center tw-text-white-color tw-text-xs">
                  <span className="tw-pr-1">
                    <Security fontSize="small" />
                  </span>
                  <span className="tw-pl-1">
                    No one can spy on you, 100% private
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="tw-col-span-1 tw-text-center">
            <div className="audio-call tw-rounded-md red-gray-gradient tw-py-4 tw-h-full">
              <div className="audio-call-icon-container tw-mb-4 tw-w-28 tw-h-28 tw-rounded-full tw-bg-second-color tw-grid tw-place-items-center mx-auto tw-border-4 tw-border-white-color">
                <Favorite
                  className="tw-text-dreamgirl-red video-call-icon"
                  style={{ fontSize: "4rem" }}
                />
              </div>
              <h2 className="tw-text-lg tw-font-bold tw-mb-2 tw-text-white-color tw-uppercase">
                private Audio call
              </h2>
              <hr className="tw-w-8/12 tw-my-4 tw-text-white-color tw-mx-auto" />
              <div className="mt-2">
                <button
                  className="audio-call-button tw-capitalize tw-font-semibold tw-text-sm tw-rounded-full tw-px-3 tw-py-2 tw-bg-dreamgirl-red tw-text-white-color"
                  onClick={() => handleCallRequest("audioCall")}
                >
                  Start {model.charges.audioCall} coins/min
                </button>
              </div>
              <p className="tw-text-sm tw-text-center tw-mt-4 tw-text-white-color tw-capitalize">
                minimum call duration {model.minCallDuration} min
              </p>
              <div className="tw-rounded tw-p-2 tw-mt-2">
                <p className="tw-mt-1 tw-capitalize tw-flex tw-justify-center tw-items-center tw-text-white-color tw-text-xs">
                  <span className="tw-pr-1">
                    <FastForward fontSize="small" />
                  </span>
                  <span className="tw-pl-1">Ultra-low latency video calls</span>
                </p>
                <p className="tw-mt-1 tw-capitalize tw-flex tw-justify-center tw-items-center tw-text-white-color tw-text-xs">
                  <span className="tw-pr-1">
                    <Audiotrack fontSize="small" />
                  </span>
                  <span className="tw-pl-1">
                    crystal clear 128 bit audio calls
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="tw-col-span-1 md:tw-col-span-2 tw-mt-2 tw-pt-2 tw-border-white-color tw-border-t-[1px]">
            <p className="tw-text-center tw-text-sm tw-capitalize tw-text-white-color tw-tracking-wide tw-px-2 md:tw-px-4">
              the model will be able to chat only with you and give you 100%
              attention. Nobody can see your chat. Booth you and the model can
              end the show at any time
            </p>
          </div>
        </div>
        <button
          className="tw-text-white-color hover:tw-text-dreamgirl-red tw-absolute tw-top-0 tw-left-0"
          onClick={props.closeModal}
        >
          <Cancel fontSize="large" />
        </button>
      </div>
    </>
  )
}

export default CallDetailsPopUp
