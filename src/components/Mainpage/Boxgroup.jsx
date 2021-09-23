import React, { useEffect, useState } from "react";
import Mainbox from "./Mainbox";
import Photo from "../../../public/pp.jpg";


function Boxgroup() {
  const [streams, setStreams] = useState([]);

  // useEffect(() => {
  //   fetch("http://localhost:8080/api/website/compose-ui/get-streaming-models")
  //     .then((res) => res.json)
  //     .then((data) => {
  //       setStreams(data.resultDoc);
  //     });
  // }, []);

  const data = [
    {
      id: 1,
      Name: "Vikas",
      Age: 22,
      Gender: "Male",
      Language: "Marwadi",
      Nation: "Cjina",
      Rating: 4,
      image: Photo,
      Group: 23,
      Private: 34,
    },
    {
      id: 2,
      Name: "Vikas",
      Age: 22,
      Gender: "Male",
      Language: "Marwadi",
      Nation: "Cjina",
      Rating: 4,
      image: Photo,
      Group: 23,
      Private: 34,
    },
    {
      id: 3,
      Name: "Vikas",
      Age: 22,
      Gender: "Male",
      Language: "Marwadi",
      Nation: "Cjina",
      Rating: 4,
      image: Photo,
      Group: 23,
      Private: 34,
    },
    {
      id: 4,
      Name: "Vikas",
      Age: 22,
      Gender: "Male",
      Language: "Marwadi",
      Nation: "Cjina",
      Rating: 4,
      image: Photo,
      Group: 23,
      Private: 34,
    },
    {
      id: 5,
      Name: "Vikas",
      Age: 22,
      Gender: "Male",
      Language: "Marwadi",
      Nation: "Cjina",
      Rating: 4,
      image: Photo,
      Group: 23,
      Private: 34,
    },
    {
      id: 6,
      Name: "Vikas",
      Age: 22,
      Gender: "Male",
      Language: "Marwadi",
      Nation: "Cjina",
      Rating: 4,
      image: Photo,
      Group: 23,
      Private: 34,
    },
    {
      id: 7,
      Name: "Vikas",
      Age: 22,
      Gender: "Male",
      Language: "Marwadi",
      Nation: "Cjina",
      Rating: 4,
      image: Photo,
      Group: 23,
      Private: 34,
    },
    {
      id: 8,
      Name: "Vikas",
      Age: 22,
      Gender: "Male",
      Language: "Marwadi",
      Nation: "Cjina",
      Rating: 4,
      image: Photo,
      Group: 23,
      Private: 34,
    },
  ];

  return (
    <div className="tw-bg-first-color tw-w-full tw-px-3">
      <h1 className="tw-text-xl tw-font-bold tw-text-white tw-mb-4 tw-mt-6">
        Test Webcams
      </h1>
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-x-3 tw-gap-y-2 tw-auto-rows-min tw-justify-items-center">
        {data.map((item, index) => {
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
              channel={"6145c2d5f2c22642743ea496"}
              stream={"ds"}
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
