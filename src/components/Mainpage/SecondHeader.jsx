import React, { useState } from "react";
import { useWidth } from "../../app/Context";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

// Pending list
// 1) Search list 

function SecondHeader() {
  const [search, setSearch] = useState(false);
  let screenWidth = useWidth();
  return (
    <div>
      <div className="tw-flex tw-text-white tw-bg-second-color  tw-text-lg tw-top-20 tw-left-0 tw-right-0  tw-z-[101] md:tw-justify-between tw-items-center tw-min-w-[100vw] ">
        {screenWidth < 600 ? (
          [
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
        ) : (
          <div className="tw-flex tw-my-auto">
            <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">Girls</div>
            <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
              Couple
            </div>
            <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">Guys</div>
            <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">Trans</div>
            <div className="tw-px-4 hover:tw-bg-first-color tw-py-2">
              {screenWidth}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SecondHeader;
