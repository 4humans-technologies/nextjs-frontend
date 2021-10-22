import React, { useState, useRef } from "react"
import { Button } from "react-bootstrap"
import { validPassword, validEmail, validatePhone } from "../UI/Regex"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

import { Money, Person, VerifiedUser } from "@material-ui/icons"
import loginBg from "../../../public/dreamgirl-bg-3.jpg"
import { useRouter } from "next/router"
import io from "../../socket/socket"
import Logo from "../../../public/logo.png"
import Image from "next/image"
import Link from "next/link"
import { imageDomainURL } from "../../../dreamgirl.config"

//Validation is still left in this
function Login() {
  const router = useRouter()
  const [formsubmit, SetFormsubmit] = useState(false)
  const [username, setuserName] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState(null)
  const ctx = useAuthContext()
  const updateCtx = useAuthUpdateContext()

  if (typeof window !== "undefined" && ctx.isLoggedIn) {
    const reloadUrl = `${window.location.protocol}//${window.location.host}${ctx.loginSuccessUrl}`
    window.location.href = reloadUrl
    return <></>
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log(password, username)
    fetch("/api/website/login", {
      method: "POST",
      cors: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        username,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        //debugger
        if (data.actionStatus === "success") {
          localStorage.setItem("jwtToken", data.token)
          localStorage.setItem(
            "jwtExpiresIn",
            Date.now() + data.expiresIn * 60 * 60 * 1000
          )
          localStorage.setItem("rootUserId", data.rootUserId)
          localStorage.setItem("relatedUserId", data.relatedUserId)
          localStorage.setItem("userType", data.userType)
          localStorage.setItem("user", JSON.stringify(data.user))
          updateCtx.updateViewer({
            rootUserId: data.userId,
            relatedUserId: data.relatedUserId,
            token: data.token,
            isLoggedIn: true,
            user: {
              userType: data.userType,
              user: data.user,
            },
            jwtExpiresIn: +data.expiresIn * 60 * 60 * 1000,
            streamRoom: data.streamRoom,
          })
          //debugger
          sessionStorage.clear()
          // io.getSocket().close()
          // io.connect(imageDomainURL)
          /* don't think it is re-creating handshake object for re-connection */
          // io.getSocket().open()

          // 👇👇 abhi ke liye is feature ko pause pe rakhaa hai bro
          // router.push(ctx.loginSuccessUrl)
        }
      })
      .catch((err) => {
        //debugger
        setLoginError(err.message)
      })
  }

  return (
    <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-min-h-screen tw-bg-third-color tw-w-[100vw] sm:tw-w-auto ">
      <div className="tw-mb-4">
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
          <div className="tw-relative tw-z-0 tw-col-span-1 tw-row-span-1 tw-text-center red-gray-gradient tw-pl-14 tw-pr-14 tw-pt-20 tw-pb-20 tw-rounded-md  ">
            <h1 className="tw-text-3xl tw-font-medium tw-text-white-color tw-mb-4 tw-text-center tw-ml-3 tw-z-20">
              {" "}
              Login
            </h1>
            <form
              onSubmit={handleSubmit}
              className="tw-mb-4 tw-flex tw-flex-col tw-justify-center"
            >
              <div className="tw-flex-grow tw-py-2 tw-px-2">
                <input
                  type="text"
                  name="Username"
                  id="Username"
                  placeholder="UserName"
                  value={username}
                  onChange={(e) => setuserName(e.target.value)}
                  className="tw-rounded-full tw-border-none tw-outline-none tw-bg-white-color tw-text-first-color tw-font-light tw-py-2 tw-px-6 tw-text-lg tw-w-full"
                />
              </div>
              <div className="tw-flex-grow tw-py-2 tw-px-2">
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
              {loginError && (
                <div className="tw-flex tw-flex-col tw-px-6 tw-mt-3">
                  <div className="tw-text-white-color tw-font-semibold">
                    {loginError}
                  </div>
                </div>
              )}
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-3">
                <Button
                  variant="danger"
                  className="tw-rounded-full tw-inline-block tw-w-11/12"
                  type="submit"
                >
                  Login
                </Button>
                <div className="tw-border-t tw-border-second-color tw-my-3 tw-w-full"></div>
                <Button
                  variant="success"
                  className="tw-rounded-full tw-inline-block tw-w-11/12"
                  type="submit"
                >
                  Register
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

export default Login
