import React from "react";
import Mainbox from "./Mainbox";

function Boxgroup() {
  return (
    <div className='tw-bg-dark-black '>
      <h1 className = "tw-text-xl tw-ml-6 tw-mt-4 tw-font-bold tw-text-white" >Top Free Live Webcams</h1>
      <div className = "tw-flex tw-pt-4 tw-flex-wrap" >
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
      </div>

      {/* Next ------ */}
      <h1 className = "tw-text-xl tw-ml-6 tw-mt-4 tw-font-bold tw-text-white" >South Indian Live Webcams</h1>
      <div className = "tw-flex tw-pt-4 tw-flex-wrap" >
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
        <Mainbox />
      </div>
      <hr className = "tw-bg-black tw-p-1" />
      <div className = "tw-text-center" >
        <p className = "tw-break-words tw-max-w-md tw-text-black tw-text-center tw-inline-flex tw-mt-4" >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
          expedita ipsa vel similique hic magni, possimus suscipit
          necessitatibus rerum soluta fugit voluptatum illum, nemo laboriosam
          quaerat reprehenderit accusantium tempora? Maiores.
        </p>
      </div>
    </div>
  );
}

export default Boxgroup;
