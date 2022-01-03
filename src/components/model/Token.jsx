import React, { useCallback, useEffect, useState } from "react"
import CancelIcon from "@material-ui/icons/Cancel"
import useModalContext from "../../app/ModalContext"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import io from "../../socket/socket"
import { useSocketContext } from "../../app/socket/SocketContext"

function Token() {
  const [token, setToken] = useState("")
  const modalCtx = useModalContext()
  const authContext = useAuthContext()
  const authUpdateCtx = useAuthUpdateContext()
  const [isExcess, setIsExess] = useState(false)

  const handleBuyToken = () => {
    if (!JSON.parse(sessionStorage.getItem("socket-rooms"))) {
      alert(
        "Please reload your connection to the server was closed, due to in-activity"
      )
    }
    fetch("/api/website/stream/process-token-gift", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modelId: window.location.pathname.split("/").reverse()[0],
        tokenAmount: token,
        socketData: {
          chatType: "coin-superchat-public",
          room: JSON.parse(sessionStorage.getItem("socket-rooms")).filter(
            (room) => room.includes("-public")
          )[0],
          amountGiven: token,
          username: `${authContext.user.user.username} 👑`,
          walletCoins: authContext.user.user.relatedUser.wallet.currentAmount,
          message: `${authContext.user.user.username} 👑 gifted ${token} coins`,
        },
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        debugger
        // alert(data.message)
        // update the authCtx & localstorage with new wallet amount
        modalCtx.hideModal()
        authUpdateCtx.updateWallet(token, "dec")
      })
      .catch((err) => console.log(err))
  }

  const handleAmountInput = (amount) => {
    if (amount > authContext.user.user.relatedUser.wallet.currentAmount) {
      // error
      setIsExess(true)
    } else {
      setToken(amount)
      if (isExcess) {
        setIsExess(false)
      }
    }
  }

  return (
    <div className="md:tw-w-96  tw-w-full tw-place-items-center tw-text-white md:tw-mx-auto">
      <div className="tw-flex tw-justify-between ">
        <div className="tw-mx-2 tw-text-lg tw-mb-4"> Tip to Model Name</div>
        <CancelIcon
          onClick={() => modalCtx.clearModalWithContent()}
          className="tw-cursor-pointer"
        />
      </div>
      <section className="tw-bg-first-color tw-justify-items-center tw-self-center tw-px-8 tw-leading-10 tw-py-4 tw-rounded">
        <div className="tw-font-medium tw-text-xl tw-mb-4">
          Enter the amount you want to tip
        </div>
        <div
          className={`tw-flex tw-justify-between tw-my-2 tw-flex-1 ${
            token == "20" ? "tw-text-green-400" : null
          }`}
        >
          <div className="tw-flex tw-items-center tw-flex-grow">
            <input
              type="radio"
              name="selected_token"
              id="Twenty"
              value="50"
              onClick={() => handleAmountInput(20)}
            />
            <label htmlFor="Twenty" className="tw-ml-2 tw-flex">
              20 <span className="tw-ml-1">Coins</span>
            </label>
          </div>
          <div
            className={`tw-px-2 tw-border-2 tw-flex-grow ${
              token == "20" ? "tw-border-green-400" : null
            }`}
          >
            <p className="tw-hidden md:tw-block">Tip the model 20 coins</p>
            <p className="md:tw-hidden tw-block">Tip 20 coins</p>
          </div>
        </div>
        {/*  */}
        <div
          className={`tw-flex tw-justify-between tw-my-2 ${
            token == 50 ? "tw-text-green-400" : null
          }`}
        >
          <div className="tw-flex tw-place-items-center tw-flex-grow">
            <input
              type="radio"
              name="selected_token"
              id="fifty"
              value="50"
              onClick={() => handleAmountInput(50)}
            />
            <label htmlFor="fifty" className="tw-ml-2 ">
              50 <span>Coins</span>
            </label>
          </div>
          <div
            className={`tw-px-2 tw-border-2 tw-flex-grow ${
              token == "50" ? "tw-border-green-400" : null
            }`}
          >
            <p className="tw-hidden md:tw-block">Tip the model 50 coins</p>
            <p className="md:tw-hidden tw-block">Tip 50 coins</p>
          </div>
        </div>
        {/*  */}
        <div
          className={`tw-flex tw-justify-between tw-my-2 ${
            token == 100 ? "tw-text-green-400" : null
          }`}
        >
          <div className="tw-flex tw-place-items-center tw-flex-grow">
            <input
              type="radio"
              name="selected_token"
              id="hundred"
              value="100"
              onClick={() => handleAmountInput(100)}
            />
            <label htmlFor="hundred" className="tw-ml-2 ">
              100 <span>Coins</span>
            </label>
          </div>
          <div
            className={`tw-px-2 tw-border-2 tw-flex-grow ${
              token == "100" ? "tw-border-green-400" : null
            }`}
          >
            <p className="tw-hidden md:tw-block"> Tip the model 100 coins</p>
            <p className="md:tw-hidden tw-block">Tip 100 coins</p>
          </div>
        </div>
        {/*  */}
        <div
          className={`tw-flex tw-justify-between tw-my-2  ${
            token == 200 ? "tw-text-green-400" : null
          }`}
        >
          <div className="tw-flex tw-place-items-center tw-flex-grow">
            <input
              type="radio"
              name="selected_token"
              id="twohundred"
              value="200"
              onClick={() => handleAmountInput(200)}
            />
            <label htmlFor="twohundred" className="tw-ml-2 ">
              200 <span>Coins</span>
            </label>
          </div>
          <div
            className={`tw-px-2 tw-border-2 tw-flex-grow ${
              token == "200" ? "tw-border-green-400" : null
            }`}
          >
            <p className="tw-hidden md:tw-block"> Tip the model 200 coins</p>
            <p className="md:tw-hidden tw-block">Tip 200 coins</p>
          </div>
        </div>
        <div
          className={`tw-flex tw-justify-between tw-mt-4 tw-mb-2 ${
            token > 200 ? "tw-text-green-500" : null
          }`}
        >
          <div className="tw-flex tw-place-items-center tw-flex-grow tw-items-center">
            <input
              type="radio"
              name="selected_token"
              id="twohundred"
              value={token}
            />
            <label htmlFor="twohundred" className="tw-ml-2 ">
              Custom
            </label>
          </div>
          <input
            type="text"
            className="tw-rounded tw-h-8 tw-outline-none tw-px-2 tw-flex-grow tw-bg-second-color tw-ml-4 tw-w-full"
            onChange={(e) => handleAmountInput(e.target.value)}
          />
        </div>
        {isExcess && (
          <div className="">
            <p className="tw-text-left tw-text-red-400 tw-text-sm">
              {`You have only ${authContext.user.user.relatedUser.wallet.currentAmount} coins in your wallet, Please enter an amount which is less than it 😀`}
            </p>
          </div>
        )}
        <div className="tw-mx-auto tw-mt-4">
          <button
            className="tw-rounded-full tw-bg-green-color tw-px-4 tw-inline-block tw-mr-3"
            onClick={() => handleBuyToken()}
          >
            Send Coins
          </button>
          <button className="tw-rounded-full tw-bg-dreamgirl-red tw-px-4 tw-inline-block tw-ml-3">
            Buy Coins
          </button>
        </div>
      </section>
    </div>
  )
}

export default Token
