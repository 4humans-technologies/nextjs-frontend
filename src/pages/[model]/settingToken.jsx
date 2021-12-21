import React from "react"
import Settingprivacy from "../../components/UI/Settingprivacy"
import Userhistory from "../../components/Mainpage/Userhistory"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
function settingToken() {
const authContext = useAuthContext()
return authContext.user.user?.relatedUser ? (
  <div className="tw-mb-4">
    <Settingprivacy />
  </div>
) : null
}

export default settingToken
