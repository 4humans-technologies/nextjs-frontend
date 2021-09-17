import React from "react";

function PrivateChat() {
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
    {
      id: 14,
      name: "Ravi shankar",
      age: 30,
      message: "Nrj is Bro ",
    },
  ];

  return (
    <div>
      <div className="tw-font-sans">
        {data.map((item, index) => {
          return (
            <div>
              <div
                key={index}
                className="tw-flex tw-bg-second-color tw-justify-between tw-text-white tw-py-1 tw-px-1  tw-font-sans"
              >
                <div className="tw-flex">
                  <div className="md:tw-mx-2 tw-font-bold tw-text-red-500 tw-text-base">
                    {item.name} :
                  </div>
                  <div className="tw-text-sm">{item.message}</div>
                </div>
                <div className="tw-text-yellow-400 tw-pr-6">{item.id}</div>
              </div>
              <hr className="tw-bg-dark-black" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PrivateChat;
