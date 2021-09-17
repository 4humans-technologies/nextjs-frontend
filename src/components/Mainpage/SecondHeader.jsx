import React, { useState } from "react";
import { useWidth } from "../../app/Context";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

function SecondHeader() {
  const [search, setSearch] = useState(false);
  let screenWidth = useWidth();
  return (
    <div>
      <div className="tw-flex tw-text-white tw-bg-second-color tw-border-b-4 tw-border-first-color tw-text-lg tw-top-20 tw-left-0 tw-right-0 tw-fixed tw-z-[101] tw-justify-between tw-items-center">
        {screenWidth < 600 ? (
          [
            search == true ? (
              <div className=" tw-px-2 tw-bg-dark-black tw-flex tw-w-full tw-pr-2 tw-py-2">
                <SearchIcon className="tw-outline-none " />
                <input
                  className="tw-rounded-full tw-w-full tw-bg-dark-black tw-border-transparent tw-outline-none tw-px-1 tw-text-white second_search"
                  type="text"
                  placeholder="Search Neeraj location"
                />
                <ClearIcon
                  onClick={() => setSearch((prevState) => !prevState)}
                />
              </div>
            ) : (
              <div className="tw-flex tw-justify-between">
                <div className="tw-flex">
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
                <div className="tw-flex tw-justify-self-end tw-ml-20 ">
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

        {/* <div className="tw-pr-3  ">
          {screenWidth < 600 && (
            <div className="tw-border-l-2">
              <SearchIcon
                className="tw-outline-none tw-ml-2 "
                onClick={() => setSearch((prevState) => !prevState)}
              />
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default SecondHeader;
