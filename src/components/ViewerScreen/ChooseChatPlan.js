import React, { useEffect, useState } from "react"
import ThePlanCard from "./ThePlanCard"

const initialData = [
  {
    id: "sfd098",
    name: "Basic Plan",
    price: 40,
    validityDays: 30,
  },
  {
    id: "sfd0sda98",
    name: "Pro Plan",
    price: 70,
    validityDays: 60,
  },
  {
    id: "sfd032498",
    name: "Knight Plan",
    price: 100,
    validityDays: 90,
  },
]

function ChooseChatPlan() {
  const [chatPlans, setChatPlans] = useState([...initialData])

  useEffect(() => {
    /* fetch chat plans */
    // fetch("/api/website/stream/get-private-chat-plans")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setChatPlans(data.plans)
    //   })
    //   .catch((err) => alert(err.message))
  }, [])

  const buyPlan = (planId) => {
    /* fetch request to buy this plan */
    alert("buying plan " + planId)
  }

  return (
    <div className="">
      <h2 className="tw-mb-4 tw-text-center tw-text-lg tw-text-white-color">
        Select The Plan
      </h2>
      <div className="tw-border-t tw-border-text-black  tw-w-10/12 md:tw-w-9/12 lg:tw-w-7/12 tw-mx-auto"></div>
      <div className=" tw-mt-4 tw-flex tw-flex-wrap tw-justify-center tw-items-center tw-py-6">
        {chatPlans.map((plan, index) => {
          return (
            <ThePlanCard
              key={`${index}_sdaslda*&*)`}
              name={plan.name}
              price={plan.price}
              validityDays={plan.validityDays}
              buyThisPlan={() => buyPlan(plan.id)}
            />
          )
        })}
      </div>
      <div className="tw-border-t tw-border-text-black tw-mt-4 tw-w-10/12 md:tw-w-9/12 lg:tw-w-7/12 tw-mx-auto"></div>
    </div>
  )
}

export default ChooseChatPlan