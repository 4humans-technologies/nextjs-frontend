import React from "react";

function Card({ children }) {
  return (
    <div className="tw-bg-second-color tw-py-4 tw-px-4 tw-rounded-md  tw-h-32  tw-mx-4 tw-my-4">
      {children}
    </div>
  )
}

export default Card;
