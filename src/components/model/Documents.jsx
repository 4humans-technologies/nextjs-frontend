import React, { useRef, useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import useModalContext from "../../app/ModalContext"
import submitFile from "../Notifications/submitFile"

function Documents() {
  const imageRef = useRef("")
  const videoRef = useRef("")
  const modalCtx = useModalContext()
  const [source, setSource] = useState("/pp.jpg")
  const [videoSource, setVideoSource] = useState("/pp.jpg")

  return (
    <div className="tw-bg-black  tw-h-[100vh] tw-text-white tw-text-center ">
      <div className="tw-bg-red-400 md:tw-w-1/2 tw-gap-2 md:tw-ml-[28%] md:tw-top-[20%] tw-absolute  document_rows_main">
        <div className="tw-grid md:tw-grid-cols-2 document_rows tw-gap-2 ">
          <div className="tw-bg-gray-400 ">
            <div className="tw-bg-gray-500 tw-min-h-full tw-relative  ">
              {/* file input */}
              <input
                type="file"
                name="file-input"
                id="file-input"
                className="file-input__input"
                onChange={(e) =>
                  setVideoSource(URL.createObjectURL(e.target.files[0]))
                }
                ref={videoRef}
              />
              <label
                className="file-input__label tw-absolute tw-top-1/3 tw-left-1/3"
                htmlFor="file-input"
              >
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
              <p className="tw-absolute tw-top-1/2 tw-left-1/4">
                Uplode photo with document
              </p>
            </div>
          </div>
          <div className="tw-bg-gray-400">
            <img
              id="output"
              src={videoSource}
              className=" tw-w-full tw-h-full "
            />
          </div>
        </div>
        {/* change of department */}
        <div className="tw-grid tw-grid-cols-2 document_rows tw-gap-2 ">
          <div className="tw-bg-gray-400  ">
            <div className="tw-bg-gray-500 tw-min-h-full tw-relative  ">
              {/* file input */}
              <input
                type="file"
                name="file-input"
                id="file-input_1"
                className="file-input__input"
                onChange={(e) =>
                  setSource(URL.createObjectURL(e.target.files[0]))
                }
                ref={imageRef}
              />
              <label
                className="file-input__label tw-absolute tw-top-1/3 tw-left-1/3"
                htmlFor="file-input_1"
              >
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
              <p className="tw-absolute tw-top-1/2 tw-left-1/4">
                Uplode your Document
              </p>
            </div>
          </div>
          <div className="tw-bg-gray-400">
            <img id="output" src={source} className=" tw-w-full tw-h-full " />
          </div>
        </div>
        <div className='tw-justify-center"'>
          <Button
            className="tw-w-1/6 tw-justify-center"
            onClick={() => modalCtx.showModalWithContent(submitFile)}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Documents
