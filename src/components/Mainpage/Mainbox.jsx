import React, { useState } from "react"
import Image from "next/image"
import { Button } from "react-bootstrap"
import router, { useRouter } from "next/router"
import dynamic from "next/dynamic"
import StarIcon from "@material-ui/icons/Star"
import Link from "next/link"

const DynamicComponent = dynamic(() => import("./ViewerScreen"), {
  ssr: false,
})

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

  return (
    <div className="tw-font-sans tw-col-span-1 tw-row-span-1 tw-w-full">
      <div className="tw-relative tw-font-sans parent_transition tw-m-0">
        <Link
          href={`/view-stream/${props.modelId}`}
          className="tw-cursor-pointer"
        >
          <img
            src={props.photo}
            className="tw-object-cover tw-object-center tw-cursor-pointer tw-rounded"
            alt=""
          />
        </Link>
      </div>
    </div>
  )
}

export default Mainbox
