import React from "react"
import { useAuthContext } from "../../app/AuthContext"
import dynamic from "next/dynamic"

const Profile = dynamic(() => import("../../components/model/Profile"))

function ModelProfile() {
  const user = useAuthContext()

  return user.isLoggedIn === true && user.user.userType === "Model" ? (
    <div className="tw-bg-first-color tw-min-h-screen">
      <Profile />
    </div>
  ) : (
    <div className="tw-mx-auto tw-mt-auto">
      <h1>You are not authorized to view this page</h1>
    </div>
  )
}

export default ModelProfile
