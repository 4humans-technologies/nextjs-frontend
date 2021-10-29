import React, { useState } from "react"
import Notification from "../../Notifications/Notification"

function Pricing() {
  const [show, setshow] = useState(false)
  const [close, setClose] = useState(false)

  const [price, setPrice] = useState({
    private_video_token: "",
    private_audio_token: "",
    private_video_time: "",
    private_audio_time: "",
  })

  // onAudio video set to post the data
  const audioVideopriceHandler = async () => {
    fetch("url", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: {
        video_token: price.private_audio_token,
        audio_toke: price.private_audio_token,
        video_time: price.private_video_time,
        audio_time: price.private_audio_time,
      },
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(error))
  }

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
            <select
              onSelect={(e) => setPrice.private_audio_token(e.targe.value)}
              className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center  tw-py-2 tw-outline-none"
              name="private_audio_token"
            >
              <option value="200tk">200tk </option>
              <option value="300tk">300tk </option>
              <option value="400tk">400tk </option>
              <option value="500tk">500tk </option>
            </select>

            <select
              name="private_audio_time"
              onSelect={(e) => setPrice.private_audio_price(e.targe.value)}
              className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-ml-4 tw-outline-none"
            >
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
            <select
              name="private_video_token"
              onSelect={(e) => setPrice.private_video_token(e.targe.value)}
              className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-py-2 tw-outline-none"
            >
              <option value="200tk">200tk </option>
              <option value="300tk">300tk </option>
              <option value="400tk">400tk </option>
              <option value="500tk">500tk </option>
            </select>

            <select
              name="private_video_time"
              onSelect={(e) => setPrice.private_video_price(e.targe.value)}
              className=" tw-rounded-t-xl tw-rounded-b-xl tw-w-20  tw-bg-dark-black   tw-text-center tw-ml-4 tw-py-2 tw-outline-none"
            >
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
            onClick={() => audioVideopriceHandler()}
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
      {/* Notifiation work is still left  */}
      <Notification onShow={show} onClose={close} />
    </div>
  )
}

export default Pricing
