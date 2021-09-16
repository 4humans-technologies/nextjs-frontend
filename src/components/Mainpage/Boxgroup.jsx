import React, { useEffect, useState } from "react";
import Mainbox from "./Mainbox";
import Photo from "../../../public/pp.jpg";

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
    <div className="tw-bg-first-color tw-w-full tw-px-3">
      <h1 className="tw-text-xl tw-font-bold tw-text-white tw-mb-4 tw-mt-6">
        Test Webcams
      </h1>
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-x-3 tw-gap-y-2 tw-auto-rows-min tw-justify-items-center">
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
