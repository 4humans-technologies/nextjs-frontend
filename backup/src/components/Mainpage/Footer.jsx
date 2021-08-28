import React from "react";
import TwitterIcon from "@material-ui/icons/Twitter";

function Footer() {
  return (
    <div className="flex bg-gray-800 text-white justify-between md:px-4 flex-1">
      <div className="footer_1">
        <img src="DG_logo.jpg" alt="Logo" className="w-4/12 h-2/6" />
        <p className="flex-wrap mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
          illum iure veritatis expedita saepe tempore eaque modi iste alias sit
          nulla magni tenetur asperiores adipisci laudantium incidunt
          accusantium, rem praesentium.
        </p>
      </div>
      <div className="footer_2">
        <h2>Superlative</h2>
        <hr />
        <div className="flex items-center mt-2">
          <TwitterIcon />
          <p>twitter</p>
        </div>
      </div>
      <div className="footer_3">
        <h2>LEGAL& SAFETY</h2>
        <hr />
        <div className="flex flex-col items-center mt-2">
          <div>Ram</div>
          <div>Ram</div>
          <div>Ram</div>
          <div>Ram</div>
        </div>
      </div>
      <div className="footer_4">
        <h2>WORK WITH US</h2>
        <hr />
        <div className="flex flex-col items-center mt-2">
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
