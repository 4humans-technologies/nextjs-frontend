import React from "react";
import { useViewerContext } from "../../app/Viewercontext";
import { useViewerUpdateContext } from "../../app/Viewercontext";
import Modal from "./Modal";
import { useRouter } from "next/router";

function ProtectedHOC(WrappedComponent) {
  return (props) => {
    if (typeof window !== "undefined") {
      const ctx = useViewerContext();
      const router = useRouter();
      //   checks whether on windows or on server
      if (!ctx.isLoggedIn) {
        alert("Beta Jaao, Login karo pahle");
      }

      return <WrappedComponent {...props} />;
    }
  };
  return null;
  //   const router = useRouter();
}

export default ProtectedHOC;
