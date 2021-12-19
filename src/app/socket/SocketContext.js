import { createContext, useContext, useState } from "react"
import io from "../../socket/socket"
import { toast } from "react-toastify"

const SocketContext = createContext({
  socketInstance: null,
  isConnected: false,
  setSocketInstance: () => {},
  setIsConnected: () => {},
  socketSetupDone: false,
  setSocketSetupDone: () => {},
})

let socketSetup = false
export const SocketContextProvider = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null)
  /**
   * realtime knowledge of is socket connected or not will come when,
   * when i will need to stock message to send when reconnection happens
   */
  const [isConnected, setIsConnected] = useState(false)
  const [socketSetupDone, setSocketSetupDone] = useState(false)

  const initSocket = () => {
    const socket = io.connect(process.env.NEXT_PUBLIC_BACKEND_URL)

    socket.on("connect", () => {
      if (!socketSetupDone) {
        setSocketSetupDone(true)
      }
      localStorage.setItem("socketId", socket.id)
      const socketRooms =
        JSON.parse(sessionStorage.getItem("socket-rooms")) || []
      if (socketRooms.length > 0) {
        socket.emit("putting-me-in-these-rooms", socketRooms, (response) => {
          if (response.status === "ok") {
            // setIsConnected(true)
          }
        })
      } else {
        /* if no rooms join beforehand, directly connect */
        sessionStorage.setItem("socket-rooms", "[]")
        // setIsConnected(true)
      }
    })

    socket.on("reconnect", (attempt) => {
      /* connect event is also fired when reconnect is fired hance
       *  getting my work done from the connect event.
       */
      console.log(`reconnect attempt number ${attempt}`)
    })

    socket.on("disconnect", (reason) => {
      if (process.env.RUN_ENV === "local") {
        toast.error(`Socket disconnected Reason : ${reason}`)
      } else {
        toast.error(`Something is not right a network error has occurred`)
      }
      localStorage.removeItem("socketId")
      if (reason === "io server disconnect") {
        /* if server manually disconnected */
        io.connect()
      }
    })

    socket.on("connect_error ", (err) => {
      alert("Could not connect to server... " + err.message)
      setTimeout(() => {
        io.connect()
      }, 2500)
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
        socketSetupDone,
        setSocketSetupDone,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  return useContext(SocketContext)
}
