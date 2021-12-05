import React, { useEffect } from "react"
import { ContextProvider } from "../app/Context"
import { SidebarContextProvider } from "../app/Sidebarcontext"
import { AuthContextProvider } from "../app/AuthContext"
import { ModalContextProvider } from "../app/ModalContext"
import { ErrorContextProvider } from "../app/Error/ErrorContext"
import { SpinnerContextProvider } from "../app/Loading/SpinnerContext"
import { SocketContextProvider } from "../app/socket/SocketContext"
import TestComponent from "./text"
import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"
import "../styles/global.css"
import Mainlayout from "../components/UI/Mainlayout"
import { ToastContainer } from "react-toastify"
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
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                    pauseOnHover
                    theme="dark"
                  />
                  <Mainlayout>
                    <Component {...pageProps} />
                  </Mainlayout>
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
