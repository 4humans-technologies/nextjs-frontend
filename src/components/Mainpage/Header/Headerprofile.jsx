import React from "react"
import PersonIcon from "@material-ui/icons/Person"
import SettingsIcon from "@material-ui/icons/Settings"
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew"
import { useRouter } from "next/router"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"

function Headerprofile(props) {
  const updateAuthContext = useAuthUpdateContext()
  const authContext = useAuthContext()

  const router = useRouter()
  const profileRouter = () => {
    if (authContext.user.userType == "Model") {
      router.push(`/${authContext.user.user.username}/profile`)
    } else {
      router.push(`/user/${authContext.user.user.username}`)
    }
  }

  // first data will be get by the context

  return (
    <div>
      <ul>
        <div className="tw-flex tw-my-2 tw-px-2 " onClick={profileRouter}>
          <PersonIcon />
          <p className="tw-ml-4">My Profile</p>
        </div>
        <div
          className="tw-flex tw-my-2 tw-px-2 tw-border-t-[1px] tw-border-gray-600"
          onClick={() =>
            router.push(`/${authContext.user.user.username}/settingToken`)
          }
        >
          <SettingsIcon />
          <p className="tw-ml-4">Setting and Earning</p>
        </div>
        {/* Profile edit */}

        {authContext.user.userType === "Model" && (
          <div className="tw-flex tw-my-2 tw-px-2 ">
            <PersonIcon />
            <p className="tw-ml-4">About Me </p>
          </div>
        )}

        {/* Profile edit */}

        <div
          className="tw-flex tw-my-4 tw-px-2 tw-border-t-[1px] tw-border-gray-600"
          onClick={updateAuthContext.logout}
        >
          <PowerSettingsNewIcon />
          <p className="tw-ml-4">Logout</p>
        </div>
      </ul>
    </div>
  )
}

export default Headerprofile
