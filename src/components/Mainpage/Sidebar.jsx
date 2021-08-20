import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import HistoryIcon from "@material-ui/icons/History";

function Sidebar() {
  return (
    <div className="bg-gray-800 md:w-40 min-h-screen flex flex-col ">
      <div className="flex text-white pt-4 pb-2 pr-2 pl-2">
        <HomeIcon className="mr-2" />
        <p>Home</p>
      </div>
      <div className="flex text-white  pt-4 pb-2 pr-2 pl-2">
        <FavoriteIcon className="mr-2" />
        <p>Favorites</p>
      </div>
      <div className="flex text-white  pt-4 pb-2 pr-2 pl-2">
        <ThumbUpAltIcon className="mr-2" />
        <p>History</p>
      </div>
      <div className="flex text-white  pt-4 pb-2 pr-2 pl-2">
        <HistoryIcon className="mr-2" />
        <p>Settings</p>
      </div>
      <div className="flex text-white  pt-4 pb-2 pr-2 pl-2">
        <HomeIcon className="mr-2" />
        <p>Home</p>
      </div>

      <hr className="bg-white" />

      <div className="flex text-white pt-4 pb-2 pr-2 pl-2">
        <HomeIcon className="mr-2" />
        <p>Home_2</p>
      </div>
      <div className="flex text-white  pt-4 pb-2 pr-2 pl-2">
        <FavoriteIcon className="mr-2" />
        <p>Favorites_2</p>
      </div>
      <div className="flex text-white  pt-4 pb-2 pr-2 pl-2">
        <ThumbUpAltIcon className="mr-2" />
        <p>History_3</p>
      </div>
      <div className="flex text-white  pt-4 pb-2 pr-2 pl-2">
        <HistoryIcon className="mr-2" />
        <p>Settings_4</p>
      </div>
      <div className="flex text-white  pt-4 pb-2 pr-2 pl-2">
        <HomeIcon className="mr-2" />
        <p>Home</p>
      </div>
    </div>
  );
}

export default Sidebar;
