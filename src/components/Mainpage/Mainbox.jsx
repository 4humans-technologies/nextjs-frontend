import React, { useState } from "react";
import Image from "next/image";
import { Button } from "react-bootstrap";
import router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import StarIcon from "@material-ui/icons/Star";
import Link from "next/link";

const DynamicComponent = dynamic(() => import("./ViewerScreen"), {
  ssr: false,
});

function Mainbox(props) {
  const watch = () => {
    console.log("pass dynamic ");
    router.push("/ravi?streaming=true");
  };

  // FOR RENDERING STARS
  // let star = [];
  // for (let index = 0; index < Rating; index++) {
  //   star.push(<StarIcon className="tw-text-yellow-300 " />);
  // }

  return (
    <div className="tw-font-sans tw-col-span-1 tw-row-span-1 tw-w-full">
      <div className="tw-relative tw-font-sans parent_transition tw-m-0">
        <img
          src={props.photo}
          className="tw-object-cover tw-object-center"
          alt=""
        />
        <div className="tw-absolute tw-z-[2]  child_transition after"></div>
        {/*  Real*/}
        <div className="tw-absolute tw-z-10  child_transition_1 after tw-top-0">
          {/* <div className="tw-absolute tw-bottom-0 tw-w-full tw-align-middle tw-flex "> */}
          <Link href={`/view-stream/${props.modelId}`}>
            <a
              className={`${
                props.onCall ? "tw-bg-purple-600" : "tw-bg-green-color"
              } tw-w-full tw-text-center tw-opacity-100 tw-text-white tw-bottom-0 tw-absolute tw-z-50 hover:tw-text-white`}
            >
              {props.onCall ? "onCall" : "streaming"}
            </a>
          </Link>
          {/* </div> */}
        </div>
        {/* ral code */}
      </div>
    </div>
  )
}

export default Mainbox;
