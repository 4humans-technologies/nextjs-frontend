import { Counter } from '../features/counter/Counter'

import Head from "next/head";
import Consent from "../components/Consent";
import Header from "../components/Mainpage/Header";
import SecondHeader from "../components/Mainpage/SecondHeader";
import Sidebar from "../components/Mainpage/Sidebar";
import Boxgroup from "../components/Mainpage/Boxgroup";
// import Mainbox from "../components/Mainbox";

export default function Home() {
  return (
    // <div className={styles.container}>
    <div className=" min-h-screen">
      <Head>
        <title>Redux Toolkit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Consent /> */}
      <Header />
      <SecondHeader />
      <div className="flex">
        <Sidebar />
        <Boxgroup />
      </div>
    </div>
  );
}
