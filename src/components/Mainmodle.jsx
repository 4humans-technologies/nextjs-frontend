import React from "react";
import Header from "../components/Mainpage/Header";
import SecondHeader from "../components/Mainpage/SecondHeader";
import Image from "next/dist/client/image";
import { useSidebarUpdate, useSidebarStatus } from "../app/Sidebarcontext";
import Sidebar from "./Mainpage/Sidebar";
import photo from "../../public/ravi.jpg";
import neeraj from "../../public/brandikaran.jpg";

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
];

function Mainmodle() {
  const sidebarStatus = useSidebarStatus();
  return (
    <div>
      <Header />
      <SecondHeader />
      {sidebarStatus && <Sidebar />}
      <Image src={data[0].photo} className="w-screen" />

      <div className="bg-gray-600 w-full sm:h-36 h-28 relative shadow-lg">
        <div class="rounded-full h-32 w-32 flex items-center justify-center bg-green-700 absolute top-[-50%] shadow-lg">
          {/* <Image src={data.image} /> */}
        </div>
        <h2 className="text-white shadow-lg sm:mt-10 sm:ml-32 mt-12 ml-28  absolute text-2xl">
          Neeraj Rai
        </h2>
      </div>

      <div className="flex min-w-full md:px-4 sm:flex-row flex-col">
        <div className="bg-red-500 text-white  sm:min-w-[50%] min-w-full ">
          <h2>Profile</h2>
          <div className="flex text-white bg-gray-500 flex-col min-h-full">
            {data.map((item, index) => (
              <div key={index} className="sm:ml-4">
                <div>
                  <span className="font-bold mr-4">Name :</span> {item.Name}
                </div>
                <div>
                  {" "}
                  <span className="font-bold mr-8">Age :</span> {item.Age}
                </div>
                <div>
                  {" "}
                  <span className="font-bold mr-2">Nation :</span> {item.nation}
                </div>
                <div>
                  {" "}
                  <span className="font-bold mr-2">Intrest :</span>{" "}
                  {item.interest}
                </div>
                <div>
                  {" "}
                  <span className="font-bold mr-4">Place :</span> {item.from}
                </div>
                <div>
                  {" "}
                  <span className="font-bold mr-1">Height :</span> {item.Height}
                </div>
                <div>
                  {" "}
                  <span className="font-bold">Culture :</span> {item.Subculture}
                </div>
                <div>
                  {" "}
                  <span className="font-bold mr-6">Eyes :</span>
                  {item.eyes}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-green-600  sm:min-w-[50%] min-w-full">
          <h2>Photo</h2>
          <div className="flex">
            <Image src={neeraj} className="w-40 h-40" />
            <Image src={neeraj} className="w-40 h-40" />
            <Image src={neeraj} className="w-40 h-40" />
            <Image src={neeraj} className="w-40 h-40" />
            <Image src={neeraj} className="w-40 h-40" />
          </div>
        </div>
      </div>

      <h2>Main Modle</h2>
      <p>{data.title}</p>
    </div>
  );
}

export default Mainmodle;
