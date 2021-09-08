import { data } from "autoprefixer";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "react-bootstrap";
import router, { useRouter } from "next/router";
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(() => import("./ViewerScreen"), {
  ssr: false,
});

function Mainbox() {
  const [stream,setStream]=useState(false)
  const data = {
    Name: "Mainbox",
    Description:
      "Mainbox is a simple, yet powerful, flexbox based grid system. ",
    Age: "22",
    nation: "China",
    language: "Javascript,PHP,English",
    photo: "brandikaran.jpg",
  };
  const watch = () => {
    console.log("pass dynamic ");

    router.push("/ravi?streaming=true");
  };
  return (
    <div className="tw-ml-2 tw-p-2 " key={Math.random() * 100}>
      <div className="tw-relative tw-font-sans parent_transition">
        <img src={data.photo} alt="Mainbox" className="tw-h-40 tw-w-40" />
        <div className=" tw-absolute tw-z-10 tw-bottom-0 child_transition ">
          {data.Description}
          <br />
          <div className=" tw-absolute tw-bottom-0 tw-ml-6 ">
            <Button
              className=" tw-bg-green-600  tw-rounded-full"
              onClick={watch}
            >
              watch Live
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mainbox;
