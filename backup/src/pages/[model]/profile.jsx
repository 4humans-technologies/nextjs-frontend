import React from "react";
import Mainmodle from "../../components/Mainmodle";
import Image from "next/dist/client/image";
import photo from "../../../public/ravi.jpg";

function mainprofile() {
  const data = {
    title: "Profile",
    description: "Profile",
    url: "profile",
    image: photo,
  };
  return (
    <div>
      <div>
        <p>Profile rss</p>
        <Mainmodle data={data} />
      </div>
    </div>
  );
}

export default mainprofile;
