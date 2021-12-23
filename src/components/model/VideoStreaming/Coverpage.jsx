import React, { useState, useEffect } from "react"
import ImageRoundedIcon from "@material-ui/icons/ImageRounded"
import { Button } from "react-bootstrap"
import BackupRoundedIcon from "@material-ui/icons/BackupRounded"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"
import { CoverUpdate } from "../../UI/Profile/Emailpassword"

function Coverpage() {
  const [coverImage, setCoverImage] = useState()
  const authContext = useAuthContext()
  const updateCtx = useAuthUpdateContext()

  useEffect(() => {
    setCoverImage(
      authContext.user.user.relatedUser?.backGroundImage || "/cover-photo.png"
    )
  }, [authContext.user.user.relatedUser?.backGroundImage])

  const changeCover = async (e) => {
    const image_1 = await e.target.files[0]
    const image_2 = await URL.createObjectURL(e.target.files[0])
    setCoverImage(image_2)

    const res = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image_1.type
    )
    const data_2 = await res.json()
    const cover_url = await data_2.uploadUrl

    // Then this uplode uplode the Image in the S3 bucket
    const resp = await fetch(cover_url, {
      method: "PUT",
      body: image_1,
    })

    const coverUrl = cover_url.split("?")[0]
    const re = await fetch("/api/website/profile/update-info-fields", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ field: "backGroundImage", value: coverUrl }]),
    })
    const lcUser = JSON.parse(localStorage.getItem("user"))
    lcUser.relatedUser.backGroundImage = coverUrl
    localStorage.setItem("user", JSON.stringify(lcUser))
    updateCtx.setAuthState((prev) => {
      prev.user.user.relatedUser.backGroundImage = coverUrl
      return { ...prev }
    })
  }

  return (
    <>
      <div className="tw-bg-second-color tw-text-white tw-px-4 tw-rounded">
        <div>
          <div className="tw-border-b-[1px] tw-border-white-color tw-mb-4 tw-py-4 tw-flex tw-items-center">
            <ImageRoundedIcon fontSize="medium" />
            <span className="">Cover Page</span>
          </div>
          <img
            src={coverImage}
            className="tw-max-h-[200px] tw-object-cover tw-rounded tw-my-2"
          />
          <div className="tw-border-b-[1px] tw-border-white-color tw-py-4">
            <input
              type="file"
              name="document_1"
              id="file-input"
              className="file-input__input"
              onChange={(e) => changeCover(e)}
            />
            <label
              className="file-input__label_exception tw-w-full tw-cursor-pointer"
              htmlFor="file-input"
            >
              <Button
                className="tw-rounded-full tw-inline-flex tw-items-center tw-text-sm tw-pointer-events-none"
                variant="success"
                // onClick={() => modalCtx.showModalWithContent(<CoverUpdate />)}
              >
                <BackupRoundedIcon fontSize="small" />
                <span className="tw-pl-2">Update Image</span>
              </Button>
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
