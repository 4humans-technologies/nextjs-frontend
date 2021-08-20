import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import BarChartIcon from "@material-ui/icons/BarChart";

function Header(props) {
  return (
    <div className="flex items-center justify-between bg-black text-white pt-2 pb-2 pr-4 pl-4">
      {/* ------------------------ */}
      <div>
        <MenuIcon />
      </div>
      {/* ------------------------ */}
      <div className="flex items-center">
        {/* circle tailwind css */}
        <div className="flex items-center">
          <div class="rounded-full bg-green-700 h-4 w-4 flex items-center justify-center"></div>
          <p className="pl-2 pr-2">4555</p>
          <p>LIVE </p>
        </div>

        <div className="flex items-center pl-4">
          <BarChartIcon />
          <p>Top Modle</p>
        </div>
      </div>

      {/* ------------------------ */}
      <div>
        <div class="rounded-full py-3 px-6 bg-blue-600 flex">
          <SearchIcon className="mr-2" />
          <input
            class="rounded-full bg-blue-600 border-transparent"
            type="text"
            placeholder="Search Neeraj location"
          />
        </div>
      </div>
      {/* ------------------------ */}

      <div className="flex items-center">
        <div class="rounded-full py-3 px-6 bg-green-500 mr-2">
          Create account
        </div>
        <div class="rounded-full py-3 px-6 bg-blue-600">Login account</div>
      </div>
    </div>
  );
}

export default Header;
