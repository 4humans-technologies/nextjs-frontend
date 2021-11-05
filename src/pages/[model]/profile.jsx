import React from "react";
import Profile from "../../components/model/Profile";
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

function profile() {
  const user = useAuthContext()
  const { updateUser } = useAuthUpdateContext()

  return user.isLoggedIn === true && user.user.userType === "Model" ? (
    <div>
      <Profile />
    </div>
  ) : (
    <div className="tw-mx-auto tw-mt-auto tw-font-extrabold tw-capitalize tw-text-3xl">
      <h1>You are not authorized to view this page</h1>
      {/* tw-mx-auto tw-mt-auto tw-font-extrabold tw-capitalize tw-text-3xl */}
    </div>
  )
}

export default profile;
