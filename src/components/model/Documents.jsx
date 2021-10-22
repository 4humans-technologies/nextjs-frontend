import React, { useRef, useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import useModalContext from "../../app/ModalContext"
import submitFile from "../Notifications/submitFile"
import Header from "../Mainpage/Header"
// import Headermodel from "./Headermodel"

function Documents() {
  const imageRef = useRef("")
  const videoRef = useRef("")
  const modalCtx = useModalContext()
  const [source, setSource] = useState("/pp.jpg")
  const [videoSource, setVideoSource] = useState("/pp.jpg")

  //submit handler to send data

  const submitHandler = async () => {
    let data = new FormData()
    data.append("document_1", source)
    data.append("document_2", videoSource)
    let respose = await fetch("url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    let result = await respose.json()
    return result
  }
  submitHandler().then((data) => console.log(data))

  return (
    <div className="tw-bg-black  tw-h-[100vh] tw-text-white tw-text-center ">
      <Header />
      <div className="tw-bg-third-color md:tw-w-1/2 tw-gap-2 md:tw-ml-[28%] tw-ml-0 md:tw-top-[20%] tw-mt-0 md:tw-absolute  document_rows_main tw-rounded-t-2xl tw-rounded-b-2xl">
        <div className="tw-grid md:tw-grid-cols-2 document_rows tw-gap-2 tw-p-4 md:tw-p-0 tw-bg-second-color tw-m-4  ">
          <div className="tw-bg-gray-400 ">
            <div className=" tw-min-h-full tw-relative tw-pt-4">
              {/* file input */}
              <input
                type="file"
                name="document_1"
                id="file-input"
                className="file-input__input"
                onChange={(e) =>
                  setVideoSource(URL.createObjectURL(e.target.files[0]))
                }
                ref={videoRef}
              />
              <label
                className="file-input__label md:tw-absolute md:tw-top-1/3 md:tw-left-1/3 "
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
              <p className="md:tw-absolute md:tw-top-1/2 md:tw-left-1/4 ">
                Uplode Your Id card
              </p>
            </div>
          </div>
          <div className="tw-bg-gray-400 ">
            <img
              id="output"
              src={videoSource}
              className=" tw-w-full tw-h-full md:tw-px-4 md:tw-py-8"
            />
          </div>
        </div>
        {/* change of department */}
        <div className="tw-grid md:tw-grid-cols-2 document_rows tw-gap-2 tw-p-4 md:tw-p-0 tw-bg-second-color tw-m-4 ">
          <div className="tw-bg-gray-400  ">
            <div className=" tw-min-h-full tw-relative tw-pt-4 ">
              <input
                type="file"
                name="document_2"
                id="file-input_1"
                className="file-input__input"
                onChange={(e) =>
                  setSource(URL.createObjectURL(e.target.files[0]))
                }
                ref={imageRef}
              />
              <label
                className="file-input__label md:tw-absolute md:tw-top-1/3 md:tw-left-1/3"
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
              <p className="md:tw-absolute md:tw-top-1/2 md:tw-left-1/4">
                Uplode self with Id card
              </p>
            </div>
          </div>
          <div className="tw-bg-gray-400">
            <img
              id="output"
              src={source}
              className=" tw-w-full tw-h-full md:tw-px-4 md:tw-py-8"
            />
          </div>
        </div>
        <div className='tw-justify-center"'>
          <Button
            className="tw-w-1/3 tw-justify-center tw-mt-4 "
            onClick={() => submitHandler}
          >
            submit request
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Documents
