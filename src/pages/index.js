import Head from "next/head"
import Sidebar from "../components/Mainpage/Sidebar"
import Boxgroup from "../components/Mainpage/Boxgroup"
import { useState, useEffect } from "react"
import { useAuthContext, useAuthUpdateContext } from "../app/AuthContext"
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
  const socketContext = useSocketContext()

  useEffect(() => {
    /* client should not be connected to any public room  while on index page */
    if (JSON.parse(sessionStorage.getItem("socket-rooms"))) {
      try {
        const socket = io.getSocket()
        const socketRooms = JSON.parse(sessionStorage.getItem("socket-rooms"))
        if (socketRooms?.length > 0) {
          socket.emit(
            "take-me-out-of-these-rooms",
            [...socketRooms.filter((room) => room.endsWith("-public"))],
            (response) => {
              if (response.status === "ok") {
                /* no action needed room will be removed automatically */
              }
            }
          )
        }
      } catch (error) {
        console.log("Client not in any room!")
      }
    }
  }, [])

  const [boxGroupsData, setBoxGroupData] = useState([
    // {
    //   title: "This just show the layout",
    //   data: data.slice(0, 7),
    // },
    // {
    //   title: "Check the layout",
    //   data: data.slice(0, 7),
    // },
  ])

  useEffect(() => {
    // fetch all live streams
    //debugger
    if (ctx.loadedFromLocalStorage) {
      fetch("/api/website/compose-ui/get-ranking-online-models")
        .then((res) => res.json())
        .then((data) => {
          setBoxGroupData((prev) => {
            if (ctx.user.userType !== "Model") {
              return [
                ...prev,
                {
                  title: "Live Streaming Model",
                  data: data.resultDocs.map((model) => ({
                    ...model,
                    relatedUserId: model._id,
                  })),
                },
              ]
            } else {
              return [
                ...prev,
                {
                  title: "Live Streaming Model",
                  data: data.resultDocs
                    .filter((model) => model._id !== ctx.relatedUserId)
                    .map((model) => ({
                      ...model,
                      relatedUserId: model._id,
                    })),
                },
              ]
            }
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
          if (ctx?.relatedUserId !== socketData.modelId) {
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
          }
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
    <div className="tw-min-h-screen tw-max-w-screen-2xl tw-bg-first-color">
      <Head>
        <title>DreamGirl Live Online Video Chat</title>
        <link rel="icon" href="/DG_icon.jpg" />
      </Head>
      <div className="tw-h-20"></div>
      <div className="tw-flex  ">
        <Sidebar />
        <div className="">
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
    </div>
  )
}

export default Home
