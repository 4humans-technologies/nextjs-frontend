import React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import { useEffect } from "react"


const LiveComponent = dynamic(() => import("../../components/model/Live"), {
  ssr: false,
})

function GoLive() {
  const ctx = useAuthContext()
  const updateCtx = useAuthUpdateContext()
  const router = useRouter()

  useEffect(() => {
    //debugger
    if (ctx.loadedFromLocalStorage) {
      if (ctx.isLoggedIn === false && ctx.user.userType !== "Model") {
        updateCtx.updateViewer({ loginSuccessUrl: window.location.pathname })
        return router.replace("/auth/login")
      }
    }
  }, [ctx.loadedFromLocalStorage, ctx.isLoggedIn, ctx.user.userType])
  return ctx.isLoggedIn === true && ctx.user.userType === "Model" ? (
    <div className="tw-min-h-screen tw-bg-first-color">
      <LiveComponent />
    </div>
  ) : (
    <div className="tw-grid tw-place-items-center tw-min-h-screen">
      <h1 className="tw-text-lg tw-font-medium text-center">
        You Are Not LoggedIn As Model, Redirecting To The Login Screen...
      </h1>
    </div>
  )
}

export default GoLive
