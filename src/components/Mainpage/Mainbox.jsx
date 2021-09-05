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
      <div className="tw-relative">
        <img src={data.photo} alt="Mainbox" className="tw-h-40 tw-w-40" />
        <p className="tw-h-40 tw-w-40 tw-absolute tw-bottom-0 tw-bg-gray-500 tw-opacity-0 hover:tw-opacity-80 tw-font-sans">
          {data.Description}
        </p>
      </div>
    </div>
  );
}

export default Mainbox;
