import { Counter } from '../features/counter/Counter'

import Head from "next/head";
import Consent from "../components/Consent";
import Header from "../components/Header";
import SecondHeader from "../components/SecondHeader";
import Sidebar from "../components/Sidebar";

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
      <Sidebar />
    </div>
  );
}
