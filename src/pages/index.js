import Head from "next/head"
import Sidebar from "../components/Mainpage/Sidebar"
import Boxgroup from "../components/Mainpage/Boxgroup"
import { useState, useEffect } from "react"
import { useAuthContext, useAuthUpdateContext } from "../app/AuthContext"
import io from "../socket/socket"
import { useSocketContext } from "../app/socket/SocketContext"

const Home = () => {
  console.log("rendering home")
  const ctx = useAuthContext()
  const socketContext = useSocketContext()

  const [boxGroupsData, setBoxGroupData] = useState([])

  useEffect(() => {
    // fetch all live streams
    //debugger
    if (ctx.loadedFromLocalStorage) {
      fetch("/api/website/compose-ui/get-ranking-online-models")
        .then((res) => res.json())
        .then((data) => {
          const renderLiveModels = (data) => {
            setBoxGroupData((prev) => {
              if (ctx.user.userType !== "Model") {
                return [
                  ...prev,
                  {
                    title: "Live Streaming Model",
                    data: data.map((model) => ({
                      ...model,
                      relatedUserId: model._id,
                    })),
                  },
                ]
              } else {
                /**
                 * hide his own card from landing page
                 */
                return [
                  ...prev,
                  {
                    title: "Live Streaming Model",
                    data: data
                      .filter((model) => model._id !== ctx.relatedUserId)
                      .map((model) => ({
                        ...model,
                        relatedUserId: model._id,
                      })),
                  },
                ]
              }
            })
          }

          if (
            !localStorage.getItem("geoLocation") ||
            JSON.parse(localStorage.getItem("geoLocation") || "{}")
              ?.lastUpdated <
              Date.now() - 86400000
          ) {
            fetch("/api/website/get-geo-location")
              .then((res) => res.json())
              .then((location) => {
                localStorage.setItem(
                  "geoLocation",
                  JSON.stringify({
                    regionName: location.regionName,
                    lastUpdated: Date.now(),
                  })
                )
                data = data.resultDocs.filter((model) => {
                  return !model.bannedStates.includes(location.regionName)
                })
                renderLiveModels(data)
              })
              .catch((err) => {})
          } else {
            const myRegion = JSON.parse(
              localStorage.getItem("geoLocation")
            ).regionName

            data = data.resultDocs.filter((model) => {
              return !model.bannedStates.includes(myRegion)
            })
            renderLiveModels(data)
          }
        })
        .catch((error) => {
          console.error(error)
          alert(error)
        })
    }
  }, [ctx.loadedFromLocalStorage])

  useEffect(() => {
    if (socketContext.socketSetupDone) {
      const socket = io.getSocket()
      let newModelHandler = (socketData) => {
        /**
         * check if client in banned region
         */
        const myRegion = JSON.parse(
          localStorage.getItem("geoLocation")
        ).regionName

        if (socketData.bannedStates.includes(myRegion)) {
          return
        }

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
      }
      socket.on("new-model-started-stream", newModelHandler)
      let modelDeleteHandler = (socketData) => {
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
      }
      socket.on("delete-stream-room", modelDeleteHandler)
      return () => {
        if (socket.hasListeners("delete-stream-room") && modelDeleteHandler) {
          socket.off("delete-stream-room", modelDeleteHandler)
        }
        if (
          socket.hasListeners("new-model-started-stream") &&
          newModelHandler
        ) {
          socket.off("new-model-started-stream", newModelHandler)
        }
      }
    }
  }, [socketContext.socketSetupDone])

  return (
    <div className="tw-min-h-screen tw-bg-first-color">
      <Head>
        <title>DreamGirl Live Online Video Chat</title>
        <link rel="icon" href="/DG_icon.jpg" />
      </Head>
      <div className="tw-flex">
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
