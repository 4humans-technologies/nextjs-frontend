import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useAuthContext } from "../../app/AuthContext"
import useModalContext from "../../app/ModalContext"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import {
  EmailChange,
  PasswordChange,
  CoverUpdate,
  ProfileUpdate,
} from "../UI/Profile/Emailpassword"
import Banned from "../model/Banned"

let allHistory = []
let act = {
  0: "AUDIO_CALL_ADV", //audoio call advance cuttinng
  1: "Audio Call",
  2: "VIDEO_CALL_ADV",
  3: "Video Call",
  4: "Coin gift", //gifted coin
  5: "Coin gift",
  6: "Activity request",
  7: "Activity request",
  8: "Refund",
  9: "SYS_ADMIN",
}
function Settingprivacy() {
  const authContext = useAuthContext()
  const modalCtx = useModalContext()
  const [tokenData, setTokenData] = useState(allHistory)
  const [filterDate, setFilterDate] = useState({
    start: 0,
    end: 0,
  })

  const [claimToken, setclaimToken] = useState(0) // Token to be claimed  by model to get
  const [bankDetails, setBankDetails] = useState({
    // Bank details
    person: "",
    bankName: "",
    bankIfsc: "",
    accountNumber: 0,
    accountType: "Saving",
  })
  useEffect(() => {
    fetch("/api/website/profile/get-model-token-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTokenData(data.results)
        allHistory = data.results
      })
      .catch((err) => console.log(err))
  }, [])

  // for the bank account
  const bankDetailHandler = async (e) => {
    e.preventDefault()
    fetch("/api/website/profile/update-info-fields", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify([
        {
          field: "bankDetails",
          value: {
            bankName: bankDetails.bankName,
            IfscCode: bankDetails.bankIfsc,
            holderName: bankDetails.person,
            accountNumber: bankDetails.accountNumber,
            // accountType:bankDetails.accountType
          },
        },
      ]),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Bank Details Successfully update", {
          position: "bottom-right",
          autoClose: 3000,
        })
      })
  }

  // assending And decending from the token
  const assendHandler = () => {
    let tok = tokenData?.sort((a, b) => a.tokenAmount - b.tokenAmount)
    return setTokenData([...tok])
  }
  const decendHandler = () => {
    let tok = tokenData?.sort((a, b) => a.tokenAmount - b.tokenAmount)
    tok.reverse()
    return setTokenData([...tok])
  }

  const dateHandler = (e) => {
    e.preventDefault()
    let end = filterDate.end ? filterDate.end : Date.parse(new Date())
    setTokenData(
      allHistory.filter((item) => {
        if (
          filterDate.start <= Date.parse(item.time.split("T")[0]) &&
          end >= Date.parse(item.time.split("T")[0])
        ) {
          return item
        }
      })
    )
  }

  return (
    authContext.isLoggedIn && (
      <div className="tw-pb-4">
        <div className="tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-text-white tw-w-full ">
          <div className="tw-col-span-1">
            <div className="tw-bg-first-color tw-flex tw-items-center tw-justify-between tw-py-4 tw-rounded-md tw-mt-4 tw-px-4 ">
              <p className="">
                My Email
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

        {/* It's token History */}
        <div className="tw-text-white tw-mt-8 ">
          <h1 className="tw-pt-4 tw-text-center tw-font-semibold">
            Token History
          </h1>
          <div className="tw-flex tw-mt-4 tw-flex-wrap">
            <form onSubmit={dateHandler}>
              <label htmlFor="startDate">From</label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                className="md:tw-mx-4 tw-mx-1 tw-text-white tw-bg-second-color tw-rounded-lg tw-px-1"
                onInput={(e) =>
                  setFilterDate((prev) => ({
                    ...prev,
                    start: Date.parse(
                      document.getElementById("startDate").value
                    ),
                  }))
                }
                placeholder="Starting Date"
              />
              <label htmlFor="lastdate">To</label>
              <input
                type="date"
                name="lastdate"
                id="lastDate"
                className=" md:tw-ml-4 tw-mx-1 tw-text-white tw-bg-second-color tw-rounded-lg tw-px-1"
                onInput={(e) =>
                  setFilterDate((prev) => ({
                    ...prev,
                    end: Date.parse(document.getElementById("lastDate").value),
                  }))
                }
                placeholder="End Date"
              />
              <button
                type="submit"
                className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium tw-ml-4"
              >
                Apply
              </button>
            </form>
          </div>

          <div className="tw-grid md:tw-grid-cols-5 tw-grid-rows-1 tw-text-xl tw-font-bold  tw-mt-4 md:tw-mx-16 tw-text-center token_grid ">
            <div>Date</div>
            <div className="tw-hidden md:tw-block">Time</div>
            <div>Action</div>
            <div>Gifted By</div>
            <div>
              Token
              <ExpandLessIcon
                className=" tw-cursor-pointer"
                onClick={() => {
                  assendHandler()
                }}
              />
              <ExpandLessIcon
                className=" tw-cursor-pointer tw-rotate-180"
                onClick={() => {
                  decendHandler()
                }}
              />
            </div>
          </div>

          <div className="tw-max-h-72 tw-overflow-y-auto">
            {tokenData?.map((item, index) => (
              <div
                className="tw-grid md:tw-grid-cols-5 tw-grid-rows-1  tw-bg-second-color tw-text-xl tw-font-bold  tw-mt-2 md:tw-mx-16 tw-text-center token_grid "
                key={index}
              >
                <div>{item.time.split("T")[0]}</div>
                <div className="tw-hidden md:tw-block">{item.time.split("T")[1].split(".")[0]}
                </div>
                <div>{act[item.givenFor]}</div>
                <div>{item.by.name}</div>
                <div>{item.tokenAmount}</div>
              </div>
            ))}
          </div>
        </div>
        {/* it's token history */}
        {/* Bank Details  */}

        {authContext.user.userType === "Model" && (
          <div className="tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-text-white tw-w-full tw-my-8 ">
            <div className="tw-col-span-1 tw-px-4">
              <h1 className=" tw-font-bold tw-text-center tw-my-4">
                Bank Details
              </h1>
              <form
                action=""
                method="post"
                className="tw-flex tw-flex-col tw-bg-second-color tw-p-4 tw-rounded-lg"
                onSubmit={bankDetailHandler}
              >
                <label htmlFor="accountHolder" className="tw-mt-3">
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
                      person: e.target.value,
                    }))
                  }
                  className="tw-bg-first-color tw-rounded-full tw-py-1 tw-px-2"
                />
                <label htmlFor="Bank-name" className="tw-mt-3">
                  BANK NAME
                </label>
                <input
                  type="text"
                  name="Bank-name"
                  id="Bank-name"
                  onInput={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      bankName: e.target.value,
                    }))
                  }
                  placeholder="Bank with Branch Name"
                  className="tw-bg-first-color tw-rounded-full tw-py-1 tw-px-2"
                />
                <label htmlFor="accountNumber" className="tw-mt-3">
                  Bank account number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  onInput={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  placeholder="Account Number"
                  id="accountNumber"
                  className="tw-bg-first-color tw-rounded-full tw-py-1 tw-px-2"
                />
                <label htmlFor="ifscCode" className="tw-mt-3">
                  IFSC CODE
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  id="ifscCode"
                  onInput={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      bankIfsc: e.target.value,
                    }))
                  }
                  placeholder="Bank Ifsc"
                  className="tw-bg-first-color tw-rounded-full tw-py-1 tw-px-2"
                />
                <label htmlFor="accountType" className="tw-mt-3">
                  Type of account
                </label>
                <select
                  name="accountType"
                  id="accountType"
                  className="tw-bg-first-color tw-rounded-full tw-py-1 tw-px-2"
                >
                  <option
                    value="saving"
                    onClick={() =>
                      setBankDetails((prev) => ({
                        ...prev,
                        accountType: "Saving",
                      }))
                    }
                  >
                    Saving
                  </option>
                  <option
                    value="current"
                    onClick={() =>
                      setBankDetails((prev) => ({
                        ...prev,
                        accountType: "Current",
                      }))
                    }
                  >
                    Current
                  </option>
                </select>

                <div className="tw-flex tw-mx-auto">
                  <button
                    type="submit"
                    className=" tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium  tw-mt-4"
                  >
                    Update
                  </button>
                </div>
              </form>
              <p className="response"></p>
            </div>
            <div className="tw-col-span-1 tw-px-4">
              <h1 className=" tw-font-bold tw-text-center tw-my-4">
                Widrawal Reuest
              </h1>
              <div className="tw-bg-second-color tw-p-4 tw-rounded-lg">
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
                    className="tw-bg-first-color tw-rounded-full tw-py-1 tw-px-2"
                  />
                </p>
                <button
                  type="submit"
                  className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium  "
                >
                  Claim token
                </button>
              </div>

              <div>
                <Banned />
              </div>
            </div>
          </div>
        )}
        {/* Bank Details  */}
      </div>
    )
  )
}

export default Settingprivacy
