import React, { useEffect, useState } from "react"
import Footer from "../Mainpage/Footer"
import Header from "../Mainpage/Header"

function Mainlayout({ children }) {
  const [liveModels, setLiveModels] = useState(0)
  useEffect(() => {
    fetch("/api/website/compose-ui/get-ranking-online-models")
      .then((res) => res.json())
      .then((data) => {
        setLiveModels(data.totalMatches)
      })
  }, [])

  return (
    <div>
      <Header liveModels={liveModels} />
      <div>{children}</div>
      <Footer />
    </div>
  )
}

export default Mainlayout
