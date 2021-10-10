import { createContext, useContext, useState } from "react";

const SocketContext = createContext({
  triedConnecting: false,
  isConnected: false,
  setTriedConnecting: () => {},
  setIsConnected: () => {},
});

export const SocketContextProvider = ({ children }) => {
  const [triedConnecting, setTriedConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <SocketContext.Provider
      value={{
        triedConnecting,
        isConnected,
        setTriedConnecting,
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
