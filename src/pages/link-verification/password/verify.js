import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAuthContext } from "../../../app/AuthContext"
import { useRouter } from "next/router"

function PasswordVerification() {
  //   const [linkWasValid, setLinkWasValid] = useState("loading")
  const [linkWasValid, setLinkWasValid] = useState(true)
  const [didReset, setDidReset] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConformation, setNewPasswordConformation] = useState("")
  const [userType, setUserType] = useState(null)
  const [hasTokenInUrl, setHasTokenInUrl] = useState(true)
  const [errorMsg, setErrorMessage] = useState("")

  const authCtx = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.has("token")) {
        fetch("/api/website/verification/initial-link-verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: searchParams.get("token"),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.actionStatus === "success") {
              setLinkWasValid(true)
            } else {
              setLinkWasValid(false)
            }
          })
          .catch((err) => {
            setLinkWasValid(false)
            alert(err.message)
          })
      } else {
        setLinkWasValid(false)
      }
    }
  }, [authCtx.isLoggedIn])

  const resetPassword = () => {
    if (newPassword !== newPasswordConformation) {
      return alert("Passwords did not matched!")
    }
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has("token")) {
      fetch("/api/website/verification/verify-token-and-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: searchParams.get("token"),
          newPassword: newPassword,
          newPasswordConformation: newPasswordConformation,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.actionStatus === "success") {
            /*  */
            setDidReset(true)
          } else {
            /*  */
            setDidReset(false)
          }
        })
        .catch((err) => {
          setDidReset(false)
          return alert(err.message || err.reason)
        })
    }
  }

  const loading = (
    <p className="tw-capitalize text-semibold tw-text-2xl">
      Verifying your link....
    </p>
  )

  return !authCtx.isLoggedIn ? (
    <div className="tw-min-h-screen tw-bg-first-color  tw-text-white-color tw-text-center">
      {linkWasValid === "loading" && loading}
      {linkWasValid === true && !didReset && (
        <>
          <h2 className="tw-text-2xl tw-my-5 tw-capitalize">
            Please Enter New Password
          </h2>
          {/* some text */}
          <div className="tw-bg-dark-black tw-px-10 tw-py-8 tw-w-10/12 md:tw-w-1/2 lg:tw-w-2/5 tw-mx-auto">
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="tw-my-2 tw-mx-4 tw-px-8 tw-py-3 tw-h-8 tw-rounded-full tw-outline-none tw-bg-first-color tw-font-semibold tw-text-lg"
            />
            <input
              type="text"
              value={newPasswordConformation}
              onChange={(e) => setNewPasswordConformation(e.target.value)}
              placeholder="Confirm your password"
              className="tw-my-2 tw-mx-4 tw-px-8 tw-py-3 tw-h-8 tw-rounded-full tw-outline-none tw-bg-first-color tw-font-semibold tw-text-lg"
            />
            {errorMsg && (
              <div className="tw-my-4 tw-text-center">
                <p className="tw-text-red-500">{errorMsg}</p>
              </div>
            )}
            <div className="tw-my-4 tw-text-center">
              <button
                onClick={resetPassword}
                className="tw-rounded-full tw-px-6 tw-py-1 tw-border-2 tw-border-text-black tw-font-medium tw-inline-block"
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
      {linkWasValid && didReset && (
        <>
          <h2 className="tw-text-2xl tw-my-5 tw-capitalize">
            Password was reset successFully
          </h2>
          <div className="tw-text-center tw-my-3">
            <img
              src="/approval.png"
              className="tw-max-w-[50px] md:tw-max-w-[80px] lg:tw-max-w-[130px] tw-mx-auto"
              alt=""
            />
          </div>
          {/* some text */}
          <p className="tw-my-8 tw-text-center lg:tw-w-6/12 tw-mx-auto">
            Hooray! your Password was reset successFully. You can now login into
            your account using the new passwords
          </p>

          <div className="tw-my-6 tw-text-center">
            <Link href="/auth/login">
              <a className="tw-font-semibold tw-bg-dreamgirl-red tw-px-6 tw-py-3 tw-capitalize hover:tw-text-white-color">
                Login to continue
              </a>
            </Link>
          </div>
        </>
      )}
      {!linkWasValid && (
        <>
          <h2 className="tw-text-2xl tw-my-5 tw-capitalize">
            The Link Was Not Valid
          </h2>
          <div className="tw-text-center tw-my-3">
            {/* checkmark svg */}
            <img
              src="/forbidden.png"
              className="tw-max-w-[50px] md:tw-max-w-[80px] lg:tw-max-w-[130px] tw-mx-auto"
              alt=""
            />
          </div>
          {/* some text */}
          <p className="tw-my-8 tw-text-center lg:tw-w-6/12 tw-mx-auto">
            oops! your link was not invalid, maybe you are clicking on the link
            after its was expired.
            <br />
            <br />
          </p>
        </>
      )}
    </div>
  ) : (
    <p className="tw-font-semibold tw-text-center tw-py-10 tw-text-2xl tw-mt-10 tw-text-white-color">
      Please logout first
    </p>
  )
}

export default PasswordVerification
