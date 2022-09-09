import React from "react"
import { useAuthContext } from "../../../app/AuthContext"
import Link from "next/link"
import { useRouter } from "next/router"
import useModalContext from "../../../app/ModalContext"

function DocumentUplode() {
  const authContext = useAuthContext()
  const modelContext = useModalContext()
  const router = useRouter()
  return (
    <div className="tw-mx-auto tw-text-white-color tw-px-3">
      <div className="tw-text-center tw-mb-6">
        <img
          src="./thank-you.png"
          alt=""
          className="tw-w-48 tw-h-48 tw-mx-auto"
        />
      </div>
      <h1 className="tw-text-white tw-text-center">
        <span className="tw-text-lg">{`Thanks  ${authContext.user.user.relatedUser.name}, for registering  With Tuktuklive, we will soon contact you for verification purposes, Have a nice day!`}</span>
      </h1>
      <div className="tw-flex  tw-justify-center">
        <button
          className="tw-rounded-full tw-bg-green-color tw-px-4 tw-py-2 tw-my-4 tw-cursor-pointer "
          onClick={() => {
            router.replace("/")
            modelContext.hideModal()
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export default DocumentUplode
