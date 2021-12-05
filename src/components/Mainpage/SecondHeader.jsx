import React, { useState, useEffect } from "react"
import { useWidth } from "../../app/Context"
import SearchIcon from "@material-ui/icons/Search"
import ClearIcon from "@material-ui/icons/Clear"
import { useRouter } from "next/router"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

// Pending list
// 1) Search list

function SecondHeader() {
  const [search, setSearch] = useState(false)
  const [isStream, setIsstream] = useState(false)
  const router = useRouter()
  const authContext = useAuthContext()
  useEffect(() => {
    if (
      router.pathname.includes("view-stream") ||
      router.pathname.includes("goLive") ||
      router.pathname.includes("/user/[name]") ||
      router.pathname.includes("/profile")
    ) {
      setIsstream(true)
    } else {
      setIsstream(false)
    }
  }, [])

  let screenWidth = useWidth()

  const scrollDown = () => {
    if (typeof window == "undefined") {
    } else {
      if (screenWidth > 768) {
        window.scroll(0, 600)
      } else {
        window.scroll(0, 1000)
      }
    }
  }

  return (
    <div className="tw-flex tw-text-white tw-bg-first-color tw-text-lg md:tw-justify-between tw-items-center tw-border-dark-black tw-shadow-md">
      {screenWidth < 600
        ? [
            search == true ? (
              <div className=" tw-px-2 tw-bg-dark-black tw-flex tw-w-full tw-pr-2 tw-py-2">
                <SearchIcon className="tw-outline-none " />
                <input
                  className="tw-rounded-full tw-w-full tw-bg-dark-black tw-border-transparent tw-outline-none tw-px-1 tw-text-white second_search"
                  type="text"
                  placeholder="Search Neeraj"
                />
                <ClearIcon
                  onClick={() => setSearch((prevState) => !prevState)}
                />
              </div>
            ) : (
              [
                isStream ? (
                  <div className="tw-grid tw-grid-cols-8 tw-w-full tw-gap-x-2">
                    <div className=" tw-col-span-7 tw-flex tw-justify-around">
                      <div className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2">
                        {authContext?.isLoggedIn
                          ? authContext.user.user?.username
                          : null}
                      </div>
                      <div
                        className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
                        onClick={scrollDown}
                      >
                        Profile
                      </div>
                      <div
                        className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2"
                        onClick={scrollDown}
                      >
                        Image
                      </div>
                      <div
                        className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2"
                        onClick={scrollDown}
                      >
                        {/* Videos */}
                        {screenWidth}
                      </div>
                    </div>
                    <div className=" tw-col-span-1 tw-flex tw-items-center">
                      <div className="tw-border-l-2 tw-w-full tw-self-center  ">
                        <SearchIcon
                          className="tw-outline-none tw-ml-2 "
                          onClick={() => setSearch((prevState) => !prevState)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tw-grid tw-grid-cols-8 tw-w-full tw-gap-x-2">
                    <div className=" tw-col-span-7 tw-flex tw-justify-around">
                      <div className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2">
                        Girls
                      </div>
                      <div className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2">
                        Couple
                      </div>
                      <div className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2">
                        Guys
                      </div>
                      <div className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2">
                        {/* Trans */}
                        {screenWidth}
                      </div>
                    </div>
                    <div className=" tw-col-span-1 tw-flex tw-items-center">
                      <div className="tw-border-l-2 tw-w-full tw-self-center  ">
                        <SearchIcon
                          className="tw-outline-none tw-ml-2 "
                          onClick={() => setSearch((prevState) => !prevState)}
                        />
                      </div>
                    </div>
                  </div>
                ),
              ]
            ),
          ]
        : [
            isStream ? (
              <div className="tw-flex tw-my-auto">
                <div className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer">
                  {authContext.user.user
                    ? authContext.user.user.username
                    : null}
                </div>
                <div
                  className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
                  onClick={scrollDown}
                >
                  Profile
                </div>
                <div
                  className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer "
                  onClick={scrollDown}
                >
                  Image
                </div>
                <div
                  className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer"
                  onClick={scrollDown}
                >
                  Videos
                </div>
                <div className="tw-px-4 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer">
                  {screenWidth}
                </div>
              </div>
            ) : (
              <div className="tw-flex tw-my-auto">
                <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
                  Girls
                </div>
                <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
                  Couple
                </div>
                <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
                  Guys
                </div>
                <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
                  Trans
                </div>
                <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
                  {screenWidth}
                </div>
              </div>
            ),
          ]}
    </div>
  )
}

export default SecondHeader
