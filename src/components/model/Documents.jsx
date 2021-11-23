import React, { useRef, useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import useModalContext from "../../app/ModalContext"
import Header from "../Mainpage/Header"
import Link from "next/link"
import DocumentUplode from "../UI/Profile/DocumentUplode"

function Documents() {
  const idRef = useRef("/pp.jpg")
  const documentRef = useRef("/pp.jpg")
  const modalCtx = useModalContext()
  const [id, setId] = useState("/pp.jpg")
  const [doc, setDoc] = useState("/pp.jpg")

  //submit handler to send data
  const submitHandler = async (e) => {
    const resp = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + idRef.current.files[0].type
    )
    const data = await resp.json()
    const uploadUrl = data.uploadUrl
    console.log(uploadUrl)

    let respose = await fetch(uploadUrl, {
      method: "PUT",
      body: idRef.current.files[0],
    })
    console.log(respose.ok)
    if (!respose.ok) {
      return alert("Error uploading file")
    }

    let url1 = uploadUrl.split("?")[0]

    // Next Image Image document----------------------------
    const resp1 = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" +
        documentRef.current.files[0].type
    )
    const data1 = await resp1.json()
    const uploadUrl1 = data1.uploadUrl

    let respose1 = await fetch(uploadUrl1, {
      method: "PUT",
      body: documentRef.current.files[0],
    })
    if (!respose1.ok) {
      alert("Error in uploading ID")
    }

    let url2 = uploadUrl1.split("?")[0]

    const urlData = [url1, url2]
    // Send the data to the server
    fetch("/api/website/register/model/handle-documents-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentImages: urlData }),
    })
      .then((res) => res.json())
      .then(
        (data) => console.log(data),
        modalCtx.showModalWithContent(<DocumentUplode />)
      )
  }
  // this data need to be send to server for to store at the server
  return (
    <div className="tw-bg-second-color  tw-min-h-screen  tw-text-white tw-text-center  tw-relative">
      <Header />
      <div className="tw-bg-third-color md:tw-w-1/2 tw-gap-2 md:tw-ml-[28%] tw-ml-0 md:tw-top-[20%] tw-mt-0 tw-absolute  document_rows_main tw-rounded-t-2xl tw-rounded-b-2xl">
        <div className="tw-grid md:tw-grid-cols-2 document_rows tw-gap-2 tw-p-4 md:tw-p-0 tw-m-4  ">
          <div className=" ">
            <div className=" tw-min-h-full tw-relative tw-pt-4">
              {/* file input */}
              <input
                type="file"
                accept="image/png, image/jpeg"
                name="document_1"
                id="file-input"
                className="file-input__input"
                onChange={(e) => {
                  setId(e.target.files[0])
                }}
                ref={idRef}
                required={true}
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
              src={typeof id === "string" ? id : URL.createObjectURL(id)}
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
                onChange={(e) => {
                  setDoc(e.target.files[0])
                }}
                ref={documentRef}
                required={true}
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
              src={typeof doc === "string" ? doc : URL.createObjectURL(doc)}
              className=" tw-w-full tw-h-full  tw-py-4"
            />
          </div>
        </div>
        {/* Once this happens the there will be modal that will be pop out and make it to send conformation on to the client */}
        <div className="tw-justify-center tw-outline-none">
          <Button
            className="tw-w-1/3 tw-justify-center tw-mt-4 tw-bg-green-color hover:tw-bg-green-color tw-rounded-full tw-outline-none"
            onClick={(e) => submitHandler(e)}
          >
            submit request
          </Button>
        </div>
        <Link href="/">Skip for Now</Link>
      </div>
    </div>
  )
}

export default Documents
