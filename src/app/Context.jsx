import React, { createContext, useEffect, useState, useContext } from "react";

const Widthcontext = React.createContext();
const updateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [innerWidth, setInnerWidth] = useState(745);
  const handleResize = () => setInnerWidth(window.innerWidth);

  useEffect(() => {
    setInnerWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <Widthcontext.Provider value={innerWidth}>{children}</Widthcontext.Provider>
  );
};

export function useWidth() {
  return useContext(Widthcontext);
}
