import { useAuthContext } from "../app/AuthContext";
import useSpinnerContext from "../app/Loading/SpinnerContext";
import fetchIntercept from 'fetch-intercept';

let fetchIntercepted = false;
const PageHoc = (WrappedComponent) => {
    const ctx = useAuthContext()
    const spinnerCtx = useSpinnerContext()
    if (!fetchIntercepted) {
        if (typeof window !== undefined) {
            fetchIntercept.register({
                request: function (url, config) {
                    if (url.startsWith("/api/website/", 0)) {
                        /**
                         * SHOW SPINNER
                         */
                        spinnerCtx.setShowSpinner(true)
                        /**
                         * if request initiated by our fetch request
                         */
                        console.log("Intercepted fetch request");
                        /**
                         * Authorization header is needed very much for each user type
                         */
                        let baseUrl = "http://localhost:8080"
                        if (window.location.hostname !== "localhost") {
                            baseUrl = "https://dreamgirl.live"
                        }
                        const finalUrl = `${baseUrl}${url}`
                        let finalConfig;
                        //
                        if (ctx.isLoggedIn) {
                            /**
                             * 
                             */
                            finalConfig = {
                                ...config,
                                headers: {
                                    ...config.headers,
                                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                                }
                            }
                        }
                        else if (ctx.unAuthedUserId && !ctx.twilioTempUserId) {
                            /**
                             * 
                             */
                            finalConfig = {
                                ...config,
                                body: {
                                    ...config.body,
                                    unAuthedUserId: unAuthedUserId,

                                }
                            }
                        }
                        else if (ctx.unAuthedUserId && ctx.twilioTempUserId) {
                            /**
                             * 
                             */
                            finalConfig = {
                                ...config,
                                body: {
                                    ...config.body,
                                    unAuthedUserId: unAuthedUserId,
                                    twilioTempUserId: twilioTempUserId
                                }
                            }
                        }
                        /**
                         * if request initiated by next js
                         */
                        return [finalUrl, finalConfig || config]
                    }
                    return [url, config]
                },
                requestError: function (error) {
                    spinnerCtx.setShowSpinner(false)
                    return Promise.reject(error)
                },
                response: function (response) {
                    // Modify the reponse object
                    //
                    if (!response.ok) {
                        spinnerCtx.setShowSpinner(false)
                        return response.json()
                            .then(data => Promise.reject(data))

                    }
                    if (response.status <= 500 && response.status >= 300) {
                        spinnerCtx.setShowSpinner(false)
                        return response.json()
                            .then(data => Promise.reject(data))
                    }
                    return response
                },
                responseError: function (error) {
                    // Handle an fetch error
                    spinnerCtx.setShowSpinner(false)
                    return Promise.reject(error)
                }
            })
        }
    }
    fetchIntercepted = true

    return <WrappedComponent />
}

export default PageHoc