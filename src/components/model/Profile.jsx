import React, { useState, useEffect, useRef } from "react"
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
import FsLightbox from "fslightbox-react"
// ========================================================
function Profile() {
  const modalCtx = modalContext()
  const authContext = useAuthContext()
  const authUpdateContext = useAuthUpdateContext()
  const [audioVideoPrice, setAudioVideoPrice] = useState({
    audio: authContext.user.user.relatedUser.charges.audioCall,
    video: authContext.user.user.relatedUser.charges.videoCall,
  })

  const [infoedited, setInfoedited] = useState(false)
  const [priceEdit, setPriceEdited] = useState(false)
  const [dynamicData, setDynamicData] = useState(
    authContext.user.user.relatedUser.tipMenuActions.actions
  )

  const [profileEdit, setProfileEdit] = useState({
    country: authContext?.user.user.relatedUser.country,
    languages: authContext?.user.user.relatedUser.languages,
    bodyType: authContext?.user.user.relatedUser.bodyType,
    skinColor: authContext?.user.user.relatedUser.skinColor,
    hairColor: authContext?.user.user.relatedUser.hairColor,
    eyeColor: authContext?.user.user.relatedUser.eyeColor,
  })

  // this is for image uplode
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1,
  })

  function openLightboxOnSlide(number) {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number,
    })
  }

  // This is for videos uplode
  const [videoboxController, setVideoboxController] = useState({
    toggler: false,
    slide: 1,
  })

  function openVideoboxOnSlide(number) {
    setVideoboxController({
      toggler: !videoboxController.toggler,
      slide: number,
    })
  }

  const callChangeHandler = (e) => {
    const { name, value } = e.target
    setAudioVideoPrice({ ...audioVideoPrice, [name]: value })
    setPriceEdited(true)
  }

  //  ============================================================================================

  const priceSetting = async () => {
    const res = await fetch("/api/website/profile/update-info-fields", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify([
        {
          field: "charges.audioCall",
          value: audioVideoPrice.audio,
        },
        {
          field: "charges.videoCall",
          value: audioVideoPrice.video,
        },
      ]),
    })
    const data = await res.json()
    authUpdateContext.updateNestedPaths((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        user: {
          ...prev.user.user,
          relatedUser: {
            ...prev.user.user.relatedUser,
            charges: {
              audioCall: audioVideoPrice.audio,
              videoCall: audioVideoPrice.video,
            },
          },
        },
      },
    }))

    let store = JSON.parse(localStorage.getItem("user"))
    console.log(
      (store["relatedUser"]["charges"] =
        authContext.user.user.relatedUser.charges)
    )
    localStorage.setItem("user", JSON.stringify(store))
  }

  // Profile editor
  const profileFunction = async () => {
    const fet = await fetch("/api/website/profile/update-info-fields", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify([
        {
          field: "country",
          value: profileEdit.country,
        },
        {
          field: "language",
          value: profileEdit.languages,
        },
        {
          field: "skinColor",
          value: profileEdit.skinColor,
        },
        {
          field: "eyeColor",
          value: profileEdit.eyeColor,
        },
        {
          field: "bodyType",
          value: profileEdit.bodyType,
        },
      ]),
    })

    const resp = await fet.json()

    authUpdateContext.updateNestedPaths((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        user: {
          ...prev.user.user,
          relatedUser: {
            ...prev.user.user.relatedUser,
            country: profileEdit.country,
            languages: profileEdit.languages,
            skinColor: profileEdit.skinColor,
            bodyType: profileEdit.bodyType,
            eyeColor: profileEdit.eyeColor,
            hairColor: profileEdit.hairColor,
          },
        },
      },
    }))

    let store = JSON.parse(localStorage.getItem("user"))["relatedUser"]
    store["country"] = profileEdit.country
    store["skinColor"] = profileEdit.skinColor
    store["languages"] = profileEdit.languages
    store["bodyType"] = profileEdit.bodyType
    store["hairColor"] = profileEdit.hairColor
    store["eyeColor"] = profileEdit.eyeColor
  }

  // Profile editor
  //  ============================================================================================

  // s3 bucket image upload

  // PhotoUplode Handler
  const photoUpdateHandler = async (e) => {
    const image = e.target.files[0]

    // to get url from domain and then uplode to aws
    const url = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image.type
    )
    const urlJson = await url.json()
    const imageUrl = await urlJson.uploadUrl

    const profileUrl = imageUrl.split("?")[0]

    // below is the data uplode to aws
    let req = await fetch(imageUrl, {
      method: "PUT",
      body: image,
    })
    if (!req.ok) {
      return alert("Image was not uploaded!")
    }

    // send data back to node serve as success report with user id and url for the data
    let serverReq = await fetch(
      "/api/website/profile/handle-public-image-upload",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          newImageUrl: profileUrl,
        }),
      }
    )

    let serverResp = await serverReq.json()
    if (serverResp.actionStatus === "success") {
      let lcUser = JSON.parse(localStorage.getItem("user"))
      lcUser.relatedUser.publicImages = [
        ...lcUser.relatedUser.publicImages,
        profileUrl,
      ]
      authUpdateContext.updateNestedPaths((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          user: {
            ...lcUser,
          },
        },
      }))
      localStorage.setItem("user", JSON.stringify(lcUser))
    } else {
      alert("Image was not uploaded to the server successfully!")
    }
  }

  // private photo handler
  const privatePhotoUpdateHandler = async (e) => {
    const image = e.target.files[0]

    // to get url from domain and then uplode to aws
    const url = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image.type
    )
    const urlJson = await url.json()
    const imageUrl = await urlJson.uploadUrl

    const profileUrl = imageUrl.split("?")[0]

    // below is the data uplode to aws
    let req = await fetch(imageUrl, {
      method: "PUT",
      body: image,
    })
    if (!req.ok) {
      return alert("Image was not uploaded!")
    }

    // send data back to node serve as success report with user id and url for the data
    let serverReq = await fetch(
      "/api/website/profile/handle-public-image-upload",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          newImageUrl: profileUrl,
        }),
      }
    )

    let serverResp = await serverReq.json()
    if (serverResp.actionStatus === "success") {
      let lcUser = JSON.parse(localStorage.getItem("user"))
      lcUser.relatedUser.privateImages = [
        ...lcUser.relatedUser.privateImages,
        profileUrl,
      ]
      authUpdateContext.updateNestedPaths((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          user: {
            ...lcUser,
          },
        },
      }))
      localStorage.setItem("user", JSON.stringify(lcUser))
    } else {
      alert("Image was not uploaded to the server successfully!")
    }
  }

  // VideoUplodeHandler videoUpdateHandler
  const videoUpdateHandler = async (e) => {
    const image = e.target.files[0]
    // to get url from domain and then uplode to aws
    const url = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image.type
    )
    const urlJson = await url.json()
    const imageUrl = await urlJson.uploadUrl

    const profileUrl = imageUrl.split("?")[0]

    let req = await fetch(imageUrl, {
      method: "PUT",
      body: image,
    })
    if (!req.ok) {
      return alert("OK BRO")
    }
    // send data back to node serve as success report with user id and url for the data
    const serverReq = await fetch(
      "/api/website/profile/handle-public-video-upload",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          newVideoUrl: profileUrl,
        }),
      }
    )
    const serverResp = await serverReq.json()
    let store = JSON.parse(localStorage.getItem("user"))
    store.relatedUser.publicVideos.push(profileUrl)
    if (serverResp.actionStatus === "success") {
      authUpdateContext.setAuthState((prev) => {
        return {
          ...prev,
          user: {
            ...prev.user,
            user: {
              ...prev.user.user,
              relatedUser: {
                ...prev.user.user.relatedUser,
                publicVideos: [
                  ...prev.user.user.relatedUser.publicVideos,
                  profileUrl,
                ],
              },
            },
          },
        }
      })
      localStorage.setItem("user", JSON.stringify(store))
    } else {
      alert("Video was not uploaded!")
    }
  }

  // privatevideoHandle
  const privatevideoUpdateHandler = async (e) => {
    const image = e.target.files[0]
    // to get url from domain and then uplode to aws
    const url = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + image.type
    )
    const urlJson = await url.json()
    const imageUrl = await urlJson.uploadUrl

    const profileUrl = imageUrl.split("?")[0]

    let req = await fetch(imageUrl, {
      method: "PUT",
      body: image,
    })
    if (!req.ok) {
      return alert("OK BRO")
    }
    // send data back to node serve as success report with user id and url for the data
    const serverReq = await fetch(
      "/api/website/profile/handle-public-video-upload",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          newVideoUrl: profileUrl,
        }),
      }
    )
    const serverResp = await serverReq.json()
    let store = JSON.parse(localStorage.getItem("user"))
    store.relatedUser.privateVideos.push(profileUrl)
    if (serverResp.actionStatus === "success") {
      authUpdateContext.setAuthState((prev) => {
        return {
          ...prev,
          user: {
            ...prev.user,
            user: {
              ...prev.user.user,
              relatedUser: {
                ...prev.user.user.relatedUser,
                privateVideos: [
                  ...prev.user.user.relatedUser.privateVideos,
                  profileUrl,
                ],
              },
            },
          },
        }
      })
      localStorage.setItem("user", JSON.stringify(store))
    } else {
      alert("Video was not uploaded!")
    }
  }
  // privatevideohandler

  // This is for save the data for the tip menu
  const saveData = () => {
    const actionArray = []
    const allInputs = document.querySelectorAll("#action-form input")
    for (let index = 0; index < allInputs.length; index += 2) {
      const action = allInputs[index].value
      const actionValue = allInputs[index + 1].value
      actionArray.push({ action: action, price: actionValue })
    }

    /*  */
    fetch("/api/website/profile/update-model-tipmenu-actions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        newActions: actionArray,
      }),
    }).catch((err) => alert(err.message))
  }

  let today = new Date()
  let thisYear = today.getFullYear()

  return authContext.user.user ? (
    <div>
      <div
        className="tw-w-full tw-relative tw-h-96 "
        style={{
          backgroundImage: `url('/cover-photo.png')`,
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

      {/* circle for profile picture */}
      <div className="tw-w-full tw-bg-first-color tw-h-28 tw-flex tw-pl-8 tw-relative tw-text-white-color tw-mb-8">
        {authContext.user.user.relatedUser.profileImage ? (
          <span className="tw-relative tw-w-32 tw-h-32 tw-inline-block">
            <img
              className="tw-rounded-full tw-w-full tw-h-full  tw-items-center tw-justify-center tw-absolute tw-z-10 tw-mt-[-3%]  hover:tw-shadow-lg tw-object-cover tw-ring-white tw-ring-2"
              src={authContext.user.user.relatedUser.profileImage}
            ></img>
            <CreateIcon
              className="tw-text-white-color tw-z-10 tw-absolute tw-bg-dark-background tw-rounded-full tw-cursor-pointer tw-top-[78%] tw-left-[78%] tw-translate-x-[-50%] tw-p-1 tw-ring-white tw-ring-1"
              fontSize="medium"
              onClick={() => modalCtx.showModalWithContent(<ProfileUpdate />)}
            />
          </span>
        ) : (
          <div className="tw-rounded-full tw-w-32 tw-h-32  tw-items-center tw-justify-center tw-absolute tw-z-10 tw-mt-[-3%]  hover:tw-shadow-lg tw-bg-green-color">
            {authContext.user.user.username.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="tw-font-semibold tw-text-2xl tw-flex tw-items-center tw-justify-start tw-ml-6">
          {authContext.user.user.relatedUser?.name}
          <img
            src={
              authContext.user.user.relatedUser.gender == "Female"
                ? "/femaleIcon.png"
                : "/maleIcon.png"
            }
            className="tw-w-6 tw-h-6 tw-ml-2"
          />
        </div>
      </div>

      {/* Profile compy from grid */}
      <div className="tw-grid md:tw-grid-cols-7 tw-grid-cols-1 md:tw-gap-4 tw-bg-dark-background tw-w-full tw-mt-16">
        <div className="md:tw-col-span-4 tw-col-span-1 tw-px-4">
          <div className="  tw-px-4 tw-py-4 tw-text-white tw-leading-8">
            <h1 className="tw-ml-4 tw-mb-4 tw-text-xl tw-font-semibold">
              My Information
            </h1>
            <div className="tw-grid tw-grid-cols-6 tw-gap-4 tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-md">
              <div className=" md:tw-col-span-1 tw-col-span-2 ">
                <p>Intrested in</p>
                <p>From</p>
                <p>Language</p>
                <p>Age</p>
                <p>Skin Type</p>
                <p>Body Type</p>
                <p>Hair</p>
                <p>Eye color</p>
              </div>

              <div className="md:tw-col-span-5 tw-col-span-4 ">
                <p>EveryOne</p>
                <p
                  onInput={(e) => {
                    setProfileEdit((prev) => ({
                      ...prev,
                      country: e.target.textContent,
                    })),
                      setInfoedited(true)
                    // console.log(e.target.textContent)
                  }}
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  // value={profileEdit.country}
                >
                  {/* {profileEdit.country ? profileEdit.country : "Kerla"} */}
                  {authContext.user.user.relatedUser.country}
                  {/* Kerla */}
                </p>
                <p
                  onInput={(e) => {
                    setProfileEdit((prev) => ({
                      ...prev,
                      languages: e.target.textContent.split(","),
                    })),
                      setInfoedited(true)
                  }}
                  suppressContentEditableWarning={true}
                  contentEditable="true"
                >
                  {/* {item.Language} */}
                  {authContext.user.user.relatedUser.languages}
                </p>
                <p>
                  {/* {item.Age} */}
                  {authContext.user.user
                    ? thisYear - authContext.user.user.relatedUser.dob
                    : null}
                </p>
                <p
                  onInput={(e) => {
                    setProfileEdit(
                      (prev) => ({
                        ...prev,
                        skinColor: e.target.textContent,
                      }),
                      setInfoedited(true)
                    )
                  }}
                  suppressContentEditableWarning={true}
                  contentEditable="true"
                  // value={profileEdit.skinColor}
                >
                  Fair
                  {/* {item.Body} */}
                </p>
                {/* Body type */}
                <p
                  onInput={(e) => {
                    setProfileEdit(
                      (prev) => ({
                        ...prev,
                        bodyType: e.target.textContent,
                      }),
                      setInfoedited(true)
                    )
                  }}
                  suppressContentEditableWarning={true}
                  contentEditable="true"
                  // value={profileEdit.skinColor}
                >
                  slim
                  {/* {item.Body} */}
                </p>
                {/* Body type */}
                <p
                  onInput={(ev) => {
                    setProfileEdit((prev) => ({
                      ...prev,
                      hairColor: ev.target.textContent,
                    })),
                      setInfoedited(true)
                  }}
                  suppressContentEditableWarning={true}
                  contentEditable="true"
                  // value={profileEdit.hairColor}
                >
                  Black
                  {/* {item.Hair} */}
                </p>
                <p
                  onInput={(e) => {
                    setProfileEdit((prev) => ({
                      ...prev,
                      eyeColor: e.target.textContent,
                    })),
                      setInfoedited(true)
                  }}
                  suppressContentEditableWarning={true}
                  contentEditable="true"
                  // value={profileEdit.eyeColor}
                >
                  Black
                </p>
              </div>

              {infoedited && (
                <button
                  type="submit"
                  onClick={() => {
                    setInfoedited(false)
                    profileFunction()
                  }}
                  className="tw-rounded-full tw-px-4 tw-py-2 tw-bg-green-color"
                >
                  Save
                </button>
              )}
            </div>

            {/* change email */}
            <div className="tw-bg-first-color tw-flex tw-items-center tw-justify-between tw-py-4 tw-rounded-md tw-mt-4 tw-px-4">
              <p className="">
                My Email{" "}
                <span className="tw-ml-4 tw-text-lg tw-font-semibold">
                  {authContext.user.user.relatedUser.email}
                </span>
              </p>
              <button
                className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium"
                onClick={() => modalCtx.showModalWithContent(<EmailChange />)}
              >
                Change Email
              </button>
            </div>

            {/* change password */}
            <div className="tw-bg-first-color tw-flex tw-items-center tw-justify-between tw-py-4 tw-rounded-md tw-mt-4 tw-px-4">
              <p className="">
                My Password{" "}
                <span className="tw-ml-4 tw-font-semibold">xxxxxxxx</span>
              </p>
              <button
                className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium"
                onClick={() =>
                  modalCtx.showModalWithContent(<PasswordChange />)
                }
              >
                Change Password
              </button>
            </div>

            {/* Pricing */}
            <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-md tw-grid-cols-3 tw-grid tw-leading-9 tw-mt-6">
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
                  <button
                    className="tw-bg-green-color tw-text-white tw-px-4  tw-my-2 tw-rounded-full"
                    onClick={() => {
                      priceSetting(), setPriceEdited(false)
                    }}
                  >
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
                    <p className="help_text_1 tw-hidden">
                      Total Earning by modle
                    </p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">
                    {authContext.user.user.relatedUser.wallet.currentAmount}
                  </h1>
                  <span className="tw-self-center">Token</span>
                </div>
              </Card>
              <Card>
                <div className="tw-flex tw-justify-between">
                  <h2>Followers</h2>
                  <div className="help_1">
                    <HelpOutlineIcon />
                    <p className="help_text_1 tw-hidden">Your Followers</p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">
                    {authContext.user.user.relatedUser.numberOfFollowers}
                  </h1>
                </div>
              </Card>
              <Card>
                <div className="tw-flex tw-justify-between">
                  <h2>Rating</h2>
                  <div className="help_1">
                    <HelpOutlineIcon />
                    <p className="help_text_1 tw-hidden">Rating by Users</p>
                  </div>
                </div>
                <div className="tw-flex tw-mt-4 tw-text-center">
                  <h1 className="tw-font-extrabold tw-text-4xl">
                    {authContext.user.user.relatedUser.rating}
                  </h1>
                  <span className="tw-self-center">Stars</span>
                </div>
              </Card>
            </div>
            {/* Call History */}
            {/* give width and apply scroll-y this is still not implimented */}
            <div>
              <div className=" tw-bg-first-color tw-py-2 tw-px-2 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
                <h1 className="tw-mb-3 tw-font-semibold tw-text-lg tw-text-white">
                  Set Actions
                </h1>
                <form
                  id="action-form"
                  className="tw-max-h-64 tw-min-h-[8rem]  tw-overflow-y-auto tw-mb-3 tw-bg-second-color tw-rounded-lg tw-p-2 tw-flex tw-flex-col tw-flex-shrink-0 "
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
                          placeholder="Actions"
                          value={item.action}
                          required={true}
                        />
                        <input
                          className="tw-col-span-1 tw-py-2 tw-mx-1 tw-px-2 tw-bg-dark-black tw-rounded-full tw-outline-none"
                          placeholder="Price"
                          type={Number}
                          value={item.price}
                          required={true}
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
                  className="tw-bg-dreamgirl-red hover:tw-bg-dreamgirl-red tw-border-none tw-rounded-full"
                  onClick={() =>
                    setDynamicData((prev) => [
                      ...prev,
                      { action: null, price: null },
                    ])
                  }
                >
                  add new action
                </Button>
                <Button
                  onClick={() => saveData()}
                  className="tw-ml-4 tw-bg-green-color tw-border-none hover:tw-bg-green-color tw-rounded-full"
                >
                  Save
                </Button>
              </div>
            </div>
            {/* Call History */}
          </div>
          {/* Scroll */}
        </div>
        <div className="md:tw-col-span-3 tw-col-span-1 tw-bg-dark-background  tw-text-white tw-py-8">
          <div className="tw-flex tw-justify-between tw-ml-4 ">
            <h1>My Photos</h1>
          </div>
          <div className="tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl">
            {/* Make Model Clickeble in model */}
            <div className="md:tw-grid md:tw-grid-cols-3 md:tw-col-span-1 tw-justify-start tw-py-4">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4 tw-mb-4">
                {/* file */}
                <div className="file-input tw-mt-10 tw-ml-2">
                  <input
                    type="file"
                    name="file-input"
                    id="file-input"
                    className="file-input__input"
                    onChange={(e) => photoUpdateHandler(e)}
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
                <FsLightbox
                  toggler={lightboxController.toggler}
                  sources={authContext.user.user.relatedUser.publicImages.map(
                    (url) => {
                      return <img src={url} />
                    }
                  )}
                  slide={lightboxController.slide}
                />
              </div>
              {authContext.user.user.relatedUser
                ? authContext.user.user.relatedUser.publicImages.map(
                    (image, index) => (
                      <div
                        className=" tw-mb-4 tw-cursor-pointer"
                        key={index}
                        onClick={() => openLightboxOnSlide(index + 1)}
                      >
                        <img src={image} className="tw-w-32 tw-h-32" />
                      </div>
                    )
                  )
                : null}
            </div>
          </div>

          {/*Private Image  */}
          <div className="tw-flex tw-justify-between tw-ml-4  tw-mt-4">
            <h1>Private Photos</h1>
          </div>
          <div className="tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl">
            {/* Make Model Clickeble in model */}
            <div className="md:tw-grid md:tw-grid-cols-3 md:tw-col-span-1 tw-justify-start tw-py-4">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4 tw-mb-4">
                {/* file */}
                <div className="file-input tw-mt-10 tw-ml-2">
                  <input
                    type="file"
                    name="file-input"
                    id="file-input"
                    className="file-input__input"
                    onChange={(e) => privatePhotoUpdateHandler(e)}
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
                <FsLightbox
                  toggler={lightboxController.toggler}
                  sources={authContext.user.user.relatedUser.privateImages.map(
                    (url) => {
                      return <img src={url} />
                    }
                  )}
                  slide={lightboxController.slide}
                />
              </div>
              {authContext.user.user.relatedUser
                ? authContext.user.user.relatedUser.privateImages.map(
                    (image, index) => (
                      <div
                        className=" tw-mb-4 tw-cursor-pointer"
                        key={index}
                        onClick={() => openLightboxOnSlide(index + 1)}
                      >
                        <img src={image} className="tw-w-32 tw-h-32" />
                      </div>
                    )
                  )
                : null}
            </div>
          </div>
          {/*Private Image  */}

          <div className="tw-flex tw-justify-between tw--mb-4 tw-mt-4 tw-ml-4">
            <h1>My videos</h1>
          </div>
          <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
            <div className="md:tw-grid md:tw-grid-cols-3 md:tw-col-span-1 tw-justify-start tw-py-4">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4 tw-mb-4">
                {/* file */}
                <div className="file-input tw-mt-10 tw-ml-2">
                  <input
                    type="file"
                    name="file-input_video"
                    id="file-input_video"
                    className="file-input__input"
                    onChange={(e) => videoUpdateHandler(e)}
                  />
                  <label
                    className="file-input__label"
                    htmlFor="file-input_video"
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
                </div>

                {/* file */}
              </div>
              <FsLightbox
                toggler={videoboxController.toggler}
                sources={authContext.user.user.relatedUser.publicVideos.map(
                  (url) => {
                    return <img src={url} />
                  }
                )}
                slide={videoboxController.slide}
              />
              {authContext.user.user.relatedUser
                ? authContext.user.user.relatedUser.publicVideos.map(
                    (image, index) => (
                      <div
                        className=" tw-mb-4 tw-cursor-pointer"
                        key={index}
                        onClick={() => openVideoboxOnSlide(index + 1)}
                      >
                        <img src={image} className="tw-w-32 tw-h-32 " />
                      </div>
                    )
                  )
                : null}
            </div>
          </div>

          {/* private videos */}
          <div className="tw-flex tw-justify-between tw--mb-4 tw-mt-4 tw-ml-4">
            <h1>Private videos</h1>
          </div>
          <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
            <div className="md:tw-grid md:tw-grid-cols-3 md:tw-col-span-1 tw-justify-start tw-py-4">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4 tw-mb-4">
                {/* file */}
                <div className="file-input tw-mt-10 tw-ml-2">
                  <input
                    type="file"
                    name="file-input_video"
                    id="file-input_video"
                    className="file-input__input"
                    onChange={(e) => privatevideoUpdateHandler(e)}
                  />
                  <label
                    className="file-input__label"
                    htmlFor="file-input_video"
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
                </div>

                {/* file */}
              </div>
              <FsLightbox
                toggler={videoboxController.toggler}
                sources={authContext.user.user.relatedUser.privateVideos.map(
                  (url) => {
                    return <img src={url} />
                  }
                )}
                slide={videoboxController.slide}
              />
              {authContext.user.user.relatedUser
                ? authContext.user.user.relatedUser.privateVideos.map(
                    (image, index) => (
                      <div
                        className=" tw-mb-4 tw-cursor-pointer"
                        key={index}
                        onClick={() => openVideoboxOnSlide(index + 1)}
                      >
                        <video>
                          <source
                            src={image}
                            className="tw-w-32 tw-h-32 "
                            type="video"
                          />
                        </video>
                      </div>
                    )
                  )
                : null}
            </div>
          </div>
          {/* private videos */}
          {/* ---------------------------------------------------- */}
          <div>{/* <Callhistory /> */}</div>
          {/* Bro in this call table and history has been removed,so you have to check all the thing carefully before procedure */}
        </div>
      </div>
    </div>
  ) : null
}

export default Profile
