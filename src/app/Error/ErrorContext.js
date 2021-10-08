import React, { useContext, createContext, useState, useCallback } from "react";
import Modal from "../../components/Call/Modal";
const ErrorContext = createContext({
  isError: false,
  errorMsg: false,
  setIsError: () => {},
  setErrorMsg: () => {},
});

export function ErrorContextProvider(props) {
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <ErrorContext.Provider
      value={{
        isError,
        errorMsg,
        setErrorMsg,
        setIsError,
      }}
    >
      <Modal
        isOpen={isError}
        onRequestClose={() => setIsError(false)}
        zIndex={160}
      >
        <div className="tw-py-4 tw-px-2 sm:tw-px-4">
          <h1 className="tw-text-xl tw-font-bold tw-mb-3 tw-text-white-color">{`Error Occurred: ${errorMsg}`}</h1>
        </div>
      </Modal>
      {props.children}
    </ErrorContext.Provider>
  );
}

export default function useErrorContext() {
  return useContext(ModalContext);
}
