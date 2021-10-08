/* eslint-disable no-debugger */
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const initialState = {
  rootUserId: null,
  relatedUserId: null,
  /**
   * 👇👇 for twilio chat service handling
   */
  twilioTempUserId: null /* 👉👉 Now no need of twilioTemp userId */,
  /**
   * identifier for un-authed user
   */
  unAuthedUserId: null,
  user: {
    userType: "UnAuthedViewer",
  },
  jwtToken: null,
  jwtExpiresIn: null,
  rtcToken: "",
  twilioChatToken:
    null /*👉👉 Now no need of twilio chatRTM token as we are using our own chat backend */,
  isLoggedIn: false,
  loginSuccessUrl: "/",
  loadedFromLocalStorage: false,
  fetchIntercepted: false,
  socketSetup: false,
};

const AuthContext = createContext(initialState);
const AuthUpdateContext = createContext({
  logout: () => {},
  updateViewer: () => {},
  readFromLocalStorage: () => {},
});

let numberOfInits = 0;
export const AuthContextProvider = ({ children }) => {
  console.log("Again initializing AUTHCONTEXT => ", numberOfInits);
  const [authState, setAuthState] = useState(initialState);

  const updateViewer = (newViewer) => {
    setAuthState((prevValue) => {
      debugger;
      let newState;
      if (newViewer.user) {
        newState = { ...prevValue, ...newViewer, user: { ...newViewer.user } };
      } else {
        newState = { ...prevValue, ...newViewer, user: { ...prevValue.user } };
      }
      return newState;
    });
  };

  const logout = () => {
    localStorage.setItem("jwtToken", "");
    localStorage.setItem("jwtExpiresIn", "");
    localStorage.setItem("rootUserId", "");
    localStorage.setItem("relatedUserId", "");
    localStorage.setItem("userType", "");
    localStorage.setItem("authContext", "");
    localStorage.setItem("rtcToken", "");
    updateViewer({
      isLoggedIn: false,
      user: { userType: "UnAuthedViewer" },
      jwtExpiresIn: null,
      rtcTokenExpireIn: null,
      rootUserId: "",
      relatedUserId: "",
      jwtToken: "",
      rtcToken: "",
    });
  };

  const readFromLocalStorage = () => {
    localStorage.removeItem("socketId");
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      if (parseInt(localStorage.getItem("jwtExpiresIn")) > Date.now()) {
        updateViewer({
          isLoggedIn: true,
          user: { userType: localStorage.getItem("userType") },
          jwtExpiresIn: +localStorage.getItem("jwtExpiresIn"),
          rootUserId: localStorage.getItem("rootUserId"),
          relatedUserId: localStorage.getItem("relatedUserId"),
          jwtToken: jwtToken,
          unAuthedUserId: localStorage.getItem("unAuthedUserId"),
          loadedFromLocalStorage: true,
        });
        localStorage.setItem(
          "authContext",
          JSON.stringify({
            isLoggedIn: authState.isLoggedIn,
            jwtToken: authState.jwtToken,
            userType: authState.user.userType,
            unAuthedUserId: authState.unAuthedUserId,
          })
        );
      } else {
        localStorage.setItem("jwtToken", "");
        localStorage.setItem("jwtExpiresIn", "");
        localStorage.setItem("rootUserId", "");
        localStorage.setItem("relatedUserId", "");
        localStorage.setItem("userType", "");
        localStorage.setItem("authContext", "");
        localStorage.setItem("unAuthedUserId", "");
        updateViewer({ loadedFromLocalStorage: true });
      }
      localStorage.setItem("rtcToken", "");
      localStorage.setItem("rtcTokenExpireIn", "");
    } else {
      updateViewer({ loadedFromLocalStorage: true });
      localStorage.setItem("rtcToken", "");
      localStorage.setItem("rtcTokenExpireIn", "");
    }
  };

  if (!authState.loadedFromLocalStorage && typeof window !== "undefined") {
    debugger;
    readFromLocalStorage();
  }

  useEffect(() => {
    /* Now no need for use of ctx in useFetchInterceptor */
    localStorage.setItem(
      "authContext",
      JSON.stringify({
        isLoggedIn: authState.isLoggedIn,
        jwtToken: authState.jwtToken,
        userType: authState.user.userType,
        unAuthedUserId: authState.unAuthedUserId,
      })
    );
  }, [
    authState.isLoggedIn,
    authState.jwtToken,
    authState.user.userType,
    authState.unAuthedUserId,
  ]);

  return (
    <AuthContext.Provider value={authState}>
      <AuthUpdateContext.Provider
        value={{
          updateViewer,
          readFromLocalStorage,
          logout,
        }}
      >
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export const useAuthUpdateContext = () => useContext(AuthUpdateContext);
