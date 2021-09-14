import React, { useEffect, useState } from "react";
import Mainbox from "./Mainbox";
import Photo from "../../../public/brandikaran.jpg";
const Data = [
  {
    Name: "Vikas Kumawat",
    Age: 22,
    Gender: "Male",
    Language: "Marwadi",
    Nation: "India",
    Rating: 5,
    image: Photo,
    Group: 12,
    Private: 16,
  },
  {
    Name: "Neeraj Rai",
    Age: 22,
    Gender: "Male",
    Language: "Marwadi",
    Nation: "India",
    Rating: 5,
    image: Photo,
    Group: 12,
    Private: 16,
  },
  {
    Name: "Neeraj Rai",
    Age: 22,
    Gender: "Male",
    Language: "Marwadi",
    Nation: "India",
    Rating: 5,
    image: Photo,
    Group: 12,
    Private: 16,
  },
  {
    Name: "Neeraj Rai",
    Age: 22,
    Gender: "Male",
    Language: "Marwadi",
    Nation: "India",
    Rating: 5,
    image: Photo,
    Group: 12,
    Private: 16,
  },
  {
    Name: "Neeraj Rai",
    Age: 22,
    Gender: "Male",
    Language: "Marwadi",
    Nation: "India",
    Rating: 5,
    image: Photo,
    Group: 12,
    Private: 16,
  },
  {
    Name: "Neeraj Rai",
    Age: 22,
    Gender: "Male",
    Language: "Marwadi",
    Nation: "India",
    Rating: 5,
    image: Photo,
    Group: 12,
    Private: 16,
  },
  {
    Name: "Neeraj Rai",
    Age: 22,
    Gender: "Male",
    Language: "Marwadi",
    Nation: "India",
    Rating: 5,
    image: Photo,
    Group: 12,
    Private: 16,
  },
  {
    Name: "Neeraj Rai",
    Age: 22,
    Gender: "Male",
    Language: "Marwadi",
    Nation: "India",
    Rating: 5,
    image: Photo,
    Group: 12,
    Private: 16,
  },
  {
    Name: "Neeraj Rai",
    Age: 22,
    Gender: "Male",
    Language: "Marwadi",
    Nation: "India",
    Rating: 5,
    image: Photo,
    Group: 12,
    Private: 16,
  },
];

function Boxgroup() {
  return (
    <div className="tw-bg-dark-black tw-w-full">
      <h1 className="tw-text-xl tw-ml-6 tw-mt-4 tw-font-bold tw-text-white">
        TestWebcams
      </h1>
      <div className="tw-flex tw-pt-4 tw-flex-wrap ">
        {Data.map((item, index) => {
          return (
            <Mainbox
              key={index}
              Name={item.Name}
              Age={item.Age}
              Gender={item.Gender}
              Language={item.Language}
              Nation={item.Nation}
              Rating={item.Rating}
              Photo={item.image}
              Group={item.Group}
              Private={item.Private}
            />
          );
        })}
        {/* show more wala button,then this will */}
      </div>
      <button
        onClick={() => setCount(count + 3)}
        className="tw-bg-red-600 tw-py-1 tw-mb-4"
      >
        Hello button{" "}
      </button>
    </div>
  );
}

export default Boxgroup;
