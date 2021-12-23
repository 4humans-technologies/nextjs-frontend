import React, { useState, useEffect } from "react"
import LocalActivityOutlinedIcon from "@material-ui/icons/LocalActivityOutlined"
import ClearIcon from "@material-ui/icons/Clear"
import SaveRoundedIcon from "@material-ui/icons/SaveRounded"
import AddOutlinedIcon from "@material-ui/icons/AddOutlined"
import { Button } from "react-bootstrap"
import { useAuthContext, useAuthUpdateContext } from "../../../app/AuthContext"

function Tip() {
  const authContext = useAuthContext()
  const [dynamicData, setDynamicData] = useState([
    authContext.user.user?.relatedUser?.topic,
  ])

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
    <div className=" tw-bg-second-color tw-px-4 tw-rounded tw-text-white-color">
      <div className="tw-border-b-[1px] tw-border-white-color tw-mb-4 tw-py-4 tw-flex tw-items-center">
        <LocalActivityOutlinedIcon />{" "}
        <span className="tw-pl-1.5">Set Activities</span>
      </div>
      <form id="action-form" className="tw-max-h-64 tw-overflow-y-auto tw-py-2">
        {dynamicData.map((item, index) => {
          return (
            <div
              className="tw-flex tw-items-center tw-justify-between tw-mb-3"
              id={index}
              key={index}
            >
              <input
                className="tw-rounded-full tw-bg-dark-black tw-border-none tw-outline-none tw-px-4 tw-py-2 tw-w-9/12 tw-mr-2"
                placeholder="Actions"
                value={item.action}
                required={true}
              />
              <input
                className="tw-rounded-full tw-bg-dark-black tw-border-none tw-outline-none tw-px-2 tw-py-2 tw-w-3/12"
                type="number"
                value={item.price}
                required={true}
              />
              <span className="tw-flex-shrink tw-flex-grow-0 tw-pl-2 tw-cursor-pointer">
                <ClearIcon
                  className="tw-text-text-black hover:tw-text-white-color tw-transition-colors"
                  onClick={() => {
                    document.getElementById(index).remove()
                  }}
                />
              </span>
            </div>
          )
        })}
      </form>
      <div className="tw-mt-4 tw-flex tw-items-center tw-justify-start tw-border-b tw-border-white-color tw-pb-6">
        <Button
          className="tw-rounded-full tw-flex tw-text-sm tw-mr-4"
          variant="outline-secondary"
          onClick={() =>
            setDynamicData((prev) => [...prev, { action: null, price: null }])
          }
        >
          <AddOutlinedIcon fontSize="small" />
          <span className="tw-pl-1 tw-tracking-tight">Add New Activity</span>
        </Button>
        <Button
          className="tw-rounded-full tw-flex tw-text-sm"
          variant="success"
          onClick={() => saveData()}
        >
          <SaveRoundedIcon fontSize="small" />
          <span className="tw-pl-1 tw-tracking-tight">Save</span>
        </Button>
      </div>
      <div className="tw-mb-4 tw-py-4">
        <p className="tw-capitalize">
          Viewers in your stream pay for activities they want to see you
          perform.
        </p>
      </div>
    </div>
  )
}

export default Tip
