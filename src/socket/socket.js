import io from "socket.io-client"
let socketConnectionInstance
import { imageDomainURL } from "../../dreamgirl.config"

export default {
  connect: (url) => {
    if (!url) {
      if (window.location.hostname.includes("dreamgirllive")) {
        url = "https://backend.dreamgirllive.com"
      } else {
        url = imageDomainURL
      }
    }

    socketConnectionInstance = io(imageDomainURL, {
      auth: {
        // token will be fetched from local storage
        token: localStorage.getItem("jwtToken") || null,
      },
      transports: ["websocket"],
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
      if (room.endsWith("-public") || room.endsWith("-private")) {
        /* dont't join the self rooms 😎😎 */
        let prevRooms = JSON.parse(sessionStorage.getItem("socket-rooms")) || []
        /* remove previous public room before joining new public room */
        prevRooms = prevRooms.filter((room) => !room.endsWith("-public"))
        if (!prevRooms.includes(room)) {
          /* add unique rooms only */
          sessionStorage.setItem(
            "socket-rooms",
            JSON.stringify([...prevRooms, room])
          )
          console.log("added in session room >> ", room)
        }
        console.log("joined room >> ", room)
      }
    })

    socket.on("you-left-a-room", (roomToLeave) => {
      const prevRooms = JSON.parse(sessionStorage.getItem("socket-rooms")) || []
      const newRooms = prevRooms.filter((room) => room !== roomToLeave) || []
      sessionStorage.setItem("socket-rooms", JSON.stringify(newRooms))
      console.log("left room >> ", roomToLeave)
    })
  },
  modelListners: (socket) => {},

  viewerListners: (socket) => {
    socket.on("model-audio-calling", (data) => {
      alert(data.message)
      console.log(data.roomSize)
    })

    socket.on("model-video-calling", (data) => {
      alert(data.message)
      console.log(data.roomSize)
    })

    socket.on("model-accepted-video-call", (data) => {
      alert(data.message)
      console.log(data.roomSize)
    })

    socket.on("model-accepted-audio-call", (data) => {
      alert(data.message)
      console.log(data.roomSize)
    })
    socket.on("model-declined-video-call", (data) => {
      alert(data.message)
      console.log(data.roomSize)
    })
    socket.on("model-declined-audio-call", (data) => {
      alert(data.message)
      console.log(data.roomSize)
    })
  },
  unAuthedViewerListners: (socket) => {},
}
