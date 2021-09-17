import React from "react";
import Footer from "../../components/Mainpage/Footer";
import Header from "../../components/Mainpage/Header";
import Headermodel from "../../components/model/Headermodel";
import Livescreen from "../../components/model/Livescreen";
import { useSidebarUpdate, useSidebarStatus } from "../../app/Sidebarcontext";
import Sidebar from "../../components/Mainpage/Sidebar";
import Profile from "../../components/model/profile";
import SecondHeader from "../../components/Mainpage/SecondHeader";

function index() {
  const sidebarStatus = useSidebarStatus();
  return (
    <div className="">
      <Header />
      {/* <Headermodel /> */}
      <SecondHeader />
      <Sidebar />
      <Livescreen />
      {/* <Profile /> */}
      <Footer />
    </div>
  );
}

export default index;
