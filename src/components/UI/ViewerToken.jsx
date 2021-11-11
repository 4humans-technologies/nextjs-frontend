import React from "react"
import Header from "../Mainpage/Header"

function ViewerToken() {
  return (
    <div>
      <div className="tw-text-white tw-bg-second-color tw-h-screen">
        <Header />
        <h1 className="tw-font-extrabold tw-text-4xl md:tw-mt-[8.2rem] tw-pt-4 tw-text-center">
          PAYMENT PAGE
        </h1>
        <div className="tw-block  tw-my-8 tw-text-center">
          <input
            type="text"
            name="payment"
            id="payment"
            placeholder="Enter your Coopan code "
            className="tw-rounded-full tw-w-96 tw-h-8  tw-outline-none tw-text-black tw-px-4"
          />
          <br />
          <button className="tw-bg-dreamgirl-red tw-px-4 tw-py-2 tw-mt-10 tw-rounded-full tw-mb-8">
            Redeem Code
          </button>

          <h2>Dynamic message when buy coin</h2>
        </div>

        <hr className=" tw-bg-white  tw-my-4" />
        <div className="tw-block tw-text-center">
          <p>You can Buy token Via GooglePay,PhonePay,Paytm,UPI</p>
          <button className="tw-bg-green-color tw-font-bold tw-rounded-full tw-px-4 tw-py-2 tw-my-2">
            Buy New Token
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewerToken
