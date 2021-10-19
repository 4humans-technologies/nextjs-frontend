import React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import { useEffect } from "react"
import useFetchInterceptor from "../../hooks/useFetchInterceptor"
import Videoshowcontroller from "../../components/model/VideoStreaming/Videoshowcontroller"
import Showcontroler from "../../components/model/VideoStreaming/Showcontroler"

const LiveComponent = dynamic(() => import("../../components/model/Live"), {
  ssr: false,
})

let fetchIntercepted = null
function GoLive() {
  const ctx = useAuthContext()
  useFetchInterceptor(fetchIntercepted)
  fetchIntercepted = true
  const updateCtx = useAuthUpdateContext()
  const router = useRouter()

  useEffect(() => {
    // eslint-disable-next-line no-//debugger
    //debugger
    if (ctx.loadedFromLocalStorage) {
      if (ctx.isLoggedIn === false && ctx.user.userType !== "Model") {
        updateCtx.updateViewer({ loginSuccessUrl: window.location.pathname })
        return router.replace("/auth/login")
      }
    }
  }, [ctx.loadedFromLocalStorage, ctx.isLoggedIn, ctx.user.userType])
  return ctx.isLoggedIn === true && ctx.user.userType === "Model" ? (
    <div>
      <LiveComponent />
    </div>
  ) : (
    <div className="tw-grid tw-place-items-center tw-min-h-screen">
      <h1 className="tw-text-lg tw-font-medium tw-font-mono">
        Redirecting To The Login Screen...
      </h1>
    </div>
  )
}

export default GoLive
