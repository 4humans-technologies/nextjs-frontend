import Head from "next/head"
import Header from "../components/Mainpage/Header"
import SecondHeader from "../components/Mainpage/SecondHeader"
import Sidebar from "../components/Mainpage/Sidebar"
import Boxgroup from "../components/Mainpage/Boxgroup"
import { useState, useEffect } from "react"
// import Mainbox from "../components/Mainbox";
import Footer from "../components/Mainpage/Footer"
import { useAuthContext, useAuthUpdateContext } from "../app/AuthContext"
import useSetupSocket from "../socket/useSetupSocket"
import socket from "../socket/socket"
import Link from "next/link"
import io from "../socket/socket"

/**
 * just for development not for production 👇👇
 */
const data = Array(8)
  .fill("")
  .map((_empty) => ({
    _id: "615eaeea12a4fc1f2c4d29ea",
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

  useEffect(() => {
    /* client should not be connected to any public/private room  while on index page */
    if (JSON.parse(sessionStorage.getItem("socket-rooms"))) {
      try {
        const socket = io.getSocket()
        const socketRooms =
          JSON.parse(sessionStorage.getItem("socket-rooms")) || []
        const roomsToLeave = []
        socketRooms.forEach((room) => {
          if (room.includes("-public") || room.includes("-private")) {
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
                  rooms.filter((room) => room !== authCtx.streamRoom)
                )
              )
              authUpdateCtx.updateViewer({ streamRoom: null })
            }
          }
        )
      } catch (error) {
        console.log("Client not in any room!")
      }
    }
  }, [authUpdateCtx.updateViewer])

  const [boxGroupsData, setBoxGroupData] = useState([
    {
      title: "Test Webcams",
      data: data.slice(0, 7),
    },
    {
      title: "Category Two",
      data: data.slice(0, 7),
    },
    {
      title: "Category Three",
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
          //debugger
          const transformedData = data.resultDocs.map((model) => {
            return {
              ...model,
              age: new Date().getFullYear() - new Date(model.dob).getFullYear(),
              languages: model.languages.join(","),
              rootUserId: model.rootUser._id,
              userName: model.rootUser.username,
              userType: model.rootUser.userType,
              // currentStream: model.rootUser.currentStream || 1 /*🤔🤔 why did i put currentStream??  */
            }
          })
          setBoxGroupData((prev) => {
            return [
              ...prev,
              {
                title: "Online Models | Either onCall or onStream",
                data: transformedData,
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

  return (
    <div className="tw-min-h-screen">
      <Head>
        <title>DreamGirl Live Online Video Vhat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="tw-h-20"></div>
      <Header />
      {/* <SecondHeader /> */}
      <div className="tw-flex tw-flex-grow-1 tw-flex-shrink-0">
        <Sidebar />
        <div>
          {boxGroupsData.map((data, index) => {
            return (
              <Boxgroup
                groupTitle={data.title}
                data={data.data}
                key={`${index}_boxGroup_&^HJK`}
              />
            )
          })}
        </div>
      </div>
      <div className="tw-text-center tw-flex tw-items-center tw-justify-around">
        <button
          onClick={doRequest}
          className="tw-px-4 py-2 tw-bg-red-500 tw-text-xl tw-my-4 tw-text-white-color"
        >
          Do Request
        </button>
        <Link href="/rohit/goLive">
          <a className="tw-px-4 py-2 tw-bg-red-500 tw-text-xl tw-my-4 tw-text-white-color hover:tw-text-white-color">
            Go Live As A model
          </a>
        </Link>
      </div>
      <Footer />
    </div>
  )
}

export default Home
