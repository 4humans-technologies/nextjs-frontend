import React, { useState } from "react"

import { useRouter } from "next/router"
import { useAuthUpdateContext, useAuthContext } from "../../app/AuthContext"
import useModalContext from "../../app/ModalContext"
import loginBg from "../../../public/dreamgirl-bg-3.jpg"
import { Money, Person, VerifiedUser } from "@material-ui/icons"
import { Button } from "react-bootstrap"
import Logo from "../../../public/logo.png"
import Image from "next/image"
import Link from "next/link"
import io from "../../socket/socket"
import ErrorIcon from "@material-ui/icons/Error"
import Header from "./Header"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import LockOpenIcon from "@material-ui/icons/LockOpen"

function SignUp() {
  const modalCtx = useModalContext()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [username, setUsername] = useState()
  const [gender, setGender] = useState("Female")
  const [name, setName] = useState("")
  const [profile, setProfile] = useState("")

  const [formError, setFormError] = useState(null)

  const updateCtx = useAuthUpdateContext()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // DATA uplode to aws
    const res = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + profile.type
    )
    const data_2 = await res.json()
    const profile_url = await data_2.uploadUrl

    const resp = await fetch(profile_url, {
      method: "PUT",
      body: profile,
    })
    const imageUrl = profile_url.split("?")[0]

    console.log(email, password, username)
    fetch("/api/website/register/viewer", {
      method: "POST",
      cors: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
        gender,
        name,
        profileImage: imageUrl,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        localStorage.setItem("jwtToken", data.token)
        localStorage.setItem(
          "jwtExpiresIn",
          Date.now() + data.expiresIn * 60 * 60 * 1000
        )
        localStorage.setItem("rootUserId", data.user._id)
        localStorage.setItem("relatedUserId", data.user.relatedUser._id)
        localStorage.setItem("userType", data.user.userType)
        localStorage.setItem("user", JSON.stringify(data.user))
        /* update client info */
        updateCtx.updateViewer({
          rootUserId: data.user._id,
          relatedUserId: data.user.relatedUser._id,
          isLoggedIn: true,
          token: data.token,
          user: {
            userType: data.user.userType,
            user: data.user,
          },
          jwtExpiresIn: +data.expiresIn * 60 * 60 * 1000,
        })

        router.replace("/")
      })
      .catch((err) => {
        if (err.message && err?.data[0]) {
          /* validator.js error */
          setFormError(`${err.data[0].msg} of field ${param} : ${value}`)
          document.getElementById("action-btn").scrollIntoView()
        }
        if (err.message && !err?.data[0]) {
          setFormError(err.message)
        }
      })
  }

  return (
    <>
      <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-min-h-screen tw-bg-first-color tw-w-full sm:tw-w-auto tw-py-16">
        <div className="tw-flex-shrink-0 tw-flex-grow-0  ">
          <div className="tw-grid sm:tw-grid-cols-2 tw-grid-cols-1  tw-grid-rows-1 sm:tw-w-full   tw-h-full tw-w-[100vw]  ">
            <div className="tw-relative tw-z-0 tw-col-span-1 tw-row-span-1 tw-text-center red-gray-gradient tw-pl-14 tw-pr-14 tw-pt-10 tw-pb-10 tw-rounded-md  ">
              <h1 className="tw-text-3xl tw-font-medium tw-text-white-color tw-mb-4 tw-text-center tw-ml-3 tw-z-20">
                Registration user
              </h1>
              <form onSubmit={handleSubmit} className="tw-mb-4 viewer-form">
                <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between tw-mx-auto">
                  <input
                    type="text"
                    name="Username"
                    id="Username"
                    placeholder="UserName"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="tw-w-full tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg"
                  />
                </div>
                <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between tw-mx-auto">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="tw-w-full tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg"
                  />
                </div>

                <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between tw-mx-auto">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="tw-w-full tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg"
                  />
                </div>

                <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between tw-mx-auto">
                  <input
                    type="Password"
                    name="Password"
                    id="Password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg tw-w-full"
                  />
                </div>

                {/* Profile image */}
                <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                  <input
                    type="file"
                    required
                    name="profileImage"
                    id="image"
                    accept="image/*"
                    placeholder="Profile"
                    // value={profile}
                    onChange={(e) => setProfile(e.target.files[0])}
                    className="tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-py-2 tw-px-2 tw-flex-grow file-input__input tw-text-white-color tw-backdrop-blur tw-bg-[rgba(201,79,79,0.53)]"
                  />
                  <label
                    className="tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-py-2 tw-px-2 tw-flex-grow tw-text-white-color tw-backdrop-blur tw-bg-[rgba(201,79,79,0.53)]"
                    htmlFor="image"
                  >
                    Uplode Profile Image
                  </label>
                </div>
                {/* Profile image */}

                <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between tw-mx-auto">
                  <select
                    placeholder="Choose"
                    className="tw-rounded-full tw-flex-grow tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg"
                    onChange={(e) => setGender(e.target.value)}
                    value={gender}
                  >
                    <option
                      className="tw-justify-between tw-rounded-full tw-border-none tw-py-4"
                      placeholder="Choose Gender"
                    >
                      Choose Gender
                    </option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                {formError && (
                  <div className="tw-flex tw-flex-col tw-px-6 tw-mt-3 tw-max-w-[260px] tw-mx-auto">
                    <div className="tw-text-white-color tw-text-sm">
                      <ErrorIcon fontSize="small" />{" "}
                      <span className="">{formError}</span>
                    </div>
                  </div>
                )}
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-3">
                  <Button
                    variant="danger"
                    className="tw-rounded-full tw-inline-block tw-w-11/12"
                    type="submit"
                    id="action-btn"
                  >
                    Register
                  </Button>
                  <div className="tw-border-t tw-border-second-color tw-my-3 tw-w-full"></div>
                  <p className="tw-text-white">Already Register ?</p>
                  <Link href="/auth/login">
                    <p className="tw-text-white tw-text-lg tw-font-bold tw-cursor-pointer">
                      <span className="tw-flex tw-mt-4 ">
                        <LockOpenIcon /> <p className="tw-ml-4">Login</p>
                      </span>
                    </p>
                  </Link>

                  <button
                    onClick={() => router.back()}
                    className="tw-flex tw-text-white tw-w-11/12 tw-mt-4 tw-justify-center tw-cursor-pointer tw-items-center"
                  >
                    <ArrowBackIcon fontSize="medium" />
                    <p className="tw-ml-4 tw-font-bold tw-text-xl">
                      Back to Home
                    </p>
                  </button>
                </div>
              </form>
            </div>
            <div className="tw-col-span-1 tw-row-span-1 sm:tw-relative tw-absolute tw-z-[-10] sm:tw-z-0 ">
              <div
                className="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-bottom-0 tw-flex tw-flex-col tw-items-start tw-align-bottom tw-content-end tw-px-4 tw-py-10 login-bg tw-bg-cover tw-bg-left-top"
                style={{ backgroundImage: `url(${loginBg.src})` }}
              >
                <div className="tw-flex-shrink-0 tw-flex-grow"></div>
                <div className="tw-flex-shrink tw-flex-grow-0">
                  <div className="tw-flex tw-items-center tw-mt-2">
                    <VerifiedUser className="tw-text-white-color" />
                    <p className="tw-text-white-color tw-font-semibold tw-capitalize tw-pl-2">
                      200M+ users worldwide
                    </p>
                  </div>
                  <div className="tw-flex tw-items-center tw-mt-2">
                    <Money className="tw-text-white-color" />
                    <p className="tw-text-white-color tw-font-semibold tw-capitalize tw-pl-2">
                      earn 24K+ per month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default SignUp
