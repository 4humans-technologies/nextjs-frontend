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
    <div className="tw-text-center tw-pt-8">
      {/* logo */}
      <img
        className="tw-object-contain tw-inline-flex"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png"
        alt=""
      />

      <p className="tw-text-white">{data.paragraph}</p>

      <p className="tw-text-white tw-pt-4 tw-pb-8">{data.name}</p>

      <button className="tw-bg-green-600 tw-text-white tw-p-4 tw-mb-6 tw-rounded-full">
        I'm over 18
      </button>

      <hr className="tw-bg-yellow-50" />
      <div className="tw-pt-8">
        <a href="#" className="tw-text-yellow-50 tw-border-solid tw-border-b-2">
          Exit here
        </a>
        {/* Privacy policies */}
        <br />
        <p className="tw-max-w-md tw-text-white tw-text-center tw-inline-flex tw-mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
          expedita ipsa vel similique hic magni, possimus suscipit
          necessitatibus rerum soluta fugit voluptatum illum, nemo laboriosam
          quaerat reprehenderit accusantium tempora? Maiores.
        </p>
        <br />
        <p className="tw-max-w-md tw-text-white tw-text-center tw-inline-flex tw-mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
        </p>
      </div>
    </div>
  );
}

export default Consent;
