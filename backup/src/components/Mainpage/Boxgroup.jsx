import React from "react";
import Mainbox from "./Mainbox";

function Boxgroup() {
  return (
    <div>
      <h1 className="text-xl ml-6 mt-4 font-bold">Top Free Live Webcams</h1>
      <div className="flex pt-4 flex-wrap ">
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
      <h1 className="text-xl ml-6 mt-4 font-bold">South Indian Live Webcams</h1>
      <div className="flex pt-4 flex-wrap ">
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
      <hr className="bg-black p-1" />
      <div className="text-center">
        <p className=" break-words max-w-md  text-black text-center inline-flex mt-4">
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
