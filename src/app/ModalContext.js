import React, { useContext, createContext, useState } from "react";
import Modal from "../components/Call/Modal";

import GlobalModalContent, {
  SetGlobalModalContent,
} from "../app/GlobalModalContent";

const ModalContext = createContext({
  isOpen: false,
  modalContent: <></>,
  showModal: () => {},
  showModalWithContent: () => {},
  clearModalWithContent: () => {},
  hideModal: () => {},
});

export function ModalContextProvider(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(
    <h1>Modal Content Not Set</h1>
  );

  const showModal = () => {
    setIsOpen(true);
  };

  const showModalWithContent = (content) => {
    /**
     * set content and show modal
     */
    debugger
    setModalContent(content);
    setIsOpen(true);
  };

  const clearModalWithContent = () => {
    /**
     * Hide the modal and clear the content
     */
    setModalContent(
      <h1 className="tw-text-center tw-text-lg">Modal Content Not Set</h1>
    );
    setIsOpen(false);
  };

  const hideModal = () => {
    debugger;
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        showModal,
        showModalWithContent,
        clearModalWithContent,
        hideModal,
      }}
    >
      {isOpen && (
        <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
          {modalContent}
        </Modal>
      )}
      {props.children}
    </ModalContext.Provider>
  );
}

export default function useModalContext() {
  return useContext(ModalContext);
}
