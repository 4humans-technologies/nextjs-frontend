// import { store } from "../app/store";
// import { Provider } from 'react-redux'
import { ContextProvider } from "../app/Context";
import { SidebarContextProvider } from "../app/Sidebarcontext";
import { AuthContextProvider } from "../app/AuthContext";
import { ModalContextProvider } from "../app/ModalContext"
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import { ErrorContextProvider } from '../app/Error/ErrorContext';
import { useEffect } from 'react';
import { SpinnerContextProvider } from '../app/Loading/SpinnerContext';
import { SocketContextProvider } from "../app/socket/SocketContext"
import io from "../socket/socket";
import useSetupSocket from "../socket/useSetupSocket";
// import dynamic from "next/dynamic";
// const io = dynamic(() => import("../socket/socket"), { ssr: false })

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
  console.log("rendering MyApp");
  useSetupSocket("http://192.168.1.104:8080")
  return (
    // <Provider store={store}>
    <AuthContextProvider>
      <SidebarContextProvider>
        <ContextProvider>
          <ModalContextProvider>
            <ErrorContextProvider>
              <SpinnerContextProvider>
                <SocketContextProvider>
                  <Component {...pageProps} />
                </SocketContextProvider>
              </SpinnerContextProvider>
            </ErrorContextProvider>
          </ModalContextProvider>
        </ContextProvider>
      </SidebarContextProvider>
    </AuthContextProvider>
    // </Provider>
  );
};

export default MyApp