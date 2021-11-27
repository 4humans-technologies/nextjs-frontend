import React, { useRef, useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import useModalContext from "../../app/ModalContext"
import Header from "../Mainpage/Header"
import Link from "next/link"
import DocumentUpload from "../UI/Profile/DocumentUplode"

function Documents() {
  const idRef = useRef("/id-card (1).png")
  const documentRef = useRef("/paper.png")
  const modalCtx = useModalContext()
  const [id, setId] = useState("/id-card (1).png")
  const [doc, setDoc] = useState("/paper.png")

  const submitHandler = async (e) => {
    if (!idRef.current.files[0] && !documentRef.current.files[0]) {
      modalCtx.showModalWithContent(<DocumentUpload />)
      return alert("Both documents are Required!")
    }
    /* get a new singed upload url */
    const [urlOne, urlTwo] = await Promise.all([
      fetch(
        "/api/website/aws/get-s3-upload-url?type=" + idRef.current.files[0].type
      ),
      fetch(
        "/api/website/aws/get-s3-upload-url?type=" +
          documentRef.current.files[0].type
      ),
    ])
    const urlDataOne = await urlOne.json()
    const urlDataTwo = await urlTwo.json()

    await Promise.all([
      fetch(urlDataOne.uploadUrl, {
        method: "PUT",
        body: documentRef.current.files[0],
      }),
      fetch(urlDataTwo.uploadUrl, {
        method: "PUT",
        body: idRef.current.files[0],
      }),
    ])

    /* now update the document url on server */
    const docUploadResponse = await fetch(
      "/api/website/register/model/handle-documents-upload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentImages: [
            urlDataOne.uploadUrl.split("?")[0],
            urlDataTwo.uploadUrl.split("?")[0],
          ],
        }),
      }
    )
    if (docUploadResponse.actionStatus === "success") {
      modalCtx.showModalWithContent(<DocumentUpload />)
    } else {
      alert("Document images ware not uploaded")
    }
  }
  // this data need to be send to server for to store at the server
  return (
    <div className="tw-min-h-screen tw-text-white-color tw-text-center tw-mt-6 tw-mb-8">
      <h1 className="tw-text-center tw-text-2xl tw-font-medium tw-py-6 tw-capitalize">
        upload your documents
      </h1>
      <div className="tw-bg-dark-black tw-mx-3 md:tw-w-9/12 lg:tw-w-1/2 tw-rounded md:tw-mx-auto tw-px-6 tw-pb-8">
        {/* row one */}
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-2 tw-my-6">
          <div className="tw-order-2 md:tw-order-1">
            <div className=" tw-min-h-full tw-relative tw-pt-4">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
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
          <div className="tw-h-36 sm:tw-h-40 md:tw-h-56 lg:tw-h-64 tw-p-3 tw-order-1 md:tw-order-2">
            <img
              src={typeof id === "string" ? id : URL.createObjectURL(id)}
              className="tw-w-full tw-h-full tw-rounded tw-object-contain"
            />
          </div>
        </div>

        {/* row two */}
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-2 tw-mb-6">
          <div className="tw-order-2 md:tw-order-1">
            <div className=" tw-min-h-full tw-relative tw-pt-4">
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
              <p className="md:tw-absolute md:tw-top-1/2 md:tw-left-1/3 tw-mt-3">
                Upload A Verified Document
              </p>
            </div>
          </div>
          <div className="tw-h-36 sm:tw-h-40 md:tw-h-56 lg:tw-h-64 tw-p-3  tw-order-1 md:tw-order-2">
            <img
              src={typeof doc === "string" ? doc : URL.createObjectURL(doc)}
              className="tw-w-full tw-h-full tw-rounded tw-object-contain"
            />
          </div>
        </div>

        <div className="tw-border-t tw-border-text-black tw-w-10/12 tw-my-6 tw-mx-auto"></div>
        {/* Once this happens the there will be modal that will be pop out and make it to send conformation on to the client */}
        <div className="tw-text-center tw-py-4 tw-mb-6 tw-flex tw-items-center tw-justify-center">
          <button
            className="tw-px-6 tw-py-2 tw-rounded-full tw-capitalize tw-bg-second-color tw-border-second-color tw-border tw-text-white-color tw-mr-4"
            onClick={(e) => submitHandler(e)}
          >
            Submit
          </button>
          <Link href="/">
            <a
              href=""
              className="tw-border-text-black tw-text-text-black tw-border tw-py-2 tw-px-6 tw-rounded-full hover:tw-text-white-color"
            >
              Skip for Now
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Documents
