import React, { useReducer, useState, useEffect } from "react"
import { PlayCircleFilled } from "@material-ui/icons"
import { toast } from "react-toastify"
import FsLightbox from "fslightbox-react"
import { useAuthUpdateContext } from "../../app/AuthContext"
import { useRouter } from "next/router"

function ChipArea(props) {
  return (
    <p className="tw-text-xs tw-rounded-lg tw-py-1 tw-text-text-black tw-bg-second-color tw-flex-shrink-0 tw-flex-grow-0 tw-inline-block tw-m-1">
      {props.children}
    </p>
  )
}

function ProfileRow(props) {
  /**
   * ment for use in here only
   */
  return (
    <div className="tw-grid tw-w-full tw-grid-cols-4 tw-mb-3">
      <h4 className="tw-grid-cols-1">
        <span className="tw-font-semibold tw-pr-1 tw-capitalize">
          {props.title}
        </span>
      </h4>
      <div className="tw-col-span-3 tw-capitalize tw-text-sm tw-font-light">
        {props.data}
      </div>
    </div>
  )
}

const windowOptions = {
  PROFILE: "profile",
  PUBLIC_IMAGES: "public-images",
  PUBLIC_VIDEOS: "public-videos",
  PRIVATE_IMAGES: "private-images",
  PRIVATE_VIDEOS: "private-videos",
}

function ModelProfile(props) {
  /**
   * ment for use in here only
   */
  const { name, age, profileImage } = props.profileData
  const updateCtx = useAuthUpdateContext()
  const router = useRouter()

  const [theKey, setTheKey] = useState(0)
  useEffect(() => {
    const handleRouteChange = () => {
      console.log("handling url change")
      setTheKey((prev) => prev + 1)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [])

  const tags = props.profileData.tags.map((tag, index) => (
    <ChipArea key={`tag-chip${index}`}>
      <a href="#" className="hover:tw-text-white-color tw-px-2">
        {tag}
      </a>
    </ChipArea>
  ))

  const categories = props.profileData.categories.map((category, index) => (
    <ChipArea key={`category-chip${index}`}>
      <a href="#" className="hover:tw-text-white-color tw-px-4">
        {category}
      </a>
    </ChipArea>
  ))

  const Profile = () => {
    return (
      <>
        <div
          id="model-profile-area"
          className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-text-text-black tw-pl-0 md:tw-pl-1 tw-gap-x-4 tw-gap-y-4"
        >
          <div className="tw-col-span-1">
            <div
              className="tw-w-44 tw-h-44 tw-rounded-full tw-border-second-color tw-border-4"
              style={{
                backgroundImage: `url(${profileImage})`,
                backgroundSize: "cover",
              }}
            ></div>
            <div className="tw-mt-5">
              {props.dynamicFields?.map((field, index) => {
                let value
                if (Array.isArray(field.value)) {
                  value = field.value.join(" , ")
                } else {
                  value = field.value
                }
                return (
                  <ProfileRow
                    title={`${field.title}:`}
                    data={<p>{value}</p>}
                    key={`${index}-profrow`}
                  />
                )
              })}
            </div>
          </div>
          <div className="tw-col-span-1 tw-self-end">
            <ProfileRow title="Name: " data={<p>{name}</p>} />
            <ProfileRow title="Age: " data={<p>{age}</p>} />
            <ProfileRow title="Tags: " data={tags} />
            <ProfileRow title="Categories: " data={categories} />
            <ProfileRow title="My Hobbies: " data={tags} />
            <ProfileRow
              title="Bio: "
              // there need to add model profile data and Images
              data={
                <p className="tw-col-span-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Delectus esse reiciendis aperiam inventore eveniet voluptatum
                  sit, molestias quidem cumque sint?
                </p>
              }
            />
          </div>
        </div>
      </>
    )
  }
  // Public Images is also woking
  const Images = () => {
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
    return (
      <>
        {/* public Images on live stream */}
        <FsLightbox
          toggler={lightboxController.toggler}
          sources={props.profileData.publicImages.map((url) => {
            return <img src={url} />
          })}
          slide={lightboxController.slide}
        />
        <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 md:tw-gap-4 tw-py-3 tw-justify-start tw-max-h-[48rem] tw-overflow-y-auto">
          {props.profileData.publicImages.length > 0 ? (
            props.profileData.publicImages.map((ima, index) => (
              <div
                className="tw-col-span-1 tw-row-span-1 tw-cursor-pointer tw-w-48 tw-h-48 "
                onClick={() => openLightboxOnSlide(index + 1)}
              >
                <img src={ima} className="tw-w-full tw-h-full" />
              </div>
            ))
          ) : (
            <div className="tw-inline">
              <h1 className="tw-text-white ">
                There is no Image Uploded by Model yet !!!
              </h1>
            </div>
          )}
        </div>
      </>
    )
  }

  // Public  videos is woking
  const Videos = () => {
    // public videos
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

    // opner of dabaa

    return (
      <div>
        <FsLightbox
          toggler={lightboxController.toggler}
          sources={props.profileData.publicVideos.map((url) => {
            return (
              <div>
                <video src={url} autoPlay controls></video>
              </div>
            )
          })}
          slide={lightboxController.slide}
        />
        <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 tw-py-3 tw-max-h-[48rem] tw-overflow-y-auto">
          {props.profileData.publicVideos.length > 0 ? (
            props.profileData.publicVideos.map((ima, index) => (
              <div
                className="tw-col-span-1 tw-row-span-1 tw-relative tw-w-48 tw-h-48"
                onClick={() => openLightboxOnSlide(index + 1)}
              >
                <video src={ima} className="tw-w-32 tw-h-32 "></video>
                <div className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-flex tw-justify-center tw-items-center tw-bg-black tw-opacity-50 hover:tw-opacity-0">
                  <PlayCircleFilled
                    className="tw-text-white-color"
                    fontSize="medium"
                  />
                </div>
                <div className="tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-flex tw-justify-center tw-items-center tw-opacity-0 hover:tw-opacity-100">
                  <a href="#" className="">
                    <PlayCircleFilled
                      className="tw-text-white-color"
                      fontSize="large"
                    />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div>
              <h1>The videos are not uploded by the Model</h1>
            </div>
          )}
        </div>
      </div>
    )
  }
  const modelId = window.location.pathname.split("/").reverse()[0]

  /* PRIVATE IMAGE COMPONENT */
  const PrivateImages = () => {
    const [currAlbum, setCurrAlbum] = useState(
      props.profileData.privateImages?.[0]?._id
    )
    const [lightboxController, setLightboxController] = useState({
      toggler: false,
      slide: 1,
    })

    function openLightboxOnSlide(number, albumId) {
      setCurrAlbum(albumId)
      setLightboxController({
        toggler: !lightboxController.toggler,
        slide: number,
      })
    }

    /* buy private images */
    const imageBuyHandler = async (albumId) => {
      try {
        const imageBuyRequest = await fetch(
          "/api/website/stream/private-content/buy-private-image-album",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              modelId: modelId,
              albumId: albumId,
            }),
          }
        )
        const imageBuyResult = await imageBuyRequest.json()
        if (imageBuyResult.actionStatus === "success") {
          /* ALBUM was brought successfully */
          const lcUser = JSON.parse(localStorage.getItem("user"))
          const modelAlbums = lcUser.relatedUser.privateImagesPlans.find(
            (entry) => entry.model === modelId
          )

          lcUser.relatedUser.wallet.currentAmount -
            parseInt(imageBuyResult.albumCost)

          if (modelAlbums) {
            modelAlbums.albums.push(albumId)
          } else {
            lcUser.relatedUser.privateImagesPlans.push({
              model: modelId,
              albums: [albumId],
            })
          }

          updateCtx.setAuthState((prev) => {
            return {
              ...prev,
              user: {
                ...prev.user,
                user: { ...lcUser },
              },
            }
          })
          localStorage.setItem("user", JSON.stringify(lcUser))
          toast.success("Album Bought Successfully", {
            position: "bottom-right",
            closeOnClick: true,
            pauseOnHover: false,
            autoClose: 3000,
            theme: "colored",
          })
          setTimeout(() => {
            window.location.reload()
          }, [3000])
        } else {
          /* ALBUM was not brought successfully */
          toast.error(imageBuyResult.message, {
            position: "bottom-right",
          })
        }
      } catch (err) {
        toast.error(err.message, {
          position: "bottom-right",
        })
      }
    }

    return (
      <>
        <FsLightbox
          toggler={lightboxController.toggler}
          sources={props.profileData.privateImages
            ?.find((album) => album._id === currAlbum)
            ?.originalImages?.map((url) => (
              <img src={url} />
            ))}
          slide={lightboxController.slide}
        />
        {/* RENDER MODELS PRIVATE ALBUMS */}
        {props.profileData.privateImages.length > 0 ? (
          props.profileData.privateImages.map((album, index) => {
            if (!album.originalImages && !album.thumbnails) {
              return
            }
            return (
              <>
                <div className="tw-text-white tw-pt-2" key={index}>
                  <div className="tw-flex tw-justify-start tw-items-center">
                    <h3 className="tw-capitalize tw-text-lg tw-ml-6">
                      Album: {album.name}
                    </h3>
                    <h3 className="tw-capitalize tw-text-sm tw-ml-2">
                      Coins: {album.price}
                    </h3>
                    <div className=" tw-ml-auto">
                      {album.thumbnails && (
                        <button
                          className="tw-rounded-full tw-px-8 tw-border-2 tw-border-white-color tw-font-medium"
                          onClick={() => imageBuyHandler(album._id)}
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>

                  {/* RENDER ALL IMAGES OF AN ALBUM */}

                  <>
                    <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-7 tw-gap-4 tw-py-3 tw-justify-start tw-max-h-52 tw-overflow-y-auto">
                      {album.originalImages?.map((image, index) => {
                        return (
                          <div
                            className="tw-col-span-1 tw-h-full tw-cursor-pointer tw-max-h-40  hover:tw-scale-[1.1] tw-transition-transform"
                            onClick={() =>
                              openLightboxOnSlide(index + 1, album._id)
                            }
                          >
                            <img
                              src={image}
                              className="tw-w-full tw-h-full tw-object-cover tw-rounded"
                            />
                          </div>
                        )
                      })}
                    </div>
                    <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 md:tw-gap-4 tw-py-3 tw-justify-start tw-max-h-52 tw-overflow-y-auto">
                      {album.thumbnails?.map((el) => {
                        return (
                          <div
                            className="tw-col-span-1 tw-row-span-1 tw-cursor-pointer tw-max-h-40  hover:tw-scale-[1.1] tw-transition-transform"
                            onClick={() => {
                              toast.error(
                                "You have to buy this image to view it in original quality!",
                                {
                                  position: "bottom-right",
                                  hideProgressBar: true,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                }
                              )
                            }}
                          >
                            <img
                              src={el}
                              className="tw-w-full tw-h-full tw-rounded tw-object-cover"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </>
                </div>
              </>
            )
          })
        ) : (
          <div>There Is no Private Image of Model</div>
        )}
      </>
    )
  }

  // private Videos
  const PrivateVideos = () => {
    const [currAlbum, setCurrAlbum] = useState(
      props.profileData.privateVideos?.[0]?._id
    )
    const [lightboxController, setLightboxController] = useState({
      toggler: false,
      slide: 1,
    })

    function openLightboxOnSlide(number, albumId) {
      setCurrAlbum(albumId)
      setLightboxController({
        toggler: !lightboxController.toggler,
        slide: number,
      })
    }

    const videoBuyHandler = async (albumId) => {
      try {
        const imageBuyRequest = await fetch(
          "/api/website/stream/private-content/buy-private-video-album",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              modelId: modelId,
              albumId: albumId,
            }),
          }
        )
        const imageBuyResult = await imageBuyRequest.json()
        if (imageBuyResult.actionStatus === "success") {
          /* ALBUM was brought successfully */
          const lcUser = JSON.parse(localStorage.getItem("user"))
          const modelAlbums = lcUser.relatedUser.privateVideosPlans.find(
            (entry) => entry.model === modelId
          )
          lcUser.relatedUser.wallet.currentAmount -
            parseInt(imageBuyResult.albumCost)

          if (modelAlbums) {
            modelAlbums.albums.push(albumId)
          } else {
            lcUser.relatedUser.privateVideosPlans.push({
              model: modelId,
              albums: [albumId],
            })
          }
          updateCtx.setAuthState((prev) => {
            return {
              ...prev,
              user: {
                ...prev.user,
                user: { ...lcUser },
              },
            }
          })
          localStorage.setItem("user", JSON.stringify(lcUser))
          toast.success("Album Bought Successfully", {
            position: "bottom-right",
            closeOnClick: true,
            pauseOnHover: false,
            autoClose: 3000,
            theme: "colored",
          })
          setTimeout(() => {
            window.location.reload()
          }, [3000])
        } else {
          /* ALBUM was not brought successfully */
          toast.error(imageBuyResult.message, {
            position: "bottom-right",
          })
        }
      } catch (err) {
        toast.error(err.message, {
          position: "bottom-right",
        })
      }
    }

    return (
      <>
        {/* public Images on live stream */}
        <FsLightbox
          toggler={lightboxController.toggler}
          sources={props.profileData.privateVideos
            ?.find((album) => album._id === currAlbum)
            ?.originalVideos?.map((url) => (
              <video src={url} controls></video>
            ))}
          slide={lightboxController.slide}
        />

        {props.profileData.privateVideos?.length > 0 ? (
          props.profileData.privateVideos.map((album, index) => (
            <div className="tw-text-white tw-pt-2 " key={index}>
              <div className="tw-flex tw-justify-start tw-items-center">
                <h3 className="tw-capitalize tw-text-lg tw-ml-6">
                  Album: {album.name}
                </h3>
                <h3 className="tw-capitalize tw-text-sm tw-ml-2">
                  Coins: {album.price}
                </h3>
                <div className=" tw-ml-auto">
                  {album.thumbnails && (
                    <button
                      className="tw-rounded-full tw-px-8 tw-border-2 tw-border-white-color tw-font-medium"
                      onClick={() => videoBuyHandler(album._id)}
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
              <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 md:tw-gap-4 tw-py-3 tw-justify-start tw-max-h-52 tw-overflow-y-auto">
                {album.originalVideos?.map((el, index) => {
                  return (
                    <div
                      className="tw-col-span-1 tw-row-span-1 tw-cursor-pointer tw-w-48 tw-h-48 "
                      onClick={() => openLightboxOnSlide(index + 1, album._id)}
                    >
                      <video src={el} className="tw-w-full tw-h-full"></video>
                    </div>
                  )
                })}
              </div>
              <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 md:tw-gap-4 tw-py-3 tw-justify-start tw-max-h-[48rem] tw-overflow-y-auto">
                {album.thumbnails?.map((el) => {
                  return (
                    <div
                      className="tw-col-span-1 tw-row-span-1 tw-cursor-pointer  tw-max-h-40  hover:tw-scale-[1.1] tw-transition-transform "
                      onClick={() => {
                        toast.error(
                          "Sona babu !! You have to buy this video to see it!",
                          {
                            position: "bottom-right",
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                          }
                        )
                      }}
                    >
                      <video src={el} className="tw-w-full tw-h-full"></video>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        ) : (
          <div>
            <h1>There is no Private videos of Model</h1>
          </div>
        )}
      </>
    )
  }

  const intiState = { val: "Profile" }

  const [state, setState] = useState("Profile")

  return (
    <div className=" tw-bg-first-color tw-pt-16 tw-pb-8  md:tw-px-4">
      <div className="">
        {/* checking for tabs */}
        <div className="tw-inline-flex tw-bg-black tw-text-white   tw-rounded-t-2xl tw-w-full">
          <button
            className={`md:tw-px-4 tw-px-1 focus:tw-bg-second-color   tw-rounded-t-xl tw-py-1 `}
            onClick={() => {
              setState("Profile")
            }}
            style={{ cursor: "pointer" }}
          >
            <div>Profile</div>
          </button>
          <button
            className={`md:tw-px-4 tw-px-1 focus:tw-bg-second-color tw-rounded-t-xl`}
            onClick={() => setState("Image")}
            style={{ cursor: "pointer" }}
          >
            Images
          </button>
          <button
            className={`md:tw-px-4 tw-px-1 focus:tw-bg-second-color tw-rounded-t-xl `}
            onClick={() => setState("PrivateImage")}
            style={{ cursor: "pointer" }}
          >
            Private Images
          </button>
          <button
            className={`md:tw-px-4 tw-px-1 focus:tw-bg-second-color tw-rounded-t-xl `}
            onClick={() => setState("Videos")}
            style={{ cursor: "pointer" }}
          >
            Videos
          </button>

          <button
            className={`tw-px-4 focus:tw-bg-second-color tw-rounded-t-xl `}
            onClick={() => setState("PrivateVideos")}
            style={{ cursor: "pointer" }}
          >
            Private Videos
          </button>
        </div>
        <div className="tw-border-t-[3px] tw-border-second-color tw-pl-4">
          <section style={{ display: state === "Profile" ? "block" : "none" }}>
            {<Profile key={theKey + 200} />}
          </section>
          <section style={{ display: state === "Image" ? "block" : "none" }}>
            {<Images key={theKey + 400} />}
          </section>
          <section
            style={{ display: state === "PrivateImage" ? "block" : "none" }}
          >
            {<PrivateImages key={theKey + 600} />}
          </section>
          <section style={{ display: state === "Videos" ? "block" : "none" }}>
            {<Videos key={theKey + 800} />}
          </section>
          <section
            style={{ display: state === "PrivateVideos" ? "block" : "none" }}
          ></section>
          {<PrivateVideos key={theKey + 1000} />}
        </div>
      </div>
    </div>
  )
}

export default ModelProfile
