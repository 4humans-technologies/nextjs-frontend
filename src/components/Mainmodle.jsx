import React from "react";
import Header from "../components/Mainpage/Header";
import SecondHeader from "../components/Mainpage/SecondHeader";
import Image from "next/dist/client/image";
function Mainmodle({ data }) {
  return (
    <div>
      <Header />
      <SecondHeader />
      <Image src={data.image} className="w-screen" />

      <div className="bg-gray-600 w-full h-36 relative shadow-lg">
        <div class="rounded-full h-32 w-32 flex items-center justify-center bg-green-700 absolute top-[-50%] shadow-lg">
          {/* <Image src={data.image} /> */}
        </div>
        <h2 className="text-white shadow-lg md:mt-10 md:ml-32  absolute text-2xl">
          Ravi
        </h2>
      </div>

      <div className="flex min-w-full md:px-4">
        <div className="bg-red-500 text-white  min-w-[50%] ">
          <h2>Profile</h2>
          <div className="flex text-white bg-gray-500 flex-col min-h-full">
            <input type="text" placeholder="Name" />
            <input type="text" placeholder="Age" />
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Phone" />
            <input type="text" placeholder="Address" />
            <input type="text" placeholder="City" />
            <input type="text" placeholder="State" />
            <input type="text" placeholder="Country" />
            <input type="text" placeholder="Zip" />
            <input type="text" placeholder="skin" />
            <input type="text" placeholder="hair" />
          </div>
        </div>
        <div className="bg-green-600  min-w-[50%] ">
          <h2>krishan</h2>
        </div>
      </div>

      <h2>Main Modle</h2>
      <p>{data.title}</p>
    </div>
  );
}

export default Mainmodle;
