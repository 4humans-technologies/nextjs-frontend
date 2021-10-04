// /* eslint-disable no-debugger */
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const initialState = {
  rootUserId: null,
  relatedUserId: null,
  /**
   * 👇👇 for twilio chat service handling
   */
  twilioTempUserId: null,
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
  twilioChatToken: null,
  isLoggedIn: false,
  isError: false,
  errorMessage: "",
  loginSuccessUrl: "/",
  loadedFromLocalStorage: false,
  fetchIntercepted: false,
};

const AuthContext = createContext(initialState);
const AuthUpdateContext = createContext({
  updateViewer: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [authSate, setAuthState] = useState(initialState);

  const updateViewer = (newViewer) => {
    setAuthState((prevValue) => {
      // debugger
      let newState;
      if (newViewer.user) {
        newState = { ...prevValue, ...newViewer, user: { ...newViewer.user } };
      } else {
        newState = { ...prevValue, ...newViewer, user: { ...prevValue.user } };
      }
      return newState;
    });
  };

  useEffect(() => {
    // debugger
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
        });
      } else {
        localStorage.setItem("jwtToken", "");
        localStorage.setItem("jwtExpiresIn", "");
        localStorage.setItem("rootUserId", "");
        localStorage.setItem("relatedUserId", "");
        localStorage.setItem("userType", "");
      }
    }
    updateViewer({ loadedFromLocalStorage: true });
  }, []);

  return (
    <AuthContext.Provider value={authSate}>
      <AuthUpdateContext.Provider
        value={{
          updateViewer,
        }}
      >
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export const useAuthUpdateContext = () => useContext(AuthUpdateContext);
