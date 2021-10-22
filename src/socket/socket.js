import io from "socket.io-client"
let socketConnectionInstance
let pendingCalls
export default {
  connect: (url) => {
    /**
     * should the implementation differ for viewer and model
     */
    if (localStorage.getItem("pendingCalls")) {
      pendingCalls = JSON.parse(localStorage.getItem("pendingCalls"))
    } else {
      localStorage.setItem(
        "pendingCalls",
        JSON.stringify({ audioCall: {}, videoCall: {} })
      )
      pendingCalls = JSON.parse(localStorage.getItem("pendingCalls"))
    }
    //debugger
    socketConnectionInstance = io(url || "http://localhost:8080", {
      auth: {
        // token will be fetched from local storage
        token: localStorage.getItem("jwtToken") || "",
      },
      query: {
        // will get userType from localStorage
        // if nothing in local storage default to UnAuthedViewer
        // no worries if user provides wrong info, we have token we can validate
        userType:
          localStorage.getItem("userType") ||
          JSON.parse(localStorage.getItem("authContext"))?.userType ||
          "UnAuthedViewer",
        hasAudioCall:
          Object.keys(pendingCalls.audioCall).length > 0 ? true : false,
        hasVideoCall:
          Object.keys(pendingCalls.videoCall).length > 0 ? true : false,
        audioCall: JSON.stringify(pendingCalls.audioCall),
        videoCall: JSON.stringify(pendingCalls.videoCall),
      },
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

    // socket.onAny((eventName, ...args) => {
    //   alert(`${eventName} is fired`)
    // });

    socket.on("you-joined-a-room", (room) => {
      if (
        room.includes("-public") ||
        room.includes("-socket-room") ||
        room.includes("-private")
      ) {
        /* dont't join the self rooms 😎😎 */
        const prevRooms =
          JSON.parse(sessionStorage.getItem("socket-rooms")) || []
        if (!prevRooms.includes(room)) {
          /* add unique rooms only */
          sessionStorage.setItem(
            "socket-rooms",
            JSON.stringify([...prevRooms, room])
          )
        }
      }
    })

    socket.on("you-left-a-room", (roomToLeave) => {
      const prevRooms = JSON.parse(sessionStorage.getItem("socket-rooms")) || []
      const newRooms = prevRooms.filter((room) => room !== roomToLeave) || []
      sessionStorage.setItem("socket-rooms", JSON.stringify(newRooms))
    })

    socket.on("viewer-left", (data) => {
      alert("Viewer left")
      console.log(data.roomSize)
    })

    socket.on("viewer-joined", (data) => {
      alert(data.message)
      console.log(data.roomSize)
    })
    // "model-public-message"
  },
  modelListners: (socket) => { },
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
  unAuthedViewerListners: (socket) => { },
}
