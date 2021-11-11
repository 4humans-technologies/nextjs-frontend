import { useEffect } from "react"
import io from "../socket/socket"
import { useSocketContext } from "../app/socket/SocketContext"

function useSetupSocket(url) {
  const ctx = useSocketContext()
  useEffect(() => {
    if (!url) {
      if (window.location.hostname.includes("dreamgirllive")) {
        url = "https://backend.dreamgirllive.com"
      } else {
        url = imageDomainURL
      }
    }
    const socket = io.connect(url)
    socket.on("connect_failed", () => {
      console.log("socket connect failed")
    })

    socket.on("connect_error ", (err) => {
      alert("Error! from server " + err.message)
    })

    socket.on("connect", () => {
      /* on connection 😀😀😀 */
      console.log("socket connected!")
      localStorage.setItem("socketId", socket.id)
      ctx.setIsConnected(true)
      // sessionStorage.setItem("socket:now-connected", "true")
      // const socketConnectEvt = new CustomEvent("socket:now-connected", {
      //   socketId: socket.id,
      // })
      // document.dispatchEvent(socketConnectEvt)
    })

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected! due to >>>", reason)
      localStorage.removeItem("socketId")
      ctx.setIsConnected(false)
    })

    /* Global Listeners */
    io.globalListeners(socket)

    if (JSON.parse(localStorage.getItem("authContext")).userType === "Model") {
      // io.modelListners
    } else if (
      JSON.parse(localStorage.getItem("authContext")).userType === "Viewer"
    ) {
      // io.viewerListners()
    } else if (
      JSON.parse(localStorage.getItem("authContext")).userType ===
      ("UnAuthedViewer" || "unAuthedViewer")
    ) {
      // io.unAuthedViewerListners()
    }
  }, [])
}

export default useSetupSocket
