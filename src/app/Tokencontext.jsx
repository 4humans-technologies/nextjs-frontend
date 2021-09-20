import React, { createContext, useContext, useState } from "react";

const tokenContext = createContext({
  modelToken: "",
  userToken: "",
});

const tokenUpdate = createContext({
  updateModelToken: () => {},
  updateUserToken: () => {},
});

function Tokencontext(props) {
  const [modelToken, setModelToken] = useState("");
  const [userToken, setUserToken] = useState("");

  const updateModelToken = (token) => {
    setModelToken(token);
  };
  const updateUserToken = (token) => {
    setUserToken(token);
  };

  return (
    <div>
      <token.Provider value={{ modelToken, userToken }}>
        <tokenUpdate.Provider value={{ updateModelToken, updateUserToken }}>
          {props.children}
        </tokenUpdate.Provider>
      </token.Provider>
    </div>
  );
}

export function useTokenContext() {
  return useContext(token);
}

export function useUpdateContext() {
  return useContext(tokenUpdate);
}
export default Tokencontext;
