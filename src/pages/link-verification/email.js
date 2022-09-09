import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import { useRouter } from "next/router"

function EmailVerification() {
  const [isVerified, setIsVerified] = useState("loading")
  const [coinsAdded, setCoinsAdded] = useState(null)
  const [expireDays, setExpireDays] = useState(null)
  const [userType, setUserType] = useState(null)
  const [hasTokenInUrl, setHasTokenInUrl] = useState(true)
  const [alreadyVerified, setAlreadyVerified] = useState(false)

  const authCtx = useAuthContext()
  const updateCtx = useAuthUpdateContext()
  const router = useRouter()

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.has("token")) {
        fetch("/api/website/verification/confirm-email", {
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
            setUserType(data.userType)
            if (data.actionStatus === "success") {
              if (data.userType === "viewer") {
                setCoinsAdded(data.coinsAdded)
                /* also update the wallet locally */
                document.getElementById("money-debit-audio").play()
                updateCtx.updateWallet(+data.coinsAdded, "add")
              }
              setIsVerified(true)
            } else {
              if (data?.alreadyVerified) {
                setAlreadyVerified(true)
              }
              setIsVerified(false)
              setExpireDays(data.expireDays)
              alert("E-mail was not verified reason :" + data.reason)
            }
          })
          .catch((err) => {
            setIsVerified(false)
            alert(err.message)
          })
      } else {
        setHasTokenInUrl(false)
      }
    }
  }, [authCtx.isLoggedIn])

  const loading = (
    <p className="tw-capitalize text-semibold tw-text-2xl">
      Verifying your email....
    </p>
  )
  const verificationSuccess = (
    <>
      <h2 className="tw-text-2xl tw-my-5 tw-capitalize">
        E-mail was verified successFully
      </h2>
      <div className="tw-text-center tw-my-3">
        {/* checkmark svg */}
        <img
          src="/approval.png"
          className="tw-max-w-[50px] md:tw-max-w-[80px] lg:tw-max-w-[130px] tw-mx-auto"
          alt=""
        />
      </div>
      {/* some text */}
      {userType === "Model" ? (
        <p className="tw-my-8 tw-text-center lg:tw-w-6/12 tw-mx-auto">
          Hooray! your E-mail was conformed successFully. Now admin will verify
          your details and contact your for further details, you have wait for
          admin verification before you can start live streaming and calling.
          <br />
          please contact us if you have any issues we will be more than happy to
          solve them and serve you, have a good day!
        </p>
      ) : (
        <p className="tw-my-8 tw-text-center lg:tw-w-6/12 tw-mx-auto">
          Hooray! your E-mail was conformed successFully. we have added{" "}
          {coinsAdded} coins in your wallet now login and explore
          tuktuklive.com, we can't wait to see what you gone do... cheers!🍺
        </p>
      )}
      <div className="tw-my-6 tw-text-center">
        <Link href="/auth/login">
          <a className="tw-font-semibold tw-bg-dreamgirl-red tw-px-6 tw-py-3 tw-capitalize hover:tw-text-white-color">
            Login to continue
          </a>
        </Link>
      </div>
    </>
  )
  const verificationFailed = (
    <>
      <h2 className="tw-text-2xl tw-my-5 tw-capitalize">
        E-mail was not Verified
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
        oops! your email was not verified, maybe you are clicking on the link
        after its was expired the verification link send to your email expires
        after {expireDays && expireDays} days.
        <br />
        <br />
        <span className="tw-inline-block tw-capitalize tw-px-6 tw-py-4 tw-rounded tw-bg-second-color tw-text-green-color tw-font-semibold">
          we have sent a new mail to the email you have registered with, please
          check your mail for the new verification link and follow the
          instruction given there
        </span>
      </p>
    </>
  )

  const alreadyVerifiedCom = (
    <>
      <h2 className="tw-text-2xl tw-my-5 tw-capitalize">
        E-mail already verified!
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
        Your email was already verified
      </p>
    </>
  )

  let finalComponent
  if (!authCtx.isLoggedIn) {
    if (isVerified !== "loading") {
      if (isVerified) {
        finalComponent = verificationSuccess
      } else {
        if (alreadyVerified) {
          finalComponent = alreadyVerifiedCom
        } else {
          finalComponent = verificationFailed
        }
      }
    } else {
      if (hasTokenInUrl) {
        finalComponent = loading
      } else {
        finalComponent = (
          <p className="tw-capitalize text-semibold tw-text-2xl">
            the link is totally invalid, it does not contains the secret!
          </p>
        )
      }
    }
  } else {
    finalComponent = alreadyVerifiedCom
  }

  return (
    <div className="tw-min-h-screen tw-bg-first-color  tw-text-white-color tw-text-center">
      {finalComponent}
    </div>
  )
}

export default EmailVerification
