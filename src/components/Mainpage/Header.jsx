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
    <div className="tw-flex tw-items-center tw-justify-between tw-bg-first-color   tw-text-white tw-pt-2 tw-pb-2 sm:tw-pr-4 tw-pl-4 tw-min-w-full tw-font-sans">
      {/* ------------------------ */}
      <div onClick={sidebarUpdate}>
        <MenuIcon />
      </div>
      {/* ------------------------ */}
      <div className="md:tw-flex md:tw-items-center tw-hidden sm:tw-inline-block">
        {/* circle tailwind css */}
        <div className="tw-flex tw-items-center">
          <div className="tw-rounded-full tw-bg-green-color tw-h-4 tw-w-4 tw-flex tw-items-center tw-justify-center"></div>
          <p className="tw-pl-2 tw-pr-2">4555</p>
          <p>LIVE </p>
        </div>

        <div className="tw-flex tw-items-center tw-pl-4">
          <BarChartIcon />
          <p>Top Modle</p>
        </div>
      </div>

      {/* ------------------------ */}
      <div className="tw-hidden sm:tw-inline-block">
        <div className="tw-rounded-full tw-py-3 tw-px-6 tw-bg-dark-black tw-flex">
          <SearchIcon className="tw-mr-2" />
          <input
            className="tw-rounded-full tw-bg-dark-black tw-border-transparent tw-outline-none tw-px-2"
            type="text"
            placeholder="Search Neeraj location"
          />
        </div>
      </div>
      {/* ------------- experiment----------- */}
      {screenWidth < 600 ? (
        [
          menu === true ? (
            <div className="tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 sm:tw-bg-first-color tw-bg-first-colortw-shadow-lg">
              <div
                className="tw-rounded-full md:tw-py-3 tw-py-1 tw-px-2 md:tw-px-6 tw-bg-dark-black sm:tw-mr-2 tw-m-2 md:tw-m-0  "
                onClick={() => setSignupOpen(!signupOpen)}
              >
                Create account
              </div>
              <div
                className="tw-rounded-full sm:tw-py-3 tw-py-1 tw-px-2 sm:tw-px-6 tw-m-2 md:tw-m-0 tw-bg-white-color tw-text-text-black"
                onClick={() => setModalIsOpen(!modalIsOpen)}
              >
                Login
              </div>
            </div>
          ) : (
            <div className="tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 sm:tw-bg-first-color tw-bg-first-color tw-shadow-lg"></div>
          ),
        ]
      ) : (
        <div className="sm:tw-flex tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 sm:tw-bg-first-color tw-bg-first-color tw-shadow-lg">
          <div
            className="tw-rounded-full md:tw-py-3 tw-py-1 tw-px-2 md:tw-px-6 tw-bg-second-color sm:tw-mr-2 tw-m-2"
            onClick={() => setSignupOpen(!signupOpen)}
          >
            Create account
          </div>
          <div
            className="tw-rounded-full sm:tw-py-3 tw-py-1 tw-px-2 sm:tw-px-6 tw-bg-white-color tw-m-2 tw-text-text-black"
            onClick={() => setModalIsOpen(!modalIsOpen)}
          >
            Login
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------*/}
      <div className="sm:tw-hidden" onClick={() => setMenu(!menu)}>
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
