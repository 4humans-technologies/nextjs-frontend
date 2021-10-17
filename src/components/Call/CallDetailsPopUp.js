import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import useModalContext from "../../app/ModalContext";
import {
  VideoCall,
  Audiotrack,
  Favorite,
  Security,
  FlashOn,
  Cancel,
} from "@material-ui/icons";
import FastForward from "@material-ui/icons/FastForward"
import Image from "next/image";
import neeraj from "../../../public/brandikaran.jpg";
import { useRouter } from "next/router";
import useAgora from "../../hooks/useAgora";
import AgoraRTC from "agora-rtc-sdk-ng";
import Videocall from "../model/VideoCall"; // Replace with your App ID.

let token;
let channel;

function CallDetailsPopUp(props) {
  const router = useRouter();
  const ctx = useModalContext();

  useEffect(() => {
    // debugger;
    fetch(
      // "http://localhost:8080/api/website/token-builder/create-stream-and-gen-token", //for model class
      "http://localhost:8080/api/website/token-builder/authed-viewer-join-stream",
      {
        method: "POST",
        cors: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtTokenViewer")}`,
        },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        debugger;
        updateCtx.updateViewer({
          rtcToken: data.rtcToken,
        });
        token = data.rtcToken;
        channel = data.modelId;
        // join();
        console.log(`${data.actionStatus}`);
      })
      .catch((error) => console.log(error));
  }, []);

  const callDirect = (e) => {
    e.preventDefault();
    router.push("/ravi/call");
  };
  const videoDirect = (e) => {
    e.preventDefault();
    (
      <Videocall
        token={token}
        channel={channel}
        role="host"
        uid={channel}
        callType="videoCall"
      />
    ),
      router.push("/ravi/videocall");
  };

  return (
    <>
      <div className="tw-relative">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5 tw-justify-center tw-justify-items-stretch tw-place-content-center tw-w-11/12 md:tw-w-10/12 lg:tw-w-8/12 xl:tw-w-7/12 2xl:tw-w-6/12 tw-mx-auto">
          <div className="tw-col-span-1 md:tw-col-span-2">
            <div className="tw-flex tw-justify-between tw-items-center tw-px-3 tw-mb-2 tw-bg-second-color tw-rounded-md tw-py-2">
              <div className="tw-inline-flex tw-justify-between tw-items-center">
                <Image
                  src={neeraj}
                  height={50}
                  width={50}
                  className="tw-rounded-full tw-border-white-color tw-border-2 tw-object-cover"
                />
                <p className="tw-text-lg tw-text-white-color tw-font-bold tw-pl-3">
                  <span className="tw-text-sm tw-font-medium">Call with </span>
                  <br /> Neeraj Model
                </p>
              </div>
              <div className="tw-flex tw-justify-center tw-items-center tw-flex-col tw-text-white-color">
                <p>100 reviews</p>
                <p>
                  <span className="tw-text-lg tw-pr-2 tw-font-semibold">
                    4.5
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
                video call
              </h2>
              <hr className="tw-w-8/12 tw-my-4 tw-text-white-color tw-mx-auto" />
              <div className="mt-2">
                <button
                  onClick={videoDirect}
                  className="video-call-button tw-capitalize tw-font-semibold tw-text-sm tw-rounded-full tw-px-3 tw-py-2 tw-bg-dreamgirl-red tw-text-white-color"
                >
                  Start 12 coins/min
                </button>
              </div>
              <p className="tw-text-sm tw-text-center tw-mt-4 tw-text-white-color tw-capitalize">
                minimum call duration 5 min
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
                Audio call
              </h2>
              <hr className="tw-w-8/12 tw-my-4 tw-text-white-color tw-mx-auto" />
              <div className="mt-2">
                <button
                  onClick={callDirect}
                  className="audio-call-button tw-capitalize tw-font-semibold tw-text-sm tw-rounded-full tw-px-3 tw-py-2 tw-bg-dreamgirl-red tw-text-white-color"
                >
                  Start 8 coins/min
                </button>
              </div>
              <p className="tw-text-sm tw-text-center tw-mt-4 tw-text-white-color tw-capitalize">
                minimum call duration 5 min
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
          onClick={ctx.toggleCallModal}
        >
          <Cancel fontSize="large" />
        </button>
      </div>
    </>
  );
}

export default CallDetailsPopUp;
