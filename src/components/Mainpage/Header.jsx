import React, { useState, useEffect, useCallback, useRef } from "react"
import MenuIcon from "@material-ui/icons/Menu"
import SearchIcon from "@material-ui/icons/Search"
import BarChartIcon from "@material-ui/icons/BarChart"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import ClearIcon from "@material-ui/icons/Clear"
import Image from "next/image"
import { useRouter } from "next/router"
import logo from "../../../public/logo.png"
import { useWidth } from "../../app/Context"
import { useSidebarStatus, useSidebarUpdate } from "../../app/Sidebarcontext"
import Link from "next/link"
import { useAuthContext } from "../../app/AuthContext"
import Headerprofile from "./Header/Headerprofile"
import Headerui from "../UI/HeaderUI"
import io from "../../socket/socket"
import { useSocketContext } from "../../app/socket/SocketContext"
import ModelDetailHeader from "../ViewerScreen/ModelDetailHeader"
import Notifications from "./Header/Notifications"
import AdjustIcon from "@material-ui/icons/Adjust"
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord"

const initialNotifications = [
  {
    message: "neeraj followed you",
    tag: "viewer-follow",
    data: {
      name: "neeraj rai",
      profileImage: "/male-model.jpg",
      _id: "hjk87897jhk886h4h4kl3j45jk",
    },
    time: 1639626202369,
  },
  {
    message: "neeraj tipped you 50 coins",
    tag: "viewer-coins-gift",
    data: {
      viewer: {
        name: "neeraj rai",
        profileImage: "/male-model.jpg",
        _id: "hjk87897jhk886h4h4kl3j45jk",
      },
      modelGot: 36,
      amount: 50,
    },
    time: 1639626202369,
  },
  {
    message: "neeraj purchased your matrix video album from 100 coins",
    tag: "video-album-purchase",
    data: {
      viewer: {
        name: "neeraj rai",
        profileImage: "/male-model.jpeg",
        _id: "hjk87897jhk886h4h4kl3j45jk",
      },
      albumCost: 100,
      debited: 80,
      album: {
        _id: "jkh43hj43kj34h5j534jk3",
        name: "matrix",
      },
    },
    time: 1639626202369,
  },
]

function Header(props) {
  const [menu, setMenu] = useState(false)
  const [searchShow, setSearchShow] = useState(false)
  const [headerProfileShow, setHeaderProfileShow] = useState(false)
  const [query, setQuery] = useState("")
  const [searchData, setSearchData] = useState([])
  const [liveModels, setLiveModels] = useState(0)
  const [notifications, setNotification] = useState(initialNotifications)

  /* 
    notification schema 
    {
      msg:"",
      time:"",
      viewed:"",
      tag:""
    }
  */

  const [showNotifications, setShowNotification] = useState(false)

  /* need to add search parmeters */
  const screenWidth = useWidth()
  const router = useRouter()
  const sidebarStatus = useSidebarStatus()
  const sidebarUpdate = useSidebarUpdate()
  const authContext = useAuthContext()
  const socketCtx = useSocketContext()

  // This to the hide the header UI to the click to  the outside of ref

  const [hide, setHide] =
    useState(false) /* control display of go live button */
  const [showSecondHeader, setShowSecondHeader] =
    useState(true) /* control display of secondHeader */
  const [modelData, setModelData] = useState({
    // profileImage, username, isStreaming, onCall
    hasData: false,
    username: "",
    profileImage: "",
    isStreaming: "",
    onCall: "",
  })

  /* show banner for email conformation */
  const sessionVal =
    typeof window !== "undefined"
      ? sessionStorage.getItem("emailPromptShown") !== "true"
      : true
  const [emailPrompt, setEmailConfirmPrompt] = useState(
    !authContext.user.user?.inProcessDetails?.emailVerified && sessionVal
  )
  const [shownToken, setShownToken] = useState(true)
  // Make sure that the show token created once the fronend load
  const tokenSession =
    typeof window !== "undefined"
      ? authContext.isLoggedIn
        ? authContext.user.userType === "Viewer"
          ? sessionStorage.getItem("showToken")
            ? false
            : true
          : false
        : true
      : false

  const hideEmailPrompt = useCallback(() => {
    setEmailConfirmPrompt(false)
    sessionStorage.setItem("emailPromptShown", "true")
  }, [])

  /* conditionally show go live button based on the page */

  const hideBuyToken = () => {
    setShownToken(false)
    sessionStorage.setItem("showToken", false)
  }

  useEffect(() => {
    if (window.location.pathname.includes("/goLive")) {
      setHide(true)
    }
    if (window.location.pathname.includes("/view-stream/")) {
      setShowSecondHeader(false)
    }

    fetch("/api/website/compose-ui/get-live-models-count")
      .then((res) => res.json())
      .then((data) => {
        setLiveModels(+data.liveNow)
      })
      .catch((err) => alert(err.message))

    const handleRouteChange = (url) => {
      /* decide display of go live button */
      if (url.includes("/goLive")) {
        setHide(true)
      } else {
        setHide(false)
      }

      /* decide display of second header */
      if (url.includes("/view-stream/")) {
        setShowSecondHeader(false)
      } else {
        setShowSecondHeader(true)
      }
    }

    const handleModelData = (e) => {
      if (e.detail?.turnStatus) {
        switch (e.detail.turnStatus) {
          case "isStreaming":
            setModelData((prev) => {
              return {
                ...prev,
                isStreaming: true,
                onCall: false,
              }
            })
            break
          case "onCall":
            setModelData((prev) => {
              return {
                ...prev,
                isStreaming: false,
                onCall: true,
              }
            })
            break
          case "offline":
            setModelData((prev) => {
              return {
                ...prev,
                isStreaming: false,
                onCall: false,
              }
            })
            break
          default:
            break
        }
      } else {
        setModelData({
          hasData: true,
          ...e.detail.viewer,
        })
      }
    }

    document.addEventListener("model-profile-data-fetched", handleModelData, {
      passive: true,
    })
    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
      document.removeEventListener(
        "model-profile-data-fetched",
        handleModelData
      )
    }
  }, [])

  /* setup live count listeners */
  useEffect(() => {
    if (socketCtx.socketSetupDone) {
      const socket = io.getSocket()

      const streamCreateHandler = (data) => {
        setLiveModels(data.liveNow)
      }
      socket.on("new-model-started-stream", streamCreateHandler)

      const streamDeleteHandler = (data) => {
        setLiveModels(data.liveNow)
      }
      socket.on("delete-stream-room", streamDeleteHandler)

      const callEndHandler = (liveNow) => {
        setLiveModels(liveNow)
      }
      socket.on("a-call-ended", callEndHandler)

      const notificationHandler = (subEvent, data) => {
        const notifications = localStorage.getItem("notifications") || []
        const easyData = {
          ...data,
          data: JSON.parse(data.data),
          time: Date.now(),
        }
        notifications.push(easyData)
        switch (subEvent) {
          case "viewer-follow":
            break

          default:
            break
        }

        localStorage.setItem("notifications", JSON.stringify(notifications))
      }

      socket.on("new-notification", notificationHandler)

      return () => {
        if (
          socket.hasListeners("new-model-started-stream") &&
          streamCreateHandler
        ) {
          socket.off("new-model-started-stream", streamCreateHandler)
        }
        if (socket.hasListeners("delete-stream-room") && streamDeleteHandler) {
          socket.off("delete-stream-room", streamDeleteHandler)
        }
        if (socket.hasListeners("a-call-ended") && callEndHandler) {
          socket.off("a-call-ended", callEndHandler)
        }
        socket.off("new-notification", notificationHandler)
      }
    }
  }, [socketCtx.socketSetupDone])

  useEffect(() => {
    fetch("/api/website/compose-ui/get-live-models-count")
      .then((res) => res.json())
      .then((data) => {
        setLiveModels(+data.liveNow)
      })
      .catch((err) => alert(err.message))
  }, [])

  // Search implementation karna hai
  useEffect(() => {
    fetch("/api/website/compose-ui/get-all-models")
      .then((res) => res.json())
      .then((data) => console.log(data))
  }, [])

  return (
    <div className="tw-min-w-full tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-[400]">
      {/* HEADER */}
      <div className="tw-relative tw-flex tw-items-center tw-justify-between tw-bg-dark-black tw-text-white  tw-py-1 sm:tw-pr-4 tw-pl-4 tw-z-[410] tw-pt-2">
        {/* ------------------------ */}
        <div className="tw-flex tw-text-center">
          <div onClick={sidebarUpdate} className="tw-self-center tw-mr-4">
            {sidebarStatus ? <ClearIcon /> : <MenuIcon />}
          </div>
          <Link href="/">
            <a className="tw-z-50 tw-cursor-pointer">
              <Image src={logo} width={110} height={56} />
            </a>
          </Link>
        </div>
        {/* ------------------------ */}
        <div className="md:tw-flex md:tw-items-center tw-hidden">
          {liveModels > 0 ? (
            <div className="tw-flex tw-items-center tw-font-medium tw-text-green-color">
              <span className="tw-pr-2">{liveModels}</span>
              <span className="">Live</span>
            </div>
          ) : null}

          {/* this has been made transparent */}
          <div className="lg:tw-flex tw-items-center tw-pl-4 tw-hidden tw-text-transparent">
            <BarChartIcon />
            <p>Top Models</p>
          </div>
        </div>
        {/* --------------search text---------- */}
        <span className="tw-hidden sm:tw-inline-block tw-relative">
          <div className="tw-rounded-full tw-p-0 tw-relative ">
            <button className="tw-absolute tw-right-4 tw-top-[50%] tw-translate-y-[-50%]">
              <SearchIcon className="tw-text-text-black" />
            </button>
            <input
              className="tw-rounded-full tw-bg-second-color tw-border-transparent tw-outline-none tw-py-2 tw-pl-6 tw-pr-12 tw-capitalize xl:tw-w-96 lg:tw-w-[300px]"
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
                          <Headerui manu={setMenu} liveModels={liveModels} />
                        )}
                        <div className="tw-flex tw-items-center tw-flex-shrink-0 tw-flex-nowrap">
                          {/* <span className="tw-relative">
                             <button
                               onClick={() =>
                                 setShowNotification((prev) => !prev)
                               }
                               className="tw-text-white-color tw-pr-5 bell-four"
                             >
                               {notifications.length > 0 ? (
                                 <NotificationsActiveIcon fontSize="small" />
                               ) : (
                                 <NotificationsIcon />
                               )}
                             </button>
                             <Notifications
                               show={showNotifications}
                               notifications={notifications}
                             />
                           </span> */}
                          {/* Here i have to add the buy now button  */}
                          <button
                            className="tw-bg-red-500 tw-rounded-full tw-font-bold tw-capitalize tw-px-2 tw-mx-2 tw-py-1"
                            onClick={() => router.push("/user/payment")}
                          >
                            Buy Now
                          </button>
                          {/* Here i have to add the buy now button  */}

                          <div
                            className="tw-flex tw-self-center"
                            onClick={() => router.push(`/user/payment`)}
                          >
                            <img
                              src="/coins.png"
                              alt=""
                              className="tw-w-4 tw-h-4 tw-text-white tw-my-auto"
                            />
                            <p className="tw-self-center tw-pl-2">
                              {(authContext.user.user.relatedUser?.wallet.currentAmount).toFixed(
                                0
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // login at smaller screen and model
                      <div>
                        {menu && (
                          <Headerui manu={setMenu} liveModels={liveModels} />
                        )}
                        <div className="tw-flex tw-self-center">
                          {!hide && (
                            <Link
                              href={`/${authContext.user.user.username}/goLive`}
                            >
                              <a className="tw-bg-red-500 hover:tw-bg-white  hover:tw-text-red-500  tw-font-bold tw-text-white tw-outline-none tw-capitalize tw-px-2 tw-py-1`  tw-inline-block tw-mx-3 tw-rounded-full  tw-whitespace-nowrap">
                                <AdjustIcon /> Go Live
                              </a>
                            </Link>
                          )}
                          <div className="tw-flex tw-items-center  tw-flex-shrink-0 tw-flex-nowrap">
                            {/* <span className="tw-relative">
                               <button
                                 onClick={() =>
                                   setShowNotification((prev) => !prev)
                                 }
                                 className="tw-text-white-color tw-pr-5 bell-four"
                               >
                                 {notifications.length > 0 ? (
                                   <NotificationsActiveIcon fontSize="small" />
                                 ) : (
                                   <NotificationsIcon />
                                 )}
                               </button>
                               <Notifications
                                 show={showNotifications}
                                 notifications={notifications}
                               />
                             </span> */}

                            <img
                              src="/coins.png"
                              alt=""
                              className="tw-w-4 tw-h-4 tw-text-white"
                              onClick={() =>
                                router.push(
                                  `/${authContext.user.user.username}/settingToken`
                                )
                              }
                            />
                            <p className="tw-self-center tw-pl-2">
                              {(authContext.user.user.relatedUser?.wallet.currentAmount).toFixed(
                                0
                              )}
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
                        <div className="tw-mx-4 tw-flex tw-items-center tw-flex-shrink-0 tw-flex-nowrap">
                          {/* <span className="tw-relative">
                             <button
                               onClick={() =>
                                 setShowNotification((prev) => !prev)
                               }
                               className="tw-text-white-color tw-pr-5 bell-four"
                             >
                               {notifications.length > 0 ? (
                                 <NotificationsActiveIcon fontSize="small" />
                               ) : (
                                 <NotificationsIcon />
                               )}
                             </button>
                             <Notifications
                               show={showNotifications}
                               notifications={notifications}
                             />
                           </span> */}
                          {/* HERE To add the buy now button  */}
                          <button
                            className="tw-bg-red-500 tw-rounded-full tw-font-bold tw-capitalize tw-px-2 tw-mr-4 tw-py-1"
                            onClick={() => router.push("/user/payment")}
                          >
                            Buy Now
                          </button>
                          {/* HERE To add the buy now button  */}
                          <img
                            src="/coins.png"
                            alt=""
                            className="tw-w-5 tw-h-5 tw-text-white"
                            onClick={() => router.push(`/user/payment`)}
                          />
                          <p className="tw-my-auto tw-ml-2 tw-font-bold">
                            {(authContext.user.user.relatedUser?.wallet.currentAmount).toFixed(
                              0
                            )}
                          </p>
                        </div>
                        <div
                          className="tw-mr-4  tw-cursor-pointer profileImage"
                          onClick={() => setHeaderProfileShow((prev) => !prev)}
                        >
                          {authContext.user.user.relatedUser?.profileImage ? (
                            <img
                              className="tw-rounded-full tw-w-8 tw-h-8 flex tw-items-center tw-justify-center tw-bg-dreamgirl-red tw-text-4xl tw-object-cover tw-border-white-color tw-border-2"
                              src={
                                authContext.user.user.relatedUser.profileImage
                              }
                            />
                          ) : (
                            <div className="tw-bg-dreamgirl-red tw-rounded-full tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-ring-2 tw-ring-white-color">
                              <span className="tw-text-4xl tw-text-white-color tw-font-light">
                                {authContext.user.user?.username
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                          {/* profile */}
                          <div
                            className={`tw-absolute tw-z-[120] tw-bg-second-color  tw-w-48 tw-mt-0 tw-rounded tw-text-white tw-right-4 headerUI `}
                          >
                            <Headerprofile userType="Viewer" />
                          </div>
                          {/* profile */}
                        </div>
                      </div>
                    ) : (
                      // login at large screen model
                      <div className="sm:tw-flex sm:tw-justify-between tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black  ">
                        <div className="tw-flex tw-items-center tw-mr-3  tw-flex-shrink-0 tw-flex-nowrap">
                          {/* <span className="tw-relative">
                             <button
                               onClick={() =>
                                 setShowNotification((prev) => !prev)
                               }
                               className="tw-text-white-color tw-pr-5 bell-four"
                             >
                               {notifications.length > 0 ? (
                                 <NotificationsActiveIcon fontSize="small" />
                               ) : (
                                 <NotificationsIcon />
                               )}
                             </button>
                             <Notifications
                               show={showNotifications}
                               notifications={notifications}
                             />
                           </span> */}
                        </div>
                        <div className="tw-mx-4 tw-flex ">
                          <img
                            src="/coins.png"
                            alt=""
                            className="tw-w-5 tw-h-5 tw-text-white"
                            onClick={() =>
                              router.push(
                                `/${authContext.user.user.username}/settingToken`
                              )
                            }
                          />
                          <p className="tw-my-auto tw-ml-2">
                            {(authContext.user.user.relatedUser?.wallet.currentAmount).toFixed(
                              0
                            )}
                          </p>
                        </div>
                        {!hide && (
                          <Link
                            href={`/${authContext.user.user.username}/goLive`}
                          >
                            <a className="tw-bg-red-500 tw-my-auto tw-font-bold tw-text-white hover:tw-bg-white hover:tw-text-red-500  tw-outline-none tw-capitalize tw-px-2 tw-py-1  tw-inline-block tw-mx-3 tw-rounded-full  tw-whitespace-nowrap">
                              <FiberManualRecordIcon />{" "}
                              <span className="tw-mr-1 ">Go Live </span>
                            </a>
                          </Link>
                        )}
                        <div
                          className="tw-mr-4 tw-cursor-pointer profileImage"
                          onClick={() => setHeaderProfileShow((prev) => !prev)}
                        >
                          {/* if image is not available then show the Name else show the image */}
                          {authContext.user.user.relatedUser?.profileImage ? (
                            <img
                              className="tw-rounded-full tw-w-8 tw-h-8 flex tw-items-center tw-justify-center  tw-bg-dreamgirl-red tw-text-4xl  tw-object-cover tw-border-white-color tw-border-2"
                              src={
                                authContext.user.user.relatedUser.profileImage
                              }
                            />
                          ) : (
                            <div className="tw-bg-dreamgirl-red tw-rounded-full tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-ring-2 tw-ring-white-color">
                              <span className="tw-text-4xl tw-text-white-color tw-font-light">
                                {authContext.user.user.username
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}

                          {/* Profile  */}
                          <div
                            className={`tw-absolute tw-z-[120] tw-bg-second-color  tw-w-48 tw-mt-0 tw-rounded-t-xl tw-rounded-b-xl tw-text-white tw-right-4 headerUI `}
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
                <div>
                  {menu && <Headerui liveModels={liveModels} manu={setMenu} />}
                </div>
              ) : (
                <div className="sm:tw-flex tw-items-center sm:tw-flex-row tw-flex-col sm:tw-static tw-absolute sm:tw-top-0 tw-top-12 tw-right-1 tw-bg-dark-black tw-shadow-lg">
                  <button
                    className="tw-rounded-full  tw-py-2 tw-px-4 md:tw-px-6 tw-bg-second-color sm:tw-mr-2 tw-m-2 tw-text-sm md:tw-text-base"
                    onClick={() => router.push("/auth/viewerRegistration")}
                  >
                    Register
                  </button>

                  <button
                    className="tw-rounded-full  tw-py-2 tw-px-4 md:tw-px-6 tw-bg-white-color tw-m-2 tw-text-text-black tw-text-sm md:tw-text-base"
                    onClick={() => router.push("/auth/login")}
                  >
                    Login
                  </button>
                </div>
              ),
            ]}
        {/* --------------------------------------------------------------*/}
        <div className={`sm:tw-hidden tw-mr-4`} onClick={() => setMenu(!menu)}>
          <MoreVertIcon />
        </div>
      </div>
      {/* VIEWER EMAIL PROMPT */}
      <div className="tw-py-0 tw-my-0">
        {/* {authContext.isLoggedIn &&
          !authContext.user.user?.inProcessDetails?.emailVerified &&
          emailPrompt &&
          authContext.user.userType === "Viewer" && (
            <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-1 tw-text-white-color tw-font-medium tw-text-sm tw-bg-dreamgirl-red">
              <span>
                Please check your email inbox & confirm your email, to claim
                your
                <span className="tw-font-mono tw-font-semibold tw-mx-1 tw-text-base">
                  9999
                </span>
                FREE COINS and prevent your account from suspension.
              </span>
              <button
                onClick={hideEmailPrompt}
                className="tw-text-white-color tw-text-lg tw-ml-3 tw-font-mono"
              >
                x
              </button>
            </div>
          )} */}
        {/* This is for the Buy coin */}
        {tokenSession && shownToken && (
          <div className="tw-capitalize tw-font-semibold tw-items-center tw-justify-between tw-px-4 tw-py-1 tw-text-sm tw-bg-white tw-flex">
            <Link href="/user/payment">
              <a className="tw-block tw-w-full tw-text-xs sm:tw-text-sm">
                <span className="tw-text-red-500"> No coins ?</span>{" "}
                <span className="tw-text-green-600">Buy Instantly using</span>
                <span className="tw-font-semibold tw-mx-1">
                  Gpay, <span className="tw-text-purple-500">PhonPay</span>,{" "}
                  <span className="tw-text-blue-600">paytm</span> or{" "}
                  <span className="tw-text-green-600">UPI</span>
                </span>
                <span className="tw-text-red-600">Get upto 30% off.</span>
                <button className="tw-text-white hover:tw-text-white-color tw-font-semibold tw-rounded-full tw-px-2 tw-py-1 tw-bg-green-400 tw-ml-2 tw-text-xs">
                  <Link href="/user/payment">
                    <a>Buy Now</a>
                  </Link>
                </button>
              </a>
            </Link>
            <button
              onClick={() => hideBuyToken()}
              className="tw-text-black tw-text-lg tw-ml-3 tw-font-mono tw-px-2"
            >
              x
            </button>
          </div>
        )}
        {/* MODEL EMAIL PROMPT */}
        {/* {authContext.isLoggedIn &&
          !authContext.user.user?.inProcessDetails?.emailVerified &&
          emailPrompt &&
          authContext.user.userType === "Model" && (
            <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-1 tw-text-white-color tw-font-medium tw-text-sm tw-bg-dreamgirl-red">
              Please check your email inbox & confirm your email, else you will
              NOT be verified and will NOT be able to go live & your account
              will be CLOSED after 2 days.
              <button
                onClick={hideEmailPrompt}
                className="tw-text-white-color tw-text-lg tw-ml-3 tw-font-mono"
              >
                x
              </button>
            </div>
          )} */}
      </div>
      {showSecondHeader ? null : <ModelDetailHeader data={modelData} />}
    </div>
  )
}

export default React.memo(Header)
