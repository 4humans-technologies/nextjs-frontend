import React, { useState, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import BarChartIcon from "@material-ui/icons/BarChart";
import MoreVertIcon from "@material-ui/icons/MoreVert";

// const useWidth = () => {
//   const [width, setWidth] = useState(745); // default width, detect on server.
//   const handleResize = () => setWidth(window.innerWidth);
//   useEffect(() => {
//     setWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [handleResize]);
//   return width;
// };

function Header(props) {
  const [menu, setMenu] = useState(true);
  const [innerWidth, setInnerWidth] = useState(745);
  const handleResize = () => setInnerWidth(window.innerWidth);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div className="flex items-center justify-between bg-black text-white pt-2 pb-2 pr-4 pl-4">
      {/* ------------------------ */}
      <div>
        <MenuIcon onClick={props.toggleSidebar} />
      </div>
      {/* ------------------------ */}
      <div className="md:flex md:items-center hidden sm:inline-block ">
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
      <div className="hidden sm:inline-block">
        <div class="rounded-full py-3 px-6 bg-blue-600 flex">
          <SearchIcon className="mr-2" />
          <input
            class="rounded-full bg-blue-600 border-transparent"
            type="text"
            placeholder="Search Neeraj location"
          />
        </div>
      </div>
      {/* ------------- experiment----------- */}
      {innerWidth < 600 ? (
        [
          menu === true ? (
            <div className="  items-center sm:flex-row  flex-col sm:static absolute sm:top-0 top-12 right-1 sm:bg-black bg-gray-600  shadow-lg ">
              <div className="rounded-full md:py-3 py-1 px-2 md:px-6 bg-green-500 sm:mr-2 m-2 md:m-0 ">
                Create account
                <p>{innerWidth}</p>
              </div>
              <div className="rounded-full sm:py-3 py-1 px-2 sm:px-6 bg-blue-600 m-2 md:m-0">
                Login
              </div>
            </div>
          ) : (
            <div className="items-center sm:flex-row  flex-col sm:static absolute sm:top-0 top-12 right-1 sm:bg-black bg-gray-600  shadow-lg "></div>
          ),
        ]
      ) : (
        <div className=" sm:flex items-center sm:flex-row  flex-col sm:static absolute sm:top-0 top-12 right-1 sm:bg-black bg-gray-600  shadow-lg ">
          <div className="rounded-full md:py-3 py-1 px-2 md:px-6 bg-green-500 sm:mr-2 m-2 md:m-0 ">
            Create account
            <p>{innerWidth}</p>
          </div>
          <div className="rounded-full sm:py-3 py-1 px-2 sm:px-6 bg-blue-600 m-2 md:m-0">
            Login
          </div>
        </div>
      )}

      {/* ------------experiment------------ */}
      {/* <div className=" sm:flex items-center sm:flex-row  flex-col sm:static absolute sm:top-0 top-12 right-1 sm:bg-black bg-gray-600  shadow-lg ">
        <div className="rounded-full md:py-3 py-1 px-2 md:px-6 bg-green-500 sm:mr-2 m-2 md:m-0 ">
          Create account
        </div>
        <div className="rounded-full sm:py-3 py-1 px-2 sm:px-6 bg-blue-600 m-2 md:m-0">
          Login
        </div>
      </div> */}
      {/* --------------------------------------------------------------*/}
      <div className="sm:hidden" onClick={() => setMenu(!menu)}>
        <MoreVertIcon />
      </div>
    </div>
  );
}

export default Header;
