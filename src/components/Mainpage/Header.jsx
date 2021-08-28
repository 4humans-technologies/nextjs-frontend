import React, { useState, useEffect, useContext } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import BarChartIcon from "@material-ui/icons/BarChart";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { useWidth } from "../../app/Context";
import { useSidebarStatus, useSidebarUpdate } from "../../app/Sidebarcontext";
import Login from "./Login";
import Signup from "./Signup";

function Header(props) {
  const [menu, setMenu] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const closeFunction = () => {
    console.log("close");
    setModalIsOpen(!modalIsOpen);
  };

  const screenWidth = useWidth();
  const sidebarStatus = useSidebarStatus();
  const sidebarUpdate = useSidebarUpdate();

  return (
    <div className="flex items-center justify-between bg-black text-white pt-2 pb-2 sm:pr-4 pl-4 min-w-full">
      {/* ------------------------ */}
      <div onClick={sidebarUpdate}>
        <MenuIcon />
      </div>
      {/* ------------------------ */}
      <div className="md:flex md:items-center hidden sm:inline-block ">
        {/* circle tailwind css */}
        <div className="flex items-center">
          <div className="rounded-full bg-green-700 h-4 w-4 flex items-center justify-center"></div>
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
        <div className="rounded-full py-3 px-6 bg-blue-600 flex">
          <SearchIcon className="mr-2" />
          <input
            className="rounded-full bg-blue-600 border-transparent outline-none px-2"
            type="text"
            placeholder="Search Neeraj location"
          />
        </div>
      </div>
      {/* ------------- experiment----------- */}
      {screenWidth < 600 ? (
        [
          menu === true ? (
            <div className="  items-center sm:flex-row  flex-col sm:static absolute sm:top-0 top-12 right-1 sm:bg-black bg-gray-600  shadow-lg ">
              <div
                className="rounded-full md:py-3 py-1 px-2 md:px-6 bg-green-500 sm:mr-2 m-2 md:m-0 "
                onClick={() => setSignupOpen(!signupOpen)}
              >
                Create account
              </div>
              <div
                className="rounded-full sm:py-3 py-1 px-2 sm:px-6 bg-blue-600 m-2 md:m-0"
                onClick={() => setModalIsOpen(!modalIsOpen)}
              >
                Login
              </div>
            </div>
          ) : (
            <div className="items-center sm:flex-row  flex-col sm:static absolute sm:top-0 top-12 right-1 sm:bg-black bg-gray-600  shadow-lg "></div>
          ),
        ]
      ) : (
        <div className=" sm:flex items-center sm:flex-row  flex-col sm:static absolute sm:top-0 top-12 right-1 sm:bg-black bg-gray-600  shadow-lg ">
          <div
            className="rounded-full md:py-3 py-1 px-2 md:px-6 bg-green-500 sm:mr-2 m-2  "
            onClick={() => setSignupOpen(!signupOpen)}
          >
            Create account
          </div>
          <div
            className="rounded-full sm:py-3 py-1 px-2 sm:px-6 bg-blue-600 m-2 "
            onClick={() => setModalIsOpen(!modalIsOpen)}
          >
            Login
          </div>
        </div>
      )}

      {/* ------------experiment------------ */}

      {/* --------------------------------------------------------------*/}
      <div className="sm:hidden" onClick={() => setMenu(!menu)}>
        <MoreVertIcon />
      </div>

      {modalIsOpen && (
        <Login modalStatus={modalIsOpen} closeModal={closeFunction} />
      )}
      {signupOpen && (
        <Signup
          modalStatus={signupOpen}
          closeModal={() => setSignupOpen(false)}
        />
      )}
    </div>
  );
}

export default Header;
