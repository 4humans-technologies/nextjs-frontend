import React from "react";
let GlobalModalContent = (
  <h1 className="tw-text-center tw-text-lg">Modal Content Not Set</h1>
);

export const SetGlobalModalContent = (newContent) => {
  debugger;
  GlobalModalContent = newContent;
  return GlobalModalContent;
};

export default GlobalModalContent;
