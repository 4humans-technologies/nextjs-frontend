import React, { useState } from "react"
import CreateIcon from "@material-ui/icons/Create"
import Card from "../UI/Card"
import HelpOutlineIcon from "@material-ui/icons/HelpOutline"
import modalContext from "../../app/ModalContext"
import NextImage from "next/image"
import ClearIcon from "@material-ui/icons/Clear"
import {
  EmailChange,
  PasswordChange,
  CoverUpdate,
  ProfileUpdate,
} from "../UI/Profile/Emailpassword"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import FsLightbox from "fslightbox-react"
import { DropdownButton, Dropdown, Button } from "react-bootstrap"
import { toast } from "react-toastify"
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
    bio: authContext?.user.user.relatedUser.bio,
  })

  // This is for the Image uplode
  const [showInput, setShowInput] = useState(false)
  const [input, setInput] = useState({
    name: "",
    price: 0,
  })
  const [albumNow, setAlbumNow] = useState()

  // This is for the video uplode
  const [showVideoInput, setShowvideoInput] = useState(false)
  const [videoInput, setVideoInput] = useState({
    price: 0,
    name: "",
  })
  const [videoAlbumNow, setVideoAlbumNow] = useState()

  // this is for image uplode
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1,
  })

  // private Image
  const [lightboxControllerPrivate, setLightboxControllerPrivate] = useState({
    toggler: false,
    slide: 1,
  })

  function openLightboxOnSlide(number) {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number,
    })
  }

  // Private image
  function openLightboxOnSlidePrivate(number) {
    setLightboxControllerPrivate({
      toggler: !lightboxControllerPrivate.toggler,
      slide: number,
    })
  }

  // This is for videos uplode
  const [videoboxController, setVideoboxController] = useState({
    toggler: false,
    slide: 1,
  })
  // private video uplode
  const [videoboxControllerPrivate, setVideoboxControllerPrivate] = useState({
    toggler: false,
    slide: 1,
  })

  function openVideoboxOnSlide(number) {
    setVideoboxController({
      toggler: !videoboxController.toggler,
      slide: number,
    })
  }

  // private video
  function openVideoboxOnSlidePrivate(number) {
    setVideoboxControllerPrivate({
      toggler: !videoboxControllerPrivate.toggler,
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
        {
          field: "bio",
          value: profileEdit.bio,
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
            bio: profileEdit.bio,
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
    // tumahar beta katgya haya
    toast.success("Profile update Successfully", {
      position: "bottom-right",
      closeOnClick: true,
      autoClose: 3000,
    })
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
      toast.success("Photo uploded Successfully", {
        position: "bottom-right",
        closeOnClick: true,
        autoClose: 3000,
      })
    } else {
      alert("Image was not uploaded to the server successfully!")
    }
  }

  // Create folder for private photo handle
  const createFolderHandler = async () => {
    // creating folder

    const album = await fetch("/api/website/profile/create-album", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: input.name,
        price: input.price,
        type: "imageAlbum",
      }),
    })
    const resp = await album.json()

    authUpdateContext.updateNestedPaths((prev) => {
      return {
        ...prev,
        user: {
          ...prev.user,
          user: {
            ...prev.user.user,
            relatedUser: {
              ...prev.user.user.relatedUser,
              privateImages: [
                ...prev.user.user.relatedUser.privateImages,
                resp.album,
              ],
            },
          },
        },
      }
    })

    const store = JSON.parse(localStorage.getItem("user"))
    store.relatedUser.privateImages.push(resp.album)
    localStorage.setItem("user", JSON.stringify(store))
    toast.success("Album create Successfully", {
      position: "bottom-right",
      closeOnClick: true,
      autoClose: 3000,
    })
    setShowInput(false)
    setAlbumNow(resp.album)
  }

  // private photo handler

  const privatePhotoUpdateHandler = async (e) => {
    let thumbnailfile
    const image = e.target.files[0]
    if (!image) {
      return alert("No Image selected")
    }
    if (!albumNow._id) {
      return toast.error("Please select album first")
    }

    /* Create thumbnail */
    const reader = await new FileReader()
    reader.readAsDataURL(image)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const MAX_WIDTH = 500
        const MAX_HEIGHT = 500
        let width = img.width
        let height = img.height

        const elem = document.createElement("canvas")
        const ctx = elem.getContext("2d")
        // ctx.fillStyle = "white"

        /* resize while containing the image */
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = height * (MAX_WIDTH / width)
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = width * (MAX_HEIGHT / height)
            height = MAX_HEIGHT
          }
        }
        /* adjust image size */
        img.width = width
        img.height = height
        img.style.objectFit = "contain"

        /* adjust canvas size */
        elem.width = width
        elem.height = height

        ctx.drawImage(img, 0, 0, width, height)
        ctx.canvas.toBlob(
          async (blob) => {
            thumbnailfile = new File([blob], image.name, {
              type: image.type,
              lastModified: Date.now(),
            })

            // to get url from domain and then uplode to aws
            const url = await fetch(
              "/api/website/aws/get-s3-model-private-content-upload-url?type=" +
                image.type +
                "&albumId=" +
                albumNow._id +
                "&albumType=imageAlbum"
            )
            const urlJson = await url.json()
            const imageUrl = await urlJson.uploadUrl

            const awsMainImage = imageUrl[0]
            const awsThumbNail = imageUrl[1]

            // below is the data uplode to aws

            let [mainImageResp, thumbNailResp] = await Promise.all([
              fetch(awsMainImage, {
                method: "PUT",
                body: image,
              }),
              fetch(awsThumbNail, {
                method: "PUT",
                body: thumbnailfile,
              }),
            ])
            if (!mainImageResp.ok || !thumbNailResp.ok) {
              return alert("Image Is not successfully uploaded")
            }
            // send data back to node serve as success report with user id and url for the data
            let serverReq = await fetch(
              "/api/website/profile/handle-private-image-upload",
              {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify({
                  originalImageURL: awsMainImage.split("?")[0],
                  thumbUrl: awsThumbNail.split("?")[0],
                  albumId: albumNow._id,
                }),
              }
            )
            let serverResp = await serverReq.json()
            if (serverResp.actionStatus === "success") {
              let lcUser = JSON.parse(localStorage.getItem("user"))
              const currentAlbum = lcUser.relatedUser.privateImages.find(
                (e) => e._id == albumNow._id
              )
              currentAlbum.originalImages.push(awsMainImage.split("?")[0]),
                currentAlbum.thumbnails.push(awsMainImage.split("?")[0]),
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
              toast.success("Image uploded  Successfully", {
                position: "bottom-right",
                closeOnClick: true,
                autoClose: 3000,
              })
            } else {
              alert("Image was not uploaded to the server successfully!")
            }
          },
          image.type,
          0.6
        )
      }
      reader.onerror = (error) => console.log(error)
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
      toast.success("Video uploded  Successfully", {
        position: "bottom-right",
        closeOnClick: true,
        autoClose: 3000,
      })
    } else {
      alert("Video was not uploaded!")
    }
  }

  // create video folder
  const createVideoFolderHandler = async () => {
    // creating folder

    const album = await fetch("/api/website/profile/create-album", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: videoInput.name,
        price: videoInput.price,
        type: "videoAlbum",
      }),
    })
    const resp = await album.json()

    authUpdateContext.updateNestedPaths((prev) => {
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
                resp.album,
              ],
            },
          },
        },
      }
    })

    const store = JSON.parse(localStorage.getItem("user"))
    store.relatedUser.privateVideos.push(resp.album)
    localStorage.setItem("user", JSON.stringify(store))
    toast.success("Album create Successfully", {
      position: "bottom-right",
      closeOnClick: true,
      autoClose: 3000,
    })
    setShowvideoInput(false)
    setVideoAlbumNow(resp.album)
  }

  // privatevideoHandle
  const privatevideoUpdateHandler = async (e) => {
    const image = e.target.files[0]
    // to get url from domain and then uplode to aws
    if (!image) {
      return alert("no Image Selected")
    }
    if (!albumNow._id) {
      return toast.error("Please select album first")
    }
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
      "/api/website/profile/handle-private-video-upload",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          originalVideoURL: profileUrl,
          thumbUrl: profileUrl,
          albumId: videoAlbumNow._id,
        }),
      }
    )
    const serverResp = await serverReq.json()
    if (serverResp.actionStatus === "success") {
      let lcUser = JSON.parse(localStorage.getItem("user"))
      const currentAlbum = lcUser.relatedUser.privateVideos.find(
        (e) => e._id == videoAlbumNow._id
      )

      // ===
      currentAlbum.originalVideos.push(profileUrl)
      currentAlbum.thumbnails.push(profileUrl)

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
      toast.success("Video Uploded  Successfully", {
        position: "bottom-right",
        closeOnClick: true,
        autoClose: 3000,
      })
    } else {
      alert("Video was not uploaded to the server successfully!")
    }
  }

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
          backgroundImage: `url(${
            authContext.user.user.relatedUser.coverImage
              ? [`${authContext.user.user.relatedUser.coverImage}`]
              : "/cover-photo.png"
          })`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          objectFit: "fill",
        }}
      >
        <p
          className=" tw-absolute tw-z-10 tw-bottom-4 tw-bg-dark-background tw-text-white-color tw-right-8 tw-py-2 tw-px-4 tw-rounded-full tw-cursor-pointer"
          onClick={() => modalCtx.showModalWithContent(<CoverUpdate />)}
        >
          <CreateIcon className="tw-mr-2" />
          Change Background
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
            <div className="tw-grid tw-grid-cols-6 tw-gap-4 tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-md tw-pb-6">
              <div className=" md:tw-col-span-1 tw-col-span-2 ">
                <p>Intrested in</p>
                <p>From</p>
                <p>Language</p>
                <p>Age</p>
                <p>Skin Type</p>
                <p>Body Type</p>
                <p>Hair</p>
                <p>Eye color</p>
                <p>About me</p>
                {}
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
                  }}
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                >
                  {authContext.user.user.relatedUser.country}
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
                  {authContext.user.user.relatedUser.languages}
                </p>
                <p>
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
                >
                  Fair
                </p>
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
                >
                  slim
                </p>
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
                >
                  Black
                </p>
                <p
                  onInput={(e) => {
                    setProfileEdit((prev) => ({
                      ...prev,
                      bio: e.target.textContent,
                    })),
                      setInfoedited(true)
                  }}
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                >
                  {authContext.user.user.relatedUser.bio}
                </p>
              </div>

              {infoedited && (
                <button
                  type="submit"
                  onClick={() => {
                    setInfoedited(false)
                    profileFunction()
                  }}
                  className="tw-rounded-full md:tw-px-4 tw-px-16 tw-border-2 tw-border-white-color tw-font-medium  "
                >
                  Save
                </button>
              )}
            </div>

            {/* change email */}
            <div className="tw-bg-first-color  tw-py-4 tw-rounded-md tw-mt-4 tw-px-4 md:tw-flex md:tw-items-center md:tw-justify-between">
              <p className="tw-flex tw-items-center tw-justify-between">
                My Email
                <span className="md:tw-ml-4 md:tw-text-lg md:tw-font-semibold  tw-text-sm tw-font-normal">
                  {authContext.user.user.relatedUser.email}
                </span>
              </p>
              <button
                className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium "
                onClick={() => modalCtx.showModalWithContent(<EmailChange />)}
              >
                Change Email
              </button>
            </div>

            {/* change password */}
            <div className="tw-bg-first-color  tw-py-4 tw-rounded-md tw-mt-4 tw-px-4 md:tw-flex md:tw-items-center md:tw-justify-between">
              <p className="tw-flex tw-items-center tw-justify-between">
                My Password
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
                    className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium tw-inline-block tw-my-4"
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
                    {authContext.user.user.relatedUser.wallet.currentAmount.toFixed(
                      2
                    )}
                  </h1>
                  <span className="tw-self-center tw-ml-2">Token</span>
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
                  Set Activities
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
                  className="tw-bg-dreamgirl-red hover:tw-bg-dreamgirl-red tw-border-none tw-rounded-full tw-capitalize"
                  onClick={() =>
                    setDynamicData((prev) => [
                      ...prev,
                      { action: null, price: null },
                    ])
                  }
                >
                  add new action
                </Button>
                <button
                  onClick={() => saveData()}
                  className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium tw-ml-4"
                >
                  Save
                </button>
              </div>
            </div>
            {/* Call History */}

            {/*Bank details  */}

            {/*Bank details  */}
          </div>
          {/* Scroll */}
        </div>
        <div className="md:tw-col-span-3 tw-col-span-1 tw-bg-dark-background  tw-text-white tw-py-8">
          <div className="tw-flex tw-justify-between tw-ml-4 ">
            <h1>My Photos</h1>
          </div>
          <div className="tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl">
            {/* Make Model Clickeble in model */}
            <div className="tw-grid md:tw-grid-cols-3 tw-col-span-1 tw-justify-start tw-py-4 tw-grid-cols-2 ">
              <div className="tw-w-36 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4 tw-mb-4">
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
                    <span className="tw-text-sm">Uplode Photo</span>
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

          {/*Private Image  */}

          <div className="tw-flex tw-justify-between tw--mb-4 tw-mt-4 tw-ml-4">
            <h1>My videos</h1>
          </div>
          <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
            <div className="tw-grid md:tw-grid-cols-3 tw-col-span-1 tw-justify-start tw-py-4 tw-grid-cols-2 ">
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
                    return (
                      <div>
                        <video src={url} controls></video>
                      </div>
                    )
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
                        <video
                          src={image}
                          className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4"
                        ></video>
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
            {/* Private video Input field */}
            <div className="tw-my-4">
              {showVideoInput && (
                <div className="tw-flex tw-justify-between">
                  <div>
                    <input
                      type="text"
                      name="fileName"
                      // value={input.name}
                      required={true}
                      className="tw-outline-none tw-text-black tw-rounded-full tw-px-2 tw-py-1"
                      placeholder="Name of folder"
                      onChange={(e) =>
                        setVideoInput((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="number"
                      name="price"
                      required={true}
                      // value={input.price}
                      placeholder="Coins for folder "
                      className="tw-outline-none tw-text-black tw-rounded-full tw-px-2 tw-py-1 tw-ml-2"
                      onInput={(e) =>
                        setVideoInput((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <button
                      className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium"
                      onClick={() => createVideoFolderHandler()}
                    >
                      Done
                    </button>
                    <button
                      className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium  tw-mx-4"
                      onClick={() => setShowvideoInput(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="tw-flex tw-justify-between">
              <DropdownButton
                id="dropdown-basic-button "
                title="Choose folder"
                variant="danger"
                className="tw-rounded-full"
              >
                {authContext.user.user.relatedUser.privateVideos.map(
                  (item, index) => (
                    <Dropdown.Item
                      key={index}
                      id={index}
                      onClick={() => setVideoAlbumNow(item)}
                      className="tw-flex tw-justify-between"
                    >
                      <div>{item.name}</div>
                      <div>
                        {item.price}
                        {/* <ClearIcon
                      className="tw-text-black tw-my-auto"
                      onClick={() => {
                        document.getElementById(index).remove()
                      }}
                    /> */}
                      </div>
                    </Dropdown.Item>
                  )
                )}
                <Dropdown.Item
                  onClick={() => setShowvideoInput((prev) => !prev)}
                >
                  create new
                </Dropdown.Item>
              </DropdownButton>

              <p className="tw-font-bold tw-text-lg md:tw-mr-8 tw-mr-4 tw-capitalize tw-align-middle tw-px-2 tw-my-auto">
                Folder Name: {videoAlbumNow?.name}
              </p>
            </div>
            {/* Privete video Input field */}

            <div className="tw-grid md:tw-grid-cols-3 tw-col-span-1 tw-justify-start tw-py-4 tw-grid-cols-2 ">
              <div className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4 tw-mb-4">
                {/* file */}
                <div className="file-input tw-mt-10 tw-ml-2">
                  <input
                    type="file"
                    name="file-input_video_private"
                    id="file-input_video_private"
                    className="file-input__input"
                    onInput={privatevideoUpdateHandler}
                  />
                  <label
                    className="file-input__label"
                    htmlFor="file-input_video_private"
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
              {videoAlbumNow && (
                <FsLightbox
                  toggler={videoboxControllerPrivate.toggler}
                  sources={authContext.user.user.relatedUser.privateVideos.map(
                    (url) => {
                      return (
                        <div>
                          <video src={url} controls></video>
                        </div>
                      )
                    }
                  )}
                  slide={videoboxControllerPrivate.slide}
                />
              )}
              {videoAlbumNow &&
                authContext.user.user.relatedUser.privateVideos
                  .find((e) => e._id == videoAlbumNow._id)
                  .originalVideos.map((image, index) => (
                    <div
                      className=" tw-mb-4 tw-cursor-pointer"
                      key={index}
                      onClick={() => openVideoboxOnSlidePrivate(index + 1)}
                    >
                      <video
                        src={image}
                        className="tw-w-32 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4"
                      ></video>
                    </div>
                  ))}
            </div>
          </div>
          {/* private videos */}

          {/* testing dummy videos */}
          <div className="tw-flex tw-justify-between tw--mb-4 tw-mt-4 tw-ml-4">
            <h1>Private photo</h1>
          </div>
          <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
            <div className="tw-my-4">
              {showInput && (
                <div className="tw-flex tw-justify-between">
                  <div>
                    <input
                      type="text"
                      name="fileName"
                      // value={input.name}
                      required={true}
                      className="tw-outline-none tw-text-black tw-rounded-full tw-px-2 tw-py-1"
                      placeholder="Name of folder"
                      onChange={(e) =>
                        setInput((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="number"
                      name="price"
                      required={true}
                      // value={input.price}
                      placeholder="Coins for folder "
                      className="tw-outline-none tw-text-black tw-rounded-full tw-px-2 tw-py-1 tw-ml-2"
                      onInput={(e) =>
                        setInput((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <button
                      className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium"
                      onClick={() => createFolderHandler()}
                    >
                      Done
                    </button>
                    <button
                      className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium  tw-mx-4"
                      onClick={() => setShowInput(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="tw-flex tw-justify-between">
              <DropdownButton
                id="dropdown-basic-button "
                title="Choose folder"
                variant="danger"
                className="tw-rounded-full"
              >
                {authContext.user.user.relatedUser.privateImages.map(
                  (item, index) => (
                    <Dropdown.Item
                      key={index}
                      id={index}
                      onClick={() => setAlbumNow(item)}
                      className="tw-flex tw-justify-between"
                    >
                      <div>{item.name}</div>
                      <div>
                        {item.price}
                        {/* <ClearIcon
                      className="tw-text-black tw-my-auto"
                      onClick={() => {
                        document.getElementById(index).remove()
                      }}
                    /> */}
                      </div>
                    </Dropdown.Item>
                  )
                )}
                <Dropdown.Item onClick={() => setShowInput((prev) => !prev)}>
                  create new
                </Dropdown.Item>
              </DropdownButton>

              <p className="tw-font-bold tw-text-lg md:tw-mr-8 tw-mr-4 tw-capitalize tw-align-middle tw-px-2 tw-my-auto">
                Folder Name: {albumNow?.name}
              </p>
            </div>
            <div className=" tw-grid md:tw-grid-cols-3 tw-col-span-1 tw-justify-start tw-py-4 tw-grid-cols-2">
              {/* This for File uplode  */}
              <div className="tw-w-36 tw-h-32 tw-border-dashed tw-border-gray-400 tw-border-4 tw-mb-4">
                {/* file */}
                <div className="file-input tw-mt-10 tw-ml-2">
                  <input
                    type="file"
                    name="file-input_private"
                    id="file-input_private"
                    className="file-input__input"
                    onChange={(e) => privatePhotoUpdateHandler(e)}
                  />
                  <label
                    className="file-input__label"
                    htmlFor="file-input_private"
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
                    <span className="tw-text-sm">Uplode Photo</span>
                  </label>
                </div>

                {/* file */}
                {albumNow && (
                  <FsLightbox
                    toggler={lightboxControllerPrivate.toggler}
                    sources={authContext.user.user.relatedUser.privateImages
                      .find((e) => e._id == albumNow._id)
                      .originalImages?.map((url, index) => {
                        return <img src={url} />
                      })}
                    slide={lightboxControllerPrivate.slide}
                  />
                )}
              </div>
              {/* That item show */}
              {/* You don't have to put the code question marks in this becacuse when you apply && this automatically cheack the conditinal rendering that you don't have to worry about  */}

              {albumNow &&
                authContext.user.user.relatedUser.privateImages
                  .find((e) => e._id == albumNow._id)
                  .originalImages?.map((image, index) => (
                    <div
                      className=" tw-mb-4 tw-cursor-pointer  "
                      key={index}
                      onClick={() => openLightboxOnSlidePrivate(index + 1)}
                    >
                      {/* <img src={image} className="tw-w-32 tw-h-32" /> */}
                      <NextImage
                        src={image}
                        width={128}
                        height={128}
                        quality="100"
                      />
                    </div>
                  ))}
              {/* That item show */}
            </div>
          </div>
          {/* Testing dummy videos */}

          {/* ---------------------------------------------------- */}
          {/* Bro in this call table and history has been removed,so you have to check all the thing carefully before procedure */}
        </div>
      </div>
    </div>
  ) : null
}

export default Profile
