import React from "react";
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(
  () => import("../../components/model/Live"),
  { ssr: false }
)

function live() {
  return (
    <div>
      <DynamicComponent />
    </div>
  );
}

export default live;
