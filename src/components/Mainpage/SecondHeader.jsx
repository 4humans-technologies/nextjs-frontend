import React, { useState, useEffect } from "react"
import { useWidth } from "../../app/Context"
import SearchIcon from "@material-ui/icons/Search"
import ClearIcon from "@material-ui/icons/Clear"
import { useRouter } from "next/router"

// Pending list
// 1) Search list

function SecondHeader() {
  const [search, setSearch] = useState(false)
  const [isStream, setIsstream] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (
      router.pathname.includes("view-stream") ||
      router.pathname.includes("goLive")
    ) {
      setIsstream(true)
    } else {
      setIsstream(false)
    }
  }, [])

  let screenWidth = useWidth()

  return (
    <div>
      <div className="tw-flex tw-text-white tw-bg-second-color tw-pt-6  md:tw-pt-2  tw-text-lg tw-top-12 md:tw-top-20  tw-left-0 tw-right-0  tw-z-[101] md:tw-justify-between tw-items-center  tw-fixed">
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
                          Name
                        </div>
                        <div className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2 tw-cursor-pointer">
                          Profile
                        </div>
                        <div className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2">
                          Image
                        </div>
                        <div className="sm:tw-ml-2 sm:tw-mr-2 tw-mx-1 hover:tw-bg-first-color tw-py-2">
                          Videos
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
                          Trans
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
                  <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
                    Name
                  </div>
                  <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
                    Profile
                  </div>
                  <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
                    Image
                  </div>
                  <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
                    Videos
                  </div>
                  <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
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
    </div>
  )
}

export default SecondHeader
