import React, { useState } from "react"
import ImageRoundedIcon from "@material-ui/icons/ImageRounded"
import { Button } from "react-bootstrap"
import { SaveRounded } from "@material-ui/icons"
import BackupRoundedIcon from "@material-ui/icons/BackupRounded"

function Coverpage() {
  const [coverImage, setCoverImage] = useState("/pp.jpg")
  // function to handle cover image change
  const changeCover = async (e) => {
    const image_1 = await e.target.files[0]
    const image_2 = await URL.createObjectURL(e.target.files[0])
    setCoverImage(image_2)
    // To send image to url and the make things possible
    // There I have to send with type of url that we uplode
    const res = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image_1.type
    )
    const data_2 = await res.json()
    const cover_url = await data_2.uploadUrl

    console.log(`Bro this is cover page url, ${cover_url.split("?")[0]}`) //The place where it needed to be uploded

    // Then this uplode uplode the Image in the S3 bucket
    const resp = await fetch(cover_url, {
      method: "PUT",
      body: image_1,
    })
    console.log(resp)

    // if response is 200 then send the data to your own server
    if (!resp.ok) {
      return alert("What is this Bakloli")
    }
    const coverUrl = cover_url.split("?")[0]
    console.log(coverUrl)
    const re = await fetch("/api/website/profile/update-model-basic-details", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coverImage: coverUrl,
      }),
    })
    const jsonResp = await re.json()
    console.log(jsonResp)
  }

  return (
    <>
      <div className="tw-bg-second-color tw-text-white tw-px-4 tw-rounded">
        <div>
          <div className="tw-border-b-[1px] tw-border-white-color tw-mb-4 tw-py-4 tw-flex tw-items-center">
            <ImageRoundedIcon fontSize="medium" />{" "}
            <span className="">Cover Page</span>
          </div>
          <div className="">
            <img
              src={coverImage}
              alt=""
              className="tw-max-h-[200px] tw-object-cover tw-rounded tw-my-2"
            />
          </div>
          <div className="tw-border-b-[1px] tw-border-white-color tw-py-4">
            <input
              type="file"
              name="document_1"
              id="file-input"
              className="file-input__input"
              onChange={(e) => changeCover(e)}
            />
            <label className="file-input__label " htmlFor="file-input">
              <BackupRoundedIcon />
              <span>Replace</span>
            </label>
          </div>
          <div className="tw-mb-4 tw-py-4">
            <p>This background image will be show when your offline</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Coverpage
