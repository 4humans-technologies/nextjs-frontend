import useSpinnerContext from "../app/Loading/SpinnerContext"
import fetchIntercept from "fetch-intercept"
import { useEffect, useRef } from "react"
// import io from "../socket/socket"
import { useAuthUpdateContext } from "../app/AuthContext"
const useFetchInterceptor = (isAlreadyIntercepted) => {
  /**
   * if all i need is the access to the functions in the context(s) than,
   * I can skip the check for "fetchIntercepted" in every component because
   * functions are available any time they are just references, and locking
   * in closure will have no effect (no matter if "stale function")
   */
  const spinnerCtx = useSpinnerContext()
  const logoutRef = useRef()
  const updateCtx = useAuthUpdateContext()

  useEffect(() => {
    logoutRef.current = updateCtx.logout
  }, [updateCtx.logout])

  useEffect(() => {
    if (!isAlreadyIntercepted) {
      /* when new page is mounted */
      fetchIntercept.clear()
      fetchIntercept.register({
        request: function (url, config) {
          /* Only intercept app server request */
          if (
            url.startsWith("/api/website/") ||
            url.startsWith("/api/admin/")
          ) {
            const NO_SPINNER_URLS = [
              "/api/website/token-builder/global-renew-token",
              "/api/website/stream/private-chat/find-or-create-private-chat",
              "/api/website/stream/get-live-room-count/",
            ]
            let canShowSpinner = true
            NO_SPINNER_URLS.forEach((safeUrl) => {
              if (url.startsWith(safeUrl)) {
                canShowSpinner = false
              }
            })

            /* SHOW SPINNER */
            if (canShowSpinner) {
              spinnerCtx.setShowSpinner(true)
            }

            const latestCtx =
              JSON.parse(localStorage.getItem("authContext")) || {}
            /* for GET requests when there is no config */

            let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

            let urlObj = new URL(`${baseUrl}${url}`)
            urlObj.searchParams.append(
              "socketId",
              localStorage.getItem("socketId")
            )
            urlObj.searchParams.append("unAuthedUserId", "")

            if (typeof config === "undefined") {
              /* get request */
              config = {}
              urlObj.searchParams.append(
                "jwtToken",
                localStorage.getItem("jwtToken") || ""
              )
            }

            if (localStorage.getItem("unAuthedUserId")) {
              urlObj.searchParams.set(
                "unAuthedUserId",
                localStorage.getItem("unAuthedUserId")
              )
            }

            /* 👑 check validity of the jwtToken before attaching it 👑 */
            if (
              parseInt(localStorage.getItem("jwtExpiresIn")) <=
              Date.now() + 2000
            ) {
              /* logout the user */
              logoutRef.current()
              return Promise.reject("You were logged out!")
            }
            /* attach jwtToken in the header */
            let finalConfig
            if (latestCtx?.isLoggedIn) {
              if (config?.headers) {
                finalConfig = {
                  ...config,
                  headers: {
                    ...config.headers,
                    Authorization: `Bearer ${
                      latestCtx.jwtToken || localStorage.getItem("jwtToken")
                    }`,
                  },
                }
              } else {
                finalConfig = {
                  ...config,
                  headers: {
                    Authorization: `Bearer ${
                      latestCtx.jwtToken || localStorage.getItem("jwtToken")
                    }`,
                  },
                }
              }
            } else {
              if (Object.keys(config).length !== 0) {
                finalConfig = config
              }
            }
            //debugger
            return [urlObj.toString(), finalConfig]
          } else if (url.includes("amazonaws.com")) {
            spinnerCtx.setShowSpinner(true, "Uploading please wait")
          }
          return [url, config]
        },
        requestError: function (error) {
          spinnerCtx.setShowSpinner(false, "Please wait..")
          return Promise.reject(
            "Network error, please check your internet connection"
          )
        },
        response: function (response) {
          /* Modify the response object */
          if (
            response.url.includes("/api/website/") ||
            response.url.includes("amazonaws.com")
          ) {
            spinnerCtx.setShowSpinner(false)
            if (!response.ok) {
              return response.json().then((data) => Promise.reject(data))
            }
            if (response.status <= 500 && response.status >= 300) {
              return response.json().then((data) => Promise.reject(data))
            }
            return response
          }
          spinnerCtx.setShowSpinner(false)
          return response
        },
        responseError: function (error) {
          spinnerCtx.setShowSpinner(false, "Please wait..")
          if (error?.message === "Failed to fetch") {
            error.message =
              "Network error, please check your internet connection"
            error.dgErrorCode = 1000
          }
          return Promise.reject(error)
        },
      })
    }
  }, [isAlreadyIntercepted])
}

export default useFetchInterceptor
