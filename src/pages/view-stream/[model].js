import { useRouter } from "next/router"
import React, { useState } from "react"
import Footer from "../../components/Mainpage/Footer"
import Header from "../../components/Mainpage/Header"
import SecondHeader from "../../components/Mainpage/SecondHeader"
import Sidebar from "../../components/Mainpage/Sidebar"
import LiveScreen from "../../components/model/LiveScreen"
import ModelProfile from "../../components/model/ModelProfile"
import Recommendation from "../../components/ViewerScreen/Recommendation"
function ViewModelStream() {
  // 👇👇👇 store the models profile value in a state here
  const [modelProfileData, setModelProfileData] = useState(null)

  return (
    <>
      <Header />
      {/* <SecondHeader /> */}
      <Sidebar />
      <LiveScreen setModelProfileData={setModelProfileData} modelProfileData={modelProfileData} />
      {modelProfileData && (
        <ModelProfile
          profileData={{
            name: modelProfileData.name,
            age: new Date().getFullYear() - modelProfileData.dob,
            profileImage: modelProfileData.profileImage,
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
            { title: "Language", value: modelProfileData.languages.join(", ") },
            { title: "body type", value: "curvy" },
            { title: "ethnicity", value: "American" },
            { title: "hair", value: "black" },
            { title: "eye color", value: "black" },
            { title: "social links", value: "What to do ?" },
            { title: "features", value: ["nice", "artist", "fast"] },
          ]}
        />
      )}
      <Recommendation parent={"viewerScreen"} />
      <Footer />
    </>
  )
}

export default ViewModelStream
