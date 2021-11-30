import { useEffect } from "react"
import { useAuthContext, useAuthUpdateContext } from "../app/AuthContext"
import { useSocketContext } from "../app/socket/SocketContext"
import useFetchInterceptor from "../hooks/useFetchInterceptor"
import io from "../socket/socket"

let fetchIntercepted = false
function TestComponent() {
  useFetchInterceptor(fetchIntercepted)
  fetchIntercepted = true

  const authCtx = useAuthContext()
  const authUpdateContext = useAuthUpdateContext()
  const socketCtx = useSocketContext()

  /* listen for wallet update events */
  useEffect(() => {
    if (socketCtx.socketSetupDone && authCtx.loadedFromLocalStorage) {
      if (authCtx.user.userType === "Model") {
        /* listen for wallet money add or remove events */
        const socket = io.getSocket()
        if (!socket.hasListeners("model-wallet-updated")) {
          socket.on("model-wallet-updated", (data) => {
            /* 
              data schema = {
                modelId:"",
                operation:"set" || "add" || "dec"
                amount:50
              }
            */
            authUpdateContext.updateWallet(data.amount, data.operation)
            document.getElementById("money-debit-audio").play()
          })
        }

        return () => {
          if (socket.hasListeners("model-wallet-updated")) {
            socket.off("model-wallet-updated")
          }
        }
      }
    }
  }, [
    socketCtx.socketSetupDone,
    authCtx.loadedFromLocalStorage,
    authUpdateContext.updateWallet,
    authCtx.user.userType,
  ])

  /**
   * listener for live count changes is in main layout
   */
  useEffect(() => {})
  return null
}

export default TestComponent
