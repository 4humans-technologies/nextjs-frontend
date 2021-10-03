import io from "socket.io-client";
/**
 * should the implementation differ for viewer and model
 */
let pendingCalls;
if (localStorage.getItem("pendingCalls")) {
    pendingCalls = JSON.parse(localStorage.getItem("pendingCalls"))
} else {
    localStorage.setItem("pendingCalls", JSON.stringify({ audioCall: {}, videoCall: {} }))
    pendingCalls = JSON.parse(localStorage.getItem("pendingCalls"))
}

let socket = io("http://192.168.1.104:8080", {
    auth: {
        // token will be fetched from local storage
        token: localStorage.getItem("jwtToken") || "",
    },
    query: {
        // will get userType from localStorage
        // if nothing in local storage default to UnAuthedViewer
        // no worries if user provides wrong info, we have token we can validate
        userType: localStorage.getItem("userType") || "UnAuthedViewer",
        hasAudioCall: pendingCalls.audioCall ? true : false,
        hasVideoCall: pendingCalls.videoCall ? true : false,
        audioCall: JSON.stringify(pendingCalls.audioCall),
        videoCall: JSON.stringify(pendingCalls.videoCall),
    }
});