import React, { useEffect, useState } from "react"
import CancelIcon from "@material-ui/icons/Cancel"
import useModalContext from "../../app/ModalContext"

function Token() {
  const [token, setToken] = useState("")
  const modalCtx = useModalContext()
  const [btnClick, setBtnClicked] = useState(false)

  useEffect(() => {
    fetch("url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    })
      .then((resp) => resp.json())
      .then((mesg) => console.log(mesg))
      .catch((err) => console.log(err))
  }, [btnClick])

  return (
    <div className="tw-w-96 tw-place-items-center tw-text-white tw-mx-auto">
      <div className="tw-flex tw-justify-between ">
        <div className="tw-mx-2 tw-text-lg tw-mb-4"> Tip to Model Name</div>
        <CancelIcon
          onClick={() => modalCtx.clearModalWithContent()}
          className="tw-cursor-pointer"
        />
      </div>
      <form className="tw-bg-second-color tw-justify-items-center tw-self-center tw-px-4 tw-leading-10 tw-py-4 ">
        <div className="tw-font-extrabold tw-text-xl tw-mb-">
          How many token would you like to tip
        </div>
        <div className="tw-flex tw-justify-between tw-my-2 ">
          <div className="tw-flex tw-place-items-center">
            <input
              type="radio"
              name="selected_token"
              id="Twenty"
              value="50"
              onClick={() => setToken(20)}
            />
            <label htmlFor="Twenty" className="tw-ml-2 ">
              20 <span>Tokens</span>
            </label>
          </div>
          <div className=" tw-px-2 tw-border-2">Tip the model 20 token</div>
        </div>
        {/*  */}
        <div className="tw-flex tw-justify-between tw-my-2 ">
          <div className="tw-flex tw-place-items-center">
            <input
              type="radio"
              name="selected_token"
              id="fifty"
              value="50"
              onClick={() => setToken(50)}
            />
            <label htmlFor="fifty" className="tw-ml-2 ">
              50 <span>Tokens</span>
            </label>
          </div>
          <div className=" tw-px-2 tw-border-2">Tip the model 50 token</div>
        </div>
        {/*  */}
        <div className="tw-flex tw-justify-between tw-my-2">
          <div className="tw-flex tw-place-items-center">
            <input
              type="radio"
              name="selected_token"
              id="hundred"
              value="100"
              onClick={() => setToken(100)}
            />
            <label htmlFor="hundred" className="tw-ml-2 ">
              100 <span>Tokens</span>
            </label>
          </div>
          <div className=" tw-px-2 tw-border-2">Tip the model 100 token</div>
        </div>
        {/*  */}
        <div className="tw-flex tw-justify-between tw-my-2">
          <div className="tw-flex tw-place-items-center">
            <input
              type="radio"
              name="selected_token"
              id="twohundred"
              value="200"
              onClick={() => setToken(200)}
            />
            <label htmlFor="twohundred" className="tw-ml-2 ">
              200 <span>Tokens</span>
            </label>
          </div>
          <div className=" tw-px-2 tw-border-2">Tip the model 200 token</div>
        </div>
        <div className="tw-flex tw-place-items-center tw-justify-between tw-my-2">
          <div className="tw-flex tw-place-items-center">
            <input
              type="radio"
              name="selected_token"
              id="twohundred"
              value={token}
              onClick={() => setToken(token)}
            />
            <label htmlFor="twohundred" className="tw-ml-2 ">
              Custom
            </label>
          </div>
          <input
            type="text"
            className="tw-rounded-full tw-w-48 tw-h-8 tw-bg-black tw-outline-none tw-px-2"
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
      </form>
      <div className="tw-mx-auto tw-mt-4">
        <button
          type="submit"
          className="tw-rounded-full tw-bg-green-color tw-px-4 tw-py-2"
          onClick={() => setBtnClicked((prev) => !prev)}
        >
          Buy Token
        </button>
      </div>
    </div>
  )
}

export default Token
