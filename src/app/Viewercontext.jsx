import { createContext, useContext, useState, useEffect } from "react";

const initialState = {
  rootUserId: null,
  relatedUserId: null,
  user: {
    userType: "UnAuthedViewer",
  },
  jwtToken: null,
  rtcToken: "",
  isLoggedIn: false,
  isError: false,
  errorMessage: "",
};

const ViewerContext = createContext(initialState);
const ViewerUpdateContext = createContext({
  updateViewer: () => {},
});

export const ViewerContextProvider = ({ children }) => {
  const [viewer, setViewer] = useState(initialState);

  const updateViewer = (newViewer) => {
    setViewer((prevValue) => ({ ...prevValue, ...newViewer }));
    console.log("updateViewer.........", newViewer);
  };
  // const updateViewer = (newViewer, cb) => {
  //   setViewer((prevValue) => ({ ...prevValue, ...newViewer })), cb();
  //   console.log("updateViewer.........", newViewer);
  // };

  return (
    <ViewerContext.Provider value={{ viewer, setViewer }}>
      <ViewerUpdateContext.Provider
        value={{
          updateViewer,
        }}
      >
        {children}
      </ViewerUpdateContext.Provider>
    </ViewerContext.Provider>
  );
};

export const useViewerContext = () => useContext(ViewerContext);
export const useViewerUpdateContext = () => useContext(ViewerUpdateContext);
