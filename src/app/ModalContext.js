import React, { useContext, createContext, useState, useCallback } from "react"
import Modal from "../components/Call/Modal"

const ModalContext = createContext({
  isOpen: false,
  modalContent: <></>,
  showModal: () => {},
  showModalWithContent: () => {},
  clearModalWithContent: () => {},
  hideModal: () => {},
})

export function ModalContextProvider(props) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState(
    <h1>Modal Content Not Set</h1>
  )
  const [modalStyles, setModalStyles] = useState({})

  const showModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const showModalWithContent = useCallback((content, styles) => {
    /**
     * set content and show modal
     */
    if (styles) {
      setModalStyles((prev) => {
        if (styles.contentStyles) {
          prev.contentStyles = styles.contentStyles
        }
        if (styles.overlayStyles) {
          prev.overlayStyles = styles.overlayStyles
        }
        return { ...prev }
      })
    }
    setModalContent(content)
    setIsOpen(true)
  }, [])

  const clearModalWithContent = useCallback(() => {
    /**
     * Hide the modal and clear the content
     */
    setModalContent(
      <h1 className="tw-text-center tw-text-lg">Modal Content Not Set</h1>
    )
    setIsOpen(false)
  }, [])

  const hideModal = useCallback(() => {
    //
    setIsOpen(false)
  }, [])

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
        <Modal
          isOpen={isOpen}
          contentStyles={
            modalStyles?.contentStyles ? modalStyles.contentStyles : {}
          }
          overlayStyles={
            modalStyles?.overlayStyles ? modalStyles.overlayStyles : {}
          }
          onRequestClose={() => setIsOpen(false)}
        >
          {modalContent}
        </Modal>
      )}
      {props.children}
    </ModalContext.Provider>
  )
}

export default function useModalContext() {
  return useContext(ModalContext)
}
