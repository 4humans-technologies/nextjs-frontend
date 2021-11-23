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
import Headerui from "../UI/HeaderUI"

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

  // search result
  let profileImage
  if (authContext.user.user) {
    profileImage = authContext.user.user.relatedUser.profileImage
  }

  // When ever the Heder reloada sidebarshow is false
  // console.log(`Model in header ${props.liveModels}`)

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
            <p>Live </p>
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
                      <div>
                        {menu && (
                          <Headerui
                            manu={setMenu}
                            liveModels={props.liveModels}
                          />
                        )}
                        <div className="tw-flex tw-self-center">
                          <img
                            src="/coins.png"
                            alt=""
                            className="tw-w-10 tw-h-10 tw-text-white"
                          />
                          <p className="tw-self-center">
                            {
                              authContext.user.user.relatedUser.wallet
                                .currentAmount
                            }
                          </p>
                        </div>
                      </div>
                    ) : (
                      // login at smaller screen and model
                      <div>
                        {menu && (
                          <Headerui
                            manu={setMenu}
                            liveModels={props.liveModels}
                          />
                        )}
                        <div className="tw-flex tw-self-center">
                          <button className="tw-mx-4  tw-rounded-full tw-capitalize tw-px-4 tw-py-2 tw-bg-white-color tw-text-black">
                            <Link
                              href={`/${authContext.user.user.username}/goLive`}
                            >
                              <a className="tw-capitalize tw-text-sm tw-font-semibold">
                                go live
                              </a>
                            </Link>
                          </button>
                          <div className="tw-flex">
                            <img
                              src="/coins.png"
                              alt=""
                              className="tw-w-10 tw-h-10 tw-text-white"
                            />
                            <p className="tw-self-center">
                              {
                                authContext.user.user.relatedUser.wallet
                                  .currentAmount
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ),
                  ]
                : [
                    // login at large screen viwer
                    authContext.user.userType == "Viewer" ? (
                      <div className="sm:tw-flex sm:tw-justify-between tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black  ">
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
                      <div className="sm:tw-flex sm:tw-justify-between tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black  ">
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
                <div>{menu && <Headerui manu={setMenu} />}</div>
              ) : (
                <div className="sm:tw-flex tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black tw-shadow-lg">
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
        <div className={`sm:tw-hidden tw-mr-4l`} onClick={() => setMenu(!menu)}>
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
