// /* eslint-disable no-debugger */
import { useAuthContext, useAuthUpdateContext } from "../app/AuthContext";
import useSpinnerContext from "../app/Loading/SpinnerContext";
import fetchIntercept from "fetch-intercept";
import { useEffect } from "react";

const useFetchInterceptor = () => {
  const ctx = useAuthContext();
  const updateAuthCtx = useAuthUpdateContext();
  const spinnerCtx = useSpinnerContext();

  useEffect(() => {
    // debugger
    if (!ctx.fetchIntercepted) {
      if (typeof window !== undefined) {
        fetchIntercept.register({
          request: function (url, config) {
            if (url.startsWith("/api/website/", 0)) {
              /**
               * SHOW SPINNER
               */

              spinnerCtx.setShowSpinner(true);
              // debugger
              /**
               * if request initiated by our fetch request
               */
              console.log("Intercepted fetch request");
              /**
               * Authorization header is needed very much for each user type
               */
              let baseUrl = "http://192.168.1.104:8080";
              if (window.location.hostname !== "localhost") {
                baseUrl = "https://dreamgirl.live";
              }
              const finalUrl = `${baseUrl}${url}`;
              let finalConfig;
              if (ctx.isLoggedIn) {
                /**
                 *
                 */
                finalConfig = {
                  ...config,
                  headers: {
                    ...config.headers,
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                  },
                };
              } else if (ctx.unAuthedUserId && !ctx.twilioTempUserId) {
                /**
                 *
                 */
                finalConfig = {
                  ...config,
                  body: {
                    ...config.body,
                    unAuthedUserId: ctx.unAuthedUserId,
                  },
                };
              } else if (ctx.unAuthedUserId && ctx.twilioTempUserId) {
                /**
                 *
                 */
                finalConfig = {
                  ...config,
                  body: {
                    ...config.body,
                    unAuthedUserId: ctx.unAuthedUserId,
                    twilioTempUserId: ctx.twilioTempUserId,
                  },
                };
              }
              /**
               * if request initiated by next js
               */
              // debugger
              return [finalUrl, finalConfig || config];
            }
            // debugger
            return [url, config];
          },
          requestError: function (error) {
            // debugger
            spinnerCtx.setShowSpinner(false);
            return Promise.reject(error);
          },
          response: function (response) {
            // Modify the reponse object
            // debugger
            spinnerCtx.setShowSpinner(false);
            if (!response.ok) {
              return response.json().then((data) => Promise.reject(data));
            }
            if (response.status <= 500 && response.status >= 300) {
              return response.json().then((data) => Promise.reject(data));
            }
            return response;
          },
          responseError: function (error) {
            // Handle an fetch error
            // debugger
            spinnerCtx.setShowSpinner(false);
            return Promise.reject(error);
          },
        });
      }
      // debugger
      updateAuthCtx.updateViewer({ fetchIntercepted: true });
    }
  }, [ctx.fetchIntercepted]);
  return { ctx, updateAuthCtx };
};

export default useFetchInterceptor;
