import React, { useState } from "react"
import { useAuthUpdateContext, useAuthContext } from "../../app/AuthContext"
import Header from "../Mainpage/Header"

function ViewerToken() {
  const [buyStatus, setBuyStatus] = useState({
    message: null,
    requestedToBuy: false,
    buySuccess: false,
  })
  const authUpdateCtx = useAuthUpdateContext()
  const authCtx = useAuthContext()

  const handleRedeemRequest = () => {
    if (!authCtx.isLoggedIn || authCtx.user.userType !== "viewer") {
      return alert("Please login first!")
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
          const lcUser = JSON.parse(localStorage.getItem("user"))
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...lcUser,
              relatedUser: {
                ...lcUser.relatedUser,
                wallet: {
                  ...data.wallet,
                },
              },
            })
          )
          authUpdateCtx.updateNestedPaths({
            ...lcUser,
            relatedUser: {
              ...lcUser.relatedUser,
              wallet: {
                ...data.wallet,
              },
            },
          })
          alert("Coins redeem successful 😀😀")
        }
      })
      .catch((err) => alert(err.message))
  }

  return (
    <div>
      <div className="tw-text-white tw-bg-first-color tw-h-screen tw-pt-[10rem]">
        <Header />
        <div className="tw-text-center tw-mx-auto tw-w-6/12 tw-bg-second-color tw-rounded-md">
          <h1 className="tw-font-bold tw-text-xl tw-pt-4 tw-text-center tw-mb-4">
            Redeem Code
          </h1>
          <div className="">
            <input
              type="text"
              name="payment"
              id="payment"
              placeholder="Enter your coupon code "
              className="tw-rounded-full tw-w-96 tw-h-8  tw-outline-none tw-text-black tw-px-4 tw-font-medium tw-py-2"
            />
          </div>
          <div className="">
            <button className="tw-bg-dreamgirl-red tw-px-4 tw-py-2 tw-mt-10 tw-rounded-full tw-mb-8">
              Redeem Code
            </button>
          </div>
          {buyStatus.requestedToBuy && (
            <p
              className={
                buyStatus.buySuccess
                  ? "tw-py-2 tw-text-green-600"
                  : "tw-py-2 tw-text-red-600"
              }
            >
              {buyStatus}
            </p>
          )}
        </div>
        {/* =========================== */}
        <h1 className="tw-font-bold tw-text-xl tw-pt-4 tw-text-center tw-mb-4">
          Buy New Coupon Code
        </h1>
        <div className="tw-text-center tw-mx-auto tw-w-6/12 tw-bg-second-color tw-rounded-md tw-py-4">
          <p className="tw-text-center tw-text-white">
            You can Buy Coins Via Google Pay, Phone Pay, PayTM, UPI
          </p>
          <a
            href="http://coinsanytime.in"
            target="_blank"
            className="tw-bg-green-color tw-rounded-full tw-px-4 tw-py-2 tw-my-2 tw-text-white"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  )
}

export default ViewerToken
