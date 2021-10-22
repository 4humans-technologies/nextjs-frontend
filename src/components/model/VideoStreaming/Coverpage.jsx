import React, { useState } from "react"
import VolumeMuteIcon from "@material-ui/icons/VolumeMute"

function Coverpage() {
  const [coverImage, setCoverImage] = useState("/pp.jpg")
  return (
    <div>
      <div className="tw-bg-first-color tw-text-white tw-mx-4 tw-rounded-t-2xl tw-rounded-b-2xl tw-mt-6   tw-font-normal sm:-font-medium ">
        <div className="tw-border-b-[1px] tw-border-text-black tw-mb-4 tw-py-2 tw-mx-auto">
          <VolumeMuteIcon /> Topic
        </div>
        <div className="tw-border-b-[1px] tw-border-text-black tw-mb-4 tw-ml-[30%] ">
          <div className="">
            <img src={coverImage} alt="sona babu" className="tw-w-48 tw-h-28" />
          </div>
          <div className=" tw-min-h-full  tw-py-4 tw-ml-10">
            {/* file input */}
            <input
              type="file"
              name="document_1"
              id="file-input"
              className="file-input__input"
              onChange={(e) =>
                setCoverImage(URL.createObjectURL(e.target.files[0]))
              }
            />
            <label className="file-input__label " htmlFor="file-input">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="upload"
                className="svg-inline--fa fa-upload fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                ></path>
              </svg>
              <span>Replace</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Coverpage
