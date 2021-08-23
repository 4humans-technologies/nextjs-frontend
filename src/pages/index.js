import { Counter } from '../features/counter/Counter'


import Head from "next/head";
import Consent from "../components/Consent";
import Header from "../components/Mainpage/Header";
import SecondHeader from "../components/Mainpage/SecondHeader";
import Sidebar from "../components/Mainpage/Sidebar";
import Boxgroup from "../components/Mainpage/Boxgroup";
import { useState } from "react";
// import Mainbox from "../components/Mainbox";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggler = () => setShowSidebar(!showSidebar);

  return (
    // <div className={styles.container}>
    <div className=" min-h-screen">
      <Head>
        <title>Redux Toolkit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Consent /> */}
      <Header toggleSidebar={toggler} />
      {/* <SecondHeader />
      <div className="flex">
        <Sidebar sidebarState={showSidebar} />
        <Boxgroup />
      </div> */}
    </div>
  );
}
