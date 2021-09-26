// import { store } from "../app/store";
import { Provider } from 'react-redux'
import { ContextProvider } from "../app/Context";
import { SidebarContextProvider } from "../app/Sidebarcontext";
import { AuthContextProvider } from "../app/AuthContext";
import { ModalContextProvider } from "../app/ModalContext"
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import fetchIntercept from 'fetch-intercept';
import { ErrorContextProvider } from '../app/Error/ErrorContext';
import { useEffect } from 'react';


const unRegister = fetchIntercept.register({
  request: function (url, config) {
    /**
     * Authorization header is needed very much for each user type
     */

    console.log("Intercepted fetch request", config);
    return [url, config]
  },
  requestError: function (error) {
    return Promise.reject(error)
  },
  response: function (response) {
    // Modify the reponse object
    return response
  },
  responseError: function (error) {
    // Handle an fetch error
    return Promise.reject(error)
  }
})

const MyApp = ({ Component, pageProps }) => {

  useEffect(() => {
    /**
     * will run whenever a page is mounted, A Page
     * Check if user has any pending call or not __AND__
     * if the user is un-authed then his temp chat id is valid or not
     */
    console.log("__app is mounted");
  }, [])

  return (
    // <Provider store={store}>
    <AuthContextProvider>
      <SidebarContextProvider>
        <ContextProvider>
          <ModalContextProvider>
            <ErrorContextProvider>
              <Component {...pageProps} />
            </ErrorContextProvider>
          </ModalContextProvider>
        </ContextProvider>
      </SidebarContextProvider>
    </AuthContextProvider>
    // </Provider>
  );
};

export default MyApp
