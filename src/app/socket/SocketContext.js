import { createContext, useContext, useState } from "react";

const SocketContext = createContext({
  socketInstance: null,
  isConnected: false,
  setSocketInstance: () => {},
  setIsConnected: () => {},
});

let socketSetup = false;
export const SocketContextProvider = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <SocketContext.Provider
      value={{
        socketInstance,
        isConnected,
        setSocketInstance,
        setIsConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export function useSocketContext() {
  return useContext(SocketContext);
}
