import React from "react"
import Header from "../components/Mainpage/Header"
import SecondHeader from "../components/Mainpage/SecondHeader"
import Image from "next/dist/client/image"
import { useSidebarUpdate, useSidebarStatus } from "../app/Sidebarcontext"
import Sidebar from "./Mainpage/Sidebar"
import photo from "../../public/ravi.jpg"
import neeraj from "../../public/brandikaran.jpg"

const data = [
  {
    Name: "Mainbox",
    Description:
      "Mainbox is a simple, yet powerful, flexbox based grid system. ",
    Age: "22",
    nation: "China",
    language: "Javascript,PHP,English",
    photo: photo,
    interest: "Music,Reading,Fishing",
    from: "Nagpur",
    Body: "Flexbox",
    Height: "5'8",
    hair: "Black",
    eyes: "Blue",
    Subculture: "Indian",
  },
]

function Mainmodle() {
  const sidebarStatus = useSidebarStatus()
  return (
    <div>
      <Header />
      <SecondHeader />
      <Image src={data[0].photo} className="tw-w-screen" />

      <div className="tw-bg-gray-600 tw-w-full sm:tw-h-36 tw-h-28 tw-relative tw-shadow-lg">
        <div className="rounded-full h-32 w-32 flex items-center justify-center bg-green-700 absolute top-[-50%] shadow-lg">
          {/* <Image src={data.image} /> */}
        </div>
        <h2 className="tw-text-white tw-shadow-lg sm:tw-mt-10 sm:tw-ml-32 tw-mt-12 tw-ml-28 tw-absolute tw-text-2xl">
          Neeraj Rai
        </h2>
      </div>

      <div className="tw-flex tw-min-w-full md:tw-px-4 sm:tw-flex-row tw-flex-col">
        <div className="tw-bg-red-500 tw-text-white sm:tw-min-w-[50%] tw-min-w-full">
          <h2>Profile</h2>
          <div className="tw-flex tw-text-white tw-bg-gray-500 tw-flex-col tw-min-h-full">
            {data.map((item, index) => (
              <div key={index} className="sm:tw-ml-4">
                <div>
                  <span className="tw-font-bold tw-mr-4">Name :</span>{" "}
                  {item.Name}
                </div>
                <div>
                  {" "}
                  <span className="tw-font-bold tw-mr-8">Age :</span> {item.Age}
                </div>
                <div>
                  {" "}
                  <span className="tw-font-bold tw-mr-2">Nation :</span>{" "}
                  {item.nation}
                </div>
                <div>
                  {" "}
                  <span className="tw-font-bold tw-mr-2">Intrest :tw-</span>
                  {""}
                  {item.interest}
                </div>
                <div>
                  {" "}
                  <span className="tw-font-bold tw-mr-4">Place :</span>{" "}
                  {item.from}
                </div>
                <div>
                  {" "}
                  <span className="tw-font-bold tw-mr-1">Height :</span>{" "}
                  {item.Height}
                </div>
                <div>
                  {" "}
                  <span className="tw-font-bold">Culture :</span>{" "}
                  {item.Subculture}
                </div>
                <div>
                  {" "}
                  <span className="tw-font-bold tw-mr-6">Eyes :</span>
                  {item.eyes}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="tw-bg-green-600 sm:tw-min-w-[50%] tw-min-w-full">
          <h2>Photo</h2>
          <div className="tw-flex">
            <Image src={neeraj} className="tw-w-40 tw-h-40" />
            <Image src={neeraj} className="tw-w-40 tw-h-40" />
            <Image src={neeraj} className="tw-w-40 tw-h-40" />
            <Image src={neeraj} className="tw-w-40 tw-h-40" />
            <Image src={neeraj} className="tw-w-40 tw-h-40" />
          </div>
        </div>
      </div>

      <h2>Main Modle</h2>
      <p>{data.title}</p>
    </div>
  )
}

export default Mainmodle
