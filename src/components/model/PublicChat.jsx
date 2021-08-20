import React from "react";

function Publicchat() {
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
  ];

  return (
    <div>
      {data.map((item, index) => {
        return (
          <div key={index} className="flex bg-gray-300 py-4 px-2 my-4">
            <div className="md:mx-4">{item.name}:-</div>
            {item.message}
          </div>
        );
      })}
    </div>
  );
}

export default Publicchat;
