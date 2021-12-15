import React from "react"
import Settingprivacy from "../../components/UI/Settingprivacy"
import Userhistory from "../../components/Mainpage/Userhistory"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
function settingToken() {

  return (
    <div className="tw-mb-4">
      <Settingprivacy />
    </div>
  )
}

export default settingToken
