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
  const submitHandler = async (e) => {
    // s3 bucket image upload
    // to get url from domain and then uplode to aws
    let image_1 = e.target.files[0]
    const resp = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image_1.type
    )
    const raw_url = await resp.json()
    const url = await raw_url.uploadUrl

    // is it possible to uplode the two images together in s3 bucket. Thats what I want to get that url

    let respose = await fetch(url, {
      method: "PUT",
      body: image_1,
    })
    let result = await respose.json()
    console.log(result)

    // s3 bucket video upload
    const imageUrl_1 = url.split("?")[0]
    console.log(imageUrl_1)

    // Second image upload to s3 bucket
    let image_2 = e.target.files[1]
    const resp_2 = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image_2.type
    )
    const raw_url_2 = await resp_2.json()
    const url_2 = await raw_url_2.uploadUrl

    // is it possible to uplode the two images together in s3 bucket. Thats what I want to get that

    const imageUrl_2 = url_2.split("?")[0]
    console.log(imageUrl_2)

    let respose_2 = await fetch(url_2, {
      method: "POST",
      body: image_2,
    })
    let result_2 = await respose_2.json()
    console.log(result_2)

    // send data to server
    const data = {
      imageUrl_1,
      imageUrl_2,
    }
  }
  // this data need to be send to server for to store at the server
  // submitHandler().then((data) => console.log(data))

  return (
    <div className="tw-bg-first-color  tw-h-[100vh] tw-text-white tw-text-center ">
      <Header />
      <div className="tw-bg-third-color md:tw-w-1/2 tw-gap-2 md:tw-ml-[28%] tw-ml-0 md:tw-top-[20%] tw-mt-0 md:tw-absolute  document_rows_main tw-rounded-t-2xl tw-rounded-b-2xl">
        <div className="tw-grid md:tw-grid-cols-2 document_rows tw-gap-2 tw-p-4 md:tw-p-0   tw-m-4  ">
          <div className=" ">
            <div className=" tw-min-h-full tw-relative tw-pt-4">
              {/* file input */}
              <input
                type="file"
                accept="image/png, image/jpeg"
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
              <p className="md:tw-absolute md:tw-top-1/2 md:tw-left-1/3 tw-mt-3">
                Uplode Your Id card
              </p>
            </div>
          </div>
          <div className=" ">
            <img
              id="output"
              src={videoSource}
              className=" tw-w-full tw-h-full  md:tw-py-4"
            />
          </div>
        </div>
        {/* change of department */}
        <div className="tw-grid md:tw-grid-cols-2 document_rows tw-gap-2 tw-p-4 md:tw-p-0  tw-m-4 ">
          <div className="  ">
            <div className=" tw-min-h-full tw-relative tw-pt-4 ">
              <input
                type="file"
                accept="image/png, image/jpeg"
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
              <p className="md:tw-absolute md:tw-top-1/2 md:tw-left-1/4 tw-mt-3">
                Uplode self with Id card
              </p>
            </div>
          </div>
          <div className="">
            <img
              id="output"
              src={source}
              className=" tw-w-full tw-h-full  tw-py-4"
            />
          </div>
        </div>
        {/* Once this happens the there will be modal that will be pop out and make it to send conformation on to the client */}
        <div className="tw-justify-center tw-outline-none">
          <Button
            className="tw-w-1/3 tw-justify-center tw-mt-4 tw-bg-green-color hover:tw-bg-green-color tw-rounded-full tw-outline-none"
            onClick={() => submitHandler()}
          >
            submit request
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Documents
