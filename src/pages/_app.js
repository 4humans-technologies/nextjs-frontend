// import { store } from "../app/store";
import { Provider } from 'react-redux'
import { ContextProvider } from "../app/Context";
import { SidebarContextProvider } from "../app/Sidebarcontext";
import { AuthContextProvider, useAuthContext } from "../app/AuthContext";
import { ModalContextProvider } from "../app/ModalContext"
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import fetchIntercept from 'fetch-intercept';
import { ErrorContextProvider } from '../app/Error/ErrorContext';
import { useEffect } from 'react';

const MyApp = ({ Component, pageProps }) => {
  const ctx = useAuthContext()
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

  useEffect(() => {
    /**
     * for setup of fetch-interceptor,
     * setting up in useEffect because i have to use context
     */
    if (typeof window !== undefined) {
      fetchIntercept.register({
        request: function (url, config) {
          console.log("Intercepted fetch request", config);
          /**
           * Authorization header is needed very much for each user type
           */
          let baseUrl = "http://localhost:8080"
          if (window.location.hostname !== "localhost") {
            baseUrl = "https://dreamgirl.live"
          }
          const finalUrl = `${baseUrl}${url}`
          let finalConfig;
          if (ctx.isLoggedIn) {
            finalConfig = {
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              }
            }
          }
          else if (ctx.unAuthedUserId && !ctx.twilioTempUserId) {
            finalConfig = {
              ...config,
              body: {
                ...config.body,
                unAuthedUserId: unAuthedUserId,

              }
            }
          }
          else if (ctx.unAuthedUserId && ctx.twilioTempUserId) {
            finalConfig = {
              ...config,
              body: {
                ...config.body,
                unAuthedUserId: unAuthedUserId,
                twilioTempUserId: twilioTempUserId
              }
            }
          }
          return [finalUrl, finalConfig || config]
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
    }
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
