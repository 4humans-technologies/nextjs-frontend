import React from "react"
import PersonIcon from "@material-ui/icons/Person"
import PeopleIcon from "@material-ui/icons/People"
import SettingsIcon from "@material-ui/icons/Settings"
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew"
import { useRouter } from "next/router"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"

function Headerprofile(props) {
  const ctx = useAuthUpdateContext()

  const router = useRouter()
  const profileRouter = (props) => {
    if (props.type == "Model") {
      router.push("/name/profile")
    }
    router.push("/user/ravi")
  }
  return (
    <div>
      <ul>
        <div className="tw-flex tw-my-2 tw-px-2 " onClick={profileRouter}>
          <PersonIcon />
          <p className="tw-ml-4">My Profile</p>
        </div>
        <div className="tw-flex tw-my-2 tw-px-2">
          <PeopleIcon />
          <p className="tw-ml-4">My Follower</p>
        </div>
        <div className="tw-flex tw-my-2 tw-px-2 tw-border-t-[1px] tw-border-gray-600">
          <SettingsIcon />
          <p className="tw-ml-4">Setting and Privacy</p>
        </div>
        <div
          className="tw-flex tw-my-4 tw-px-2 tw-border-t-[1px] tw-border-gray-600"
          onClick={ctx.logout}
        >
          <PowerSettingsNewIcon />
          <p className="tw-ml-4">Logout</p>
        </div>
      </ul>
    </div>
  )
}

export default Headerprofile
