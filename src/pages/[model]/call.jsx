import React from "react";
// import Audio from "../../components/Mainpage/Audio";
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(
  () => import("../../components/Mainpage/Audio"),
  { ssr: false }
);

function call() {
  return (
    <div>
      <DynamicComponent />
    </div>
  );
}

export default call;
