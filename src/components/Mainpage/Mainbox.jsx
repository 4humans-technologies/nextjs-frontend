import { data } from "autoprefixer";
import React from "react";
import Image from "next/image";

function Mainbox() {
  const data = {
    Name: "Mainbox",
    Description:
      "Mainbox is a simple, yet powerful, flexbox based grid system. ",
    Age: "22",
    nation: "China",
    language: "Javascript,PHP,English",
    photo: "brandikaran.jpg",
  };
  return (
    <div className="tw-ml-2 tw-p-2">
      <div className="tw-relative tw-font-sans parent_transition">
        <img src={data.photo} alt="Mainbox" className="tw-h-40 tw-w-40" />
        <p className=" tw-absolute tw-z-10 tw-bottom-0 child_transition ">{data.Description}</p>
      </div>
    </div>
  );
}

export default Mainbox;
