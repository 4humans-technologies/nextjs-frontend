import React, { useState, useEffect } from "react"
import CreateIcon from "@material-ui/icons/Create"
import Card from "../UI/Card"
import HelpOutlineIcon from "@material-ui/icons/HelpOutline"
import { Tooltip } from "react-bootstrap"
import help from "../UI/help"
import { OverlayTrigger } from "react-bootstrap"

function UserProfile() {
  const [followerData, setFollowerData] = useState([])

  useEffect(() => {
    fetch("/model.json", {})
      .then((resp) => resp.json())
      .then((data) => setFollowerData(data))
  }, [])

  // console.log(followerData)

  // console.log(followerData.Follower)

  // {
  //   followerData.Follower.map((item) => console.log(item.userName))
  // }

  return (
    <div className="tw-bg-dark-background">
      {/* Cover page */}
      <div className="tw-w-screen tw-relative  tw-bg-dark-background ">
        <img
          src="/swami_ji.jpg"
          className="tw-w-full md:tw-h-80 tw-object-cover tw-object-center"
        />
        <p className=" tw-absolute tw-z-10 tw-bottom-4 tw-bg-dark-background tw-text-white-color tw-right-8 tw-py-2 tw-px-4 tw-rounded-full ">
          <CreateIcon className="tw-mr-2" />
          Background
        </p>
      </div>
      {/* Circular name  */}
      <div className="tw-w-screen tw-bg-first-color tw-h-28 tw-flex tw-pl-8">
        <img
          className="tw-rounded-full tw-w-32 tw-h-32 flex tw-items-center tw-justify-center tw-absolute tw-z-10 tw-mt-[-3%] tw-bg-green-400 tw-shadow-lg"
          src="/pp.jpg"
        ></img>
        <div className="tw-font-extrabold tw-text-2xl tw-text-white tw-ml-44 tw-pt-4 ">
          Neeraj Rai
        </div>
      </div>
      {/* name and profile */}
      <div className="tw-grid md:tw-grid-cols-7 tw-grid-cols-1 md:tw-gap-4   md:tw-py-2 md:tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-text-white tw-w-screen tw-bg-dark-background">
        <div className="md:tw-col-span-4 tw-col-span-1 tw-grid tw-grid-cols-4 tw-bg-first-color tw-pl-4 tw-py-4">
          <div className="md:tw-col-span-1 tw-col-span-2   ">
            <p>Intrested in</p>
            <p>From</p>
            <p>Language</p>
            <p>Age</p>
            <p>Body type</p>
            <p>Specifiv</p>
            <p>Hair</p>
            <p>Eye color</p>
            <p>SubCulture</p>
          </div>
          <div className="md:tw-col-span-3 tw-col-span-2 ">
            <p>Intrested in</p>
            <p>From</p>
            <p>Language</p>
            <p>Age</p>
            <p>Body type</p>
            <p>Specifiv</p>
            <p>Hair</p>
            <p>Eye color</p>
            <p>SubCulture</p>
          </div>
        </div>
        <div className="tw-grid  tw-bg-first-color md:tw-col-span-3 tw-col-span-1">
          <h1 className="tw-pl-4 tw-pt-4">Freinds</h1>
          <br />
          {/* Problem with useEffect and useState is that it is update after all data loaded that you have to remmembember */}
          {/* {followerData && (
            <div className="tw-flex tw-flex-wrap tw-justify-between">
              {followerData.Follower.map((item) => (
                <div className="tw-text-center tw-my-4">
                  <img
                    className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                    src={item.profileImage}
                  />
                  <h2 className="tw-my-2">{item.userName}</h2>
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
