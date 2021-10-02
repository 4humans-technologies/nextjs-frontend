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
    /**
     * will run whenever a page is mounted, A Page
     * Check if user has any pending call or not __AND__
     * if the user is un-authed then his temp chat id is valid or not
     */
    if (false) {
      /**
       * check for pending calls
       */
      if (localStorage.getItem("pending-calls") && localStorage.getItem("pending-calls").length > 0) {
        /**
         * viewer has pending calls, hence inform about it
         */
      }
    }
    console.log("__app is mounted");
  }, [])

  return (
    // <Provider store={store}>
    <AuthContextProvider>
      <SidebarContextProvider>
        <ContextProvider>
          <ModalContextProvider>
            <ErrorContextProvider>
              <SpinnerContextProvider>
                <Component {...pageProps} />
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