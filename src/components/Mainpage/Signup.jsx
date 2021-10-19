import React, { useState } from "react"
import CloseIcon from "@material-ui/icons/Close"
import { useHistory } from "react-router-dom"
import { useRouter } from "next/router"
import { useAuthUpdateContext, useAuthContext } from "../../app/AuthContext"
import useModalContext from "../../app/ModalContext"
import loginBg from "../../../public/dreamgirl-bg-3.jpg"
import { Money, Person, VerifiedUser } from "@material-ui/icons"
import { Button } from "react-bootstrap"
import useFetchInterceptor from "../../hooks/useFetchInterceptor"
import Logo from "../../../public/logo.png"
import Image from "next/image"
import Link from "next/link"

function Signup() {
  const modalCtx = useModalContext()

  const [email, setEmail] = useState(
    `ravi_4${Math.floor(Math.random() * 1000000)}@gm.co`
  )
  const [password, setPassword] = useState(
    `ravi_4${Math.floor(Math.random() * 1000000)}`
  )
  const [username, setUsername] = useState(
    `ravi_4${Math.floor(Math.random() * 1000000)}`
  )
  const [gender, setGender] = useState("Male")
  const [name, setName] = useState("")

  const ctx = useAuthContext()
  const updateCtx = useAuthUpdateContext()
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
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
      }),
    })
      .then((resp) => resp.json())
      .then(
        (data) =>
          updateCtx.updateViewer(
            {
              rootUserId: data.user._id,
              relatedUserId: data.user.relatedUser._id,
              user: data.user,
            },
            () => {
              router.replace("/")
            }
          )
        //redirect to home page
      )

      .catch((err) => console.log(err))
  }

  return (
    <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-min-h-screen tw-bg-third-color tw-w-[100vw] sm:tw-w-auto ">
      <div className="tw-my-4">
        <Link href="/" className="tw-cursor-pointer">
          <Image
            src={Logo}
            width={150}
            height={79}
            className="tw-cursor-pointer"
          />
        </Link>
      </div>
      <div className="tw-flex-shrink-0 tw-flex-grow-0  ">
        <div className="tw-grid sm:tw-grid-cols-2 tw-grid-cols-1  tw-grid-rows-1 sm:tw-w-full   tw-h-full tw-w-[100vw]  ">
          <div className="tw-relative tw-z-0 tw-col-span-1 tw-row-span-1 tw-text-center red-gray-gradient tw-pl-14 tw-pr-14 tw-pt-10 tw-pb-10 tw-rounded-md  ">
            <h1 className="tw-text-3xl tw-font-medium tw-text-white-color tw-mb-4 tw-text-center tw-ml-3 tw-z-20">
              {" "}
              Registration user
            </h1>
            <form onSubmit={handleSubmit} className="tw-mb-4">
              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="text"
                  name="Username"
                  id="Username"
                  placeholder="UserName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg"
                />
              </div>
              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg"
                />
              </div>

              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg"
                />
              </div>

              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="Password"
                  name="Password"
                  id="Password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg"
                />
              </div>

              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <select
                  placeholder="Choose"
                  className="tw-rounded-full tw-flex-grow tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg"
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                >
                  <option
                    className="tw-justify-between tw-rounded-full tw-border-none tw-py-4 "
                    placeholder="Choose Gender"
                  >
                    Choose Gender
                  </option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-6">
                <Button
                  variant="danger"
                  className="tw-rounded-full tw-inline-block tw-w-11/12"
                  type="submit"
                >
                  Register
                </Button>
                <div className="tw-border-t tw-border-second-color tw-my-3 tw-w-full"></div>
                <Button
                  variant="success"
                  className="tw-rounded-full tw-inline-block tw-w-11/12"
                  type="submit"
                >
                  Login
                </Button>
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

export default Signup
