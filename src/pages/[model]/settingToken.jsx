import React from "react"
import Settingprivacy from "../../components/UI/Settingprivacy"
import Userhistory from "../../components/Mainpage/Userhistory"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
function settingToken() {
  const authContext = useAuthContext()
  let show = <div></div>
  if (authContext.user.userType == "Model") {
    show = <Settingprivacy />
  } else {
    show = <Userhistory />
  }
  return <div className="">{show}</div>
}

export default settingToken
