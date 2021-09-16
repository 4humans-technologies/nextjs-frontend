import React from "react";
import TwitterIcon from "@material-ui/icons/Twitter";

function Footer() {
  return (
    <div className="tw-flex tw-bg-gray-600 tw-text-white  md:tw-px-4 tw-flex-1 tw-font-sans tw-pt-4 tw-w-full ">
      {/*  */}
      <div className="tw-footer_1">
        <img src="logo.png" alt="Logo" className="tw-w-4/12 tw-h-2/6" />
        <p className="tw-flex-wrap tw-mt-4 tw-px-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
          illum iure veritatis expedita saepe tempore eaque modi iste alias sit
          nulla magni tenetur asperiores adipisci laudantium incidunt
          accusantium, rem praesentium.
        </p>
      </div>
      {/*  ---------------------------------------------------*/}
      <div className="tw-flex tw-justify-around tw-flex-grow ">
        <div className="tw-footer_2 tw-flex-grow ">
          <h2 className="tw-text-base">Help & Support</h2>
          <hr className="tw-w-48" />
          <div className="tw-flex tw-items-center tw-mt-2">
            <TwitterIcon />
            <p>twitter</p>
          </div>
        </div>
        {/*  */}
        <div className="tw-footer_3 tw-flex-grow">
          <h2 className="tw-text-base">LEGAL& SAFETY</h2>
          <hr className="tw-w-48" />
          <div className="tw-flex tw-flex-col  tw-mt-2 ">
            <p className="tw-text-sm tw-py-1">Privacy Policy</p>
            <hr className="tw-bg-white  tw-w-32" />
            <p className="tw-text-sm tw-py-1">Privacy Policy</p>
            <hr className="tw-bg-white  tw-w-32" />
            <div className="tw-text-sm tw-py-1">Privacy Policy</div>
            <hr className="tw-bg-white  tw-w-32" />
            <p className="tw-text-sm tw-py-1">Privacy Policy</p>
          </div>
        </div>
        {/*  */}
        <div className="tw-footer_4 tw-flex-grow">
          <h2 className="tw-text-base">WORK WITH US</h2>
          <hr className="tw-w-48" />
          <div className="tw-flex tw-flex-col  tw-mt-2 ">
            <p className="tw-text-sm tw-py-1">Privacy Policy</p>
            <hr className="tw-bg-white  tw-w-32" />
            <p className="tw-text-sm tw-py-1">Privacy Policy</p>
            <hr className="tw-bg-white  tw-w-32" />
            <div className="tw-text-sm tw-py-1">Privacy Policy</div>
            <hr className="tw-bg-white  tw-w-32" />
            <p className="tw-text-sm tw-py-1">Privacy Policy</p>
          </div>
        </div>
      </div>

      {/*  */}
    </div>
  );
}

export default Footer;
