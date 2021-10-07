/* eslint-disable no-debugger */
import useSpinnerContext from "../app/Loading/SpinnerContext";
import fetchIntercept from "fetch-intercept";
import { useEffect } from "react";
const useFetchInterceptor = (isAlreadyIntercepted) => {
  /**
   * if all i need is the access to the functions in the context(s) than,
   * I can skip the check for "fetchIntercepted" in every component because
   * functions are available any time they are just references, and locking
   * in closure will have no effect (no matter if "stale function")
   */
  const spinnerCtx = useSpinnerContext();

  useEffect(() => {
    debugger;
    if (!isAlreadyIntercepted) {
      debugger;
      /* when new page is mounted */
      fetchIntercept.clear();
      fetchIntercept.register({
        request: function (url, config) {
          /* Only intercept app server request */
          if (url.startsWith("/api/website/")) {
            /* SHOW SPINNER */
            spinnerCtx.setShowSpinner(true);
            debugger;
            const latestCtx = JSON.parse(localStorage.getItem("authContext"));
            /* for GET requests when there is no config */
            let baseUrl = "http://192.168.1.104:8080";
            if (window.location.hostname !== "localhost") {
              baseUrl = "https://dreamgirl.live";
            }
            let finalUrl = `${baseUrl}${url}?socketId=${localStorage.getItem(
              "socketId"
            )}&unAuthedUserId=`;

            if (typeof config === "undefined") {
              /* get request */
              config = {};
            }

            if (latestCtx.unAuthedUserId) {
              finalUrl = `${baseUrl}${url}?socketId=${localStorage.getItem(
                "socketId"
              )}&unAuthedUserId=${latestCtx.unAuthedUserId}`;
            }

            /* attach jwtToken in the header */
            let finalConfig;
            if (latestCtx.isLoggedIn) {
              if (config?.headers) {
                finalConfig = {
                  ...config,
                  headers: {
                    ...config.headers,
                    Authorization: `Bearer ${latestCtx.jwtToken}`,
                  },
                };
              } else {
                finalConfig = {
                  ...config,
                  headers: {
                    Authorization: `Bearer ${latestCtx.jwtToken}`,
                  },
                };
              }
            } else {
              if (Object.keys(config).length !== 0) {
                finalConfig = config;
              }
            }
            debugger;
            return [finalUrl, finalConfig];
          }
          return [url, config];
        },
        requestError: function (error) {
          debugger;
          spinnerCtx.setShowSpinner(false);
          return Promise.reject(error);
        },
        response: function (response) {
          /* Modify the response object */
          if (response.url.includes("/api/website/")) {
            debugger;
            spinnerCtx.setShowSpinner(false);
            if (!response.ok) {
              return response.json().then((data) => Promise.reject(data));
            }
            if (response.status <= 500 && response.status >= 300) {
              return response.json().then((data) => Promise.reject(data));
            }
            return response;
          }
          spinnerCtx.setShowSpinner(false);
          return response;
        },
        responseError: function (error) {
          // Handle an fetch error
          debugger;
          console.error(error);
          spinnerCtx.setShowSpinner(false);
          return Promise.reject(error);
        },
      });
      debugger;
    }
  }, [isAlreadyIntercepted]);
};

export default useFetchInterceptor;
