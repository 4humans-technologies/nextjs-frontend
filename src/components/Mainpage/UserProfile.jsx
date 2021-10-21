import React from "react";
import CreateIcon from "@material-ui/icons/Create";
import Card from "../UI/Card";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { Tooltip } from "react-bootstrap";
import help from "../UI/help";
import { OverlayTrigger } from "react-bootstrap";

function UserProfile() {
  return (
    <div>
      {/* Cover page */}
      <div className="tw-w-screen tw-relative  ">
        <img
          src="/swami_ji.jpg"
          className="tw-w-full md:tw-h-80 tw-object-cover tw-object-center"
        />
        <p className=" tw-absolute tw-z-10 tw-bottom-4 tw-bg-white tw-text-black tw-right-8 tw-py-2 tw-px-2 ">
          Background
          <CreateIcon className="tw-ml-2" />
        </p>
      </div>
      {/* Circular name  */}
      <div className="tw-w-screen tw-bg-red-400 tw-h-28 tw-flex tw-pl-8">
        <img
          className="tw-rounded-full tw-w-32 tw-h-32 flex tw-items-center tw-justify-center tw-absolute tw-z-10 tw-mt-[-3%] tw-bg-green-400 tw-shadow-lg"
          src="/pp.jpg"
        ></img>
        <div className="tw-font-extrabold tw-text-2xl tw-text-white tw-ml-44  ">
          Sansatinal Girl
        </div>
      </div>
      {/* name and profile */}
      <div className="tw-grid md:tw-grid-cols-7 tw-grid-cols-1 md:tw-gap-4   md:tw-py-2 md:tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-text-white tw-w-screen">
        <div className="md:tw-col-span-4 tw-col-span-1 tw-grid tw-grid-cols-4 tw-bg-first-color tw-pl-4 tw-py-4">
          <div className="md:tw-col-span-1 tw-col-span-2   ">
            <p>Intrested in</p>
            <p>From</p>
            <p>Language</p>
            <p>Age</p>
            <p>Body type</p>
            <p>Specifiv</p>
            <p>Hair</p>
            <p>Eye color</p>
            <p>SubCulture</p>
          </div>
          <div className="md:tw-col-span-3 tw-col-span-2 ">
            <p>Intrested in</p>
            <p>From</p>
            <p>Language</p>
            <p>Age</p>
            <p>Body type</p>
            <p>Specifiv</p>
            <p>Hair</p>
            <p>Eye color</p>
            <p>SubCulture</p>
          </div>
        </div>
        <div className="tw-grid  tw-bg-red-400 md:tw-col-span-3 tw-col-span-1">
          <h1>Freinds</h1>
          <br />
          <div className="tw-flex tw-flex-wrap tw-justify-between">
            <br />
            <div className="tw-text-center">
              <img
                className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                src="/pp.jpg"
              />
              <h2>Vikas Kumawat</h2>
            </div>
            <div className="tw-text-center">
              <img
                className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                src="/pp.jpg"
              />
              <h2>Vikas Kumawat</h2>
            </div>
            <div className="tw-text-center">
              <img
                className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                src="/pp.jpg"
              />
              <h2>Vikas Kumawat</h2>
            </div>
            <div className="tw-text-center">
              <img
                className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                src="/pp.jpg"
              />
              <h2>Vikas Kumawat</h2>
            </div>
            <div className="tw-text-center">
              <img
                className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                src="/pp.jpg"
              />
              <h2>Vikas Kumawat</h2>
            </div>
            <div className="tw-text-center">
              <img
                className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                src="/pp.jpg"
              />
              <h2>Vikas Kumawat</h2>
            </div>
            <div className="tw-text-center">
              <img
                className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                src="/pp.jpg"
              />
              <h2>Vikas Kumawat</h2>
            </div>
            <div className="tw-text-center">
              <img
                className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                src="/pp.jpg"
              />
              <h2>Vikas Kumawat</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile;
