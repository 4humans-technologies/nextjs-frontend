import Head from "next/head"
import Header from "../components/Mainpage/Header"
import Sidebar from "../components/Mainpage/Sidebar"
import Boxgroup from "../components/Mainpage/Boxgroup"
import { useState, useEffect } from "react"
import Footer from "../components/Mainpage/Footer"
import { useAuthContext, useAuthUpdateContext } from "../app/AuthContext"
import socket from "../socket/socket"
import Link from "next/link"
import io from "../socket/socket"
import { useSocketContext } from "../app/socket/SocketContext"

/**
 * just for development not for production 👇👇
 */
const data = Array(8)
  .fill("")
  .map((_empty) => ({
    relatedUserId: "615eaeea12a4fc1f2c4d29ea",
    onCall: [true, false][Math.floor(Math.random() * 10) % 2],
    isStreaming: [true, false][Math.floor(Math.random() * 10) % 2],
    name: "Vikas Kumawat",
    age: 22,
    gender: "Male",
    dob: 1999,
    languages: ["Marwadi"],
    rating: 5,
    profileImage:
      "https://png.pngtree.com/png-clipart/20190614/original/pngtree-female-avatar-vector-icon-png-image_3725439.jpg",
    rootUserId: "615eaeea12a4fc1f2c4d29ec",
    userName: "rohitkumar9133@gmail.com",
    userType: "Model",
  }))

const Home = () => {
  console.log("rendering home")
  const ctx = useAuthContext()
  const authUpdateCtx = useAuthUpdateContext()
  const socketContext = useSocketContext()

  useEffect(() => {
    /* client should not be connected to any public/private room  while on index page */
    if (JSON.parse(sessionStorage.getItem("socket-rooms"))) {
      try {
        const socket = io.getSocket()
        const socketRooms =
          JSON.parse(sessionStorage.getItem("socket-rooms")) || []
        const roomsToLeave = []
        if (socketRooms.length > 0) {
          socketRooms.forEach((room) => {
            if (room.includes("-public")) {
              roomsToLeave.push(room)
            }
          })
          socket.emit(
            "take-me-out-of-these-rooms",
            [...roomsToLeave],
            (response) => {
              if (response.status === "ok") {
                /* remove this room from session storage also */
                const rooms =
                  JSON.parse(sessionStorage.getItem("socket-rooms")) || []
                sessionStorage.setItem(
                  "socket-rooms",
                  JSON.stringify(
                    rooms.filter((room) => !roomsToLeave.includes(room))
                  )
                )
                authUpdateCtx.updateViewer({ streamRoom: null })
              }
            }
          )
        }
      } catch (error) {
        console.log("Client not in any room!")
      }
    }
  }, [authUpdateCtx.updateViewer])

  const [boxGroupsData, setBoxGroupData] = useState([
    {
      title: "This just show the layout",
      data: data.slice(0, 7),
    },
    {
      title: "Check the layout",
      data: data.slice(0, 7),
    },
  ])

  const doRequest = () => {
    //debugger
    const id = socket.getSocketId()
    console.log(`${socket.getSocketId()}`)
    fetch("/api/website/compose-ui/get-ranking-online-models")
      .then((res) => res.json())
      .then((data) => {
        console.log("request completed!")
      })
  }

  useEffect(() => {
    // fetch all live streams
    //debugger
    if (ctx.loadedFromLocalStorage) {
      fetch("/api/website/compose-ui/get-ranking-online-models")
        .then((res) => res.json())
        .then((data) => {
          setBoxGroupData((prev) => {
            return [
              ...prev,
              {
                title: "Online Models | Either onCall or onStream",
                data: data.resultDocs.map((model) => ({
                  ...model,
                  relatedUserId: model._id,
                })),
              },
            ]
          })
        })
        .catch((error) => {
          console.error(error)
          alert(error)
        })
    }
  }, [ctx.loadedFromLocalStorage])

  useEffect(() => {
    if (socketContext.setSocketSetupDone) {
      const socket = io.getSocket()
      if (!socket.hasListeners("new-model-started-stream")) {
        socket.on("new-model-started-stream", (socketData) => {
          // alert("New Model Started Streaming..." + JSON.stringify(socketData))
          debugger
          setBoxGroupData((prev) => {
            if (
              prev[prev.length - 1].data
                .map((stream) => stream.relatedUserId)
                .includes(socketData.modelId)
            ) {
              return prev
            }

            const prevLastPopped = prev.pop()
            return [
              ...prev,
              {
                ...prevLastPopped,
                data: [
                  ...prevLastPopped.data,
                  {
                    relatedUserId: socketData.modelId,
                    profileImage: socketData.profileImage,
                    isStreaming: true,
                  },
                ],
              },
            ]
          })
        })
      }
      if (!socket.hasListeners("delete-stream-room")) {
        socket.on("delete-stream-room", (socketData) => {
          // alert("Model Ended Streaming..." + JSON.stringify(socketData))
          debugger
          setBoxGroupData((prev) => {
            const prevLastPopped = prev.pop()
            const poppedModelDataList = prevLastPopped.data.filter(
              (stream) => stream.relatedUserId !== socketData.modelId
            )
            return [
              ...prev,
              {
                ...prevLastPopped,
                data: [...poppedModelDataList],
              },
            ]
          })
        })
      }
    }
  }, [socketContext.setSocketSetupDone])

  useEffect(() => {
    return () => {
      if (socketContext.setSocketSetupDone) {
        const socket = io.getSocket()
        if (socket.hasListeners("delete-stream-room")) {
          socket.off("delete-stream-room")
        }
        if (socket.hasListeners("new-model-started-stream")) {
          socket.off("new-model-started-stream")
        }
      }
    }
  }, [socketContext.setSocketSetupDone])

  return (
    <div className="tw-min-h-screen tw-max-w-screen-2xl">
      <Head>
        <title>DreamGirl Live Online Video Vhat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="tw-h-20"></div>
      <Header />
      <div className="tw-flex tw-w-screen tw-flex-grow">
        <Sidebar />
        <div>
          {boxGroupsData.map((data, index) => {
            return (
              <Boxgroup
                parent={"index"}
                groupTitle={data.title}
                data={data.data}
                key={`${index}_boxGroup_&^HJK`}
              />
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
