import React, { useContext, createContext, useState } from "react"

const ModalContext = createContext({
    modalIsOpen: false,
    setModalIsOpen: () => { },
    toggleModal: () => { },
})

export function ModalContextProvider(props) {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const toggleModal = () => {
        setModalIsOpen(prev => !prev)
    }

    return (
        <ModalContext.Provider value={{
            modalIsOpen,
            setModalIsOpen,
            toggleModal
        }}>
            {props.children}
        </ModalContext.Provider>
    )
}

export default function useModalContext() {
    return useContext(ModalContext)
}