import React, { useEffect, useState } from "react"
import Footer from "../Mainpage/Footer"
import Header from "../Mainpage/Header"
import Sidebar from "../Mainpage/Sidebar"
import io from "../../socket/socket"

function MainLayout({ children }) {
  return (
    <div className="tw-w-full">
      <Header />
      <Sidebar />
      <div className="tw-w-full tw-mt-[7.6rem] lg:tw-mt-[8rem] tw-bg-first-color tw-pb-8 tw-pt-2">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
