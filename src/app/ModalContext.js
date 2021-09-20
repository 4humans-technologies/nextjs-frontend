import React, { useContext, createContext, useState } from "react";

const ModalContext = createContext({
  callDetailsOpen: false,
  loginOpen: false,
  registerOpen: false,
  toggleCallModal: () => {},
  toggleLoginModal: () => {},
  toggleRegisterModal: () => {},
});

export function ModalContextProvider(props) {
  const [callDetailsOpen, setCallDetailsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const toggleCallModal = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setCallDetailsOpen((prev) => !prev);
  };
  const toggleLoginModal = () => {
    setLoginOpen((prev) => !prev);
    setRegisterOpen(false);
    setCallDetailsOpen(false);
  };
  const toggleRegisterModal = () => {
    setLoginOpen(false);
    setRegisterOpen((prev) => !prev);
    setCallDetailsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        callDetailsOpen,
        loginOpen,
        registerOpen,
        toggleCallModal,
        toggleLoginModal,
        toggleRegisterModal,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
}

export default function useModalContext() {
  return useContext(ModalContext);
}
