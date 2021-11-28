import React, { useReducer, useState } from "react"
import Neeraj from "../../../public/brandikaran.jpg"
import Image from "next/image"
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
    const authContext = useAuthContext()
    return (
      <>
        {/* <h2 className="tw-font-semibold tw-text-2xl tw-text-text-black tw-border-second-color tw-border-b-[1px] tw-pb-3 tw-pl-0 md:tw-pl-1 tw-mb-6"></h2> */}
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
        <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 tw-py-3">
          {props.profileData.publicImages.map((ima, index) => (
            <div
              className="tw-col-span-1 tw-row-span-1 tw-cursor-pointer"
              onClick={() => openLightboxOnSlide(index + 1)}
            >
              <img src={ima} height={280} width={280} className="tw-rounded" />
            </div>
          ))}

          <div className="tw-mt-4 tw-col-span-2 md:tw-col-span-3 lg:tw-col-span-5 xl:tw-col-span-6 tw-flex tw-justify-center tw-items-center">
            <div className="tw-h-1 tw-bg-second-color tw-mr-2 tw-flex-grow tw-rounded-sm"></div>
            <button className="tw-uppercase tw-px-3 tw-py-2 tw-rounded tw-bg-second-color tw-text-white-color tw-font-semibold hover:tw-bg-dark-black">
              explore more photos
            </button>
            <div className="tw-h-1 tw-bg-second-color tw-ml-2 tw-flex-grow tw-rounded-sm"></div>
          </div>
        </div>
      </>
    )
  }

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
    return (
      <div>
        {/* <h2 className="tw-font-semibold tw-text-2xl tw-text-text-black tw-border-second-color tw-border-b-[1px] tw-pb-3 tw-pl-0 md:tw-pl-1 tw-mb-6"></h2> */}
        <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-gap-3 tw-py-3">
          <div className="tw-col-span-1 tw-row-span-1 tw-relative">
            <Image
              src={Neeraj}
              height={280}
              width={280}
              className="tw-rounded"
            />
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
          <div className="tw-col-span-1 tw-row-span-1 tw-relative">
            <Image
              src={Neeraj}
              height={280}
              width={280}
              className="tw-rounded"
            />
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
          <div className="tw-col-span-1 tw-row-span-1 tw-relative">
            <Image
              src={Neeraj}
              height={280}
              width={280}
              className="tw-rounded"
            />
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
          <div className="tw-col-span-1 tw-row-span-1 tw-relative">
            <Image
              src={Neeraj}
              height={280}
              width={280}
              className="tw-rounded"
            />
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
          <div className="tw-col-span-1 tw-row-span-1 tw-relative">
            <Image
              src={Neeraj}
              height={280}
              width={280}
              className="tw-rounded"
            />
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
          <div className="tw-col-span-1 tw-row-span-1 tw-relative">
            <Image
              src={Neeraj}
              height={280}
              width={280}
              className="tw-rounded"
            />
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
          <div className="tw-mt-4 tw-col-span-2 md:tw-col-span-3 lg:tw-col-span-5 xl:tw-col-span-6 tw-flex tw-justify-center tw-items-center">
            <div className="tw-h-1 tw-bg-second-color tw-mr-2 tw-flex-grow tw-rounded-sm"></div>
            <button className="tw-uppercase tw-px-3 tw-py-2 tw-rounded tw-bg-second-color tw-text-white-color tw-font-semibold hover:tw-bg-dark-black">
              explore more videos
            </button>
            <div className="tw-h-1 tw-bg-second-color tw-ml-2 tw-flex-grow tw-rounded-sm"></div>
          </div>
        </div>
      </div>
    )
  }

  const intiState = { val: <Profile /> }

  const reducer = (state = intiState, action) => {
    switch (action.type) {
      case "Profile":
        return { val: <Profile /> }
      case "Image":
        return { val: <Images /> }
      case "Videos":
        return { val: <Videos /> }
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
          <button
            className="tw-px-4 focus:tw-bg-second-color tw-rounded-t-xl"
            onClick={() => dispatch({ type: "Videos" })}
            style={{ cursor: "pointer" }}
          >
            Videos
          </button>
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
