import { useEffect } from "react";
import { useAuthUpdateContext, useAuthContext } from "../app/AuthContext";
import io from "../socket/socket";

function useSetupSocket(url) {
  const updateCtx = useAuthUpdateContext();
  const ctx = useAuthContext();
  useEffect(() => {
    debugger;
    /* Init socket */
    console.log("Initializing socket, status");
    const socket = io.connect(url);

    socket.on("connect_failed", () => {
      console.log("socket connected!");
    });

    socket.on("connect_error ", (err) => {
      alert("Error! from server " + err.message);
    });

    socket.on("connect", () => {
      console.log("socket connected!");
      localStorage.setItem("socketId", socket.id);
      if (!ctx.socketSetup) {
        updateCtx.updateViewer({
          socketSetup: true,
        });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected! due to >>>", reason);
      localStorage.removeItem("socketId");
    });

    /* Global Listeners */
    io.globalListeners(socket);

    if (JSON.parse(localStorage.getItem("authContext")).userType === "Model") {
      // io.modelListners
    } else if (
      JSON.parse(localStorage.getItem("authContext")).userType === "Viewer"
    ) {
      // io.viewerListners()
    } else if (
      JSON.parse(localStorage.getItem("authContext")).userType ===
      ("UnAuthedViewer" || "unAuthedViewer")
    ) {
      // io.unAuthedViewerListners()
    }
  }, [url]);
}

export default useSetupSocket;
