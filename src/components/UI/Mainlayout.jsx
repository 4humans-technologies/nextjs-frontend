import React, { useEffect, useState, useRef } from "react"
import Footer from "../Mainpage/Footer"
import Header from "../Mainpage/Header"
import Sidebar from "../Mainpage/Sidebar"
import Head from "next/head"
import { useRouter } from "next/router"
import { useSidebarStatus, useSidebarUpdate } from "../../app/Sidebarcontext"

function MainLayout(props) {
  const router = useRouter()
  const ref = useRef()
  const sideBarstate = useSidebarStatus()
  const sidebarUpdate = useSidebarUpdate()
  // let findClick = () => {
  //   console.log("clicked")
  // }

  // This is another try to do things
  useEffect(() => {
    let findClick = (e) => {
      // console.log(String(e.target.getAttribute("class")).includes("menuIcon"))
      // console.log(`sidebar staatus  ${sideBarstate}`)

      if (
        sideBarstate &&
        !String(e.target.getAttribute("class")).includes("menuIcon")
      ) {
        sidebarUpdate()
        console.log("from inside if block")
      }
    }
    document.addEventListener("mousedown", findClick)
    return () => {
      document.removeEventListener("mousedown", findClick)
    }
  }, [sideBarstate])

  return (
    <div>
      <Head>
        <title>DreamGirl Live Online Video Chat</title>
        <link rel="icon" href="/DG_icon.jpg" />
      </Head>
      <div className="tw-w-full " ref={ref}>
        <Header />
        <Sidebar />
        <div className="tw-w-full md:tw-mt-[4.5rem] tw-mt-16 tw-bg-first-color tw-pb-8 ">
          {props.children}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
