import { useRouter } from "next/router"
import React, { useCallback } from "react"
import { createContext, useContext, useState, useEffect } from "react"
import io from "../socket/socket"

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
})

let numberOfInits = 0
export const AuthContextProvider = ({ children }) => {
  console.log("Again initializing AUTHCONTEXT => ", ++numberOfInits)
  const [authState, setAuthState] = useState(initialState)
  const router = useRouter()

  const updateViewer = useCallback(
    (newViewer) => {
      setAuthState((prevValue) => {
        //debugger
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
      const newAuthState = nestedHandlingFunc(prev)
      return newAuthState
    })
  }

  const updateWallet = useCallback(
    (amount, operation = "add", updateFor = "both") => {
      /* for === ["lc" || "ctx" || "both"] */
      if (updateFor === "both" || updateFor === "lc") {
        const lcUser = JSON.parse(localStorage.getItem("user"))
        lcUser.relatedUser.wallet.currentAmount =
          operation === "set"
            ? amount
            : operation === "add"
            ? lcUser.relatedUser.wallet.currentAmount + amount
            : lcUser.relatedUser.wallet.currentAmount - amount
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
          return { ...prev }
        })
      }
    },
    []
  )

  const logout = useCallback(() => {
    router.replace("/")

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
          localStorage.removeItem("authContext")
          localStorage.removeItem("unAuthedUserId")
          localStorage.removeItem("user")
        }
      }
    )
  }, [router])

  const readFromLocalStorage = () => {
    localStorage.removeItem("socketId")
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
            isLoggedIn: authState.isLoggedIn,
            jwtToken: authState.jwtToken,
            userType: authState.user.userType,
            unAuthedUserId: authState.unAuthedUserId,
          })
        )
      } else {
        localStorage.removeItem("jwtToken")
        localStorage.removeItem("jwtExpiresIn")
        localStorage.removeItem("rootUserId")
        localStorage.removeItem("relatedUserId")
        localStorage.removeItem("userType")
        localStorage.removeItem("authContext")
        localStorage.removeItem("unAuthedUserId")
        localStorage.removeItem("user")
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
    //debugger
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
        unAuthedUserId: authState.unAuthedUserId,
      })
    )
  }, [
    authState.isLoggedIn,
    authState.jwtToken,
    authState.user.userType,
    authState.unAuthedUserId,
  ])

  useEffect(() => {
    /* get the latest user data */
  }, [])

  return (
    <AuthContext.Provider value={authState}>
      <AuthUpdateContext.Provider
        value={{
          updateViewer,
          readFromLocalStorage,
          logout,
          updateNestedPaths,
          updateWallet,
        }}
      >
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
export const useAuthUpdateContext = () => useContext(AuthUpdateContext)
