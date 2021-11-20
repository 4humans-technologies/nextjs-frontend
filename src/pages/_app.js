import React, { useEffect } from "react"
import { ContextProvider } from "../app/Context"
import { SidebarContextProvider } from "../app/Sidebarcontext"
import { AuthContextProvider } from "../app/AuthContext"
import { ModalContextProvider } from "../app/ModalContext"
import { ErrorContextProvider } from "../app/Error/ErrorContext"
import { SpinnerContextProvider } from "../app/Loading/SpinnerContext"
import { SocketContextProvider } from "../app/socket/SocketContext"
import TestComponent from "./text"
import SimpleReactLightbox from "simple-react-lightbox"
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/global.css"

/**
 * RULES OF HOOKS
 * react hooks must be called in the same order in every render
 * hence implement all the hooks in the start of the compoent and
 * then think about rendering
 * ---------
 * do not mutate state in between of a rendering of a component,
 * usually it happens when u mutate state directly in a hook
 */

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    window.onunload = function () {
      sessionStorage.clear()
    }
  }, [])

  return (
    // <Provider store={store}>
    <AuthContextProvider>
      <SidebarContextProvider>
        <ContextProvider>
          <ModalContextProvider>
            <ErrorContextProvider>
              <SpinnerContextProvider>
                <SocketContextProvider>
                  <TestComponent />
                  <SimpleReactLightbox>
                    <Component {...pageProps} />
                  </SimpleReactLightbox>
                </SocketContextProvider>
              </SpinnerContextProvider>
            </ErrorContextProvider>
          </ModalContextProvider>
        </ContextProvider>
      </SidebarContextProvider>
    </AuthContextProvider>
    // </Provider>
  )
}

export default MyApp
