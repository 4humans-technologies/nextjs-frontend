import React, { useState } from "react"
import Notification from "../../Notifications/Notification"

function Pricing() {
  const [show, setshow] = useState(false)
  const [close, setClose] = useState(false)

  return (
    <div>
      <div className="tw-text-white tw-bg-first-color tw-py-2 tw-pl-4 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-grid-cols-3 tw-grid tw-leading-9 tw-mt-6 tw-mx-2">
        <div className="tw-col-span-1">
          <p>Private Audio</p>
          <p className="tw-mt-8">Private video </p>
        </div>
        <div className="tw-col-span-2">
          <div className="tw-flex ">
            {/* <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center  tw-py-2">
                {audio.length > 0
                  ? audio.map((item) => (
                      <option value={item}>
                        {item} <span>tk</span>
                      </option>
                    ))
                  : null}
              </select> */}
            <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center  tw-py-2 tw-outline-none">
              <option value="200tk">200tk </option>
              <option value="300tk">300tk </option>
              <option value="400tk">400tk </option>
              <option value="500tk">500tk </option>
            </select>

            <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-ml-4 tw-outline-none">
              <option value="1"> 1 minute </option>
              <option value="2"> 2 minute </option>
              <option value="3"> 3 minute </option>
              <option value="4"> 4 minute </option>
            </select>
          </div>
          {/*  */}

          <div className="tw-flex  tw-my-2">
            {/* <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center  tw-py-2">
                {video.length > 0
                  ? video.map((item) => (
                      <option value={item}>
                        {item} <span>tk</span>
                      </option>
                    ))
                  : null}
              </select> */}
            <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-py-2 tw-outline-none">
              <option value="200tk">200tk </option>
              <option value="300tk">300tk </option>
              <option value="400tk">400tk </option>
              <option value="500tk">500tk </option>
            </select>

            <select className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-ml-4 tw-py-2 tw-outline-none">
              <option value="1"> 1 minute </option>
              <option value="2"> 2 minute </option>
              <option value="3"> 3 minute </option>
              <option value="4"> 4 minute </option>
            </select>
          </div>
        </div>
        <div className="tw-flex tw-my-4 tw-text-white">
          <button
            className="tw-rounded-full tw-px-4  tw-bg-green-color tw-mr-4 tw-outline-none"
            onClick={() => setshow((prev) => !prev)}
          >
            Save
          </button>
          <button
            className="tw-rounded-full tw-px-4 tw-py-1 tw-bg-dreamgirl-red "
            onClick={() => setClose((prev) => !prev)}
          >
            Cancel
          </button>
        </div>
      </div>
      <Notification onShow={show} onClose={close} />
    </div>
  )
}

export default Pricing
