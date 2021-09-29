import React from "react";

function help({ children, text }) {
  return (
    <div className="hover:tw-bg-black">
      {children}
      <h3>{text}</h3>
    </div>
  );
}

export default help;
