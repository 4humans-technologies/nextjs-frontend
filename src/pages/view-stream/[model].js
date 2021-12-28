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
    const handleRouteChange = () => {
      console.log("handling url change")
      setTheKey((prev) => prev + 1)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
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
          profileData={{
            name: modelProfileData.name,
            age: new Date().getFullYear() - modelProfileData.dob,
            profileImage: modelProfileData.profileImage,
            publicImages: modelProfileData.publicImages,
            publicVideos: modelProfileData.publicVideos,
            privateImages: modelProfileData.privateImages,
            privateVideos: modelProfileData.privateVideos,
            tags: [
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
            categories: ["America", "India", "Bhutan", "USA"],
          }}
          dynamicFields={[
            {
              title: "Language",
              value: modelProfileData?.languages.join(", "),
            },
            { title: "body type", value: "curvy" },
            { title: "ethnicity", value: "American" },
            { title: "hair", value: "black" },
            { title: "eye color", value: "black" },
            { title: "features", value: ["nice", "artist", "fast"] },
          ]}
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
