import React, { useState } from "react"
import Image from "next/image"
import { Button } from "react-bootstrap"
import router, { useRouter } from "next/router"
import dynamic from "next/dynamic"
import StarIcon from "@material-ui/icons/Star"
import Link from "next/link"
import { imageDomainURL } from "../../../dreamgirl.config"

function Mainbox(props) {
  const watch = () => {
    console.log("pass dynamic ")
    router.push("/ravi?streaming=true")
  }

  // FOR RENDERING STARS
  // let star = [];
  // for (let index = 0; index < Rating; index++) {
  //   star.push(<StarIcon className="tw-text-yellow-300 " />);
  // }

  let imageUrl
  if (props.photo.startsWith("http")) {
    imageUrl = props.photo
  } else {
    imageUrl = `${imageDomainURL}${props.photo}`
  }

  return (
    <div className="tw-font-sans tw-col-span-1 tw-row-span-1 tw-w-full">
      <div className="tw-relative tw-font-sans parent_transition tw-m-0">
        <Link
          href={
            props.parent === "index" ? `/view-stream/${props.modelId}` : "/"
          }
          className="tw-cursor-pointer"
        >
          <span className="tw-cursor-pointer">
            <img
              src={imageUrl}
              className="tw-object-cover tw-object-center tw-rounded-t tw-w-[211px] tw-h-[211px]"
              alt=""
            />
            {/* <p className="tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-xs tw-tracking-wider tw-bg-purple-600">
              Busy
            </p> */}
            <p className="tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-xs tw-tracking-wider tw-bg-green-color tw-py-0.5">
              Streaming
            </p>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default Mainbox
