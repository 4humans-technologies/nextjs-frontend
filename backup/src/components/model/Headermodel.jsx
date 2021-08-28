import React from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CategoryIcon from "@material-ui/icons/Category";

function Headermodel() {
  return (
    <div className="bg-gray-600 pt-4 pb-2 text-lg flex justify-between place-items-center">
      <div className="text-center flex text-white ">
        <div className="ml-2 mr-2">Name</div>
        <div className="ml-2 mr-2">Profile</div>
        <div className="ml-2 mr-2">Videos</div>
        <div className="ml-2 mr-2">Feed</div>
        <div class="rounded-full  px-6 bg-gray-200 flex"> Neeraj Rai</div>
      </div>
      <div className="sm:flex text-white mr-2  hidden">
        <div className="flex items-center">
          <p>Next Model</p>
          <ChevronRightIcon className=" mr-2" />
        </div>
        <div className="flex items-center">
          <CategoryIcon className=" mr-2" />
          <p>Categories</p>
        </div>
      </div>
    </div>
  );
}

export default Headermodel;
