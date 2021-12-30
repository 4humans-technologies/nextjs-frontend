import React, { useState } from "react"
import { useAuthUpdateContext, useAuthContext } from "../../app/AuthContext"
import Header from "../Mainpage/Header"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import Link from "next/link"
function ViewerToken() {
  const [buyStatus, setBuyStatus] = useState({
    message: null,
    requestedToBuy: false,
    buySuccess: false,
  })
  const authUpdateCtx = useAuthUpdateContext()
  const authCtx = useAuthContext()

  const handleRedeemRequest = () => {
    if (!authCtx.isLoggedIn || authCtx.user.userType !== "Viewer") {
      return alert("Please login to redeem the code! 😀")
    }
    fetch("/api/website/coupon/redeem-coupon-viewer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: document.getElementById("payment").value.trim(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.actionStatus === "success") {
          document.getElementById("money-debit-audio").play()
          authUpdateCtx.updateWallet(+data.wallet.currentAmount, "set")
          setBuyStatus({
            message: data.message,
            requestedToBuy: true,
            buySuccess: true,
          })
        }
      })
      .catch((err) => {
        setBuyStatus({
          message: err.message,
          requestedToBuy: true,
          buySuccess: false,
        })
      })
  }

  return (
    <div>
      <audio
        preload="true"
        src="/audio/money-debit.mp3"
        id="money-debit-audio"
      ></audio>
      <h1 className="tw-font-bold tw-text-xl tw-pt-4 tw-text-center tw-mb-4 tw-text-white">
        Redeem Code
      </h1>
      <div className="tw-text-white tw-bg-first-color tw-h-screen tw-pt-4 ">
        <div className="tw-text-center md:tw-mx-auto tw-w-full tw-mx-3 md:tw-w-4/12 tw-bg-second-color tw-rounded-md">
          <div className="tw-flex tw-pt-2 tw-px-2 tw-cursor-pointer">
            <Link href="/">
              <ArrowBackIcon fontSize="medium" />
            </Link>
          </div>
          <div className="tw-pt-8">
            <input
              type="text"
              name="payment"
              id="payment"
              placeholder="Enter your coupon code "
              className="tw-rounded tw-w-96 tw-h-8  tw-outline-none tw-text-black tw-px-4 tw-font-medium tw-py-2"
            />
          </div>
          <div className="">
            <button
              onClick={handleRedeemRequest}
              className="tw-bg-dreamgirl-red tw-px-4 tw-py-2 tw-mt-10 tw-rounded-full tw-mb-4"
            >
              Redeem
            </button>
          </div>
          {buyStatus.requestedToBuy && (
            <p
              className={
                buyStatus.buySuccess
                  ? "tw-py-2 tw-text-green-600 tw-font-semibold tw-text-xl"
                  : "tw-py-2 tw-text-red-600 tw-font-semibold tw-text-xl"
              }
            >
              {buyStatus.message}
            </p>
          )}
        </div>
        {/* =========================== */}
        <h1 className="tw-font-bold tw-text-xl tw-pt-4 tw-text-center tw-mb-4">
          Buy New Coupon Code
        </h1>
        <div className="tw-text-center md:tw-mx-auto tw-w-full tw-mx-3 md:tw-w-4/12 tw-bg-second-color tw-rounded-md   tw-py-4">
          <p className="tw-text-center tw-text-white tw-mb-3 md:tw-py-6">
            You can Buy Coins Via Google Pay, Phone Pay, PayTM, UPI
          </p>
          <a
            href="https://couponwa.com"
            target="_blank"
            className="tw-bg-green-color tw-rounded-full tw-px-4 tw-py-2 tw-my-2  tw-text-white"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  )
}

export default ViewerToken
