import React, { useEffect, useState } from "react"

let indianstate = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
]
function Banned() {
  const [selected, setSelected] = useState([])

  const blockHandler = () => {
    fetch("/api/website/profile/update-info-fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          field: "bannedStates",
          value: selected,
        },
      ]),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
  }

  return (
    <div>
      <div
        className="tw-bg-second-color tw-w-full tw-h-3/12 tw-shadow-lg tw-text-white tw-px-2 tw-py-2 tw-mt-4 tw-rounded-md"
        multiselect-select-all="true"
      >
        <p className=" tw-text-white tw-px-2 tw-py-2 tw-bg-first-color tw-w-full tw-flex tw-rounded ">
          <p>Banned State:</p>
          {selected.map((item) => (
            <span className="tw-px-2">{item}</span>
          ))}
        </p>

        <div className="tw-flex tw-w-full tw-mt-2">
          <button
            className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium tw-ml-auto"
            onClick={blockHandler}
          >
            Submit
          </button>
          <button
            className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium tw-ml-4"
            onClick={() => setSelected([])}
          >
            Reset
          </button>
        </div>

        <div className="tw-mt-4 dropdwown tw-bg-first-color tw-capitalize ">
          <label
            htmlFor="banned-states"
            className="tw-text-lg tw-bg-first-color  tw-font-semibold tw-text-white tw-px-2 tw-rounded"
          >
            State list
          </label>
          <select
            name="banned-states"
            id="banned-states"
            multiple
            className="tw-w-full tw-min-h-[156px] tw-bg-second-color tw-px-2 tw-py-3 tw-rounded"
          >
            {indianstate.map((item) => (
              <option
                value={item}
                className="tw-text-white"
                onClick={(e) =>
                  setSelected((prev) => [...new Set(prev), e.target.value])
                }
              >
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default Banned
