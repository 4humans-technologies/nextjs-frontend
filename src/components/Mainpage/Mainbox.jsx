import React, { useState } from "react";
import Image from "next/image";
import { Button } from "react-bootstrap";
import router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import StarIcon from "@material-ui/icons/Star";

const DynamicComponent = dynamic(() => import("./ViewerScreen"), {
  ssr: false,
});

function Mainbox({
  Name,
  Age,
  Gender,
  Language,
  Nation,
  Rating,
  Photo,
  Group,
  Private,
}) {
  const watch = () => {
    console.log("pass dynamic ");

    router.push("/ravi?streaming=true");
  };
  let star = [];
  for (let index = 0; index < Rating; index++) {
    star.push(<StarIcon className="tw-text-yellow-300 " />);
  }
  return (
    <div
      className="tw-font-sans tw-col-span-1 tw-row-span-1 tw-w-full"
      key={Math.random() * 100}
    >
      <div className="tw-relative tw-font-sans parent_transition tw-m-0">
        <Image
          src={Photo}
          height={256 * 2}
          width={352 * 2}
          alt="Dream Girl"
          objectFit="cover"
          objectPosition="top left"
          className="tw-max-h-full tw-max-w-full"
        />
        <div className="tw-absolute tw-z-[2]  child_transition after"></div>
        {/*  Real*/}
        <div className="tw-absolute tw-z-10  child_transition_1 after tw-top-0">
          <ul className="tw-pl-4 tw-text-white tw-z-10" key={Math.random}>
            <li className="tw-font-extrabold tw-text-xl tw-py-1">{Name}</li>
            <li className="tw-py-1">
              {Age}Yrs <span className="tw-ml-2">{Gender}</span>
            </li>
            <li className="tw-py-1 ">Rating : {star}</li>
            <li className="tw-py-1">
              <span>Public</span>: {Group} Coins/min
            </li>
            <li className="tw-py-1">
              <span>Private</span>: {Private} Coins/min
            </li>
            <li className="tw-py-1">
              <span>I Speak</span>: {Language}
            </li>
          </ul>
          {/* <div className="tw-absolute tw-bottom-0 tw-w-full tw-align-middle tw-flex "> */}
          <button
            className="tw-bg-green-color tw-w-full tw-text-center tw-opacity-100 tw-text-white tw-bottom-0 tw-absolute"
            onClick={watch}
          >
            watch Live
          </button>
          {/* </div> */}
        </div>
        {/* ral code */}
      </div>
    </div>
  );
}

export default Mainbox;
