import React from "react"
import { useAuthContext } from "../../app/AuthContext"
import { useAuthUpdateContext } from "../../app/AuthContext"
import Modal from "./Modal"
import { useRouter } from "next/router"

function ProtectedHOC(WrappedComponent) {
  return (props) => {
    if (typeof window !== "undefined") {
      const ctx = useAuthContext()
      const router = useRouter()
      //   checks whether on windows or on server
      if (!ctx.isLoggedIn && ctx.user.userType == "model") {
        alert("Beta Jaao, Login karo pahle")
        router.push("/")
      }

      return <WrappedComponent {...props} />
    }
  }
 
}

export default ProtectedHOC
