import React from "react";
import Footer from "../../components/Mainpage/Footer";
import Header from "../../components/Mainpage/Header";
import Headermodel from "../../components/model/Headermodel";
import Livescreen from "../../components/model/Livescreen";
import { useSidebarUpdate, useSidebarStatus } from "../../app/Sidebarcontext";
import Sidebar from "../../components/Mainpage/Sidebar";

function index() {
  const sidebarStatus = useSidebarStatus();
  return (
    <div className="">
      <Header />
      <Headermodel />
      {sidebarStatus && <Sidebar />}
      <Livescreen />
      {/* <h2>Model</h2> */}
      <Footer />
    </div>
  );
}

export default index;
