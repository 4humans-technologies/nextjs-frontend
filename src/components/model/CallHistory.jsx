import React, { useEffect, useState } from "react"
import Card from "../UI/Card"

function chat() {
  const [pending, setPending] = useState([])

  useEffect(() => {
    fetch("/model.json")
      .then((res) => res.json())
      .then((data) => setPending(data.models))
  }, [])

  return (
    <div className="tw-grid tw-grid-cols-2 tw-bg-first-color tw-mt-4 tw-rounded-t-lg tw-rounded-b-lg">
      {pending.map((item) => {
        return (
          <Card key={item.id}>
            <div className="tw-grid card_grid tw-place-items-center tw-w-[100%]">
              <p>{item.Name}</p>
              <div className="tw-grid-cols-4 tw-grid ">
                <div className="tw-col-span-2 tw-px-2">{item.Call}</div>
                <div className="tw-col-span-2 tw-px-2">{item.Rate}</div>
              </div>
              <div className="tw-grid-cols-2 tw-grid">
                <div className="tw-col-span-1 tw-px-2">{item.Time}</div>
                <div className="tw-col-span-1 tw-px-2">call</div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default chat
