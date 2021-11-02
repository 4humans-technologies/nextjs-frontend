import React, { useState, useRef } from "react"
import { Button } from "react-bootstrap"
import { validPassword, validEmail, validatePhone } from "../UI/Regex"
import loginBg from "../../../public/dreamgirl-bg-3.jpg"
import { Money, Person, VerifiedUser } from "@material-ui/icons"
import { useRouter } from "next/router"
import Logo from "../../../public/logo.png"
import Image from "next/image"
import Link from "next/link"

//Validation is still left in this
// I did blunder using multiple state ,rather than using single to create it
function Registration() {
  const router = useRouter()
  const [formsubmit, SetFormsubmit] = useState(false)
  const [name, setName] = useState("")
  const [username, setuserName] = useState("")
  const [age, setAge] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("Female")
  const [profile, setProfile] = useState()

  const handleSubmit = (e) => {
    e.preventDefault()
    // In this get we url from to uplode profile image to s3 bucket ,first get url from server and then use that url to uplode directly to aws
    const { profile_url } = fetch("/api/website/aws/get-s3-upload-url")
      .then((data) => data.uploadUrl)
      .catch((error) => console.log(error))

    // Now use this url to uplode the
    fetch(profile_url, {
      method: "PUT",
      headers: {
        "Content-type": "multipart/form-data",
      },
      body: {
        profile,
      },
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data))

    // Now to send the data to server to make
    // const formData = new FormData()
    // formData.append("name", name)
    // formData.append("username", username)
    // formData.append("age", age)
    // formData.append("password", password)
    // formData.append("email", email)
    // formData.append("phone", phone)
    // formData.append("gender", gender)
    // formData.append("profileImage", profile)
    // formData.append("languages", "marwadi")

    // // model Creation -------------- //////////////
    // fetch("/api/website/register/model/create", {
    //   method: "POST",
    //   cors: "include",
    //   body: formData,
    // })
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     console.log(data.message)
    //     console.log(data)
    //     console.log(name, age, email, password, username, phone, gender),
    //       SetFormsubmit(true),
    //       console.log(formsubmit)
    //     router.push("/document")
    //   })
    //   .catch((err) => console.log(err))
  }

  return (
    <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-min-h-screen tw-bg-third-color tw-w-[100vw] sm:tw-w-auto tw-py-12">
      <div className="tw-mb-4 tw-flex-grow">
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
          <div className="tw-relative tw-z-0 tw-col-span-1 tw-row-span-1 tw-text-center red-gray-gradient tw-pl-14 tw-pr-14 tw-pt-10 tw-pb-10 tw-rounded-md">
            <h1 className="tw-text-3xl tw-font-medium tw-text-white-color tw-mb-4 tw-text-center tw-ml-3 tw-z-20">
              Registration Model
            </h1>
            <form
              onSubmit={handleSubmit}
              className="tw-mb-4"
              encType="multipart/form-data"
            >
              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="text"
                  name="Username"
                  id="Username"
                  placeholder="UserName"
                  value={username}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="tw-rounded-full tw-flex-grow  tw-border-none tw-outline-none tw-font-light tw-py-2 tw-px-6 tw-text-lg tw-text-white-color tw-backdrop-blur tw-bg-[rgba(201,79,79,0.53)]"
                />
              </div>
              <div className="tw-flex tw-py-2 tw-px-2 tw-justify-between">
                <input
                  type="file"
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

export default Registration
