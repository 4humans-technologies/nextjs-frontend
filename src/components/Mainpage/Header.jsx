import React, { useState, useEffect, useContext } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import BarChartIcon from "@material-ui/icons/BarChart";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClearIcon from "@material-ui/icons/Clear";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../../public/logo.png";
import ChatIcon from "@material-ui/icons/Chat";
import NotificationsIcon from "@material-ui/icons/Notifications"
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn"


import { useWidth } from "../../app/Context"
import { useSidebarStatus, useSidebarUpdate } from "../../app/Sidebarcontext"

import useModalContext from "../../app/ModalContext"
import Link from "next/link"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

function Header(props) {
  const [menu, setMenu] = useState(false)
  const [searchShow, setSearchShow] = useState(false)
  const [query, setQuery] = useState("")
  const [searchData, setSearchData] = useState([])
  // need to add search parmeters
  const screenWidth = useWidth()
  const modalCtx = useModalContext()
  const router = useRouter()
  const sidebarStatus = useSidebarStatus()
  const sidebarUpdate = useSidebarUpdate()
  const authContext = useAuthContext()
  const updateAuthContext = useAuthUpdateContext()
  const [hide, setHide] = useState()

  // Checking login and logout -----------------

  useEffect(() => {
    if (window.location.pathname.includes("goLive") == true) {
      setHide(true)
    }
  }, [])

  useEffect(() => {
    fetch("/data.json")
      .then((resp) => {
        return resp.json()
      })
      .then((data) => setSearchData(data.products))
  }, [query])

  // need for

  return (
    <div className="tw-flex tw-items-center tw-justify-between tw-bg-dark-black tw-text-white tw-pt-2 tw-pb-2 sm:tw-pr-4 tw-pl-4 tw-min-w-full tw-font-sans tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-[102]">
      {/* ------------------------ */}
      <div className="tw-flex tw-text-center">
        <div onClick={sidebarUpdate} className="tw-self-center tw-mr-4">
          {sidebarStatus ? <ClearIcon /> : <MenuIcon />}
        </div>
        <Link href="/">
          <a className="tw-z-50 tw-cursor-pointer">
            <Image src={logo} width={124} height={65} />
          </a>
        </Link>
      </div>
      {/* ------------------------ */}
      <div className="md:tw-flex md:tw-items-center tw-hidden ">
        {/* circle tailwind css */}
        <div className="tw-flex tw-items-center">
          <div className="tw-rounded-full tw-bg-green-400 tw-h-2 tw-w-2 tw-flex tw-items-center tw-justify-center"></div>
          <p className="tw-pl-1 tw-pr-2">4555</p>
          <p>LIVE </p>
        </div>

        <div className="lg:tw-flex tw-items-center tw-pl-4 tw-hidden">
          <BarChartIcon />
          <p>Top Modle</p>
        </div>
      </div>
      {/* --------------search text---------- */}
      <span className="tw-hidden sm:tw-inline-block ">
        <div className="tw-rounded-full tw-p-0 tw-relative">
          <button className="tw-absolute tw-right-4 tw-top-[50%] tw-translate-y-[-50%]">
            <SearchIcon className="tw-text-text-black" />
          </button>
          <input
            className="tw-rounded-full tw-bg-second-color tw-border-transparent tw-outline-none tw-py-3 tw-pl-6 tw-pr-12 tw-capitalize xl:tw-w-96 lg:tw-w-[300px]"
            type="text"
            placeholder="Search Models"
            onFocus={() => setSearchShow(true)}
            onBlur={() => setSearchShow(false)}
            value={query.toString().trim().toLowerCase()}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div
          className={`tw-absolute tw-z-[120] tw-bg-gray-400 tw-h-96 tw-w-96 tw-mt-2 tw-rounded-t-xl tw-rounded-b-xl tw-text-white  ${
            searchShow ? "" : "tw-hidden"
          }`}
        >
          <ul>
            {searchData
              .filter((val) => {
                if (query == "") {
                  return
                } else if (
                  val.name.toLowerCase().includes(query.toLowerCase())
                ) {
                  return val
                }
              })
              .map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
          </ul>
        </div>
      </span>

      {/* ------------- experiment----------- */}
      {/* usertype viwer and unauth  */}

      {authContext.isLoggedIn
        ? [
            screenWidth < 600
              ? [
                  // login and at small screen and viwer
                  authContext.user.userType == "Viewer" ? (
                    <div className="">
                      <div className="tw-flex tw-self-center">
                        <button
                          className="tw-mx-4 tw-bg-dreamgirl-red tw-p-2 tw-rounded-full"
                          onClick={updateAuthContext.logout}
                        >
                          logout
                        </button>
                        <div className=" tw-ml-6">
                          <NotificationsIcon />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // login at large screen and model
                    <div className="">
                      <div className="tw-flex tw-self-center">
                        <button
                          className="tw-mx-4 tw-bg-dreamgirl-red tw-p-2 tw-rounded-full"
                          onClick={updateAuthContext.logout}
                        >
                          logout
                        </button>
                        <div className=" tw-ml-6">
                          <Link href="/rohit/goLive">
                            <a>Go live</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ),
                ]
              : [
                  // login at large screen viwer
                  authContext.user.userType == "Viewer" ? (
                    <div className="sm:tw-flex sm:tw-justify-between tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black tw-shadow-lg ">
                      <button
                        className="tw-mx-4 tw-bg-dreamgirl-red tw-p-2 tw-rounded-full"
                        onClick={updateAuthContext.logout}
                      >
                        logout
                      </button>
                      <div className="tw-mx-8">
                        <NotificationsIcon />
                      </div>
                      <div className="tw-mr-4">
                        <img
                          className="tw-rounded-full tw-w-12 tw-h-12 flex tw-items-center tw-justify-center  tw-bg-green-400 tw-shadow-lg"
                          src="/pp.jpg"
                        ></img>
                      </div>
                    </div>
                  ) : (
                    // login at large screen viewer
                    <div className="sm:tw-flex sm:tw-justify-between tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black tw-shadow-lg ">
                      <button
                        className="tw-mx-4 tw-bg-dreamgirl-red tw-p-2 tw-rounded-full"
                        onClick={updateAuthContext.logout}
                      >
                        logout
                      </button>
                      <div>
                        <MonetizationOnIcon />
                      </div>
                      <button className="tw-mx-8 tw-bg-dreamgirl-red tw-p-2 tw-rounded-full">
                        {hide ? (
                          <Link href="/">
                            <a>stop Broadcasting</a>
                          </Link>
                        ) : (
                          <Link href="/rohit/goLive">
                            <a>Start Broadcasting</a>
                          </Link>
                        )}
                      </button>
                      <div className="tw-mr-4">
                        <img
                          className="tw-rounded-full tw-w-12 tw-h-12 flex tw-items-center tw-justify-center  tw-bg-green-400 tw-shadow-lg"
                          src="/pp.jpg"
                        ></img>
                      </div>
                    </div>
                  ),
                ],
          ]
        : // if not sign in is below
          [
            screenWidth < 600 ? (
              [
                menu === true ? (
                  <div className="tw-items-center sm:tw-flex-row tw-flex-col  tw-absolute tw-z-[105] sm:tw-top-0 tw-top-32 tw-right-1  tw-bg-second-color tw-w-9/12 tw-py-4 tw-px-4">
                    <div className="tw-flex tw-justify-between tw-px-2  ">
                      <div className="tw-flex tw-items-center">
                        <div className="tw-rounded-full tw-bg-green-400 tw-h-2 tw-w-2 tw-flex tw-items-center tw-justify-center"></div>
                        <p className="tw-pl-1 tw-pr-2">4555</p>
                        <p>LIVE </p>
                      </div>

                      <div className="tw-flex tw-items-center tw-pl-4">
                        <BarChartIcon />
                        <p>Top Model</p>
                      </div>
                    </div>
                    <button
                      className="tw-rounded-full sm:tw-py-4 tw-py-2 tw-px-2 sm:tw-px-6 tw-bg-white-color tw-text-black sm:tw-mr-2 tw-m-2 md:tw-m-0 tw-text-center tw-my-4"
                      onClick={() => router.push("/auth/viewerRegistration")}
                    >
                      Create account
                    </button>
                    <button
                      className="tw-rounded-full sm:tw-py-3 tw-py-2 tw-px-2 sm:tw-px-6 tw-text-white tw-border-2 sm:tw-mr-2 tw-m-2 md:tw-m-0 tw-text-center "
                      onClick={() => router.push("auth/login")}
                    >
                      Login
                    </button>
                  </div>
                ) : (
                  <div className="tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 sm:tw-bg-first-color tw-bg-first-color tw-shadow-lg"></div>
                ),
              ]
            ) : (
              <div className="sm:tw-flex tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black tw-shadow-lg">
                <button
                  className="tw-rounded-full md:tw-py-3 tw-py-1 tw-px-2 md:tw-px-6 tw-bg-second-color sm:tw-mr-2 tw-m-2"
                  onClick={() => router.push("/auth/viewerRegistration")}
                >
                  Create account
                </button>

                <button
                  className="tw-rounded-full sm:tw-py-3 tw-py-1 tw-px-2 sm:tw-px-6 tw-bg-white-color tw-m-2 tw-text-text-black"
                  onClick={() => router.push("auth/login")}
                >
                  Login
                </button>
              </div>
            ),
          ]}
      {/* --------------------------------------------------------------*/}
      <div
        className={`sm:tw-hidden tw-mr-4 ${
          authContext.isLoggedIn ? "tw-hidden" : null
        }`}
        onClick={() => setMenu(!menu)}
      >
        <MoreVertIcon />
      </div>
    </div>
  )
}

export default Header;
