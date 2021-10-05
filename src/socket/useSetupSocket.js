import { useEffect } from "react"
import dynamic from "next/dynamic";
function useSetupSocket() {

    useEffect(() => {
        /* Init socket */
        import("../socket/socket")
            .then(io => {
                const socket = io.default.connect()
                socket.on("connect", () => {
                    console.log("socket connected!");
                })

                socket.on("disconnect", () => {
                    console.log("socket disconnected!");
                })
                // socket.globalListners()
            })
    }, [])
}

export default useSetupSocket
