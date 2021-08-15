import React from "react";

function Consent() {
  // Fetch data from API
  const data = {
    name: "Neeraj rai",
    email: "rass",
    age: "25",
    country: "USA",
    city: "New York",
    paragraph: "Neeraj rai is a marketing Guy",

    // It will be available in the template as `consent.customField`
  };

  return (
    <div className="text-center pt-8">
      {/* logo */}
      <img
        className=" object-contain inline-flex "
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png"
        alt=""
      />

      <p className="text-white">{data.paragraph}</p>

      <p className="text-white pt-4 pb-8">{data.name}</p>

      <button className="bg-green-600 text-white p-4 mb-6  rounded-full ">
        I'm over 18
      </button>

      <hr className="bg-yellow-50" />
      <div className="pt-8">
        <a href="#" className="text-yellow-50 border-solid border-b-2 ">
          Exit here
        </a>
        {/* Privacy policies */}
        <br />
        <p className="max-w-md text-white text-center inline-flex mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
          expedita ipsa vel similique hic magni, possimus suscipit
          necessitatibus rerum soluta fugit voluptatum illum, nemo laboriosam
          quaerat reprehenderit accusantium tempora? Maiores.
        </p>
        <br />
        <p className="max-w-md text-white text-center inline-flex mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
        </p>
      </div>
    </div>
  );
}

export default Consent;
