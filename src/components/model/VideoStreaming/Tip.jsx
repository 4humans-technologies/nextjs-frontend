import React, { useState } from "react"
import { Button } from "react-bootstrap"

function Tip() {
  const [dynamicData, setDynamicData] = useState([2])
  const saveData = () => {
    const allInputs = document.querySelectorAll("#action-form input")
    const actionArray = []
    for (let index = 0; index < allInputs.length; index += 2) {
      const action = allInputs[index].value
      const actionValue = allInputs[index + 1].value
      actionArray.push({ [action]: actionValue })
    }
  }
  return (
    <div>
      <div className=" tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6 ">
        <h1 className="tw-mb-3 tw-font-semibold tw-text-lg tw-text-white">
          Set Actions
        </h1>
        <form
          id="action-form"
          className="tw-grid tw-grid-rows-4 tw-max-h-64 tw-overflow-y-auto tw-mb-3 tw-bg-second-color tw-rounded-lg tw-p-2 tw-mx-2"
        >
          {dynamicData.map((item, index) => {
            return (
              <div
                className="tw-grid tw-grid-cols-2 tw-my-4 tw-text-white-color"
                key={index}
              >
                <input
                  className="tw-rounded-full tw-col-span-1 tw-py-2 tw-mx-1 tw-px-2 tw-bg-dark-black  tw-outline-none"
                  placeholder="ravi"
                />
                <input
                  className="tw-col-span-1 tw-py-2 tw-mx-1 tw-px-2 tw-bg-dark-black tw-rounded-full tw-outline-none"
                  placeholder="name"
                />
              </div>
            )
          })}
        </form>
        <Button
          variant="denger"
          onClick={() => setDynamicData((prev) => [...prev, 1])}
          className="tw-rounded-full tw-bg-gray-600"
        >
          add new action
        </Button>
        <Button
          onClick={saveData}
          variant="success"
          className="tw-ml-4 tw-rounded-full tw-bg-green-color"
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default Tip
