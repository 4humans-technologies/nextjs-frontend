import { createContext, useContext, useState, useEffect } from "react";

const initialState = {
  rootUserId: null,
  relatedUserId: null,
  user: {
    userType:"viewer"
  },
  token: null,
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
  //   const [viewerUpdate, setViewerUpdate] = useState(null);
  //   const [viewerUpdateCallback, setViewerUpdateCallback] = useState(null);

  //   useEffect(() => {
  //     if (viewerUpdateCallback) {
  //       viewerUpdateCallback(viewerUpdate);
  //     }
  //   }, [viewerUpdate]);

  const updateViewer = (newViewer, cb) => {
    setViewer((prevValue) => ({ ...prevValue, ...newViewer })), cb();
    console.log("updateViewer.........", newViewer);
  };

  return (
    <ViewerContext.Provider value={{ viewer, setViewer }}>
      <ViewerUpdateContext.Provider
        value={{
          //   viewerUpdate,
          //   setViewerUpdate,
          //   setViewerUpdateCallback,
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
