import React, { useRef, useEffect, useState } from "react"
import { Button } from "react-bootstrap"

function Documents() {
  const imageRef = useRef("")
  const [source, SetSource] = useState("/pp.jpg")
  const [videoSource, setVideoSource] = useState("/pp.jpg")

  return (
    <div className="tw-bg-black  tw-h-[100vh] tw-text-white tw-text-center ">
      {/* Document for  */}
      <h1 className="tw-text-white tw-text-xl ">Document Uplode</h1>

      <h1 className="">Close-up photo of your ID</h1>
      {/* Uplde Image */}
      <form
        action=""
        method="post"
        className="md:tw-w-1/2 md:tw-ml-[28%] tw-bg-red-400 tw-self-center tw-rounded-t-xl tw-rounded-b-xl"
      >
        <div className="tw-grid md:tw-grid-cols-12 tw-grid-cols-1 tw-h-[200px] tw-mt-8">
          <div className="file-input md:tw-mt-10  tw-col-span-4  tw-text-center tw-bg-gray-400 tw-self-center  md:tw-py-8 md:tw-mx-8 ">
            <input
              type="file"
              name="file-input"
              id="file-input"
              className="file-input__input"
              onChange={(e) =>
                setVideoSource(URL.createObjectURL(e.target.files[0]))
              }
              ref={imageRef}
            />
            <label className="file-input__label" htmlFor="file-input">
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
              <span>Upload file</span>
            </label>
          </div>
          {/* Uplode Image */}
          <div className="tw-col-span-4 md:tw-w-[32rem] tw-h-[200px] ">
            <img
              id="output"
              src={videoSource}
              className=" tw-w-full tw-h-full tw-object-fill tw-rounded-t-xl"
            />
          </div>
        </div>
        {/* New---------------------------------------------- */}
        <div className="tw-grid md:tw-grid-cols-12 tw-grid-cols-1 tw-h-[200px] tw-mt-8">
          <div className="file-input md:tw-mt-10  tw-col-span-4  tw-text-center tw-bg-gray-400 tw-self-center  md:tw-py-8 md:tw-mx-8 ">
            <input
              type="file"
              name="file-input"
              id="file-input"
              className="file-input__input"
              onChange={(e) =>
                setVideoSource(URL.createObjectURL(e.target.files[0]))
              }
              ref={imageRef}
            />
            <label className="file-input__label" htmlFor="file-input">
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
              <span>Upload file</span>
            </label>
          </div>
          {/* Uplode Image */}
          <div className="tw-col-span-4 md:tw-w-[32rem] tw-h-[200px] ">
            <img
              id="output"
              src={videoSource}
              className=" tw-w-full tw-h-full tw-object-fill "
            />
          </div>
        </div>
        <Button type="submit" className="tw-mt-4">
          Uplode your document
        </Button>
      </form>
      {/* Uplode Image */}
    </div>
  )
}

export default Documents
