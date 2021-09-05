import React from "react";
import TwitterIcon from "@material-ui/icons/Twitter";

function Footer() {
  return (
    <div className="tw-flex tw-bg-gray-800 tw-text-white tw-justify-between md:tw-px-4 tw-flex-1 tw-font-sans">
      <div className="tw-footer_1">
        <img src="DG_logo.jpg" alt="Logo" className="tw-w-4/12 tw-h-2/6" />
        <p className="tw-flex-wrap tw-mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
          illum iure veritatis expedita saepe tempore eaque modi iste alias sit
          nulla magni tenetur asperiores adipisci laudantium incidunt
          accusantium, rem praesentium.
        </p>
      </div>
      <div className="tw-footer_2">
        <h2>Superlative</h2>
        <hr />
        <div className="tw-flex tw-items-center tw-mt-2">
          <TwitterIcon />
          <p>twitter</p>
        </div>
      </div>
      <div className="tw-footer_3">
        <h2>LEGAL& SAFETY</h2>
        <hr />
        <div className="tw-flex tw-flex-col tw-items-center tw-mt-2">
          <div>Ram</div>
          <div>Ram</div>
          <div>Ram</div>
          <div>Ram</div>
        </div>
      </div>
      <div className="tw-footer_4">
        <h2>WORK WITH US</h2>
        <hr />
        <div className="tw-flex tw-flex-col tw-items-center tw-mt-2">
          <div>Ram</div>
          <div>Ram</div>
          <div>Ram</div>
          <div>Ram</div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
