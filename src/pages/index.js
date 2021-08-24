import { Counter } from '../features/counter/Counter'


import Head from "next/head";
import Consent from "../components/Consent";
import Header from "../components/Mainpage/Header";
import SecondHeader from "../components/Mainpage/SecondHeader";
import Sidebar from "../components/Mainpage/Sidebar";
import Boxgroup from "../components/Mainpage/Boxgroup";
import { useState } from "react";
// import Mainbox from "../components/Mainbox";
import { useSidebarUpdate, useSidebarStatus } from "../app/Sidebarcontext";

export default function Home() {
  // const [showSidebar, setShowSidebar] = useState(true);

  const sidebarStatus = useSidebarStatus();
  // const toggler = () => setShowSidebar(!showSidebar);

  return (
    // <div className={styles.container}>
    <div className=" min-h-screen">
      <Head>
        <title>Redux Toolkit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Consent /> */}
      <Header />
      {/* <Header toggleSidebar={toggler} /> */}
      <SecondHeader />
      <div className="flex">
        {sidebarStatus && <Sidebar />}
        {/* <Sidebar sidebarState={showSidebar} /> */}
        <Boxgroup />
      </div>
    </div>
  );
}
