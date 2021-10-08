import React from "react";

function Notification() {
  return (
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
                <span className="tw-text-lg tw-pr-2 tw-font-semibold">4.5</span>{" "}
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
                Accept calll
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
      </div>
    </div>
  );
}

export default Notification;
