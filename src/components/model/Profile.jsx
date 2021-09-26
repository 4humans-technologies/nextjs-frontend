import React, { useState } from "react";
import CreateIcon from "@material-ui/icons/Create";
import HelpIcon from "@material-ui/icons/Help";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddIcon from "@material-ui/icons/Add";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
const Data = [
  {
    id: 1,
    Name: "Vikas Kumawat",
    Age: 22,
    From: "Rajsthan",
    Language: "Marwadi",
    Body: "Sexy",
    Specifics: "Shaven",
    Hair: "Blonde",
    Eye: "Brown",
    Subculture: "Romantic",
    profile: "/pp.jpg",
  },
];

// Image, Video uplode
let inputImage;

const videoUplode = () => {};
function Profile() {
  const [checked, setChecked] = useState(false);
  const [modelState, setModelState] = useState({
    images: [],
    videos: [],
    videoCall: 200,
    audioCall: 100,
    profile: "",
    header_image: "",
  });

  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };

  // Image uplode
  const imageUplode = (e) => {
    e.preventDefault();
    alert("clicked"), (inputImage = React.createElement("input"));
    inputImage.type("file");
    inputImage.onChange(setModelState({ images: inputImage }));
  };
  // Data fetching which make things possible
  return (
    <div>
      {/* Cover page */}
      <div className="tw-w-screen tw-relative  ">
        <img src="/swami_ji.jpg" className="tw-w-full md:tw-h-80" />
        <p className=" tw-absolute tw-z-10 tw-bottom-4 tw-bg-white tw-text-black tw-right-8 tw-py-2 tw-px-2 ">
          {" "}
          Background
          <CreateIcon className="tw-ml-2" />
        </p>
      </div>
      {/* corcle for profile picture */}
      <div className="tw-w-screen tw-bg-red-400 tw-h-28 tw-flex tw-pl-8">
        <img
          className="tw-rounded-full tw-w-32 tw-h-32 flex tw-items-center tw-justify-center tw-absolute tw-z-10 tw-mt-[-3%] tw-bg-green-400 tw-shadow-lg"
          src="/pp.jpg"
        ></img>
        <div className="tw-font-extrabold tw-text-2xl tw-text-white tw-ml-44  ">
          Sansatinal Girl
        </div>
      </div>
      {/* horizontal bar */}
      {/* Profile compy from grid */}
      <div className="tw-grid tw-grid-cols-7 tw-gap-4">
        <div className="tw-col-span-4">
          <div className="tw-bg-gray-600  tw-px-4 tw-py-4 tw-text-white tw-leading-8">
            <h1 className="tw-ml-4">My Information</h1>
            <div className="tw-grid tw-grid-cols-6 tw-gap-4 tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl">
              <div className="tw-col-span-1  ">
                <p>Intrested in</p>
                <p>From</p>
                <p>Language</p>
                <p>Age</p>
                <p>Body type</p>
                <p>Specifiv</p>
                <p>Hair</p>
                <p>Eye color</p>
                <p>SubCulture</p>
              </div>
              <div className="tw-col-span-5 ">
                <p>Intrested in</p>
                <p>From</p>
                <p>Language</p>
                <p>Age</p>
                <p>Body type</p>
                <p>Specifiv</p>
                <p>Hair</p>
                <p>Eye color</p>
                <p>SubCulture</p>
              </div>
            </div>
            <div className="tw-bg-first-color tw-my-4 tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-px-4 tw-py-2 ">
              <div className="tw-flex tw-justify-between">
                <p>
                  Epic Goal <HelpIcon />
                </p>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={checked}
                      onChange={toggleChecked}
                    />
                  }
                />
              </div>
              <div className="tw-flex tw-justify-between ">
                <p className="tw-font-extrabold tw-text-purple-500">
                  Neeraj is My Passion ,We live with It.
                </p>
                <p>0 Contributor</p>
              </div>
              <div className="tw-flex tw-justify-between ">
                <p>0 tk/2500 tk</p>
                <p className="tw-right-2">0%</p>
              </div>
            </div>
            <div className=" tw-bg-first-color tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-px-4 tw-py-2">
              <p className="tw-flex tw-justify-between">
                <p>
                  <CalendarTodayIcon /> Broadcast Schedule
                </p>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      color="primary"
                      checked={checked}
                      onChange={toggleChecked}
                    />
                  }
                />
              </p>
              <p>
                Let you Viewer know when the broadcast You see all times in tour
                current time zone -GMT +5.30 Feel free to change it. User see
                all times in their local time zones
              </p>
            </div>
            {/* Pricing */}
            <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-grid-cols-3 tw-grid tw-leading-9 tw-mt-6">
              <div className="tw-col-span-1">
                <p>Private Show</p>
                <p className="tw-my-2">Exclusive Show</p>
                <p className="tw-my-2">Spying</p>
                <p>Group Show</p>
              </div>
              <div className="tw-col-span-2">
                <div className="tw-flex  ">
                  <span className="dropdown_1 tw-bg-dark-black tw-rounded-full tw-px-4">
                    Price <ArrowDropDownIcon />
                    <ul className="dropdown_list_1 tw-rounded-t-xl tw-rounded-b-xl tw-px-8  ">
                      <li className="hover:tw-bg-gray-500 tw-w-full ">Ravi </li>
                      <li className="hover:tw-bg-gray-500 tw-w-full ">Ravi </li>
                      <li className="hover:tw-bg-gray-500 tw-w-full ">Ravi </li>
                      <li className="hover:tw-bg-gray-500 tw-w-full ">Ravi </li>
                    </ul>
                  </span>

                  <span className="dropdown_1  tw-ml-8 tw-bg-dark-black tw-rounded-full tw-px-4">
                    Time <ArrowDropDownIcon />
                    <ul className="dropdown_list_1">
                      <li>Ravi </li>
                      <li>Ravi </li>
                      <li>Ravi </li>
                      <li>Ravi </li>
                    </ul>
                  </span>
                </div>
                {/*  */}
                <div className="tw-flex  tw-my-2">
                  <span className="dropdown_1  tw-bg-dark-black tw-rounded-full tw-px-4">
                    Price <ArrowDropDownIcon />
                    <ul className="dropdown_list_1">
                      <li>Ravi </li>
                      <li>Ravi </li>
                      <li>Ravi </li>
                      <li>Ravi </li>
                    </ul>
                  </span>

                  <span className="dropdown_1 tw-ml-8 tw-bg-dark-black tw-rounded-full tw-px-4">
                    Price <ArrowDropDownIcon />
                    <ul className="dropdown_list_1">
                      <li>Ravi </li>
                      <li>Ravi </li>
                      <li>Ravi </li>
                      <li>Ravi </li>
                    </ul>
                  </span>
                </div>
                <div className="tw-bg-dark-black tw-rounded-full tw-px-4 tw-w-24 tw-my-2">
                  <span className="dropdown_1  ">
                    Price <ArrowDropDownIcon />
                    <ul className="dropdown_list_1">
                      <li>Ravi </li>
                      <li>Ravi </li>
                      <li>Ravi </li>
                      <li>Ravi </li>
                    </ul>
                  </span>
                </div>
                <div className="tw-bg-dark-black tw-rounded-full tw-px-4 tw-w-24">
                  <span className="dropdown_1  ">
                    Price <ArrowDropDownIcon />
                    <ul className="dropdown_list_1">
                      <li>Ravi </li>
                      <li>Ravi </li>
                      <li>Ravi </li>
                      <li>Ravi </li>
                    </ul>
                  </span>
                </div>
              </div>
            </div>
            {/* Pricing */}
          </div>
        </div>
        <div className="tw-col-span-3 tw-bg-gray-600  tw-text-white tw-py-8">
          <div className="tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl">
            <div className="tw-flex tw-justify-between">
              <h1>My Photos</h1>
              <CreateIcon className="tw-mr-2 tw-underline tw-text-white" />
            </div>
            {/* Make Model Clickeble in model */}
            <div className="tw-grid md:tw-grid-cols-3 tw-col-span-1 tw-py-4">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4 ">
                <AddIcon
                  className=" tw-text-gray-600 tw-align-middle tw-mt-6 tw-ml-8 add_icon "
                  fontSize="large"
                  onClick={imageUplode}
                />
                <p className="tw-inline-block tw-ml-4 ">Create Album</p>
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
            </div>
          </div>
          <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
            <div className="tw-flex tw-justify-between">
              <h1>My videos</h1>
              <CreateIcon className="tw-mr-2 tw-underline tw-text-white" />
            </div>
            {/* Make Model Clickeble in model */}
            <div className="tw-grid md:tw-grid-cols-3 tw-col-span-1 tw-py-4">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4">
                <AddIcon
                  className=" tw-text-gray-600 tw-align-middle tw-mt-6 tw-ml-8 "
                  fontSize="large"
                  onClick={videoUplode}
                />

                <p className="tw-inline-block tw-ml-4 ">Create Album</p>
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
