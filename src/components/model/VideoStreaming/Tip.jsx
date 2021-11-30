import React, { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import ClearIcon from "@material-ui/icons/Clear"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"

function Tip() {
  const [dynamicData, setDynamicData] = useState([2])
  const authContext = useAuthContext()

  useEffect(() => {
    if (authContext.loadedFromLocalStorage === true) {
      let arr = []
      fetch("/api/website/stream/get-model-tipmenu-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelId: localStorage.getItem("relatedUserId"),
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          data.tips.map((item) =>
            arr.push({ action: item.action, price: item.price })
          )
          setDynamicData(arr)
        })
    }
  }, [authContext.loadedFromLocalStorage])

  const saveData = () => {
    const allInputs = document.querySelectorAll("#action-form input")
    const actionArray = []
    for (let index = 0; index < allInputs.length; index += 2) {
      const action = allInputs[index].value
      const actionValue = allInputs[index + 1].value
      actionArray.push({ action: action, price: actionValue })
    }
    // console.log(actionArray)

    fetch("/api/website/profile/update-model-tipmenu-actions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        newActions: actionArray,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data))
  }

  return (
    <div>
      <div className=" tw-bg-first-color tw-py-2 tw-px-2 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-mt-6">
        <h1 className="tw-mb-3 tw-font-semibold tw-text-lg tw-text-white">
          Set Actions
        </h1>
        <form
          id="action-form"
          className="tw-max-h-64  tw-overflow-y-auto tw-mb-3 tw-bg-second-color tw-rounded-lg tw-p-2 tw-flex tw-flex-col tw-flex-shrink-0 "
        >
          {dynamicData.map((item, index) => {
            return (
              <div
                className="tw-grid tw-my-4 tw-text-white-color action_grid "
                id={index}
                key={index}
              >
                <input
                  className="tw-col-span-1 tw-py-2 tw-mx-1 tw-px-2 tw-bg-dark-black tw-rounded-full tw-outline-none "
                  placeholder="Actions"
                  value={item.action}
                  required={true}
                />
                <input
                  className="tw-col-span-1 tw-py-2 tw-mx-1 tw-px-2 tw-bg-dark-black tw-rounded-full tw-outline-none"
                  type="number"
                  value={item.price}
                  required={true}
                />
                {/* Amazing ninja technique for dom menupulation */}
                <ClearIcon
                  className="tw-text-white tw-my-auto"
                  onClick={() => {
                    document.getElementById(index).remove()
                  }}
                />
              </div>
            )
          })}
        </form>
        <Button
          className="tw-bg-dreamgirl-red hover:tw-bg-dreamgirl-red tw-border-none tw-rounded-full"
          onClick={() =>
            setDynamicData((prev) => [...prev, { action: null, price: null }])
          }
        >
          add new action
        </Button>
        <Button
          onClick={() => saveData()}
          className="tw-ml-4 tw-bg-green-color tw-border-none hover:tw-bg-green-color tw-rounded-full"
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default Tip
