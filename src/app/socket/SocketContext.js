import { createContext, useContext, useState } from "react"
import io from "../../socket/socket"

const SocketContext = createContext({
  socketInstance: null,
  isConnected: false,
  setSocketInstance: () => {},
  setIsConnected: () => {},
})

let socketSetup = false
export const SocketContextProvider = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  const initSocket = () => {
    debugger
    console.log("Initializing socket, status")
    const url = "http://192.168.1.104:8080"
    const socket = io.connect(url)
    console.log("Initial socket id 🔴🔴", socket.id)

    socket.on("connect", () => {
      localStorage.setItem("socketId", socket.id)
      const socketRooms =
        JSON.parse(sessionStorage.getItem("socket-rooms")) || []
      if (socketRooms.length > 0) {
        alert("put me in room")
        socket.emit("putting-me-in-these-rooms", socketRooms, (response) => {
          if (response.status === "ok") {
            setIsConnected(true)
          }
        })
      } else {
        /* if no rooms join beforehand */
        setIsConnected(true)
      }
    })

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected! due to >>>", reason)
      localStorage.removeItem("socketId")
      setIsConnected(false)
    })

    socket.on("connect_failed", () => {
      console.log("socket connected!")
    })

    socket.on("connect_error ", (err) => {
      alert("Error! from server " + err.message)
    })

    /* Global Listeners */
    io.globalListeners(socket)

    /* 👇👇 the localstorage is not read from hence no authContext is available hence have to move listners somewhere else
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
    } */
  }

  if (!socketSetup && typeof window !== "undefined") {
    initSocket()
    socketSetup = true
  }

  return (
    <SocketContext.Provider
      value={{
        socketInstance,
        isConnected,
        setSocketInstance,
        setIsConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  return useContext(SocketContext)
}
