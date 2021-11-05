import React from "react";
import UserProfile from "../../components/Mainpage/UserProfile";
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

function name() {
  const user = useAuthContext()
  return user.isLoggedIn === true && user.user.userType === "Viewer" ? (
    <div>
      <UserProfile />
    </div>
  ) : (
    <h1 className="tw-mx-auto tw-mt-auto tw-font-extrabold tw-capitalize tw-text-3xl">
      You are not authorized to view this page
      {/* tw-mx-auto tw-mt-auto tw-font-extrabold tw-capitalize tw-text-3xl */}
    </h1>
  )
}

export default name;
