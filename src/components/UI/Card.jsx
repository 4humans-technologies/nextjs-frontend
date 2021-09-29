import React from "react";

function Card({ children }) {
  return (
    <div className="tw-bg-first-color tw-py-4 tw-px-4 tw-rounded-t-xl tw-rounded-b-xl tw-w-52 tw-h-32  tw-mx-4 tw-my-4 hover:tw-shadow-2xl ">
      {children}
    </div>
  );
}

export default Card;
