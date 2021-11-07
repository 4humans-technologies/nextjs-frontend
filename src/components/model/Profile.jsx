import React, { useState, useEffect } from "react"
import CreateIcon from "@material-ui/icons/Create"
import { Button } from "react-bootstrap"
import Card from "../UI/Card"
import HelpOutlineIcon from "@material-ui/icons/HelpOutline"
import modalContext from "../../app/ModalContext"
import ClearIcon from "@material-ui/icons/Clear"
import {
  EmailChange,
  PasswordChange,
  CoverUpdate,
  ProfileUpdate,
} from "../UI/Profile/Emailpassword"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import Header from "../Mainpage/Header"

function Profile() {
  const [checked, setChecked] = useState(false)
  const [infoedited, setInfoedited] = useState(false)
  const [priceEdit, setPriceEdited] = useState(false)
  const [dynamicData, setDynamicData] = useState([1])
  const [imageVideo, setImageVideo] = useState({
    images: [],
    videos: [],
  })

  const [modelData, setModelData] = useState()
  const [modelDetails, setModelDetails] = useState(null)
  const [callData, setCallData] = useState()
  const modalCtx = modalContext()
  const authContext = useAuthContext()
  const updateAuth = useAuthUpdateContext()

  const [audioVideoPrice, setAudioVideoPrice] = useState({
    audio: authContext.user.user.relatedUser.charges.audioCall,
    video: authContext.user.user.relatedUser.charges.videoCall,
  })

  useEffect(() => {
    fetch("/model.json")
      .then((res) => res.json())
      .then((data) => {
        setModelData(data.Personal), setCallData(data.Charges)
      })
    return {}
  }, [])

  const callChangeHandler = (e) => {
    const { name, value } = e.target
    setAudioVideoPrice({ ...audioVideoPrice, [name]: value })
    setPriceEdited(true)
  }

  // s3 bucket image upload
  // to get url from domain and then uplode to aws
  // const { url } = await fetch("/api/website/aws/get-s3-upload-url").then(
  //   (resp) => resp.uploadUrl
  // ) //this is the url where to uplode to aws

  // s3 bucket image upload

  // PhotoUplode Handler
  const photoUpdateHandler = async (e) => {
    setImageVideo.images((prev) => [
      ...prev,
      URL.createObjectURL(e.target.files[0]),
    ])
    // to get url from domain and then uplode to aws
    // const { url } = await fetch("/api/website/aws/get-s3-upload-url").then(
    //   (resp) => resp.json() //this is the url where to uplode to aws
    // )
    let req = await fetch("url", {
      method: "PUT",
      headers: {
        "Content-type": "multipart/form-data",
      },
      body: {
        modelImage: imageVideo.images,
      },
    })
    let resp = await req.json()
    return resp
    // send data back to node serve as success report with user id and url for the data

    let serverReq = await fetch("url", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        rootUserId: authContext.rootUserId,
        // there we need to pass the image url to save in local data base
      }),
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data))
  }

  // VideoUplodeHandler videoUpdateHandler
  const videoUpdateHandler = async (e) => {
    setImageVideo.videos((prev) => [
      ...prev,
      URL.createObjectURL(e.target.files[0]),
    ])
    let req = await fetch("url", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: {
        modelVideos: imageVideo.videos,
      },
    })
    let resp = await req.json()
    return resp
  }

  useEffect(() => {
    fetch("/api/website/profile/get-model-profile-data")
      .then((resp) => resp.json())
      .then((data) => setModelDetails(data))
  }, [])

  // console.log(modelDetails.model)
  // useEffect to make  button appear when change in information takes place
  let audio = []
  let video = []

  useEffect(() => {
    if (callData) {
      for (let index = 1; index < 5; index++) {
        audio.push(callData.Audio * index)
        video.push(callData.Video * index)
      }
    }
  }, [callData])

  const toggleChecked = () => {
    setChecked((prev) => !prev)
  }

  // This will change data and fecth data and send to uper
  const saveData = () => {
    const allInputs = document.querySelectorAll("#action-form input")
    const actionArray = []
    for (let index = 0; index < allInputs.length; index += 2) {
      const action = allInputs[index].value
      const actionValue = allInputs[index + 1].value
      actionArray.push({ action: action, price: actionValue })
    }

    fetch("/api/website/profile/update-model-tipmenu-actions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        newActions: actionArray,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data))
  }

  let today = new Date()
  let thisYear = today.getFullYear()

  // Data fetching which make things possible
  let profileImage = ""
  if (authContext.user.user) {
    profileImage = authContext.user.user.relatedUser.profileImage
  }

  return (
    <div>
      {/* Cover page */}
      <Header />

      <div
        className="tw-w-screen tw-relative  md:tw-mt-[8.2rem] tw-mt-28 tw-h-96 "
        style={{
          backgroundImage: `url(${profileImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <p
          className=" tw-absolute tw-z-10 tw-bottom-4 tw-bg-dark-background tw-text-white-color tw-right-8 tw-py-2 tw-px-4 tw-rounded-full tw-cursor-pointer"
          onClick={() => modalCtx.showModalWithContent(<CoverUpdate />)}
        >
          <CreateIcon className="tw-mr-2" />
          Edit Background
        </p>
      </div>
      {/* corcle for profile picture */}
      <div className="tw-w-screen tw-bg-first-color tw-h-28 tw-flex tw-pl-8 tw-relative">
        <img
          className="tw-rounded-full tw-w-32 tw-h-32 flex tw-items-center tw-justify-center tw-absolute tw-z-10 tw-mt-[-3%]  hover:tw-shadow-lg "
          src={profileImage}
        ></img>
        <CreateIcon
          className="md:tw-ml-24 md:tw-mt-12 tw-mt-16 tw-ml-28 tw-text-white-color tw-z-10 tw-absolute tw-bg-dark-background tw-rounded-full tw-cursor-pointer"
          fontSize="medium"
          onClick={() => modalCtx.showModalWithContent(<ProfileUpdate />)}
        />
        <div className="tw-font-extrabold tw-text-2xl tw-text-white tw-ml-44 tw-flex  md:tw-mt-4 tw-mt-8">
          {modelDetails ? modelDetails.model.name : null}
          {authContext.user.user.relatedUser.gender == "Female" ? (
            <img src="/femaleIcon.png" className="tw-w-8 tw-h-8 tw-ml-4" />
          ) : (
            <img src="/maleIcon.png" className="tw-w-8 tw-h-8 tw-ml-4" />
          )}
        </div>
      </div>
      {/* horizontal bar */}
      {/* Profile compy from grid */}
      <div className="tw-grid md:tw-grid-cols-7 tw-grid-cols-1 md:tw-gap-4 tw-bg-dark-background tw-w-screen">
        <div className="md:tw-col-span-4 tw-col-span-1">
          <div className="  tw-px-4 tw-py-4 tw-text-white tw-leading-8">
            <h1 className="tw-ml-4 tw-mb-4">My Information</h1>
            <div className="tw-grid tw-grid-cols-6 tw-gap-4 tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl">
              <div className=" md:tw-col-span-1 tw-col-span-2 ">
                <p>Intrested in</p>
                <p>From</p>
                <p>Language</p>
                <p>Age</p>
                <p>Body type</p>
                <p>Specifiv</p>
                <p>Hair</p>
                <p>Eye color</p>
                <p>SubCulture</p>
              </div>

              {modelData
                ? modelData.map((item) => (
                    <div
                      className="md:tw-col-span-5 tw-col-span-4 "
                      onChange={() => setInfoedited(true)}
                    >
                      <p
                        onInput={
                          ((e) => e.currentTarget.textContent,
                          () => setInfoedited(true))
                        }
                        contentEditable="true"
                      >
                        {item.Interest}
                      </p>
                      <p
                        onInput={
                          ((e) => e.currentTarget.textContent,
                          () => setInfoedited(true))
                        }
                        contentEditable="true"
                      >
                        {item.From}
                      </p>
                      <p
                        onInput={
                          ((e) => e.currentTarget.textContent,
                          () => setInfoedited(true))
                        }
                        contentEditable="true"
                      >
                        {/* {item.Language} */}
                        {modelDetails ? modelDetails.model.languages[0] : null}
                      </p>
                      <p
                        onInput={
                          ((e) => e.currentTarget.textContent,
                          () => setInfoedited(true))
                        }
                      >
                        {/* {item.Age} */}
                        {modelDetails
                          ? thisYear - modelDetails.model.dob
                          : null}
                      </p>
                      <p
                        onInput={
                          ((e) => e.currentTarget.textContent,
                          () => setInfoedited(true))
                        }
                        contentEditable="true"
                      >
                        {item.Body}
                      </p>
                      <p
                        onInput={
                          ((e) => e.currentTarget.textContent,
                          () => setInfoedited(true))
                        }
                        contentEditable="true"
                      >
                        {item.Hair}
                      </p>
                      <p
                        onInput={
                          ((e) => e.currentTarget.textContent,
                          () => setInfoedited(true))
                        }
                        contentEditable="true"
                      >
                        {item.Eye}
                      </p>
                      <p
                        onInput={
                          ((e) => e.currentTarget.textContent,
                          () => setInfoedited(true))
                        }
                        contentEditable="true"
                      >
                        {item.Call}
                      </p>
                      <p
                        onInput={
                          ((e) => e.currentTarget.textContent,
                          () => setInfoedited(true))
                        }
                        contentEditable="true"
                      >
                        {item.Call}
                      </p>
                    </div>
                  ))
                : null}

              <br />
              {infoedited && (
                <button
                  type="submit"
                  onClick={() => setInfoedited(false)}
                  className="tw-rounded-full tw-px-4 tw-py-2 tw-bg-green-color"
                >
                  Save
                </button>
              )}
            </div>
            {/* removed epic goal and Broadcast shedule */}

            {/* setting */}
            <div className="  tw-rounded-t-2xl tw-rounded-b-lg tw-mt-4">
              <div className="tw-bg-first-color tw-flex tw-flex-col tw-py-4">
                <p className="tw-px-4">
                  My Email{" "}
                  <span className="tw-ml-4 tw-font-bold tw-text-xl">
                    {modelDetails ? modelDetails.model.email : null}
                  </span>
                </p>
                <div className="tw-mx-auto tw-px-4 tw-pt-2 ">
                  <button
                    className="tw-rounded-full tw-bg-second-color tw-px-2"
                    onClick={() =>
                      modalCtx.showModalWithContent(<EmailChange />)
                    }
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </div>

            <div className="tw-my-4  hover:tw-shadow-lg tw-rounded-t-2xl tw-rounded-b-2xl ">
              <div className="tw-bg-first-color tw-flex tw-flex-col tw-py-4 ">
                <p className="tw-mx-4">My Password</p>
                <div className=" tw-mx-auto tw-pt-2">
                  <button
                    className="tw-rounded-full tw-bg-second-color  tw-px-2 "
                    onClick={() =>
                      modalCtx.showModalWithContent(<PasswordChange />)
                    }
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
            {/* setting */}

            {/* Pricing */}
            <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-grid-cols-3 tw-grid tw-leading-9 tw-mt-6">
              <div className="tw-col-span-1">
                <p>Private Audio Call</p>
                <p className="md:tw-my-2">Private video Call</p>
              </div>
              <div className="tw-col-span-2">
                <div className="tw-flex ">
                  <input
                    type="number"
                    name="audio"
                    onChange={(e) => callChangeHandler(e)}
                    id=""
                    max="100"
                    min="20"
                    className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-outline-none"
                    value={audioVideoPrice.audio}
                  />
                </div>
                {/*  */}

                <div className="tw-flex  md:tw-my-2 tw-my-10">
                  <input
                    type="number"
                    name="video"
                    onChange={(e) => callChangeHandler(e)}
                    id=""
                    max="100"
                    min="20"
                    className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-outline-none"
                    value={audioVideoPrice.video}
                  />
                </div>
                {priceEdit && (
                  <button className="tw-bg-green-color tw-text-white tw-px-4  tw-my-2 tw-rounded-full">
                    Save
                  </button>
                )}
              </div>
            </div>
            {/* scroll*/}
            <div className=" tw-text-white tw-flex  tw-overflow-x-auto tw-mt-6 tw-bg-first-color ">
              <Card>
                <div className="tw-flex tw-justify-between ">
                  <h2>Earning</h2>
                  <div className="help_1">
                    <HelpOutlineIcon />
                    <p className="help_text_1 tw-hidden">Hello bro</p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">123</h1>
                  <span className="tw-self-center">Token</span>
                </div>
              </Card>
              <Card>
                <div className="tw-flex tw-justify-between">
                  <h2>Followers</h2>
                  <div className="help_1">
                    <HelpOutlineIcon />
                    <p className="help_text_1 tw-hidden">Hello bro</p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">123</h1>
                </div>
              </Card>
              <Card>
                <div className="tw-flex tw-justify-between">
                  <h2>Rating</h2>
                  <div className="help_1">
                    <HelpOutlineIcon />
                    <p className="help_text_1 tw-hidden">Hello bro</p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">
                    {authContext.user.user.relatedUser.rating}
                  </h1>
                  <span className="tw-self-center">Stars</span>
                </div>
              </Card>
              <Card>
                <div className="tw-flex tw-justify-between">
                  <h2>Earning</h2>
                  <div className="help_1">
                    <HelpOutlineIcon />
                    <p className="help_text_1 tw-hidden">Hello bro</p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">123</h1>
                  <span className="tw-self-center">Token</span>
                </div>
              </Card>
            </div>
            {/* Call History */}
            {/* give width and apply scroll-y this is still not implimented */}

            {/* Call History */}
          </div>
          {/* Scroll */}
        </div>
        <div className="md:tw-col-span-3 tw-col-span-1 tw-bg-dark-background  tw-text-white tw-py-8">
          <div className="tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl">
            <div className="tw-flex tw-justify-between">
              <h1>My Photos</h1>
            </div>
            {/* Make Model Clickeble in model */}
            <div className="md:tw-grid md:tw-grid-cols-3 md:tw-col-span-1  tw-flex tw-flex-wrap tw-justify-around tw-py-4">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4 ">
                {/* file */}
                <div className="file-input tw-mt-10 tw-ml-2">
                  <input
                    type="file"
                    name="file-input"
                    id="file-input"
                    className="file-input__input"
                    onChange={() => photoUpdateHandler()}
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

                {/* file */}
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
            </div>
          </div>
          <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
            <div className="tw-flex tw-justify-between">
              <h1>My videos</h1>
            </div>
            {/* Make Model Clickeble in model */}
            <div className="md:tw-grid md:tw-grid-cols-3 md:tw-col-span-1  tw-flex tw-flex-wrap tw-justify-around tw-py-4">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4">
                {/* input */}
                <div className="file-input tw-mt-10 tw-ml-2 tw-grid">
                  <label
                    className="file-input__label tw-place-items-center"
                    htmlFor="file-input"
                  >
                    <input
                      type="file"
                      name="file-input"
                      id="file-input"
                      className="file-input__input"
                      onChange={() => videoUpdateHandler()}
                    />
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

                {/* input */}
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
              <div className="tw-w-32 tw-h-32 tw-bg-gray-300">
                <img src="/pp.jpg" />
              </div>
            </div>
          </div>
          <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
            <h1 className="tw-mb-3 tw-font-semibold tw-text-lg">Set Actions</h1>
            <form
              id="action-form"
              className="tw-max-h-64  tw-overflow-y-auto tw-mb-3 tw-bg-second-color tw-rounded-lg tw-p-2 tw-flex tw-flex-col tw-flex-shrink-0 "
            >
              {dynamicData.map((item, index) => {
                return (
                  <div
                    className="tw-grid tw-my-4 tw-text-white-color action_grid "
                    id={index}
                    key={index}
                  >
                    <input
                      className="tw-col-span-1 tw-py-2 tw-mx-1 tw-px-2 tw-bg-dark-black tw-rounded-full tw-outline-none "
                      placeholder={index}
                    />
                    <input
                      className="tw-col-span-1 tw-py-2 tw-mx-1 tw-px-2 tw-bg-dark-black tw-rounded-full tw-outline-none"
                      placeholder={dynamicData}
                    />
                    {/* Amazing ninja technique for dom menupulation */}
                    <ClearIcon
                      className="tw-text-white tw-my-auto"
                      onClick={() => {
                        document.getElementById(index).remove()
                      }}
                    />
                  </div>
                )
              })}
            </form>
            <Button
              className="tw-bg-dreamgirl-red hover:tw-bg-dreamgirl-red tw-border-none tw-rounded-full "
              onClick={() => setDynamicData((prev) => [...prev, 1])}
            >
              add new action
            </Button>
            <Button
              onClick={saveData}
              className="tw-ml-4 tw-bg-green-color tw-border-none hover:tw-bg-green-color tw-rounded-full"
            >
              Save
            </Button>
          </div>
          <div>{/* <Callhistory /> */}</div>
          {/* Bro in this call table and history has been removed,so you have to check all the thing carefully before procedure */}
        </div>
      </div>
    </div>
  )
}

export default Profile
