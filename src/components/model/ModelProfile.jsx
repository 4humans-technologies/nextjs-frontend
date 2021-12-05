import React, { useReducer, useState } from "react"
import { PlayCircleFilled } from "@material-ui/icons"
import useModalContext from "../../app/ModalContext"
// import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import FsLightbox from "fslightbox-react"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
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

function ModelProfile(props) {
  /**
   * ment for use in here only
   */
  const { name, age, profileImage } = props.profileData
  const modalContext = useModalContext()

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
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-text-text-black tw-pl-0 md:tw-pl-1 tw-gap-x-4 tw-gap-y-4">
          <div className="tw-col-span-1">
            <div
              className="tw-w-44 tw-h-44 tw-rounded-full tw-border-second-color tw-border-4"
              style={{
                backgroundImage: `url(${profileImage})`,
                backgroundSize: "cover",
              }}
            ></div>
            <div className="tw-mt-5">
              {props.dynamicFields.map((field, index) => {
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
          {props.profileData.publicImages.map((ima, index) => (
            <div
              className="tw-col-span-1 tw-row-span-1 tw-cursor-pointer tw-w-48 tw-h-48 "
              onClick={() => openLightboxOnSlide(index + 1)}
            >
              <img src={ima} className="tw-w-full tw-h-full" />
            </div>
          ))}
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
          {props.profileData.publicVideos.map((ima, index) => (
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
          ))}
        </div>
      </div>
    )
  }
  const modelid = window.location.pathname.split("/").reverse()[0]
  // Private Image
  const PrivateImages = () => {
    const authContext = useAuthContext()
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
    // fech request for buy
    const imageBuyHandler = async (albumId) => {
      const re = await fetch(
        "/api/website/stream/private-content/buy-private-image-album",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            modelId: modelid,
            albumId: albumId,
          }),
        }
      )
      const res = await re.json()
      let store = JSON.parse(localStorage.getItem("user"))
    }
    const imageIndex = 0
    const Counter = () => (imageIndex = +1)
    return authContext.user.user ? (
      <>
        {/* public Images on live stream */}
        {/* Image FsLightbox is not working it has to see */}
        <FsLightbox
          toggler={lightboxController.toggler}
          sources={props.profileData.privateImages.map((item) => {
            {
              item.thumbnails.map((el) => {
                return <img src={el} />
              })
            }
          })}
          slide={lightboxController.slide}
        />

        {props.profileData.privateImages.map((item, index) => (
          <div className="tw-text-white " key={index}>
            <div className="tw-flex tw-justify-between">
              <div className="tw-flex">
                <span className="tw-text-xl">Album:</span>
                <h1 className="tw-capitalize tw-text-xl tw-my-auto tw-ml-2">
                  {item.name}
                </h1>
              </div>
              <div className="tw-flex">
                <span className="tw-text-xl">Coins:</span>
                <h1 className="tw-capitalize tw-text-xl tw-my-auto tw-ml-2">
                  {item.price}
                </h1>
              </div>
              {!item.originalImages && (
                <button
                  className="tw-rounded-full tw-px-8 tw-border-2 tw-border-white-color tw-font-medium"
                  onClick={() => imageBuyHandler(item._id)}
                >
                  Buy Now
                </button>
              )}
            </div>
            {item.originalImages ? (
              <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 md:tw-gap-4 tw-py-3 tw-justify-start tw-max-h-[48rem] tw-overflow-y-auto">
                {item.originalImages.map((el) => {
                  return (
                    <div
                      className="tw-col-span-1 tw-row-span-1 tw-cursor-pointer tw-w-48 tw-h-48 "
                      onClick={() => openLightboxOnSlide(imageIndex)}
                    >
                      <img src={el} className="tw-w-full tw-h-full" />
                      Counter()
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 md:tw-gap-4 tw-py-3 tw-justify-start tw-max-h-[48rem] tw-overflow-y-auto">
                {item.thumbnails.map((el) => {
                  return (
                    <div
                      className="tw-col-span-1 tw-row-span-1 tw-cursor-pointer tw-w-24 tw-h-24 "
                      onClick={() =>
                        alert("I am not Kejriwal,so click on buy now")
                      }
                    >
                      <img src={el} className="tw-w-full tw-h-full" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </>
    ) : (
      <div className="tw-text-white tw-text-xl tw-h-48">
        <h1>
          BETAA !!! TUMAHRA DIMAG FIRGYA HAI ? BAKLOL,JAA KE LOGIN KARO PAHLE
        </h1>
      </div>
    )
  }

  // private Videos
  const PrivateVideos = () => {
    const authContext = useAuthContext()
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
    // videoBuyer at the thing
    const videoBuyHandler = async (albumId) => {
      const re = await fetch(
        "/api/website/stream/private-content/buy-private-image-album",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            modelId: window.location.pathname.split("/").reverse()[0],
            albumId: albumId,
          }),
        }
      )
      const res = await re.json()
    }

    let videoIndex = 1
    const Counter = () => (videoIndex = +1)

    return authContext.user.user ? (
      <>
        {/* public Images on live stream */}
        <FsLightbox
          toggler={lightboxController.toggler}
          sources={props.profileData.privateVideos.map((item) => {
            {
              item.thumbnails.map((el) => (
                <div>
                  <video src={el} autoPlay controls></video>
                </div>
              ))
            }
          })}
          slide={lightboxController.slide}
        />

        {props.profileData.privateVideos.map((item, index) => (
          <div className="tw-text-white " key={index}>
            <div className="tw-flex tw-justify-between">
              <div className="tw-flex">
                <span className="tw-text-xl">Album:</span>
                <h1 className="tw-capitalize tw-text-xl tw-my-auto tw-ml-2">
                  {item.name}
                </h1>
              </div>
              <div className="tw-flex">
                <span className="tw-text-xl">Coins:</span>
                <h1 className="tw-capitalize tw-text-xl tw-my-auto tw-ml-2">
                  {item.price}
                </h1>
              </div>
              {!item.originalImages && (
                <button
                  className="tw-rounded-full tw-px-8 tw-border-2 tw-border-white-color tw-font-medium"
                  onClick={() => videoBuyHandler(item._id)}
                >
                  Buy Now
                </button>
              )}
            </div>
            {item.originavideos ? (
              <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 md:tw-gap-4 tw-py-3 tw-justify-start tw-max-h-[48rem] tw-overflow-y-auto">
                {item.originavideos.map((el) => {
                  return (
                    <div
                      className="tw-col-span-1 tw-row-span-1 tw-cursor-pointer tw-w-48 tw-h-48 "
                      onClick={() => openLightboxOnSlide(imageIndex)}
                    >
                      <video src={el} className="tw-w-full tw-h-full"></video>
                      Counter()
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 md:tw-gap-4 tw-py-3 tw-justify-start tw-max-h-[48rem] tw-overflow-y-auto">
                {item.thumbnails.map((el) => {
                  return (
                    <div
                      className="tw-col-span-1 tw-row-span-1 tw-cursor-pointer tw-w-48 tw-h-48 "
                      // onClick={() => openLightboxOnSlide(imageIndex)}
                    >
                      <video src={el} className="tw-w-full tw-h-full"></video>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </>
    ) : (
      <div className="tw-text-white tw-text-xl tw-h-48">
        <h1>
          BETAA !!! TUMAHRA DIMAG FIRGYA HAI ? BAKLOL Insaan,JAA KE LOGIN KARO
          PAHLE
        </h1>
      </div>
    )
  }

  const intiState = { val: <Profile /> }

  const reducer = (state = intiState, action) => {
    switch (action.type) {
      case "Profile":
        return { val: <Profile /> }
      case "Image":
        return {
          val: <Images />,
        }
      case "PrivateImage":
        return {
          val: <PrivateImages />,
        }
      case "Videos":
        return { val: <Videos /> }
      case "PrivateVideos":
        return {
          val: <PrivateVideos />,
        }
      default:
        return state
    }
  }
  const [state, dispatch] = useReducer(reducer, intiState)
  return (
    <div className=" tw-bg-first-color tw-pt-16 tw-pb-8 tw-px-3 md:tw-px-4">
      <div className="">
        {/* checking for tabs */}
        <div className="tw-inline-flex tw-bg-black tw-text-white   tw-rounded-t-2xl">
          <button
            className="tw-px-4 focus:tw-bg-second-color   tw-rounded-t-xl tw-py-1"
            onClick={() => {
              dispatch({ type: "Profile" })
            }}
            style={{ cursor: "pointer" }}
          >
            <div>Profile</div>
            {/* <Profile /> */}
          </button>
          <button
            className="tw-px-4 focus:tw-bg-second-color tw-rounded-t-xl"
            onClick={() => dispatch({ type: "Image" })}
            style={{ cursor: "pointer" }}
          >
            Images
          </button>
          {/* Private Images */}
          <button
            className="tw-px-4 focus:tw-bg-second-color tw-rounded-t-xl"
            onClick={() => dispatch({ type: "PrivateImage" })}
            style={{ cursor: "pointer" }}
          >
            Private Images
          </button>
          {/* Private Images */}
          <button
            className="tw-px-4 focus:tw-bg-second-color tw-rounded-t-xl"
            onClick={() => dispatch({ type: "Videos" })}
            style={{ cursor: "pointer" }}
          >
            Videos
          </button>
          {/* private videos */}

          <button
            className="tw-px-4 focus:tw-bg-second-color tw-rounded-t-xl"
            onClick={() => dispatch({ type: "PrivateVideos" })}
            style={{ cursor: "pointer" }}
          >
            Private Videos
          </button>
          {/* Private videos */}
        </div>
        {/* checking for tabs */}
        <div className="tw-border-t-[3px] tw-border-second-color">
          {state.val}
        </div>
      </div>
      {/* <button onClick={ctx.toggleModal} className="tw-px-3 tw-py-2 tw-text-white-color">Close</button> */}
    </div>
  )
}

export default ModelProfile
