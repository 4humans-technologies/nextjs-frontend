import { data } from "autoprefixer";
import React from "react";
import Image from "next/image";

function Mainbox() {
  const data = {
    Name: "Mainbox",
    Description:
      "Mainbox is a simple, yet powerful, flexbox based grid system. It is built on top of the flexbox and is fully responsive. Mainbox is built with the latest technologies and is built to be a great starting point for any project.",
    Age: "22",
    nation: "China",
    language: "Javascript,PHP,English",
    photo: "brandikaran.jpg",
  };
  return (
    <div className=" ml-4 p-4">
      {/* <div>{data.Name}</div> */}
      {/* <div className="bg-gray-500 h-40 w-40 ">{data.photo}</div> */}
      <img src={data.photo} alt="Mainbox" className="h-40 w-40" />
    </div>
  );
}

export default Mainbox;
