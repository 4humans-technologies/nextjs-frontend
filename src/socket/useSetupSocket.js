import { useEffect } from "react"
import io from "../socket/socket";

function useSetupSocket(url) {
    useEffect(() => {
        debugger
        /* Init socket */
        console.log("Initing socket, status");
        const socket = io.connect(url)

        socket.on("connect_failed", () => {
            console.log("socket connected!");
        })

        socket.on("connect_error ", (err) => {
            alert("Error! from server " + err.message);
        })

        socket.on("connect", () => {
            console.log("socket connected!");
            localStorage.setItem("socketId", socket.id)
        })

        socket.on("disconnect", () => {
            console.log("socket disconnected!");
            localStorage.removeItem("socketId")
        })

        /* Global Listeners */
        io.globalListeners(socket)

        if (JSON.parse(localStorage.getItem("authContext")).userType === "Model") {
            // io.modelListners
        } else if (JSON.parse(localStorage.getItem("authContext")).userType === "Viewer") {
            // io.viewerListners()
        } else if (JSON.parse(localStorage.getItem("authContext")).userType === ("UnAuthedViewer" || "unAuthedViewer")) {
            // io.unAuthedViewerListners()
        }
    }, [url])
}

export default useSetupSocket
