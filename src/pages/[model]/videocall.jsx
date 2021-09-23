import React from "react";
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(
  () => import("../../components/model/VideoCall"),
  { ssr: false }
);

function videoCall() {
  return (
    <div>
      <DynamicComponent />
    </div>
  );
}

export default videoCall;
