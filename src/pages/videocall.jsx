import React from 'react'

import dynamic from "next/dynamic";

const DynamicComponent = dynamic(
  () => import("../components/Mainpage/ModelScreen"),
  { ssr: false }
);

function videocall() {
    return (
      <div>
        <h1>Video call</h1>
        <DynamicComponent />
      </div>
    );
}

export default videocall
