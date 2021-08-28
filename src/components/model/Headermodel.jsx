import React from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CategoryIcon from "@material-ui/icons/Category";

function Headermodel() {
  return (
    <div className = "tw-bg-gray-600 tw-pt-4 tw-pb-2 tw-text-lg tw-flex tw-justify-between tw-place-items-center" >
      <div className = "tw-text-center tw-flex tw-text-white" >
        <div className = "tw-ml-2 tw-mr-2" >Name</div>
        <div className = "tw-ml-2 tw-mr-2" >Profile</div>
        <div className = "tw-ml-2 tw-mr-2" >Videos</div>
        <div className = "tw-ml-2 tw-mr-2" >Feed</div>
        <div class="rounded-full  px-6 bg-gray-200 flex"> Neeraj Rai</div>
      </div>
      <div className = "sm:tw-flex tw-text-white tw-mr-2 tw-hidden" >
        <div className = "tw-flex tw-items-center" >
          <p>Next Model</p>
          <ChevronRightIcon className = "tw-mr-2" />
        </div>
        <div className = "tw-flex tw-items-center" >
          <CategoryIcon className = "tw-mr-2" />
          <p>Categories</p>
        </div>
      </div>
    </div>
  );
}

export default Headermodel;
