import React from "react";
import Header from "../components/Mainpage/Header";
import SecondHeader from "../components/Mainpage/SecondHeader";
import Image from "next/dist/client/image";
import { useSidebarUpdate, useSidebarStatus } from "../app/Sidebarcontext";
import Sidebar from "./Mainpage/Sidebar";
function Mainmodle({ data }) {
  const sidebarStatus = useSidebarStatus();
  return (
    <div>
      <Header />
      <SecondHeader />
      {sidebarStatus && <Sidebar />}
      <Image src={data.image} className="w-screen" />

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
          <form className="flex text-white bg-gray-500 flex-col min-h-full">
            <input
              type="text"
              placeholder="Name"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
            <input
              type="text"
              placeholder="Age"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
            <input
              type="text"
              placeholder="Email"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
            <input
              type="text"
              placeholder="Phone"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
            <input
              type="text"
              placeholder="Address"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
            <input
              type="text"
              placeholder="City"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
            <input
              type="text"
              placeholder="State"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
            <input
              type="text"
              placeholder="Country"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
            <input
              type="text"
              placeholder="Zip"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
            <input
              type="text"
              placeholder="skin"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
            <input
              type="text"
              placeholder="hair"
              className="rounded-full py-3 px-6 outline-none my-2 sm:mx-4 mx-2"
            />
          </form>
        </div>
        <div className="bg-green-600  sm:min-w-[50%] min-w-full">
          <h2>krishan</h2>
        </div>
      </div>

      <h2>Main Modle</h2>
      <p>{data.title}</p>
    </div>
  );
}

export default Mainmodle;
