import React from "react"
import { useAuthContext } from "../../../app/AuthContext"
import Link from "next/link"
import { useRouter } from "next/router"
import useModalContext from "../../../app/ModalContext"

function DocumentUplode() {
  const authContext = useAuthContext()
  const router = useRouter()
  const modalContext = useModalContext()
  return (
    <div className="tw-mx-auto tw-w-12 md:tw-w-8/12 lg:tw-w-2/6 tw-my-6 tw-rounded  tw-py-5 tw-text-center tw-text-white-color tw-border-2 tw-border-white-color">
      <h1 className="tw-text-white  ">
        <span className="tw-font-semibold tw-text-lg">{`Thanks  ${authContext.user.user.relatedUser.name} to register  With Dreamgril ,We will contect you soon `}</span>
      </h1>
      <div className="tw-flex  tw-justify-center">
        <button
          className="tw-rounded-full tw-bg-green-color tw-px-4 tw-py-2 tw-my-4 tw-cursor-pointer "
          onClick={() => {
            modalContext.hideModal()
            setTimeout(() => {
              router.replace("/")
            }, 200)
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export default DocumentUplode
