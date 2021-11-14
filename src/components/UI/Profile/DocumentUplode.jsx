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
    <div className="tw-w-96 tw-place-items-center tw-text-white tw-mx-auto">
      <h1 className="tw-text-white tw-w-32  ">
        <span className="tw-flex">
          <span className="tw-flex">{`Thanks  ${authContext.user.user.relatedUser.name} to register  With Dreamgril ,We will contect you soon `}</span>
        </span>
      </h1>
      <div className="tw-flex tw-justify-between">
        <button
          className="tw-rounded-full tw-bg-green-color tw-px-4 tw-py-2 tw-my-4 tw-cursor-pointer "
          onClick={() => {
            modalContext.hideModal()
            setTimeout(() => {
              router.replace("/")
            }, 2000)
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export default DocumentUplode
