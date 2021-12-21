import React, { useEffect, useState } from "react"
import { Dropdown } from "react-bootstrap"
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
function test() {
  const [state, setstate] = useState([])
  const [selected, setSelected] = useState([])
  useEffect(() => {
    fetch("http://ip-api.com/json")
      .then((resp) => resp.json())
      .then((data) => setstate(data.city))
  }, [])
  return (
    <div
      className="tw-bg-gray-600 tw-w-3/12 tw-h-3/12 tw-shadow-lg tw-text-white tw-px-2 tw-py-2"
      multiselect-select-all="true"
    >
      <h1>Banned State</h1>

      <div>
        <p className="tw-w-full tw-py-4 tw-bg-red-400 tw-text-white tw-px-2">
          {selected.map((item) => (
            <span className="tw-px-2">{item}</span>
          ))}
        </p>

        <div className="tw-mt-8 dropdwown tw-bg-first-color tw-capitalize ">
          <label
            htmlFor="banned-states"
            className="tw-text-lg tw-bg-first-color tw-mb-2 tw-font-semibold tw-text-white"
          >
            banned-states
          </label>
          <select
            name="banned-states"
            id="banned-states"
            multiple
            className="tw-w-full tw-min-h-[256px] tw-bg-second-color tw-px-2 tw-py-3 tw-rounded"
          >
            {indianstate.map((item) => (
              <option
                value={item}
                className="tw-text-white"
                onClick={(e) =>
                  setSelected((prev) => [...prev, e.target.value])
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

export default test
