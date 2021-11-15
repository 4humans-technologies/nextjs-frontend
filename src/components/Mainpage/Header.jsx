import React, { useState, useEffect, useContext } from "react"
import MenuIcon from "@material-ui/icons/Menu"
import SearchIcon from "@material-ui/icons/Search"
import BarChartIcon from "@material-ui/icons/BarChart"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import ClearIcon from "@material-ui/icons/Clear"
import Image from "next/image"
import { useRouter } from "next/router"
import logo from "../../../public/logo.png"
import NotificationsIcon from "@material-ui/icons/Notifications"

import { useWidth } from "../../app/Context"
import { useSidebarStatus, useSidebarUpdate } from "../../app/Sidebarcontext"

import useModalContext from "../../app/ModalContext"
import Link from "next/link"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import Headerprofile from "./Header/Headerprofile"
import SecondHeader from "./SecondHeader"

function Header(props) {
  const [menu, setMenu] = useState(false)
  const [searchShow, setSearchShow] = useState(false)
  const [headerProfileShow, setHeaderProfileShow] = useState(false)
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

  // data for serch result
  useEffect(() => {
    fetch("/data.json")
      .then((resp) => {
        return resp.json()
      })
      .then((data) => setSearchData(data.products))
  }, [query])

  // search result
  let profileImage
  if (authContext.user.user) {
    profileImage = authContext.user.user.relatedUser.profileImage
  }

  // When ever the Heder reloada sidebarshow is false
  console.log(`Model in header ${props.liveModels}`)

  return (
    <div>
      <div className="tw-flex tw-items-center tw-justify-between tw-bg-dark-black tw-text-white tw-pt-2 tw-pb-2 tw-py-4 sm:tw-pr-4 tw-pl-4 tw-min-w-full tw-font-sans tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-[410]">
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
            <p className="tw-pl-1 tw-pr-2">
              {props.liveModels ? props.liveModels : 0}
            </p>
            <p>LIVE </p>
          </div>

          <div className="lg:tw-flex tw-items-center tw-pl-4 tw-hidden">
            <BarChartIcon />
            <p>Top Modle</p>
          </div>
        </div>
        {/* --------------search text---------- */}
        <span className="tw-hidden sm:tw-inline-block tw-relative">
          <div className="tw-rounded-full tw-p-0 tw-relative ">
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
                      <div
                        className="tw-flex tw-self-center"
                        key="(&&kjjkHG&867678JhJKh&*^"
                      >
                        <button
                          className="tw-mx-4 tw-bg-dark-black tw-shadow-lg tw-px-2 tw-rounded-full"
                          onClick={updateAuthContext.logout}
                        >
                          logout
                        </button>
                        <div className=" tw-ml-6">
                          <NotificationsIcon />
                        </div>
                      </div>
                    ) : (
                      // login at smaller screen and model
                      <div className="tw-flex tw-self-center" key="(49KJHjkh98kjjkHG&867678Jhklsd3jklJKh&*^">
                        <button
                          className="tw-mx-4 tw-bg-dark-black tw-shadow-lg tw-rounded-full tw-capitalize tw-px-4 tw-py-2"
                          onClick={updateAuthContext.logout}
                        >
                          logout
                        </button>
                        <button className="tw-mx-4  tw-rounded-full tw-capitalize tw-px-4 tw-py-2 tw-bg-white-color tw-text-black">
                          <Link
                            href={`/${authContext.user.user.username}/goLive`}
                          >
                            <a>live</a>
                          </Link>
                        </button>
                      </div>
                    ),
                  ]
                : [
                    // login at large screen viwer
                    authContext.user.userType == "Viewer" ? (
                      <div className="sm:tw-flex sm:tw-justify-between tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black" key="(iuuiu*&7897687yuiyhy7&uy(*)*0_$R3#@@#!JI^">
                        <button
                          className="tw-mx-4  tw-px-4 tw-py-2 tw-rounded-full tw-bg-none hover:tw-bg-white hover:tw-text-black hover:tw-border tw-border-white tw-capitalize"
                          onClick={updateAuthContext.logout}
                        >
                          logout
                        </button>
                        <div className="tw-mx-8 tw-flex">
                          <img
                            src="/coins.png"
                            alt=""
                            className="tw-w-10 tw-h-10 tw-text-white"
                          />
                          <div className="tw-my-auto tw-ml-2 tw-font-bold">
                            {
                              authContext.user.user.relatedUser.wallet
                                .currentAmount
                            }
                          </div>
                        </div>
                        <div
                          className="tw-mr-4  tw-cursor-pointer"
                          onClick={() => setHeaderProfileShow((prev) => !prev)}
                        >
                          {profileImage ? (
                            <img
                              className="tw-rounded-full tw-w-12 tw-h-12 flex tw-items-center tw-justify-center  tw-bg-green-400 tw-text-4xl  "
                              src={profileImage}
                            />
                          ) : (
                            <div className="tw-text-4xl tw-text-black tw-font-bold tw-bg-green-400 tw-rounded-full tw-w-12 tw-h-12 flex tw-items-center tw-justify-center tw-pl-3">
                              {authContext.user.user.username
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                          {/* profile */}
                          <div
                            className={`tw-absolute tw-z-[120] tw-bg-second-color  tw-w-48 tw-mt-2 tw-rounded-t-xl tw-rounded-b-xl tw-text-white tw-right-4 ${
                              headerProfileShow ? "" : "tw-hidden"
                            }`}
                          >
                            <Headerprofile userType="Viewer" />
                          </div>
                          {/* profile */}
                        </div>
                      </div>
                    ) : (
                      // login at large screen model
                      <div key="(49KJHreii896&*^iokje56e4543455476&*^" className="sm:tw-flex sm:tw-justify-between tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black  ">
                        <button
                          className="tw-mx-4 tw-px-4 tw-py-2 tw-rounded-full hover:tw-bg-white hover:tw-text-black hover:tw-border tw-border-white tw-capitalize"
                          onClick={updateAuthContext.logout}
                        >
                          Logout
                        </button>
                        <div className="tw-mx-4 tw-flex ">
                          <img
                            src="/coins.png"
                            alt=""
                            className="tw-w-10 tw-h-10 tw-text-white"
                          />
                          <p className="tw-my-auto tw-ml-2">
                            {
                              authContext.user.user.relatedUser.wallet
                                .currentAmount
                            }
                          </p>
                        </div>
                        {hide ? null : (
                          <Link
                            href={`/${authContext.user.user.username}/goLive`}
                          >
                            <a className="tw-bg-white-color text-sm lg:tw-text-base tw-text-black tw-outline-none tw-capitalize tw-px-4 tw-py-2 tw-inline-block tw-mx-4 tw-rounded-full hover:tw-text-black tw-whitespace-nowrap">
                              Go Live
                            </a>
                          </Link>
                        )}
                        <div
                          className="tw-mr-4 tw-cursor-pointer"
                          onClick={() => setHeaderProfileShow((prev) => !prev)}
                        >
                          {/* if image is not available then show the Name else show the image */}
                          {profileImage ? (
                            <img
                              className="tw-rounded-full tw-w-12 tw-h-12 flex tw-items-center tw-justify-center  tw-bg-green-400 tw-text-4xl  "
                              src={profileImage}
                            />
                          ) : (
                            <div className="tw-text-4xl tw-text-black tw-font-bold tw-bg-green-400 tw-rounded-full tw-w-12 tw-h-12 flex tw-items-center tw-justify-center tw-pl-3">
                              {authContext.user.user.username
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          {/* Profile  */}
                          <div
                            className={`tw-absolute tw-z-[120] tw-bg-second-color  tw-w-48 tw-mt-2 tw-rounded-t-xl tw-rounded-b-xl tw-text-white tw-right-4 ${
                              headerProfileShow ? "" : "tw-hidden"
                            }`}
                          >
                            <Headerprofile userType="Model" />
                          </div>
                          {/* Profile  */}
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
                    <div key="(49KJHreii896&*^dfsdfsdf9798&*(&pl&*^" className="tw-items-center sm:tw-flex-row tw-flex-col  tw-absolute tw-z-[105] sm:tw-top-0 tw-top-32 tw-right-1  tw-bg-second-color tw-w-9/12 tw-py-4 tw-px-4">
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
                        className="tw-rounded-full sm:tw-py-4 tw-py-2 tw-px-2 sm:tw-px-6 tw-bg-white-color tw-text-black sm:tw-mr-2 tw-m-2 md:tw-m-0 tw-text-center tw-my-4 tw-text-sm md:tw-text-base"
                        onClick={() => router.push("/auth/viewerRegistration")}
                      >
                        Sign Up
                      </button>
                      <button
                        className="tw-rounded-full sm:tw-py-3 tw-py-2 tw-px-2 sm:tw-px-6 tw-text-white tw-border-2 sm:tw-mr-2 tw-m-2 md:tw-m-0 tw-text-center tw-text-sm md:tw-text-base"
                        onClick={() => router.push("/auth/login")}
                      >
                        Login
                      </button>
                    </div>
                  ) : (
                    <div key="(49kljkl897897&*^786kjkj^%6jkhjh%^$&*^" className="tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 sm:tw-bg-first-color tw-bg-first-color tw-shadow-lg"></div>
                  ),
                ]
              ) : (
                <div key="(sdsad54545as&*^786kjkj^%6jkhjh%^$&*^" className="sm:tw-flex tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black tw-shadow-lg">
                  <button
                    className="tw-rounded-full md:tw-py-3 tw-py-2 tw-px-4 md:tw-px-6 tw-bg-second-color sm:tw-mr-2 tw-m-2 tw-text-sm md:tw-text-base"
                    onClick={() => router.push("/auth/viewerRegistration")}
                  >
                    Sign Up
                  </button>

                  <button
                    className="tw-rounded-full sm:tw-py-3 tw-py-2 tw-px-4 md:tw-px-6 tw-bg-white-color tw-m-2 tw-text-text-black tw-text-sm md:tw-text-base"
                    onClick={() => router.push("/auth/login")}
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
      {/* --------------------------------------------------------------*/}
      {/* {router.pathname.includes("/profile") ? (
        <ProfileHeader />
      ) : (
        <SecondHeader />
      )} */}
      <SecondHeader />
    </div>
  )
}

export default Header
