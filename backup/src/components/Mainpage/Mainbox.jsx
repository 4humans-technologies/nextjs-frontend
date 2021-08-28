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
    <div className=" ml-2 p-2">
      <div className="relative">
        <img src={data.photo} alt="Mainbox" className="h-40 w-40 " />
        <p className="h-40 w-40 absolute bottom-0 bg-gray-500 opacity-0 hover:opacity-80">
          {data.Description}
        </p>
      </div>
    </div>
  );
}

export default Mainbox;
