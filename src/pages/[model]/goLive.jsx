import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext";
import { useEffect } from "react";
import useFetchInterceptor from "../../hooks/useFetchInterceptor";

const LiveComponent = dynamic(
  () => import("../../components/model/Live"),
  { ssr: false }
)

function GoLive() {
  useFetchInterceptor()
  const ctx = useAuthContext();
  const updateCtx = useAuthUpdateContext()
  const router = useRouter()

  useEffect(() => {
    // eslint-disable-next-line no-debugger
    debugger
    if (ctx.loadedFromLocalStorage) {
      if ((ctx.isLoggedIn === false && ctx.user.userType !== "Model")) {
        updateCtx.updateViewer({ loginSuccessUrl: window.location.pathname })
        return router.push("/auth/login")
      }
    }
  }, [ctx.loadedFromLocalStorage,  ctx.isLoggedIn, ctx.user.userType])
  return (
    (ctx.isLoggedIn === true && ctx.user.userType === "Model") ? <LiveComponent /> : <h1>Should not reach here</h1>
  );
}

export default GoLive;
