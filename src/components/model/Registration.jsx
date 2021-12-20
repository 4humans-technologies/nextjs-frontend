import React, { useState, useRef, useEffect } from "react"
import { Button } from "react-bootstrap"
import { validPassword, validEmail, validatePhone } from "../UI/Regex"
import loginBg from "../../../public/dreamgirl-bg-3.jpg"
import { Money, Person, VerifiedUser } from "@material-ui/icons"
import { useRouter } from "next/router"
import Logo from "../../../public/logo.png"
import Image from "next/image"
import Link from "next/link"
import { useAuthUpdateContext } from "../../app/AuthContext"
import io from "../../socket/socket"
import ErrorIcon from "@material-ui/icons/Error"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import LockOpenIcon from "@material-ui/icons/LockOpen"
import { toast } from "react-toastify"

//Validation is still left in this
// I did blunder using multiple state ,rather than using single to create it
function Registration() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [username, setuserName] = useState("")
  const [age, setAge] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("Female")
  const [profile, setProfile] = useState("")
  const [formError, setFormError] = useState(null)

  const updateCtx = useAuthUpdateContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // In this get we url from to uplode profile image to s3 bucket ,first get url from server and then use that url to uplode directly to aws

    const res = await fetch(
      "/api/website/aws/get-s3-upload-url?type=" + profile.type
    )
    const data_2 = await res.json()
    const profile_url = await data_2.uploadUrl

    // console.log(`This is profile url bro ${profile_url}`)
    // console.log(`This is profile url bro ${profile_url.split("?")[0]}`)

    // Now use this url to uplode the

    const resp = await fetch(profile_url, {
      method: "PUT",
      // When I was using multipart form data the data needed to be downloaded
      body: profile,
    })

    // // model Creation --------------
    // Now profile is url and you have to fetch the data from aws for profile image
    if (!resp.ok) {
      return alert("Betaa data is wrong")
    }

    const imageUrl = profile_url.split("?")[0]

    fetch("/api/website/register/model/create", {
      method: "POST",
      cors: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        age,
        phone,
        gender,
        password,
        languages: "",
        email,
        profileImage: imageUrl,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        // login the model also
        if (data.actionStatus === "success") {
          localStorage.setItem("jwtToken", data.token)
          localStorage.setItem(
            "jwtExpiresIn",
            Date.now() + data.expiresIn * 60 * 60 * 1000
          )
          localStorage.setItem("rootUserId", data.user._id)
          localStorage.setItem("relatedUserId", data.model._id)
          localStorage.setItem("userType", data.user.userType)
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...data.user,
              relatedUser: {
                ...data.model,
                wallet: {
                  ...data.wallet,
                },
              },
            })
          )
          updateCtx.updateViewer({
            rootUserId: data.user._id,
            relatedUserId: data.model._id,
            token: data.token,
            isLoggedIn: true,
            user: {
              userType: data.user.userType,
              user: {
                ...data.user,
                relatedUser: {
                  ...data.model,
                  wallet: {
                    ...data.wallet,
                  },
                },
              },
            },
            jwtExpiresIn: +data.expiresIn * 60 * 60 * 1000,
          })
          toast.success(`Sign up successful, as ${username}`, {
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          })
          toast.info(`Please Upload Documents For Verification.`, {
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
          })
          router.push("/document")
        } else {
          toast.error("An Error Has Occurred, Please Correct And Try Again!", {
            position: "bottom-right",
          })
        }
      })
      .catch((err) => {
        if (err?.dgErrorCode === 1000) {
          return toast.error(err.message, {
            position: "bottom-right",
          })
        }
        toast.error("An Error Has Occurred, Please Correct And Try Again!", {
          position: "bottom-right",
        })
        if (err.message && err?.data[0]) {
          /* validator.js error */
          const value = err.data[0].value
          const param = err.data[0].param
          if (value.trim() !== "") {
            setFormError(`${err.data[0].msg} of field ${param} : ${value}`)
          } else {
            setFormError(
              `${param} "CANNOT BE EMPTY", please enter a valid value`
            )
          }
          document.getElementById("action-btn").scrollIntoView({
            block: "end",
          })
        } else if (err.message && !err?.data[0]) {
          setFormError(err.message)
        }
      })
  }

  useEffect(() => {
    router.prefetch("/document")
  }, [])

  return (
    <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-min-h-screen tw-bg-first-color tw-w-[100vw] sm:tw-w-auto tw-py-12 tw-text-white">
      <div className="tw-flex-shrink-0 tw-flex-grow-0">
        <div className="tw-grid sm:tw-grid-cols-2 tw-grid-cols-1 tw-grid-rows-1 sm:tw-w-full  tw-h-full tw-w-[100vw] ">
          <div className="tw-relative tw-z-0 tw-col-span-1 tw-row-span-1 tw-text-center red-gray-gradient tw-pl-14 tw-pr-14 tw-pt-10 tw-pb-10 tw-rounded-md">
            <h1 className="tw-text-3xl tw-font-medium tw-text-white-color tw-mb-4 tw-text-center tw-ml-3 tw-z-20">
              Registration Model
            </h1>
            <form
              onSubmit={handleSubmit}
              className="tw-mb-4"
              // encType="multipart/form-data"
            >
              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="text"
                  name="Username"
                  id="Username"
                  placeholder="UserName"
                  value={username}
                  required={true}
                  onChange={(e) => setuserName(e.target.value)}
                  className="tw-text-white-color tw-rounded-full tw-flex-grow tw-border-none tw-outline-none tw-font-light tw-py-2 tw-px-6 tw-text-lg tw-backdrop-blur tw-bg-[rgba(201,79,79,0.53)]"
                />
              </div>
              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={name}
                  required={true}
                  onChange={(e) => setName(e.target.value)}
                  className="tw-text-white-color tw-rounded-full tw-flex-grow tw-border-none tw-outline-none tw-font-light tw-py-2 tw-px-6 tw-text-lg tw-backdrop-blur tw-bg-[rgba(201,79,79,0.53)]"
                />
              </div>
              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="number"
                  name="age"
                  id="age"
                  placeholder="age"
                  value={age}
                  required={true}
                  onChange={(e) => setAge(e.target.value)}
                  className="tw-text-white-color tw-rounded-full tw-flex-grow tw-border-none tw-outline-none tw-font-light tw-py-2 tw-px-6 tw-text-lg tw-backdrop-blur tw-bg-[rgba(201,79,79,0.53)]"
                />
              </div>
              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="email"
                  required={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="tw-text-white-color tw-rounded-full tw-flex-grow tw-border-none tw-outline-none tw-font-light tw-py-2 tw-px-6 tw-text-lg tw-backdrop-blur tw-bg-[rgba(201,79,79,0.53)]"
                />
              </div>
              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="tel"
                  name="phone Number"
                  id="phone Number"
                  placeholder="phone Number"
                  value={phone}
                  required={true}
                  onChange={(e) => setPhone(e.target.value)}
                  className="tw-text-white-color tw-rounded-full tw-flex-grow tw-border-none tw-outline-none tw-font-light tw-py-2 tw-px-6 tw-text-lg tw-backdrop-blur tw-bg-[rgba(201,79,79,0.53)]"
                />
              </div>

              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="Password"
                  name="Password"
                  id="Password"
                  placeholder="Password"
                  value={password}
                  required={true}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tw-rounded-full tw-flex-grow  tw-border-none tw-outline-none tw-font-light tw-py-2 tw-px-6 tw-text-lg tw-text-white-color tw-backdrop-blur tw-bg-[rgba(201,79,79,0.53)]"
                />
              </div>
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

              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <select
                  placeholder="Choose"
                  className="tw-text-white-color tw-rounded-full tw-flex-grow tw-border-none tw-outline-none tw-font-light tw-py-2 tw-px-6 tw-text-lg tw-backdrop-blur tw-bg-[rgba(201,79,79,0.53)]"
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                >
                  <option selected value="Female">
                    Female
                  </option>
                  <option value="Male">Male</option>
                </select>
              </div>
              {formError && (
                <div className="tw-flex tw-flex-col tw-px-6 tw-mt-3 tw-max-w-[260px] tw-text-center tw-mx-auto">
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
                <p>Already Register ?</p>
                <Link href="/auth/login">
                  <p className="tw-text-white tw-text-lg tw-font-bold tw-cursor-pointer">
                    <span className="tw-flex tw-mt-4 ">
                      <LockOpenIcon /> <p className="tw-ml-4">Login</p>
                    </span>
                  </p>
                </Link>

                <div
                  className="tw-flex tw-text-white  tw-w-11/12 tw-mt-4  tw-justify-center tw-cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  <ArrowBackIcon fontSize="medium" />
                  <p className="tw-ml-4 tw-font-bold tw-text-xl">
                    Back to Home
                  </p>
                </div>
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
  )
}

export default Registration
