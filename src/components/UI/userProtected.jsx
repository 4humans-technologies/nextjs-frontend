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
      if (!ctx.isLoggedIn && ctx.user.userType == "viewer") {
        alert("Beta Jaao, Login karo pahle")
      }

      return <WrappedComponent {...props} />
    }
  }
  return null
  //   const router = useRouter();
}

export default ProtectedHOC
