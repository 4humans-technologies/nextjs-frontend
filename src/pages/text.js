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
  return (
    <>
      <audio
        preload="true"
        src="/audio/call-request.mp3"
        id="call-request-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/private-message.mp3"
        id="private-message-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/superchat-2.mp3"
        id="superchat-2-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/superchat.mp3"
        id="superchat-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/money-debit.mp3"
        id="money-debit-audio"
      ></audio>
      <audio
        preload="true"
        src="/audio/call-end.mp3"
        id="call-end-audio"
      ></audio>
    </>
  )
}

export default TestComponent
