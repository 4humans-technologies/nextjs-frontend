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
    <div>
      <div>
        {data.map((item, index) => {
          return (
            <div key={index} className="flex bg-gray-300 py-4 px-2 my-4">
              <div className="md:mx-4">{item.name}:-</div>
              {item.age}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LivePeople;
