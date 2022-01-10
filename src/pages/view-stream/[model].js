import React, { useState, useEffect } from "react"

import ModelProfile from "../../components/model/ModelProfile"
import Recommendation from "../../components/ViewerScreen/Recommendation"
import LiveScreen from "../../components/model/Livescreen"
import { useRouter } from "next/router"

function ViewModelStream() {
  // 👇👇👇 store the models profile value in a state here
  const [modelProfileData, setModelProfileData] = useState(null)

  const router = useRouter()

  const [theKey, setTheKey] = useState(0)
  useEffect(() => {
    let mounted = true
    const handleRouteChange = (url) => {
      console.log("changed url", url)
      if (mounted) {
        setTheKey((prev) => prev + 1)
      }
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      mounted = false
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [])

  return (
    <>
      <LiveScreen
        key={theKey}
        setModelProfileData={setModelProfileData}
        modelProfileData={modelProfileData}
      />
      {modelProfileData && (
        <ModelProfile
          key={theKey + 200}
          modelProfileData={modelProfileData}
          profileData={{
            name: modelProfileData.name,
            age: new Date().getFullYear() - modelProfileData.dob,
            profileImage: modelProfileData.profileImage,
            publicImages: modelProfileData.publicImages,
            publicVideos: modelProfileData.publicVideos,
            privateImages: modelProfileData.privateImages,
            privateVideos: modelProfileData.privateVideos,
            tags:
              modelProfileData.tags.length > 0
                ? elProfileData.tags
                : [
                    "Black",
                    "White",
                    "Artist",
                    "Intelligent",
                    "Black",
                    "White",
                    "Artist",
                    "Black",
                    "White",
                    "Artist",
                  ],
          }}
        />
      )}
      <Recommendation
        key={theKey + 400}
        parent={"viewerScreen"}
        setTheKey={setTheKey}
      />
    </>
  )
}

export default React.memo(ViewModelStream)
