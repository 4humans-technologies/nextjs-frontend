import { data } from "autoprefixer";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "react-bootstrap";
import router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import StarIcon from "@material-ui/icons/Star";


const DynamicComponent = dynamic(() => import("./ViewerScreen"), {
  ssr: false,
});


function Mainbox() {
  const [stream, setStream] = useState(false);
  const data = {
    Name: "Mainbox",
    Description:
      "Mainbox is a simple, yet powerful, flexbox based grid system. ",
    Age: "22",
    nation: "China",
    rating: 5,
    Group: 12,
    Private: 16,
    language: "Javascript,PHP,English",
    photo: "brandikaran.jpg",
  };
  const watch = () => {
    console.log("pass dynamic ");

    router.push("/ravi?streaming=true");
  };
  let star = [];
  for (let index = 0; index < data.rating; index++) {
    star.push(<StarIcon className="tw-text-yellow-300 " />);
  }

  return (
    <div className="tw-ml-2 tw-mb-2 tw-font-sans" key={Math.random() * 100}>
      <div className="tw-relative tw-font-sans parent_transition">
        <img
          src={data.photo}
          alt="Mainbox"
          className="tw-h-[270px] tw-w-[370px]"
        />
        <div className="before"></div>
        <div className="tw-absolute tw-z-[2]  child_transition after">
          <ul
            className="  tw-pl-4 tw-text-white tw-z-0"
            style={{ textShadow: "0 0 4px white" }}
          >
            <li className="tw-font-bold tw-py-1">{data.Name}</li>
            <li className="tw-py-1">
              {data.Age}Yrs <span className="tw-ml-2">{data.nation}</span>
            </li>
            <li className="tw-py-1 ">Rating : {star}</li>
            <li className="tw-py-1">
              <span>Public</span>: {data.Group} Coins/min
            </li>
            <li className="tw-py-1">
              <span>Private</span>: {data.Private} Coins/min
            </li>
            <li className="tw-py-1">
              <span>I Speak</span>: {data.language}
            </li>
          </ul>
          <br />
          <div className=" tw-absolute tw-bottom-0  tw-align-middle tw-flex ">
            <button
              className="tw-bg-green-500 tw-w-[370px] tw-text-center tw-opacity-100"
              onClick={watch}
            >
              watch Live
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mainbox;

