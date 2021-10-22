import React from "react";

function LivePeople() {
  const data = [
    {
      id: 1,
      name: "Neeraj Bhai Brandikaran ",
      age: 18,
      message: "I love silicon Valley",
    },
    {
      id: 2,
      name: "Neeraj Rai",
      age: 19,
      message: "I love My India",
    },
    {
      id: 3,
      name: "Neeraj",
      age: 20,
      message: "我是王五",
    },

    {
      id: 4,
      name: "Ravi Bhai",
      age: 21,
      message: "I am The Hero",
    },
    {
      id: 5,
      name: "Ravi shankar",
      age: 22,
      message: "I am Ravi",
    },
    {
      id: 6,
      name: "Ravi ji",
      age: 23,
      message: "我是Ravi",
    },
    {
      id: 7,
      name: "Ravi",
      age: 24,
      message: "我是Ravi",
    },
    {
      id: 8,
      name: "Ravi",
      age: 25,
      message: "我是Ravi",
    },
    {
      id: 9,
      name: "Ravi",
      age: 26,
      message: "我是Ravi",
    },
    {
      id: 10,
      name: "Ravi",
      age: 27,
      message: "我是Ravi",
    },
    {
      id: 11,
      name: "Ravi",
      age: 28,
      message: "我是Ravi ----",
    },
    {
      id: 12,
      name: "Ravi shankar singh",
      age: 29,
      message: "我是Ravi======================",
    },
    {
      id: 13,
      name: "Ravi",
      age: 30,
      message: "我是Ravi ji",
    },
  ];
  return (
    <div className="tw-font-sans chat-box">
      {data.map((item, index) => {
        return (
          <div>
            <div
              key={index}
              className="tw-flex tw-bg-second-color tw-py-1 tw-px-1  tw-font-sans"
            >
              <div className="md:tw-mx-2  tw-text-gray-500  tw-text-base">
                {item.name} :
              </div>
              <div className="tw-text-sm tw-text-white">{item.age}</div>
            </div>
            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default LivePeople;
