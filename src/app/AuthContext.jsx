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
    userType: "UnAuthedViewer"
  },
  jwtToken: null,
  rtcToken: "",
  twilioChatToken: null,
  isLoggedIn: false,
  isError: false,
  errorMessage: "",
};

const AuthContext = createContext(initialState);
const AuthUpdateContext = createContext({
  updateViewer: () => { },
});

export const AuthContextProvider = ({ children }) => {
  const [viewer, setViewer] = useState(initialState);

  const updateViewer = (newViewer) => {
    setViewer((prevValue) => ({ ...prevValue, ...newViewer }));
  };

  return (
    <AuthContext.Provider value={{ viewer, setViewer }}>
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
