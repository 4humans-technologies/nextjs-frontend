/* eslint-disable no-debugger */
import { useAuthContext, useAuthUpdateContext } from "../app/AuthContext"
import useSpinnerContext from "../app/Loading/SpinnerContext"
import fetchIntercept from 'fetch-intercept';
import { useEffect } from "react";

const useFetchInterceptor = () => {
    const ctx = useAuthContext()
    const updateAuthCtx = useAuthUpdateContext()
    const spinnerCtx = useSpinnerContext()

    useEffect(() => {
        debugger
        if (!ctx.fetchIntercepted) {
            if (typeof window !== undefined) {
                fetchIntercept.register({
                    request: function (url, config) {
                        /***
                         * 😯😯😯😯😯😯
                         * Here the values are locked in clousers
                         * spinnerCtx and ctx are all STALE in here hence have to call
                         * getter functions to the latest value
                         */
                        if (url.startsWith("/api/website/")) {
                            /**
                             * SHOW SPINNER
                             */
                            spinnerCtx.setShowSpinner(true)
                            debugger
                            if (typeof (config) === "undefined") {
                                config = {}
                            }
                            /**
                             * if request initiated by our fetch request
                             */
                            console.log("Intercepted fetch request");
                            /**
                             * Authorization header is needed very much for each user type
                             */
                            let baseUrl = "http://192.168.1.104:8080"
                            if (window.location.hostname !== "localhost") {
                                baseUrl = "https://dreamgirl.live"
                            }
                            const finalUrl = `${baseUrl}${url}`
                            let finalConfig;
                            const latestCtx = JSON.parse(localStorage.getItem("authContext"))
                            if (latestCtx.isLoggedIn) {
                                /**
                                 * 
                                 */
                                if (typeof (config?.headers) !== "undefined") {
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
                            else if (latestCtx.unAuthedUserId && !latestCtx.twilioTempUserId) {
                                /**
                                 * 
                                 */
                                finalConfig = {
                                    ...config,
                                    body: {
                                        ...config.body,
                                        unAuthedUserId: latestCtx.unAuthedUserId,

                                    }
                                }
                            }
                            else if (latestCtx.unAuthedUserId && latestCtx.twilioTempUserId) {
                                /**
                                 * 
                                 */
                                finalConfig = {
                                    ...config,
                                    body: {
                                        ...config.body,
                                        unAuthedUserId: latestCtx.unAuthedUserId,
                                        twilioTempUserId: latestCtx.twilioTempUserId
                                    }
                                }
                            }
                            /**
                             * if request initiated by next js
                             */
                            debugger
                            return [finalUrl, finalConfig || config]
                        }
                        return [url, config]
                    },
                    requestError: function (error) {
                        debugger
                        spinnerCtx.setShowSpinner(false)
                        return Promise.reject(error)
                    },
                    response: function (response) {
                        // Modify the reponse object
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
            }
            debugger
            updateAuthCtx.updateViewer({ fetchIntercepted: true })
        }
    }, [ctx.fetchIntercepted])
    return { ctx, updateAuthCtx }
}

export default useFetchInterceptor
