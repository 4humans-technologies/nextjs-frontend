import io from "socket.io-client"
let socketConnectionInstance
import { toast } from "react-toastify"

export default {
  connect: (url) => {
    if (!url) {
      url = process.env.NEXT_PUBLIC_BACKEND_URL
    }
    socketConnectionInstance = io(url, {
      auth: {
        token: localStorage.getItem("jwtToken") || null,
      },
      transports: ["websocket"],
      upgrade: false,
      query: {
        // will get userType from localStorage
        // if nothing in local storage default to UnAuthedViewer
        // no worries if user provides wrong info, we have token we can validate
        userType:
          localStorage.getItem("userType") ||
          JSON.parse(localStorage.getItem("authContext"))?.userType ||
          "UnAuthedViewer",
      },
      reconnection: true,
    })
    return socketConnectionInstance
  },
  getSocket: () => {
    // if (!socketConnectionInstance) {
    //   throw Error("Socket is not initialized!");
    // }
    return socketConnectionInstance
  },
  getSocketId: () => {
    if (!socketConnectionInstance) {
      // throw Error("Socket is not initialized!")
      // return "socket not init";
      return
    }
    return socketConnectionInstance.id
  },

  globalListeners: (socket) => {
    socket.on("you-joined-a-room", (room) => {
      /* dont't join the self rooms 😎😎 */
      let prevRooms = JSON.parse(sessionStorage.getItem("socket-rooms")) || []
      if (room.endsWith("-public")) {
        /* remove previous public room before joining new public room */
        prevRooms = prevRooms.filter((room) => !room.endsWith("-public"))

        /* add unique rooms only */
        if (!prevRooms.includes(room)) {
          sessionStorage.setItem(
            "socket-rooms",
            JSON.stringify([...prevRooms, room])
          )
          console.log("added in session room >> ", room)
        }
      } else if (room.endsWith("-private")) {
        /* remove previous private room */
        prevRooms = prevRooms.filter((room) => !room.endsWith("-private"))

        /* add unique rooms only */
        if (!prevRooms.includes(room)) {
          sessionStorage.setItem(
            "socket-rooms",
            JSON.stringify([...prevRooms, room])
          )
          console.log("added in session room >> ", room)
        }
      }
    })

    socket.on("you-left-a-room", (roomToLeave) => {
      const prevRooms = JSON.parse(sessionStorage.getItem("socket-rooms")) || []
      if (process.env.RUN_ENV === "local") {
        toast.warn(`left a room : ${roomToLeave}`, {
          autoClose: 2000,
        })
      }
      if (roomToLeave.endsWith("-public")) {
        const newRooms = prevRooms.filter((room) => room !== roomToLeave)
        sessionStorage.setItem("socket-rooms", JSON.stringify(newRooms))
      } else if (roomToLeave.endsWith("-private")) {
        const newRooms = prevRooms.filter((room) => room !== roomToLeave)
        sessionStorage.setItem("socket-rooms", JSON.stringify(newRooms))
      }
      console.log("left room >> ", roomToLeave)
    })
  },
  modelListners: (socket) => {},

  viewerListners: (socket) => {},
  unAuthedViewerListners: (socket) => {},
}
