import React, { useState } from "react"
import { useAuthContext } from "../../../app/AuthContext"

function SendPasswordResetLink() {
  const [username, setUsername] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState(null)

  const authContext = useAuthContext()

  const sendResetLink = () => {
    fetch("/api/website/verification/send-password-reset-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.actionStatus === "success") {
          setEmailSent(true)
          setError(null)
        } else {
          setError(data.message)
        }
      })
      .catch((err) => setError(err.message))
  }

  return !authContext.isLoggedIn ? (
    <div className="tw-grid tw-place-content-center tw-bg-first-color tw-text-text-black tw-py-8 tw-text-center">
      <div className="tw-bg-dark-black tw-px-10 tw-py-8 tw-w-10/12 md:tw-w-1/2 lg:tw-w-2/5 tw-mx-auto">
        <h1 className="tw-text-xl tw-font-semibold tw-mb-5 tw-text-center">
          Please Enter Your Username
        </h1>
        <div className="tw-my-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="tw-my-2 tw-mx-4 tw-px-8 tw-py-3 tw-h-8 tw-rounded-full tw-outline-none tw-bg-first-color tw-font-semibold tw-text-lg"
          />
        </div>
        {emailSent && (
          <p className="tw-text-green-color tw-font-semibold tw-px-3 tw-my-4">
            Password reset link was sent successfully! ✔✔, Please check your
            email
          </p>
        )}
        {error && (
          <p className="tw-text-red-500 tw-font-semibold tw-px-3 tw-my-4">
            error
          </p>
        )}
        <div className="tw-border-text-black tw-border-t tw-w-11/12 tw-mx-auto tw-mb-3 tw-mt-6"></div>
        <p className="tw-text-center ">
          Please enter the username for the account you want to reset password
          for, An email containing the password reset link will sent to email
          linked to this username account.
        </p>
        {!emailSent && (
          <div className="tw-my-4 tw-text-center">
            <button
              onClick={sendResetLink}
              className="tw-rounded-full tw-px-6 tw-py-1 tw-border-2 tw-border-text-black tw-font-medium tw-inline-block"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <p className="tw-font-semibold tw-text-center tw-py-10 tw-text-2xl tw-mt-10 tw-text-white-color">
      Please logout first
    </p>
  )
}

export default SendPasswordResetLink
