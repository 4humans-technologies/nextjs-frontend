import React, { useState, useEffect } from "react"
import { useAuthContext } from "../../app/AuthContext"
import useModalContext from "../../app/ModalContext"
import {
  EmailChange,
  PasswordChange,
  CoverUpdate,
  ProfileUpdate,
} from "../UI/Profile/Emailpassword"

function Settingprivacy() {
  const authContext = useAuthContext()
  const modalCtx = useModalContext()
  const [tokenData, setTokenData] = useState()
  const [claimToken, setclaimToken] = useState(0) // Token to be claimed  by model to get
  const [bankDetails, setBankDetails] = useState({
    // Bank details
    person: "",
    bankName: "",
    bankIfsc: "",
    accountNumber: 0,
  })
  useEffect(() => {
    fetch("/api/website/profile/get-model-token-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => setTokenData(data.results))
      .catch((err) => console.log(err))
  }, [])

  // for the bank account

  const bankDetailHandler = async (e) => {
    e.preventdefault()
  }

  return authContext.user.user ? (
    <div className="tw-pb-4">
      <div className="tw-mb-8">
        <div className="tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-text-white tw-w-full ">
          <div className="tw-col-span-1">
            <div className="tw-bg-first-color tw-flex tw-items-center tw-justify-between tw-py-4 tw-rounded-md tw-mt-4 tw-px-4 ">
              <p className="">
                My Email{" "}
                <span className="tw-ml-4 tw-text-lg tw-font-semibold">
                  {authContext.user.user.relatedUser.email}
                </span>
              </p>
              <button
                className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium "
                onClick={() => modalCtx.showModalWithContent(<EmailChange />)}
              >
                Change Email
              </button>
            </div>
          </div>
          <div className="tw-col-span-1">
            <div className="tw-bg-first-color tw-flex tw-items-center tw-justify-between tw-py-4 tw-rounded-md tw-mt-4 tw-px-4 ">
              <p className="">
                My Password{" "}
                <span className="tw-ml-4 tw-font-semibold">xxxxxxxx</span>
              </p>
              <button
                className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium "
                onClick={() =>
                  modalCtx.showModalWithContent(<PasswordChange />)
                }
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
        <div className="tw-text-white tw-mt-8 ">
          {/* It's token History */}
          <h1 className="tw-pt-4 tw-text-center tw-font-semibold">
            Token History
          </h1>
          <div className="tw-grid md:tw-grid-cols-4 tw-grid-rows-1 tw-text-xl tw-font-bold  tw-mt-4 md:tw-mx-16 tw-text-center token_grid ">
            <div>Date</div>
            <div>Time</div>
            <div>User</div>
            <div>Token</div>
          </div>

          <div className="tw-max-h-72 tw-overflow-y-auto">
            {tokenData?.map((item, index) => (
              <div
                className="tw-grid md:tw-grid-cols-4 tw-grid-rows-1  tw-bg-second-color tw-text-xl tw-font-bold  tw-mt-2 md:tw-mx-16 tw-text-center token_grid "
                key={index}
              >
                <div>{item.time.split("T")[0]}</div>
                <div>{item.time.split("T")[1].split(".")[0]}</div>
                <div>{item.by.name}</div>
                <div>{item.tokenAmount}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Bank Details  */}
        <div className="tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-text-white tw-w-full tw-my-4 ">
          <div className="tw-col-span-1 tw-px-4">
            <h1 className=" tw-font-bold tw-text-center tw-my-4">
              Bank Details
            </h1>
            <form
              action=""
              method="post"
              className="tw-flex tw-flex-col tw-pr-4"
            >
              <label htmlFor="accountHolder" className="">
                Your Name (as per bank)
              </label>
              <input
                type="text"
                name="accountHolder"
                id="accountHolder"
                placeholder="Your name as resgister"
                onInput={(e) =>
                  setBankDetails((prev) => ({
                    ...prev,
                    person: e.taget.value,
                  }))
                }
                className="tw-bg-second-color tw-rounded-full tw-py-1 tw-px-2"
              />
              <label htmlFor="Bank-name">BANK NAME</label>
              <input
                type="text"
                name="Bank-name"
                id="Bank-name"
                onInput={(e) =>
                  setBankDetails((prev) => ({
                    ...prev,
                    bankName: e.taget.value,
                  }))
                }
                className="tw-bg-second-color tw-rounded-full tw-py-1 tw-px-2"
              />
              <label htmlFor="accountNumber">Bank account number</label>
              <input
                type="text"
                name="accountNumber"
                onInput={(e) =>
                  setBankDetails((prev) => ({
                    ...prev,
                    accountNumber: e.taget.value,
                  }))
                }
                id="accountNumber"
                className="tw-bg-second-color tw-rounded-full tw-py-1 tw-px-2"
              />
              <label htmlFor="ifscCode">IFSC CODE</label>
              <input
                type="text"
                name="ifscCode"
                id="ifscCode"
                onInput={(e) =>
                  setBankDetails((prev) => ({
                    ...prev,
                    bankIfsc: e.taget.value,
                  }))
                }
                className="tw-bg-second-color tw-rounded-full tw-py-1 tw-px-2"
              />

              <div className="tw-flex tw-mx-auto">
                <button
                  type="submit"
                  className=" tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium  tw-mt-4"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
          <div className="tw-col-span-1 tw-px-4">
            <h1 className=" tw-font-bold tw-text-center tw-my-4">
              Widrawal Reuest
            </h1>
            <p>
              <span className="tw-font-smibold tw-mr-4">
                Token in your account :
              </span>
              {authContext.user.user.relatedUser.wallet.currentAmount}
            </p>
            <p className="flex tw-my-2">
              <span className="tw-font-smibold tw-mr-4">
                Withdrawal Token :
              </span>
              <input
                type="text"
                name=""
                id=""
                onInput={(e) => setclaimToken(e.target.value)}
                className="tw-bg-second-color tw-rounded-full tw-py-1 tw-px-2"
              />
            </p>
            <button
              type="submit"
              className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium  "
            >
              Claim token
            </button>
          </div>
        </div>
        {/* Bank Details  */}
      </div>
    </div>
  ) : null
}

export default Settingprivacy
