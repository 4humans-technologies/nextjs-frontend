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
  const sidebarStatus = useSidebarStatus();

  return (
    <div className="tw-min-h-screen">
      <Head>
        <title>Redux Toolkit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="tw-h-32"></div>
      {/* <Consent /> */}
      <Header />
      <SecondHeader />
      <div className="tw-flex">
        <Sidebar />
        <Boxgroup />
      </div>
      {/* Spinner tester  */}
      {/* <div className = "tw-spinner tw-animate-spin" ></div> */}
      {/* spinner tester */}
    </div>
  );
}
