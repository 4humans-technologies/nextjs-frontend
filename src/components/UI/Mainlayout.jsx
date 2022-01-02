import React, { useEffect, useState } from "react"
import Footer from "../Mainpage/Footer"
import Header from "../Mainpage/Header"
import Sidebar from "../Mainpage/Sidebar"
import { useRouter } from "next/router"


function MainLayout(props) {
  const router = useRouter()
  return (
    <div className="tw-w-full ">
      <Header />
      <Sidebar />
      <div className="tw-w-full md:tw-mt-[4.5rem] tw-mt-16 tw-bg-first-color tw-pb-8 ">
        {props.children}
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
