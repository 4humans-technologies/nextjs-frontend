import io from "socket.io-client";

/**
 * should the implementation differ for viewer and model
 */


let pendingCalls;
if (localStorage.getItem("pendingCalls")) {
    pendingCalls = JSON.parse(localStorage.getItem("pendingCalls"))
} else {
    localStorage.setItem("pendingCalls", JSON.stringify({ audioCalls: [], videoCalls: [] }))
    pendingCalls = JSON.parse(localStorage.getItem("pendingCalls"))
}



let socket = io('http://localhost:8080', {
    auth: {
        // token will be fetched from local storage
        token: localStorage.getItem("jwtToken") || "",
    },
    query: {
        // will get userType from localStorage
        // if nothing in local storage default to UnAuthedViewer
        // no worries if user provides wrong info, we have token we can validate
        userType: localStorage.getItem("userType") || "UnAuthedViewer",
        hasAudioCall: pendingCalls.audioCalls.length !== 0,
        hasVideoCall: pendingCalls.videoCalls.length !== 0,
        audioCalls: JSON.stringify(pendingCalls.audioCalls),
        videoCalls: JSON.stringify(pendingCalls.videoCalls),
    }
});

export default socket