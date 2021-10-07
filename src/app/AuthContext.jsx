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
};

const AuthContext = createContext(initialState);
const AuthUpdateContext = createContext({
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

  const readFromLocalStorage = () => {
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
        updateViewer({ loadedFromLocalStorage: true });
      }
    } else {
      updateViewer({ loadedFromLocalStorage: true });
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
        }}
      >
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export const useAuthUpdateContext = () => useContext(AuthUpdateContext);
