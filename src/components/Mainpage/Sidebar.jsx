import React from "react"
import HomeIcon from "@material-ui/icons/Home"
import FavoriteIcon from "@material-ui/icons/Favorite"
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt"
import HistoryIcon from "@material-ui/icons/History"
import { useSidebarStatus, useSidebarUpdate } from "../../app/Sidebarcontext"
import { Button } from "react-bootstrap"
import { useRouter } from "next/router"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import { useAuthContext } from "../../app/AuthContext"

function Sidebar(props) {
  const sidebarStatus = useSidebarStatus()
  const updateSidebar = useSidebarUpdate()
  const route = useRouter()
  const authContext = useAuthContext()

  const top = `${props.top}rem` || "32rem"
  const showStyle = {
    left: "0",
  }
  const hideStyle = {
    left: "-240px",
  }
  return (
    <div
      className={`tw-bg-dark-black tw-w-[240px] tw-min-h-screen tw-flex tw-flex-col tw-fixed tw-font-sans tw-transition-all tw-bottom-0 tw-top-[64px] tw-z-[400]`}
      style={sidebarStatus ? showStyle : hideStyle}
    >
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2">
        <Button
          variant="secondary"
          className="tw-w-full tw-text-black tw-font-bold"
          onClick={() => {
            route.push("/user/payment")
            updateSidebar()
          }}
        >
          Buy Now
        </Button>
      </div>

      {/* register as model */}
      {/* <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2 sidebar_item tw-align-middle  ">
        <ExitToAppIcon className="tw-mr-4" />
        <p
          id="sidebar_item_name"
          onClick={() => {
            route.push("/auth/modelRegisteration")
            updateSidebar()
          }}
          className="tw-cursor-pointer"
        >
          Model Sign Up
        </p>
      </div> */}

      {/* forgot password */}
      {!authContext.isLoggedIn && (
        <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2 sidebar_item tw-align-middle  ">
          <ExitToAppIcon className="tw-mr-4" />
          <p
            id="sidebar_item_name"
            onClick={() => {
              route.push("/link-verification/password/send-link")
              updateSidebar()
            }}
            className="tw-cursor-pointer"
          >
            Forgot Password
          </p>
        </div>
      )}
    </div>
  )
}

export default Sidebar
