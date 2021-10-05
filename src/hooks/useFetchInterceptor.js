/* eslint-disable no-debugger */
import { useAuthContext, useAuthUpdateContext } from "../app/AuthContext"
import useSpinnerContext from "../app/Loading/SpinnerContext"
import fetchIntercept from 'fetch-intercept';
import { useEffect } from "react";

const useFetchInterceptor = (isAlreadyIntercepted) => {
    /**
     * if all i need is the access to the functions in the context(s) than,
     * I can skip the check for "fetchIntercepted" in every component because 
     * functions are available any time they are just references, and locking
     * in closure will have no effect (no matter if "stale function")
     */
    const spinnerCtx = useSpinnerContext()

    useEffect(() => {
        debugger
        if (!isAlreadyIntercepted) {
            fetchIntercept.register({
                request: function (url, config) {
                    /***
                     * 😯😯😯😯😯😯
                     * Here the values are locked in clousers
                     * spinnerCtx and ctx are all STALE in here hence have to call
                     * getter functions to the latest value
                     */

                    /* Only intercept app server request */
                    if (url.startsWith("/api/website/")) {
                        /* SHOW SPINNER */
                        spinnerCtx.setShowSpinner(true)
                        debugger
                        /* for GET requests when there is no config */
                        if (typeof (config) === "undefined") {
                            config = {}
                        }
                        let baseUrl = "http://localhost:8080"
                        if (window.location.hostname !== "localhost") {
                            baseUrl = "https://dreamgirl.live"
                        }
                        const finalUrl = `${baseUrl}${url}`
                        let finalConfig;
                        const latestCtx = JSON.parse(localStorage.getItem("authContext"))
                        if (latestCtx.isLoggedIn) {
                            /* attach jwtToken in the header */
                            if (!config?.headers) {
                                finalConfig = {
                                    ...config,
                                    headers: {
                                        ...config.headers,
                                        Authorization: `Bearer ${latestCtx.jwtToken}`,
                                    }
                                }
                            } else {
                                finalConfig = {
                                    ...config,
                                    headers: {
                                        Authorization: `Bearer ${latestCtx.jwtToken}`,
                                    }
                                }
                            }
                        }
                        else if (latestCtx.unAuthedUserId) {
                            /* attach Identifier for the unAuthenticated user */
                            if (!config?.body) {
                                finalConfig = {
                                    ...config,
                                    body: {
                                        unAuthedUserId: latestCtx.unAuthedUserId,
                                    }
                                }
                            } else {
                                finalConfig = {
                                    ...config,
                                    body: {
                                        ...config.body,
                                        unAuthedUserId: latestCtx.unAuthedUserId,
                                    }
                                }
                            }

                        }
                        debugger
                        return [finalUrl, finalConfig]
                    }
                    return [url, config]
                },
                requestError: function (error) {
                    debugger
                    spinnerCtx.setShowSpinner(false)
                    return Promise.reject(error)
                },
                response: function (response) {
                    /* Modify the response object */
                    if (response.url.startsWith("http://192.168.1.104:8080/api/website/")) {
                        debugger
                        spinnerCtx.setShowSpinner(false)
                        if (!response.ok) {
                            return response.json()
                                .then(data => Promise.reject(data))
                        }
                        if ((response.status <= 500 && response.status >= 300)) {
                            return response.json()
                                .then(data => Promise.reject(data))
                        }
                        return response
                    }
                    return response
                },
                responseError: function (error) {
                    // Handle an fetch error
                    debugger
                    console.error(error)
                    spinnerCtx.setShowSpinner(false)
                    return Promise.reject(error)
                }
            })
            debugger
        }
    }, [isAlreadyIntercepted])
}

export default useFetchInterceptor
