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
  const [searchData, setSearchData] = useState([])

  useEffect(() => {
    if (ctx.loadedFromLocalStorage) {
      fetch("/api/website/compose-ui/get-all-models")
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
            // fetch("/api/website/get-geo-location")
            fetch("https://ipapi.co/region")
              .then((res) => res.text())
              .then((regionName) => {
                localStorage.setItem(
                  "geoLocation",
                  JSON.stringify({
                    regionName: regionName,
                    lastUpdated: Date.now(),
                  })
                )
                data = data.resultDocs.filter((model) => {
                  return !model.bannedStates.includes(location.regionName)
                })
                renderLiveModels(data)
              })
              .catch((err) => {
                localStorage.setItem(
                  "geoLocation",
                  JSON.stringify({
                    regionName: "delta",
                    lastUpdated: Date.now(),
                  })
                )
                data = data.resultDocs.filter((model) => {
                  return !model.bannedStates.includes(location.regionName)
                })
                renderLiveModels(data)
              })
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
            if (prev.length < 1) {
              return prev
            }
            prev[prev.length - 1].data = prev[prev.length - 1].data
              .map((model) => {
                if (model.relatedUserId === socketData.modelId) {
                  return {
                    _id: socketData.modelId,
                    relatedUserId: socketData.modelId,
                    profileImage: model.profileImage,
                    isStreaming: socketData.isStreaming,
                    onCall: socketData?.onCall,
                  }
                } else {
                  return model
                }
              })
              .sort((a, b) => {
                let aScore = 0
                let bScore = 0
                if (a.isStreaming) {
                  aScore += 2
                } else if (a.onCall) {
                  aScore += 1
                }
                if (b.isStreaming) {
                  bScore += 2
                } else if (b.onCall) {
                  bScore += 1
                }
                aScore - bScore
              })

            return [...prev]
          })
        }
      }
      socket.on("new-model-started-stream", newModelHandler)
      let modelDeleteHandler = (socketData) => {
        setBoxGroupData((prev) => {
          if (prev.length < 1) {
            return prev
          }
          prev[prev.length - 1].data = prev[prev.length - 1].data
            .map((model) => {
              if (model.relatedUserId === socketData.modelId) {
                return {
                  _id: socketData.modelId,
                  relatedUserId: socketData.modelId,
                  profileImage: model.profileImage,
                  isStreaming: socketData.isStreaming,
                  onCall: socketData?.onCall,
                }
              } else {
                return model
              }
            })
            .sort((a, b) => {
              let aScore = 0
              let bScore = 0
              if (a.isStreaming) {
                aScore += 2
              } else if (a.onCall) {
                aScore += 1
              }
              if (b.isStreaming) {
                bScore += 2
              } else if (b.onCall) {
                bScore += 1
              }
              aScore - bScore
            })

          return [...prev]
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
    <div className="tw-min-h-screen tw-bg-first-color ">
      <Head>
        <title>DreamGirl Live Online Video Chat</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="tw-flex ">
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
