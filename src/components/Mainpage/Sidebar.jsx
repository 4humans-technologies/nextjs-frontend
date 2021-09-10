import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import HistoryIcon from "@material-ui/icons/History";
import { useSidebarStatus } from "../../app/Sidebarcontext";
import {Button } from 'react-bootstrap'


const data = [
  {
    name: "Home",
    icon: <FavoriteIcon className="tw-mr-2" />,
    number: 56,
  },
  {
    name: "Neeraj Rai",
    icon: <FavoriteIcon className="tw-mr-2" />,
    number: '05',
  },
  {
    name: "Motu bhai",
    icon: <FavoriteIcon className="tw-mr-2" />,
    number: 153,
  },
];






function Sidebar(props) {
  const sidebarStatus = useSidebarStatus();

  const showStyle = {
    transform: "translateX(0px)",

  };
  const hideStyle = {
    transform: "translateX(-100%)",
    
  };
  return (
    <div
      className="tw-bg-gray-800 md:tw-w-40 tw-min-h-screen tw-flex tw-flex-col tw-absolute tw-z-10 tw-font-sans"
      style={sidebarStatus ? showStyle : hideStyle}
    >
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <Button
          variant="secondary"
          className="tw-w-full tw-text-black tw-font-bold"
        >
          Buy Now
        </Button>
      </div>

      {data.map((item,index)=> {
        return (
          <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2 sidebar_item tw-align-middle  ">
            {/* <FavoriteIcon className="tw-mr-2" /> */}
            {item.icon}
            <p id="sidebar_item_name">{item.name}</p>
            <p className="tw-font-normal tw-text-sm tw-self-center sidebar_item_number tw-text-left">{item.number}</p>
          </div>
        );
      })}

      {/* <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <Button variant="secondary" className='tw-w-full tw-text-black tw-font-bold'>Buy Now</Button>
      </div>

      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
       variant="secondary"
        <p>Home</p>
      </div>
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <FavoriteIcon className="tw-mr-2" />
        <p>Favorites</p>
      </div>
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <ThumbUpAltIcon className="tw-mr-2" />
        <p>History</p>
      </div>
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <HistoryIcon className="tw-mr-2" />
        <p>Settings</p>
      </div>
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <HomeIcon className="tw-mr-2" />
        <p>Home</p>
      </div>

      <hr className="tw-bg-white" />

      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <HomeIcon className="tw-mr-2" />
        <p>Home_2</p>
      </div>
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <FavoriteIcon className="tw-mr-2" />
        <p>Favorites_2</p>
      </div>
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <ThumbUpAltIcon className="tw-mr-2" />
        <p>History_3</p>
      </div>
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <HistoryIcon className="tw-mr-2" />
        <p>Settings_4</p>
      </div>
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <HomeIcon className="tw-mr-2" />
        <p>Home</p>
      </div> */}
    </div>
  );
}

export default Sidebar;
