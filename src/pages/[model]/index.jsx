import React from "react";
import Footer from "../../components/Mainpage/Footer";
import Header from "../../components/Mainpage/Header";
import Headermodel from "../../components/model/Headermodel";
import Livescreen from "../../components/model/Livescreen";
import { useSidebarUpdate, useSidebarStatus } from "../../app/Sidebarcontext";
import Sidebar from "../../components/Mainpage/Sidebar";
import ModelProfile from "../../components/model/ModelProfile.jsx";

function index() {
  const sidebarStatus = useSidebarStatus();
  return (
    <div className="">
      <Header />
      <Headermodel />
      <Sidebar />
      <Livescreen />
      <ModelProfile profileData={{
        name: "Neeraj Rai",
        age: 42,
        tags: ['Black', "White", "Artist", "Intelligent", 'Black', "White", "Artist", 'Black', "White", "Artist"],
        categories: ["America", "India", "Bhutan", "USA"]
      }}
        dynamicFields={[
          { title: "Language", value: ["hindi", "english"] },
          { title: "body type", value: "curvy" },
          { title: "ethnicity", value: "American" },
          { title: "hair", value: "black" },
          { title: "eye color", value: "black" },
          { title: "social links", value: "What to do ?" },
          { title: "features", value: ["nice", "artist", "fast"] },
        ]}
      />
      <Footer />
    </div>
  );
}

export default index;
