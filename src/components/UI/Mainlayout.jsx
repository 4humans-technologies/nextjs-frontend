import React, { useEffect, useState } from "react"
import Footer from "../Mainpage/Footer"
import Header from "../Mainpage/Header"

function Mainlayout({ children }) {
  return (
    <div className="tw-w-full">
      <Header />
      <div className="tw-w-full">{children}</div>
      <Footer />
    </div>
  )
}

export default Mainlayout
