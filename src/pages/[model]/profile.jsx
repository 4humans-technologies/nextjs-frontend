import React from "react"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

const Profile = dynamic(() => import("../../components/model/Profile"))

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
