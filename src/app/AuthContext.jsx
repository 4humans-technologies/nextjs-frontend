import { useRouter } from "next/router"
import React, { useCallback } from "react"
import { createContext, useContext, useState, useEffect } from "react"
import io from "../socket/socket"
import { toast } from "react-toastify"

const initialState = {
  rootUserId: null,
  relatedUserId: null,
  /**
   * 👇👇 for twilio chat service handling
   */
  twilioTempUserId: null /* 👉👉 Now no need of twilioTemp userId */,
  /**
   * identifier for un-authed user
   */
  unAuthedUserId: null,
  user: {
    userType: "UnAuthedViewer",
  },
  jwtToken: null,
  jwtExpiresIn: null,
  rtcToken: "",
  twilioChatToken:
    null /*👉👉 Now no need of twilio chatRTM token as we are using our own chat backend */,
  isLoggedIn: false,
  loginSuccessUrl: "/",
  loadedFromLocalStorage: false,
  fetchIntercepted: false /* 👈👈 not relying on this value */,
  socketSetup: false,
  streamRoom: null,
}

const AuthContext = createContext(initialState)
const AuthUpdateContext = createContext({
  logout: () => {},
  updateViewer: () => {},
  readFromLocalStorage: () => {},
  updateNestedPaths: () => {},
  updateWallet: (amount, operation = "add", updateFor = "both") => {},
  setAuthState: () => {},
})

let numberOfInits = 0
export const AuthContextProvider = ({ children }) => {
  // console.log("Again initializing AUTHCONTEXT => ", ++numberOfInits)
  const [authState, setAuthState] = useState(initialState)
  const router = useRouter()

  const updateViewer = useCallback(
    (newViewer) => {
      setAuthState((prevValue) => {
        //
        let newState
        if (newViewer.user) {
          newState = { ...prevValue, ...newViewer, user: { ...newViewer.user } }
        } else {
          newState = { ...prevValue, ...newViewer, user: { ...prevValue.user } }
        }
        return newState
      })
    },
    [setAuthState]
  )

  const updateNestedPaths = (nestedHandlingFunc) => {
    setAuthState((prev) => {
      return nestedHandlingFunc(prev)
    })
  }

  const updateWallet = useCallback(
    (amount, operation = "add", updateFor = "both") => {
      /* for === ["lc" || "ctx" || "both"] */
      if (typeof amount !== "number") {
        return
      }
      if (updateFor === "both" || updateFor === "lc") {
        const lcUser = JSON.parse(localStorage.getItem("user"))
        lcUser.relatedUser.wallet.currentAmount =
          operation === "set"
            ? amount
            : operation === "add"
            ? lcUser.relatedUser.wallet.currentAmount + amount
            : lcUser.relatedUser.wallet.currentAmount - amount

        /**
         * correct the decimal places
         */
        if (!Number.isInteger(lcUser.relatedUser.wallet.currentAmount)) {
          lcUser.relatedUser.wallet.currentAmount = parseFloat(
            lcUser.relatedUser.wallet.currentAmount.toFixed(1)
          )
        }
        localStorage.setItem("user", JSON.stringify(lcUser))
      }
      if (updateFor === "both" || updateFor === "ctx") {
        setAuthState((prev) => {
          prev.user.user.relatedUser.wallet.currentAmount =
            operation === "set"
              ? amount
              : operation === "add"
              ? prev.user.user.relatedUser.wallet.currentAmount + amount
              : prev.user.user.relatedUser.wallet.currentAmount - amount

          /**
           * correct the decimal places
           */
          if (
            !Number.isInteger(prev.user.user.relatedUser.wallet.currentAmount)
          ) {
            prev.user.user.relatedUser.wallet.currentAmount = parseFloat(
              prev.user.user.relatedUser.wallet.currentAmount.toFixed(1)
            )
          }
          return { ...prev }
        })
      }
    },
    []
  )

  const logout = useCallback(() => {
    router.replace("/")

    // io.getSocket().disconnect().connect()

    // updateViewer({
    //   isLoggedIn: false,
    //   user: { userType: "UnAuthedViewer" },
    //   jwtExpiresIn: null,
    //   rtcTokenExpireIn: null,
    //   rootUserId: "",
    //   relatedUserId: "",
    //   jwtToken: "",
    //   rtcToken: "",
    // })

    // localStorage.removeItem("jwtToken")
    // localStorage.removeItem("jwtExpiresIn")
    // localStorage.removeItem("rootUserId")
    // localStorage.removeItem("relatedUserId")
    // localStorage.setItem("userType", "UnAuthedViewer")
    // localStorage.setItem(
    //   "authContext",
    //   JSON.stringify({
    //     isLoggedIn: null,
    //     jwtToken: null,
    //     userType: "UnAuthedViewer",
    //   })
    // )
    // localStorage.removeItem("user")
    // toast.success(`Logged Out successfully!`, {
    //   hideProgressBar: true,
    //   closeOnClick: true,
    //   pauseOnHover: false,
    // })

    /**
     * 👇👇 this implementation is causing some bug on the server,
     * causing two server emit of public message, will came when
     * time to debug this
     */

    io.getSocket().emit(
      "update-client-info",
      {
        action: "logout",
      },
      (result) => {
        if (result.ok) {
          updateViewer({
            isLoggedIn: false,
            user: { userType: "UnAuthedViewer" },
            jwtExpiresIn: null,
            rtcTokenExpireIn: null,
            rootUserId: "",
            relatedUserId: "",
            jwtToken: "",
            rtcToken: "",
          })

          localStorage.removeItem("jwtToken")
          localStorage.removeItem("jwtExpiresIn")
          localStorage.removeItem("rootUserId")
          localStorage.removeItem("relatedUserId")
          localStorage.setItem("userType", "UnAuthedViewer")
          localStorage.setItem(
            "authContext",
            JSON.stringify({
              isLoggedIn: null,
              jwtToken: null,
              userType: "UnAuthedViewer",
            })
          )
          localStorage.removeItem("user")
          toast.success(`Logged Out successfully!`, {
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
          })
        }
      }
    )
  }, [router])

  const readFromLocalStorage = (clearSocket = true) => {
    if (clearSocket) {
      localStorage.removeItem("socketId")
    }
    const jwtToken = localStorage.getItem("jwtToken")
    if (jwtToken) {
      if (parseInt(localStorage.getItem("jwtExpiresIn")) > Date.now()) {
        let userObj
        if (
          localStorage.getItem("userType") === "Viewer" ||
          localStorage.getItem("userType") === "Model"
        ) {
          userObj = {
            userType: localStorage.getItem("userType"),
            user: JSON.parse(localStorage.getItem("user")),
          }
        } else {
          userObj = {
            userType: localStorage.getItem("userType") || "UnAuthedViewer",
          }
        }
        updateViewer({
          isLoggedIn: true,
          user: userObj,
          jwtExpiresIn: +localStorage.getItem("jwtExpiresIn"),
          rootUserId: localStorage.getItem("rootUserId"),
          relatedUserId: localStorage.getItem("relatedUserId"),
          jwtToken: jwtToken,
          unAuthedUserId: localStorage.getItem("unAuthedUserId"),
          loadedFromLocalStorage: true,
        })
        localStorage.setItem(
          "authContext",
          JSON.stringify({
            isLoggedIn: true,
            jwtToken: authState.jwtToken,
            userType: authState.user.userType,
          })
        )
      } else {
        localStorage.removeItem("jwtToken")
        localStorage.removeItem("jwtExpiresIn")
        localStorage.removeItem("rootUserId")
        localStorage.removeItem("relatedUserId")
        localStorage.removeItem("userType")
        localStorage.removeItem("authContext")
        localStorage.removeItem("user")
        toast.info("You were logged out, please login again.")
        updateViewer({ loadedFromLocalStorage: true })
      }
      localStorage.removeItem("rtcToken")
      localStorage.removeItem("rtcTokenExpireIn")
    } else {
      updateViewer({ loadedFromLocalStorage: true })
      localStorage.removeItem("rtcToken")
      localStorage.removeItem("rtcTokenExpireIn")
    }
  }

  if (!authState.loadedFromLocalStorage && typeof window !== "undefined") {
    readFromLocalStorage()
  }

  useEffect(() => {
    /* Now no need for use of ctx in useFetchInterceptor */
    localStorage.setItem(
      "authContext",
      JSON.stringify({
        isLoggedIn: authState.isLoggedIn,
        jwtToken: authState.jwtToken,
        userType: authState.user.userType,
      })
    )
  }, [
    authState.isLoggedIn,
    authState.jwtToken,
    authState.user.userType,
    authState.unAuthedUserId,
  ])

  return (
    <AuthContext.Provider value={authState}>
      <AuthUpdateContext.Provider
        value={{
          updateViewer,
          readFromLocalStorage,
          logout,
          updateNestedPaths,
          updateWallet,
          setAuthState,
        }}
      >
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
export const useAuthUpdateContext = () => useContext(AuthUpdateContext)
