import io from "socket.io-client";
let socketConnectionInstance;

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

export default {
    connect: (url) => {
        socketConnectionInstance = io(url || "http://192.168.1.104:8080", {
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
        })
        return socketConnectionInstance
    },
    getSocket: () => {
        if (!socketConnectionInstance) {
            throw Error("Socket is not initialized!")
        }
        return socketConnectionInstance
    },
    getSocketId: () => {
        if (!socketConnectionInstance) {
            throw Error("Socket is not initialized!")
        }
        return socketConnectionInstance.id
    },
    globalListners: (socket) => {
        socket.on("new-model-started-stream", (data) => {
            const model = JSON.parse(data)
            const dataObj = {
                ...model,
                profileImage: "https://png.pngtree.com/png-clipart/20190614/original/pngtree-female-avatar-vector-icon-png-image_3725439.jpg",
                age: new Date().getFullYear() - new Date(model.dob).getFullYear(),
                languages: model.languages.join(","),
                rootUserId: model.rootUser._id,
                userName: model.rootUser.username,
                userType: model.rootUser.userType,
            }
        })
    },
    modelListners: (socket) => {

    }

}