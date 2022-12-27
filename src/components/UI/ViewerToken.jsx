import React, { useCallback, useEffect, useState } from "react"
import { useAuthUpdateContext, useAuthContext } from "../../app/AuthContext"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import Link from "next/link"
import useModalContext from "../../app/ModalContext"
import Package from "../Payment/Package"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
function ViewerToken() {
  const [buyStatus, setBuyStatus] = useState({
    message: null,
    requestedToBuy: false,
    buySuccess: false,
  })

  const [packages, setPackages] = useState([])
  const router = useRouter()

  const authUpdateCtx = useAuthUpdateContext()
  const authCtx = useAuthContext()
  const modalCtx = useModalContext()

  if (modalCtx.isOpen) {
    modalCtx.hideModal()
  }

  const handleRedeemRequest = () => {}

  useEffect(async () => {
    // fetch packages
    if (!authCtx.isLoggedIn) {
      router.push("/auth/login")
      return toast.error("Please login to Purchase coins!")
    }
    const packagesResponse = await fetch("/api/website/package")
    const allActivePackages = await packagesResponse.json()
    setPackages(allActivePackages.data)
  }, [authCtx.isLoggedIn])

  const initiateBuyPackage = useCallback(async (packageData) => {
    const { _id, discountedAmountINR } = packageData
    const depositResponse = await fetch(
      "/api/website/paymentGateway/astropay/deposit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: discountedAmountINR,
          packageId: _id,
          currency: "INR",
          country: "IN",
        }),
      }
    )
    const deposit = await depositResponse.json()

    if (!deposit || !deposit?.data) {
      return toast.error("Your purchase order was not created, pls try again")
    }

    window.location.assign(deposit.data.url)
  }, [])

  return (
    <div>
      <audio
        preload="true"
        src="/audio/money-debit.mp3"
        id="money-debit-audio"
      ></audio>
      <div className="tw-text-white tw-bg-first-color tw-h-screen tw-pt-4">
        <div className="tw-text-center tw-h-5/6 md:tw-mx-auto tw-w-full tw-px-2 md:tw-w-8/12 xl:tw-w-5/12 tw-bg-second-color tw-rounded-md tw-overflow-y-scroll">
          <p className="tw-font-light tw-text-gray-200 tw-pt-3 tw-px-2">
            Please select from the packages below, you want to buy
          </p>

          <div className="tw-pt-2 tw-pb-4">
            {packages.map((coinPackage) => {
              return (
                <Package
                  initiateBuyPackage={initiateBuyPackage}
                  {...coinPackage}
                />
              )
            })}
          </div>
        </div>
        <div className="tw-py-2 tw-text-center">
          <p>Our Payments Partner</p>
          <div className="tw-my-2">
            <img src="/astropay.png" className="tw-w-28 tw-mx-auto" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewerToken
