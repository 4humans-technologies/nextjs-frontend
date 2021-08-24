import { createContext, useContext, useState } from "react";

const sidebarStatusProvider = createContext();
const sidebarStatusUpdateProvider = createContext();

export const SidebarContextProvider = ({ children }) => {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  // const [sidebarStatusUpdate,setSidebarStatusUpdate]=useState(false)
  const value = sidebarStatus;
  function toggleSidebarContext() {
    setSidebarStatus((prevStatus) => !prevStatus);
  }
  return (
    <sidebarStatusProvider.Provider value={value}>
      <sidebarStatusUpdateProvider.Provider value={toggleSidebarContext}>
        {children}
      </sidebarStatusUpdateProvider.Provider>
    </sidebarStatusProvider.Provider>
  );
};

export function useSidebarStatus() {
  return useContext(sidebarStatusProvider);
}

export function useSidebarUpdate() {
  return useContext(sidebarStatusUpdateProvider);
}
