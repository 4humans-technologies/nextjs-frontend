import React, { useState } from "react"
import Image from "next/image"
import { Button } from "react-bootstrap"
import router, { useRouter } from "next/router"
import dynamic from "next/dynamic"
import StarIcon from "@material-ui/icons/Star"
import Link from "next/link"

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
    imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${props.photo}`
  }

  return (
    <div className="tw-font-sans  ">
      <Link
        href={props.parent === "index" ? `/view-stream/${props.modelId}` : "/"}
        // className="tw-cursor-pointer"
      >
        <span className="tw-cursor-pointer tw-w-[211px] tw-h-[211px] tw-relative ">
          <img
            src={imageUrl}
            className="tw-object-cover tw-object-center tw-rounded-t"
            alt=""
          />

          <p className="tw-text-center tw-font-light tw-text-white tw-rounded-b tw-text-xs tw-tracking-wider tw-bg-green-color tw-py-0.5  tw-relative tw-bottom-0 tw-w-full">
            Streaming
          </p>
        </span>
      </Link>
    </div>
  )
}

export default Mainbox
