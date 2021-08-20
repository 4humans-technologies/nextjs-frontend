import { LiveHelpTwoTone } from "@material-ui/icons";
import React from "react";
import Footer from "../../components/Mainpage/Footer";
import Header from "../../components/Mainpage/Header";
import Headermodel from "../../components/model/Headermodel";
import Livescreen from "../../components/model/Livescreen";

function index() {
  return (
    <div>
      <Header />
      <Headermodel />
      <Livescreen />
      <h2>Model</h2>
      <Footer />
    </div>
  );
}

export default index;
