import React from "react"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import dynamic from "next/dynamic"

const UserProfile = dynamic(() =>
  import("../../components/Mainpage/UserProfile")
)

function name() {
  const user = useAuthContext()
  return user.isLoggedIn === true && user.user.userType === "Viewer" ? (
    <div>
      <UserProfile />
    </div>
  ) : (
    <h1 className="tw-mx-auto tw-mt-auto ">
      You are not authorized to view this page
      {/* tw-mx-auto tw-mt-auto tw-font-extrabold tw-capitalize tw-text-3xl */}
    </h1>
  )
}

export default name
