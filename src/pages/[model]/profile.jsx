import React from "react"
import Profile from "../../components/model/Profile"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

function ModelProfile() {
  const user = useAuthContext()
  const { updateUser } = useAuthUpdateContext()

  return user.isLoggedIn === true && user.user.userType === "Model" ? (
    <div>
      <Profile />
    </div>
  ) : (
    <div className="tw-mx-auto tw-mt-auto">
      <h1>You are not authorized to view this page</h1>
    </div>
  )
}

export default ModelProfile
