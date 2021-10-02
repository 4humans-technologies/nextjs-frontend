import React, { useContext, createContext, useState } from "react";
import Spinner from "../../components/UI/Spinner";
const SpinnerContext = createContext({
    isLoading: false,
    setShowSpinner: () => { },
    setLoading: () => { },
});

export function SpinnerContextProvider(props) {
    const [isLoading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Please Wait...")
    const setShowSpinner = (showSpinner, loadText) => {
        setLoading(showSpinner)
        if (loadText) {
            setLoadingText(loadText)
        }
    }
    return (
        <SpinnerContext.Provider
            value={{
                isLoading,
                setShowSpinner,
                setLoadingText
            }}
        >
            {isLoading && <Spinner loadingText={loadingText} />}
            {props.children}
        </SpinnerContext.Provider>
    );
}

export default function useSpinnerContext() {
    return useContext(SpinnerContext);
}
