import React from "react"
import HomeIcon from "@material-ui/icons/Home"
import FavoriteIcon from "@material-ui/icons/Favorite"
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt"
import HistoryIcon from "@material-ui/icons/History"
import { useSidebarStatus, useSidebarUpdate } from "../../app/Sidebarcontext"
import { Button } from "react-bootstrap"
import { useRouter } from "next/router"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"

const data = [
  /* {
    name: "Home",
    icon: <FavoriteIcon className="tw-mr-2" />,
    number: 56,
  },
  {
    name: "Neeraj Rai",
    icon: <FavoriteIcon className="tw-mr-2" />,
    number: "05",
  },
  {
    name: "Motu bhai",
    icon: <FavoriteIcon className="tw-mr-2" />,
    number: 153,
  }, */
]

function Sidebar(props) {
  const sidebarStatus = useSidebarStatus()
  const updateSidebar = useSidebarUpdate()
  const route = useRouter()

  const top = `${props.top}rem` || "32rem"
  const showStyle = {
    left: "0",
  }
  const hideStyle = {
    left: "-240px",
  }
  return (
    <div
      className={`tw-bg-dark-black tw-w-[240px] tw-min-h-screen tw-flex tw-flex-col tw-fixed tw-font-sans tw-transition-all tw-bottom-0 tw-top-[86px] tw-z-[400]`}
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

      {data.map((item, index) => {
        return (
          <div
            key={index}
            className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2 sidebar_item tw-align-middle  "
          >
            {item.icon}
            <p id="sidebar_item_name">{item.name}</p>
            <p className="tw-font-normal tw-text-sm tw-self-center sidebar_item_number tw-text-left">
              {item.number}
            </p>
          </div>
        )
      })}
      {/* register as model */}
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2 sidebar_item tw-align-middle  ">
        <ExitToAppIcon className="tw-mr-4" />
        <p
          id="sidebar_item_name"
          onClick={() => {
            route.push("/auth/modelRegisteration")
            updateSidebar()
          }}
          className="tw-cursor-pointer"
        >
          Model signup
        </p>
      </div>
      {/* register as model */}
      {/* Modle login  */}
      <div className="tw-flex tw-text-white tw-pt-4 tw-pb-2 tw-pr-2 tw-pl-2 sidebar_item tw-align-middle  ">
        <ExitToAppIcon className="tw-mr-4" />
        <p
          id="sidebar_item_name"
          onClick={() => {
            route.push("/auth/login")
            updateSidebar()
          }}
          className="tw-cursor-pointer"
        >
          Model Login
        </p>
      </div>
      {/* Modle login  */}
    </div>
  )
}

export default Sidebar
