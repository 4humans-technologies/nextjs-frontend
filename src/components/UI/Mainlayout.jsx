import React, { useEffect, useState } from "react"
import Footer from "../Mainpage/Footer"
import Header from "../Mainpage/Header"
import Sidebar from "../Mainpage/Sidebar"
import Head from "next/head"
import { useRouter } from "next/router"

function MainLayout(props) {
  const router = useRouter()
  return (
    <div>
      <Head>
        <title>DreamGirl Live Online Video Chat</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="tw-w-full ">
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
