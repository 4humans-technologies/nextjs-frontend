import React from "react";
import Footer from "../../components/Mainpage/Footer";
import Header from "../../components/Mainpage/Header";
import Livescreen from "../../components/model/Livescreen";
import { useSidebarUpdate, useSidebarStatus } from "../../app/Sidebarcontext";
import Sidebar from "../../components/Mainpage/Sidebar";
import ModelProfile from "../../components/model/ModelProfile.jsx";
import SecondHeader from "../../components/Mainpage/SecondHeader";

function index() {
  const sidebarStatus = useSidebarStatus();
  return (
    <div className="">
      <Header />
      <SecondHeader />
      <Sidebar />
      <Livescreen />
      <ModelProfile />
      <Footer />
    </div>
  );
}

export default index;
